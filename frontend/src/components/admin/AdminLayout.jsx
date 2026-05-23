import React, { useState } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
  HiMenu,
  HiX,
} from 'react-icons/hi';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: HiOutlineViewGrid, exact: true },
  { to: '/admin/productos', label: 'Productos', icon: HiOutlineCube },
  { to: '/admin/categorias', label: 'Categorías', icon: HiOutlineTag },
  { to: '/admin/ordenes', label: 'Pedidos', icon: HiOutlineClipboardList },
  { to: '/admin/trabajos', label: 'Bolsa de Trabajos', icon: HiOutlineBriefcase },
  { to: '/admin/presupuestos', label: 'Presupuestos', icon: HiOutlineDocument },
  { to: '/admin/cupones', label: 'Cupones', icon: HiOutlineTicket },
  { to: '/admin/cloudinary', label: 'Almacenamiento', icon: HiOutlinePhotograph },
  { to: '/admin/banners', label: 'Banners', icon: HiOutlineCollection },
  { to: '/admin/popup', label: 'Popup WhatsApp', icon: HiOutlineChatAlt2 },
  { to: '/admin/usuarios', label: 'Gestión de Usuarios', icon: HiOutlineUsers },
  { to: '/admin/recomendaciones', label: 'Recomendaciones', icon: HiOutlineStar },
  { to: '/admin/descargas', label: 'Descargas', icon: HiOutlineDownload },
];

const AdminLayout = ({ children }) => {
  const isAdmin = useSelector(selectIsAdmin);
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Desktop Sidebar */}
      <aside className="w-56 bg-gray-900 text-gray-100 flex-shrink-0 hidden md:flex flex-col">
        <div className="px-5 py-4 border-b border-gray-800">
          <p className="font-bold text-white">Panel Admin</p>
        </div>
        <nav className="flex-1 py-4 space-y-1 px-3">
          {NAV_ITEMS.map(({ to, label, icon: Icon, exact }) => {
            const active = exact ? location.pathname === to : location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors ${
                  active ? 'bg-primary-400 text-gray-900 font-semibold' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-gray-800">
          <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
            <HiOutlineHome size={18} />
            Ir a la tienda
          </Link>
        </div>
      </aside>

      {/* Mobile Header + Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden bg-gray-900 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
          <p className="font-bold text-white">Panel Admin</p>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl hover:bg-gray-800 text-primary-400"
          >
            {mobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <nav className="md:hidden bg-gray-800 border-b border-gray-700 px-4 py-2 space-y-1">
            {NAV_ITEMS.map(({ to, label, icon: Icon, exact }) => {
              const active = exact ? location.pathname === to : location.pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors ${
                    active ? 'bg-primary-400 text-gray-900 font-semibold' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              );
            })}
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-400 hover:bg-gray-700 hover:text-white transition-colors border-t border-gray-700 mt-2 pt-2"
            >
              <HiOutlineHome size={18} />
              Ir a la tienda
            </Link>
          </nav>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gray-950 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
