import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import FloatingButtons from '../ui/FloatingButtons';
import WhatsAppPopup from '../ui/WhatsAppPopup';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#050505]">
      <Header />
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
      <Footer />
      <FloatingButtons />
      <WhatsAppPopup />
    </div>
  );
};

export default Layout;
