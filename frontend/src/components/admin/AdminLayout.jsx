import React, { useState } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { selectCurrentUser, selectIsAdmin } from '../../features/auth/authSlice';
import {
  HiOutlineViewGrid,
  HiOutlineCube,
  HiOutlineTag,
  HiOutlineClipboardList,
  HiOutlineTruck,
  HiOutlineTicket,
  HiOutlinePhotograph,
  HiOutlineCollection,
  HiOutlineHome,
  HiOutlineChatAlt2,
  HiOutlineBriefcase,
  HiOutlineUsers,
  HiOutlineStar,
  HiOutlineDocument,
  HiOutlineDownload,
  HiOutlineSpeakerphone,
  HiMenu,
  HiX,
} from 'react-icons/hi';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: HiOutlineViewGrid, exact: true },
  { to: '/admin/proyectos', label: 'Proyectos', icon: HiOutlineCube },
  { to: '/admin/servicios', label: 'Servicios', icon: HiOutlineCollection },
  { to: '/admin/presupuestos', label: 'Presupuestos', icon: HiOutlineDocument },
  { to: '/admin/popup', label: 'Popups & Ads', icon: HiOutlineSpeakerphone },
  { to: '/admin/faqs', label: 'Preguntas Frecuentes', icon: HiOutlineClipboardList },
  { to: '/admin/usuarios', label: 'Gestión de Usuarios', icon: HiOutlineUsers },
  { to: '/admin/cloudinary', label: 'Almacenamiento', icon: HiOutlinePhotograph },
  { to: '/admin/categorias', label: 'Categorías', icon: HiOutlineTag },
];

const AdminLayout = ({ children }) => {
  const isAdmin = useSelector(selectIsAdmin);
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="flex h-screen bg-[#050505]">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-[#0D0D0D] border-r border-white/5 text-gray-100 flex-shrink-0 hidden md:flex flex-col relative z-20 shadow-2xl">
        <div className="p-8 border-b border-white/5 bg-gradient-to-br from-white/5 to-transparent">
          <div className="flex flex-col gap-4">
            <div className="p-2 bg-white/5 rounded-2xl border border-white/10 w-fit">
              <img src="/logooficial.png" alt="Admin" className="h-10 w-auto" />
            </div>
            <div>
              <span className="font-black text-white text-xl tracking-tighter uppercase italic leading-none">Control <span className="text-primary-400">Hub</span></span>
              <p className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.4em] mt-2">AUSAUTH CORE</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-6 space-y-1.5 px-4 overflow-y-auto custom-scrollbar">
          {NAV_ITEMS.map(({ to, label, icon: Icon, exact }) => {
            const active = exact ? location.pathname === to : location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl text-[11px] uppercase tracking-widest font-bold transition-all ${
                  active 
                    ? 'bg-primary-400 text-black shadow-[0_0_15px_rgba(139,92,246,0.3)]' 
                    : 'text-gray-500 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/5'
                }`}
              >
                <Icon size={18} className={active ? 'text-black' : 'text-primary-400'} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5 bg-black/50 backdrop-blur-md">
          <Link 
            to="/" 
            className="flex items-center justify-center gap-3 px-4 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-primary-400 border border-primary-400/20 hover:bg-primary-400 hover:text-black transition-all group"
          >
            <HiOutlineHome size={16} />
            BACK TO GALAXY
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Glow */}
        <div className="absolute top-0 right-0 w-1/2 h-64 bg-primary-600/5 blur-[120px] pointer-events-none" />

        {/* Mobile Header */}
        <div className="md:hidden bg-[#0D0D0D] border-b border-white/5 px-6 py-4 flex items-center justify-between relative z-30">
          <div className="flex items-center gap-3">
             <img src="/logooficial.png" alt="Admin" className="h-8 w-auto" />
             <span className="font-black text-white uppercase italic tracking-tighter text-sm">HUB</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-3 rounded-2xl bg-white/5 border border-white/10 text-primary-400"
          >
            {mobileMenuOpen ? <HiX size={20} /> : <HiMenu size={20} />}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden absolute inset-x-0 top-full bg-[#0D0D0D] border-b border-white/10 px-6 py-4 space-y-2 z-40 shadow-2xl"
            >
              {NAV_ITEMS.map(({ to, label, icon: Icon, exact }) => {
                const active = exact ? location.pathname === to : location.pathname.startsWith(to);
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-4 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${
                      active ? 'bg-primary-400 text-black' : 'text-gray-400 hover:bg-white/5'
                    }`}
                  >
                    <Icon size={18} />
                    {label}
                  </Link>
                );
              })}
            </motion.nav>
          )}
        </AnimatePresence>

        {/* Main Dashboard Content */}
        <main className="flex-1 overflow-auto p-4 md:p-8 relative custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
