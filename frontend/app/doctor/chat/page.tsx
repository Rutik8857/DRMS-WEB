"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, User, Search, Paperclip, MoreVertical, Loader2 } from "lucide-react";
import { io } from "socket.io-client";
import axios from "axios";
import { cn } from "@/lib/utils";

// create socket but don't auto connect until token set
const socket = io("http://localhost:5000", { autoConnect: false });

// types
interface Patient {
  id: number;
  name: string;
  role?: string;
  online?: boolean;
  unread?: number;
}

interface ChatMessage {
  roomId?: string;
  sender: string;
  message: string;
}

export default function ChatPage() {
  // determine logged in doctor id from localStorage
  let doctorId = 0;
  if (typeof window !== 'undefined') {
    doctorId = parseInt(localStorage.getItem('doctorId') || '0');
    if (!doctorId) {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload?.doctorId) doctorId = payload.doctorId;
        }
      } catch {};
    }
  }
  const [activePatient, setActivePatient] = useState<Patient | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // load chat list dynamically when component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    axios.get('http://localhost:5000/api/chats/my', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setPatients(res.data.map((c: any) => ({ id: c.patient_id, name: c.patientName || c.name, unread: c.unread || 0 })));
      })
      .catch(console.error);
  }, []);

  // Logic: Create a consistent Room ID (e.g., room_1_101)
  const getRoomId = (otherId: number) => {
    const ids = [doctorId, otherId].sort((a, b) => a - b);
    return `room_${ids[0]}_${ids[1]}`;
  };

  // Scroll to bottom when messages update
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔥 JOIN & SYNC CHAT
  useEffect(() => {
    if (!activePatient) return;

    const token = localStorage.getItem('token');
    if (token && !socket.connected) {
      socket.auth = { token };
      socket.connect();
    }

    const roomId = getRoomId(activePatient.id);
    setLoading(true);

    // 1. Tell Server we are joining this room
    socket.emit("joinRoom", roomId);

    // 2. Load History from DB
    axios.get(`http://localhost:5000/api/messages/${roomId}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then((res) => {
        setMessages(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // 3. Listen for Live Messages
    const handleReceive = (data: any) => {
      if (data.roomId === roomId) {
        setMessages((prev) => [...prev, data]);
      }
    };

    socket.on("receiveMessage", handleReceive);

    // update unread count if message is for another patient
    const handleNew = (data: any) => {
      if (data.roomId === roomId) return; // current chat already shows
      // parse other id
      const parts = data.roomId.split('_');
      if (parts.length === 3) {
        const ids = [parseInt(parts[1]), parseInt(parts[2])];
        const other = ids.find(i => i !== doctorId);
        if (other) {
          setPatients(prev => prev.map(p => {
            if (p.id === other) {
              return { ...p, unread: (p.unread || 0) + 1 };
            }
            return p;
          }));
        }
      }
    };
    socket.on("receiveMessage", handleNew);

    // Cleanup when switching chats
    return () => {
      socket.off("receiveMessage", handleReceive);
    };
  }, [activePatient]);

  // 🔥 SEND MESSAGE
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !activePatient) return;

    const roomId = getRoomId(activePatient.id);
    const data = {
      roomId,
      sender: "doctor", // Helps UI identify bubble side
      message: message.trim(),
    };

    // Send via Socket (Real-time)
    socket.emit("sendMessage", data);

    // Save to Database (Persistence)
    try {
      await axios.post("http://localhost:5000/api/messages/send", data, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    } catch (err) {
      console.error("DB Save Error:", err);
    }

    setMessage("");
  };

  return (
    <div className="h-[calc(100vh-10rem)] bg-white rounded-2xl border shadow-sm overflow-hidden flex">
      {/* SIDEBAR */}
      <div className="w-80 border-r flex flex-col bg-slate-50">
        <div className="p-4 border-b bg-white">
          <h2 className="font-bold text-slate-800 mb-3">Chats</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search..." className="w-full pl-9 pr-4 py-2 border rounded-xl text-sm outline-none" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {patients.map((p: Patient) => (
            <button
              key={p.id}
              onClick={() => {
                setActivePatient(p);
                setPatients(prev => prev.map(q => q.id === p.id ? { ...q, unread: 0 } : q));
              }}
              className={cn(
                "w-full p-4 flex gap-3 border-b transition-all",
                activePatient?.id === p.id ? "bg-blue-50 border-r-4 border-blue-600" : "hover:bg-white"
              )}
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold uppercase">
                {p.name[0]}
              </div>
              <div className="text-left flex-1">
                <div className="flex justify-between">
                  <p className="font-bold text-sm text-slate-800">{p.name}</p>
                  {(p.unread || 0) > 0 && (
                    <span className="text-xs bg-red-500 text-white rounded-full px-2">{p.unread}</span>
                  )}
                </div>
                <p className="text-xs text-slate-500 truncate">Click to chat</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* CHAT WINDOW */}
      <div className="flex-1 flex flex-col bg-slate-50">
        {activePatient ? (
          <>
            <div className="p-4 bg-white border-b flex justify-between items-center">
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center"><User size={20}/></div>
                <p className="font-bold text-slate-900">{activePatient.name}</p>
              </div>
              <MoreVertical className="text-slate-400 cursor-pointer" />
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {loading ? (
                <div className="flex justify-center"><Loader2 className="animate-spin text-blue-500" /></div>
              ) : (
                messages.map((m, i) => (
                  <div key={i} className={`flex ${m.sender === "doctor" ? "justify-end" : "justify-start"}`}>
                    <div className={cn(
                        "p-3 rounded-2xl max-w-md shadow-sm text-sm",
                        m.sender === "doctor" ? "bg-blue-600 text-white rounded-tr-none" : "bg-white border rounded-tl-none text-slate-700"
                    )}>
                      {m.message}
                    </div>
                  </div>
                ))
              )}
              <div ref={scrollRef} />
            </div>

            <form onSubmit={sendMessage} className="p-4 bg-white border-t flex gap-3">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-slate-100 px-4 py-2 rounded-xl outline-none text-sm"
              />
              <button type="submit" className="bg-blue-600 text-white p-2 rounded-xl">
                <Send size={18} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 italic">
            Select a contact to start messaging
          </div>
        )}
      </div>
    </div>
  );
}