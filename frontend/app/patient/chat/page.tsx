"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, User, Search, Loader2 } from "lucide-react";
import { io } from "socket.io-client";
import axios from "axios";
import { cn } from "@/lib/utils";

// init socket after token is available
const socket = io("http://localhost:5000", {
  autoConnect: false,
});

interface Doctor {
  id: number;
  name: string;
  unread?: number;
}

interface ChatMessage {
  sender: string;
  message: string;
  roomId?: string;
}


export default function PatientChatPage() {
  // retrieve stored ids from localStorage
  let patientId = 0;
  if (typeof window !== 'undefined') {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        patientId = payload?.id || 0;
      }
    } catch {}
  }
  const [activeDoctor, setActiveDoctor] = useState<Doctor | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // load chat list for patient
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    axios.get('http://localhost:5000/api/chats/my', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        // server returns items with doctorId and doctorName
        setDoctors(res.data.map(c => ({ id: c.doctor_id, name: c.doctorName, unread: c.unread || 0 })));
      })
      .catch(console.error);
  }, []);

  // Room ID logic wahi rahegi (sorting important hai taaki dono same room mein milein)
  const getRoomId = (docId) => {
    const ids = [patientId, docId].sort((a, b) => a - b);
    return `room_${ids[0]}_${ids[1]}`;
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!activeDoctor) return;

    const token = localStorage.getItem('token');
    if (token && !socket.connected) {
      socket.auth = { token };
      socket.connect();
    }

    const roomId = getRoomId(activeDoctor.id);
    setLoading(true);

    socket.emit("joinRoom", roomId);

    axios.get(`http://localhost:5000/api/messages/${roomId}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then((res) => {
        setMessages(res.data);
        setLoading(false);
      });

    const handleMsg = (data: any) => {
      if (data.roomId === roomId) {
        setMessages((prev) => [...prev, data]);
      } else {
        // increment unread for doctor not in current chat
        const parts = data.roomId.split('_');
        if (parts.length === 3) {
          const ids = [parseInt(parts[1]), parseInt(parts[2])];
          const other = ids.find(i => i !== patientId);
          if (other) {
            setDoctors(prev => prev.map(d => {
              if (d.id === other) {
                return { ...d, unread: (d.unread || 0) + 1 };
              }
              return d;
            }));
          }
        }
      }
    };

    socket.on("receiveMessage", handleMsg);
    return () => { socket.off("receiveMessage", handleMsg); };
  }, [activeDoctor]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !activeDoctor) return;

    const roomId = getRoomId(activeDoctor.id);
    const data = {
      roomId,
      sender: "patient",
      message: message.trim(),
    };

    const token = localStorage.getItem('token');

    socket.emit("sendMessage", data);
    await axios.post("http://localhost:5000/api/messages/send", data, { headers: { Authorization: `Bearer ${token}` } });
    setMessage("");
  };

  return (
    <div className="h-[500px] flex bg-white border rounded-2xl overflow-hidden">
      {/* Sidebar - Doctor List */}
      <div className="w-1/3 border-r bg-slate-50">
        <div className="p-4 font-bold border-b">My Doctors</div>
        {doctors.map((d) => (
          <button 
            key={d.id} 
            onClick={() => {
              setActiveDoctor(d);
              setDoctors(prev => prev.map(p => p.id === d.id ? { ...p, unread: 0 } : p));
            }}
            className={cn("w-full p-4 text-left border-b", activeDoctor?.id === d.id && "bg-blue-100")}
          >
            <div className="flex justify-between">
              <p className="font-bold text-sm">{d.name}</p>
              {d.unread > 0 && (
                <span className="text-xs bg-red-500 text-white rounded-full px-2">{d.unread}</span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeDoctor ? (
          <>
            <div className="p-4 border-b font-bold bg-white">{activeDoctor.name}</div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.sender === "patient" ? "justify-end" : "justify-start"}`}>
                  <div className={cn(
                    "p-3 rounded-2xl max-w-xs text-sm shadow-sm",
                    m.sender === "patient" ? "bg-green-600 text-white" : "bg-white border text-slate-800"
                  )}>
                    {m.message}
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>
            <form onSubmit={sendMessage} className="p-4 flex gap-2">
              <input 
                className="flex-1 border p-2 rounded-lg" 
                value={message} 
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg">Send</button>
            </form>
          </>
        ) : (
          <div className="m-auto text-slate-400">Select a doctor to start chat</div>
        )}
      </div>
    </div>
  );
}