import React from 'react';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';
import ChatWidget from './ChatWidget';
import config from '../../config/app';

const FloatingButtons = () => {
  // Número actualizado por el usuario
  const waNumber = config.whatsappNumber;
  const instaUrl = config.instagramUrl;

  return (
    <div className="fixed bottom-6 right-4 z-[10001] flex flex-col-reverse items-center gap-4 pointer-events-auto">
      {/* AI Chat (Base) */}
      <ChatWidget />

      {/* WhatsApp - Premium Aesthetic */}
      <a
        href={`https://wa.me/${waNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 bg-black border border-white/10 ring-1 ring-primary-400/30 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 hover:ring-primary-400 group"
        aria-label="WhatsApp"
      >
        <FaWhatsapp size={22} className="text-primary-400 group-hover:text-white transition-colors" />
      </a>

      {/* Instagram - Premium Aesthetic */}
      <a
        href={instaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 bg-black border border-white/10 ring-1 ring-primary-400/30 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 hover:ring-primary-400 group"
        aria-label="Instagram"
      >
        <FaInstagram size={22} className="text-primary-400 group-hover:text-white transition-colors" />
      </a>
    </div>
  );
};

export default FloatingButtons;
