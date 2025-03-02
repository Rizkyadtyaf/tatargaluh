'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { IconHome, IconMenu, IconLogout } from './Icons';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.replace('/admin/login');
  };

  if (!mounted) {
    return null;
  }

  return (
    <aside className={`fixed left-0 top-0 h-screen bg-surface flex flex-col items-center py-8 gap-8 transition-all duration-300 ${isOpen ? 'w-20' : 'w-16'}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-8 transition-transform duration-300 ${!isOpen ? 'rotate-180' : ''}`}
      >
        <IconMenu />
      </button>

      <nav className={`flex flex-col gap-6 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
        <Link href="/admin/dashboard" className="nav-icon active">
          <IconHome />
        </Link>
      </nav>

      {/* Spacer to push logout button to bottom */}
      <div className="flex-grow"></div>
      
      {/* Logout button */}
      <button 
        onClick={handleLogout}
        className={`w-12 h-12 text-red-500 hover:bg-red-500/10 rounded-xl flex items-center justify-center transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'} mb-4`}
        title="Logout"
      >
        <IconLogout />
      </button>
    </aside>
  );
}
