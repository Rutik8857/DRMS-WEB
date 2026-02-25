"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, User, Search, Loader2 } from "lucide-react";
import { io } from "socket.io-client";
import axios from "axios";
import { cn } from "@/lib/utils";

const socket = io("http://localhost:5000");

export default function PatientChatPage() {
  const patientId = 101; 
  const [activeDoctor, setActiveDoctor] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const doctors = [
    { id: 1, name: "Dr. Rutik", specialization: "Cardiologist" },
    // { id: 5, name: "Dr. Abhishek", specialization: "General Physician" },
    // { id: 50, name: "Support Admin", specialization: "Help Desk" },
  ];

  const getRoomId = (docId) => {
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
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

    const handleMsg = (data) => {
      if (data.roomId === roomId) {
        setMessages((prev) => [...prev, data]);
      }
    };

    socket.on("receiveMessage", handleMsg);
    return () => { socket.off("receiveMessage", handleMsg); };
  }, [activeDoctor]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !activeDoctor) return;

    const roomId = getRoomId(activeDoctor.id);
    const data = {
      roomId,
      sender: "patient",
      message: message.trim(),
    };

    socket.emit("sendMessage", data);
    await axios.post("http://localhost:5000/api/messages/send", data);
    setMessage("");
  };

  return (
    <div className="h-[500px] flex bg-white border rounded-2xl overflow-hidden">
      <div className="w-1/3 border-r bg-slate-50">
        <div className="p-4 font-bold border-b">My Doctors</div>
        <div className="overflow-y-auto h-full pb-20">
          {doctors.map((d) => (
            <button 
              key={d.id} 
              onClick={() => setActiveDoctor(d)}
              className={cn("w-full p-4 text-left border-b hover:bg-slate-100 transition-colors", activeDoctor?.id === d.id && "bg-blue-100")}
            >
              <p className="font-bold text-sm text-slate-800">{d.name}</p>
              <p className="text-xs text-slate-500">{d.specialization}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {activeDoctor ? (
          <>
            <div className="p-4 border-b font-bold bg-white flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">
                {activeDoctor.name[0]}
              </div>
              {activeDoctor.name}
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {loading ? (
                <div className="flex justify-center p-4"><Loader2 className="animate-spin text-blue-600" /></div>
              ) : (
                messages.map((m, i) => (
                  <div key={i} className={`flex ${m.sender === "patient" ? "justify-end" : "justify-start"}`}>
                    <div className={cn(
                      "p-3 rounded-2xl max-w-xs text-sm shadow-sm",
                      m.sender === "patient" ? "bg-green-600 text-white rounded-tr-none" : "bg-white border text-slate-800 rounded-tl-none"
                    )}>
                      {m.message}
                    </div>
                  </div>
                ))
              )}
              <div ref={scrollRef} />
            </div>
            <form onSubmit={sendMessage} className="p-4 flex gap-2 bg-white border-t">
              <input 
                className="flex-1 border p-2 rounded-lg outline-none focus:ring-1 focus:ring-green-500" 
                value={message} 
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                <Send size={18} />
              </button>
            </form>
          </>
        ) : (
          <div className="m-auto text-slate-400 flex flex-col items-center gap-2">
            <User size={48} className="opacity-20" />
            <p>Select a doctor to start chat</p>
          </div>
        )}
      </div>
    </div>
  );
}