// "use client";

// import React, { useState } from "react";
// import { Send, User, Search, Paperclip, MoreVertical } from "lucide-react";

// import { cn } from "@/lib/utils";

// export default function ChatPage() {
//   const [activePatient, setActivePatient] = useState(1);
//   const [message, setMessage] = useState("");

//   const patients = [
//     { id: 1, name: "John Doe", lastMsg: "Thank you doctor!", time: "10:30 AM", online: true },
//     { id: 2, name: "Emma Watson", lastMsg: "When is my next visit?", time: "09:15 AM", online: false },
//     { id: 3, name: "Robert Brown", lastMsg: "The pain is decreasing.", time: "Yesterday", online: true },
//   ];

//   return (
//     <div className="h-[calc(100vh-12rem)] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex">
//       {/* Patient List */}
//       <div className="w-80 border-r border-slate-100 flex flex-col">
//         <div className="p-4 border-b border-slate-100 bg-slate-50/50">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//             <input 
//               type="text" 
//               placeholder="Search chat..." 
//               className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
//             />
//           </div>
//         </div>
//         <div className="flex-1 overflow-y-auto">
//           {patients.map(p => (
//             <button 
//               key={p.id}
//               onClick={() => setActivePatient(p.id)}
//               className={cn(
//                 "w-full p-4 flex gap-3 border-b border-slate-50 transition-colors hover:bg-slate-50",
//                 activePatient === p.id && "bg-blue-50 border-r-4 border-r-blue-600"
//               )}
//             >
//               <div className="relative">
//                 <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
//                   <User className="w-6 h-6" />
//                 </div>
//                 {p.online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>}
//               </div>
//               <div className="flex-1 text-left min-w-0">
//                 <div className="flex justify-between items-center mb-1">
//                   <p className="font-bold text-slate-800 text-sm truncate">{p.name}</p>
//                   <span className="text-[10px] text-slate-400 font-medium">{p.time}</span>
//                 </div>
//                 <p className="text-xs text-slate-500 truncate">{p.lastMsg}</p>
//               </div>
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Chat Window */}
//       <div className="flex-1 flex flex-col bg-slate-50/30">
//         {/* Chat Header */}
//         <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
//               <User className="w-5 h-5" />
//             </div>
//             <div>
//               <p className="font-bold text-slate-800 text-sm">{patients.find(p => p.id === activePatient)?.name}</p>
//               <p className="text-[10px] text-emerald-500 font-bold tracking-tight">ONLINE</p>
//             </div>
//           </div>
//           <button className="p-2 hover:bg-slate-100 rounded-lg">
//             <MoreVertical className="w-5 h-5 text-slate-400" />
//           </button>
//         </div>

//         {/* Messages */}
//         <div className="flex-1 overflow-y-auto p-6 space-y-4">
//           <div className="flex justify-start">
//             <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 max-w-md shadow-sm">
//               <p className="text-sm text-slate-700">Hello doctor, I've been feeling better since the last medicine.</p>
//               <span className="text-[10px] text-slate-400 mt-1 block">10:25 AM</span>
//             </div>
//           </div>
//           <div className="flex justify-end">
//             <div className="bg-blue-600 p-3 rounded-2xl rounded-tr-none text-white max-w-md shadow-lg shadow-blue-100">
//               <p className="text-sm">That's great to hear! Keep taking the prescription for another 3 days.</p>
//               <span className="text-[10px] text-blue-100 mt-1 block">10:30 AM</span>
//             </div>
//           </div>
//         </div>

//         {/* Input Area */}
//         <div className="p-4 bg-white border-t border-slate-100">
//           <form className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200">
//             <button type="button" className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
//               <Paperclip className="w-5 h-5" />
//             </button>
//             <input 
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               placeholder="Type your message..." 
//               className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 px-2"
//             />
//             <button 
//               type="submit" 
//               className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 shadow-md shadow-blue-200"
//               disabled={!message.trim()}
//             >
//               <Send className="w-4 h-4" />
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }






"use client";

import React, { useState, useEffect } from "react";
import { Send, User, Search, Paperclip, MoreVertical } from "lucide-react";
import { io } from "socket.io-client";
import axios from "axios";
import { cn } from "@/lib/utils";

const socket = io("http://localhost:5000");

export default function ChatPage() {
  const doctorId = 1; // 🔥 logged doctor id
  const [activePatient, setActivePatient] = useState(1);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  const patients = [
    { id: 1, name: "John Doe", online: true },
    { id: 2, name: "Emma Watson", online: false },
    { id: 3, name: "Robert Brown", online: true },
  ];

  const roomId = `doctor_${doctorId}_patient_${activePatient}`;

  // 🔥 JOIN ROOM
  useEffect(() => {
    socket.emit("joinRoom", roomId);

    // load old messages
    axios
      .get(`http://localhost:5000/api/messages/${roomId}`)
      .then((res) => setMessages(res.data));

    socket.on("receiveMessage", (data) => {
      if (data.roomId === roomId) {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [activePatient]);

  // 🔥 SEND MESSAGE
  const sendMessage = async (e: any) => {
    e.preventDefault();
    if (!message.trim()) return;

    const data = {
      roomId,
      sender: "doctor",
      message,
    };

    socket.emit("sendMessage", data);
    await axios.post("http://localhost:5000/api/messages/send", data);

    setMessage("");
  };

  return (
    <div className="h-[calc(100vh-12rem)] bg-white rounded-2xl border shadow-sm overflow-hidden flex">
      
      {/* LEFT PANEL */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b bg-slate-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search chat..."
              className="w-full pl-9 pr-4 py-2 border rounded-xl text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {patients.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePatient(p.id)}
              className={cn(
                "w-full p-4 flex gap-3 border-b hover:bg-slate-50",
                activePatient === p.id && "bg-blue-50 border-r-4 border-blue-600"
              )}
            >
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                <User />
              </div>
              <div className="text-left">
                <p className="font-bold text-sm">{p.name}</p>
                <p className="text-xs text-slate-400">
                  {p.online ? "Online" : "Offline"}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT CHAT */}
      <div className="flex-1 flex flex-col bg-slate-50">
        
        {/* HEADER */}
        <div className="p-4 bg-white border-b flex justify-between">
          <div className="flex gap-3 items-center">
            <User />
            <b>
              {patients.find((p) => p.id === activePatient)?.name}
            </b>
          </div>
          <MoreVertical />
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.sender === "doctor" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 rounded-2xl max-w-md ${
                  m.sender === "doctor"
                    ? "bg-blue-600 text-white"
                    : "bg-white border"
                }`}
              >
                <p className="text-sm">{m.message}</p>
              </div>
            </div>
          ))}
        </div>

        {/* INPUT */}
        <div className="p-4 bg-white border-t">
          <form
            onSubmit={sendMessage}
            className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border"
          >
            <Paperclip />
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type message..."
              className="flex-1 bg-transparent outline-none"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white p-2 rounded-xl"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}