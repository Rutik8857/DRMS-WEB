"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, User, Search, Loader2 } from "lucide-react";
import { io } from "socket.io-client";
import axios from "axios";
import { cn } from "@/lib/utils";

const socket = io("http://localhost:5000");

export default function PatientChatPage() {
  const patientId = 101; // 🔥 Logged-in Patient ID
  const [activeDoctor, setActiveDoctor] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Patient ke liye Doctors ki list
  const doctors = [
    { id: 1, name: "Dr. Smith", specialization: "Cardiologist" },
    { id: 5, name: "Dr. Khanna", specialization: "General Physician" },
    { id: 50, name: "Support Admin", specialization: "Help Desk" },
  ];

  // Room ID logic wahi rahegi (sorting important hai taaki dono same room mein milein)
  const getRoomId = (docId: number) => {
    const ids = [patientId, docId].sort((a, b) => a - b);
    return `room_${ids[0]}_${ids[1]}`;
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!activeDoctor) return;

    const roomId = getRoomId(activeDoctor.id);
    setLoading(true);

    socket.emit("joinRoom", roomId);

    axios.get(`http://localhost:5000/api/messages/${roomId}`)
      .then((res) => {
        setMessages(res.data);
        setLoading(false);
      });

    const handleMsg = (data: any) => {
      if (data.roomId === roomId) {
        setMessages((prev) => [...prev, data]);
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
      sender: "patient", // 🔥 Ab sender "patient" hai
      message: message.trim(),
    };

    socket.emit("sendMessage", data);
    await axios.post("http://localhost:5000/api/messages/send", data);
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
            onClick={() => setActiveDoctor(d)}
            className={cn("w-full p-4 text-left border-b", activeDoctor?.id === d.id && "bg-blue-100")}
          >
            <p className="font-bold text-sm">{d.name}</p>
            <p className="text-xs text-slate-50">{d.specialization}</p>
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