// import Link from 'next/link';

// export default function DoctorLayout({ children }) {
//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Sidebar */}
//       <aside className="w-64 bg-teal-700 text-white">
//         <div className="p-6 text-2xl font-bold">Doctor Portal</div>
//         <nav className="mt-6">
//           <Link href="/doctor" className="block py-3 px-6 hover:bg-teal-600">
//             My Appointments
//           </Link>
//           <Link href="/doctor/patients" className="block py-3 px-6 hover:bg-teal-600">
//             Patient Records
//           </Link>
//           <Link href="/doctor/profile" className="block py-3 px-6 hover:bg-teal-600">
//             My Profile
//           </Link>
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-8 overflow-y-auto">
//         {children}
//       </main>
//     </div>
//   );
// }



"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'doctor') {
      router.push('/login');
    } else {
      setAuthorized(true);
    }
  }, []);

  if (!authorized) return <div className="p-10">Checking access...</div>;

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-teal-700 text-white p-6">
        <h2 className="text-2xl font-bold mb-8">Doctor Portal</h2>
        <nav className="space-y-4">
          <Link href="/doctor" className="block hover:text-teal-200">Appointments</Link>
          <Link href="/doctor/patients" className="block hover:text-teal-200">My Patients</Link>
          <Link href="/doctor/chat" className="block hover:text-teal-200">Chat</Link>
          <button onClick={() => { localStorage.clear(); router.push('/login'); }} className="text-red-300 mt-10">Logout</button>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}