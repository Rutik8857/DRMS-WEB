// "use client";
// import { useEffect, useState } from 'react';

// export default function DoctorDashboard() {
//   const [data, setData] = useState(null);
//   // Hardcoded doctor ID for demo. In production, get this from user context/session
//   const DOCTOR_ID = 1; 

//   // Function to fetch data, can be reused
//   const fetchDashboard = () => {
//     fetch(`http://localhost:5000/api/doctors/${DOCTOR_ID}/dashboard`)
//       .then(res => {
//         if (!res.ok) throw new Error("Failed to fetch dashboard");
//         return res.json();
//       })
//       .then(data => setData(data))
//       .catch(err => {
//         console.error(err);
//         // Fallback data for demo/offline mode
//         setData({
//           stats: { total: 15, pending: 5, completed: 10 },
//           appointments: [
//             { id: 1, patient_name: "Rahul Sharma", date: "2023-10-25T10:00:00", time: "10:00 AM", status: "pending" },
//             { id: 2, patient_name: "Priya Patel", date: "2023-10-25T11:30:00", time: "11:30 AM", status: "confirmed" },
//             { id: 3, patient_name: "Amit Singh", date: "2023-10-24T02:00:00", time: "02:00 PM", status: "completed" }
//           ]
//         });
//       });
//   };

//   useEffect(() => {
//     fetchDashboard();
//   }, []);

//   const handleStatus = async (id, status) => {
//     await fetch(`http://localhost:5000/api/appointments/${id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ status })
//     });
//     // Refresh data without reloading page
//     fetchDashboard();
//   };

//   if (!data) return <div>Loading Appointments...</div>;

//   return (
//     <div>
//       <h1 className="text-3xl font-bold mb-8">My Appointments</h1>

//       <div className="grid grid-cols-3 gap-6 mb-8">
//         <div className="bg-white p-6 rounded shadow border-l-4 border-blue-500">
//             <h3 className="text-gray-500">Total</h3>
//             <p className="text-2xl font-bold">{data.stats.total}</p>
//         </div>
//         <div className="bg-white p-6 rounded shadow border-l-4 border-yellow-500">
//             <h3 className="text-gray-500">Pending</h3>
//             <p className="text-2xl font-bold">{data.stats.pending}</p>
//         </div>
//         <div className="bg-white p-6 rounded shadow border-l-4 border-green-500">
//             <h3 className="text-gray-500">Completed</h3>
//             <p className="text-2xl font-bold">{data.stats.completed}</p>
//         </div>
//       </div>

//       <div className="bg-white shadow rounded-lg">
//         <table className="w-full text-left">
//             <thead className="bg-gray-100">
//                 <tr>
//                     <th className="p-4">Patient</th>
//                     <th className="p-4">Date & Time</th>
//                     <th className="p-4">Status</th>
//                     <th className="p-4">Actions</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 {data.appointments.map(app => (
//                     <tr key={app.id} className="border-t">
//                         <td className="p-4">{app.patient_name}</td>
//                         <td className="p-4">{app.date.split('T')[0]} at {app.time}</td>
//                         <td className="p-4">
//                             <span className={`px-2 py-1 rounded text-sm ${
//                                 app.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
//                                 app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100'
//                             }`}>{app.status}</span>
//                         </td>
//                         <td className="p-4 space-x-2">
//                             {app.status === 'pending' && (
//                                 <button onClick={() => handleStatus(app.id, 'confirmed')} className="text-green-600 hover:underline">Accept</button>
//                             )}
//                             <button onClick={() => handleStatus(app.id, 'rejected')} className="text-red-600 hover:underline">Reject</button>
//                         </td>
//                     </tr>
//                 ))}
//             </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }



"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Store Token
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect based on Role
      if (data.role === 'admin') router.push('/admin');
      else if (data.role === 'doctor') router.push('/doctor');
      else if (data.role === 'patient') router.push('/patient');

    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} 
              className="w-full border p-2 rounded" required />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} 
              className="w-full border p-2 rounded" required />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}