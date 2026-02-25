"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, User, Search, Paperclip, MoreVertical, Loader2 } from "lucide-react";
import { io } from "socket.io-client";
import axios from "axios";
import { cn } from "@/lib/utils";

// Connect to socket once
const socket = io("http://localhost:5000");

export default function ChatPage() {
  const doctorId = 1; // Logged-in Doctor ID
  const [activePatient, setActivePatient] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Example list (In production, fetch this from your API)
  const patients = [
    { id: 101, name: "Rushikesh", role: "patient", online: true },
    // { id: 102, name: "Yash", role: "patient", online: false },
    // { id: 50, name: "Admin Support", role: "admin", online: true },
  ];

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

    const roomId = getRoomId(activePatient.id);
    setLoading(true);

    // 1. Tell Server we are joining this room
    socket.emit("joinRoom", roomId);

    // 2. Load History from DB
    axios.get(`http://localhost:5000/api/messages/${roomId}`)
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
      await axios.post("http://localhost:5000/api/messages/send", data);
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
          {patients.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePatient(p)}
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
                  <span className="text-[9px] text-slate-400 uppercase font-bold">{p.role}</span>
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