import React from 'react';
import { Link } from 'react-router-dom';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';
import { HiMail, HiPhone, HiArrowRight } from 'react-icons/hi';
import config from '../../config/app';

const Footer = () => {
  const waNumber = config.whatsappNumber;
  const storeName = "Ausauth";
  const email = config.contactEmail;

  return (
    <footer className="bg-[#050505] text-gray-300 relative border-t border-white/5 overflow-hidden">
      {/* Glow effect */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-32 bg-primary-600/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24">
          {/* Brand Column */}
          <div className="md:col-span-12 lg:col-span-5">
            <div className="flex flex-col gap-6 mb-8 items-start">
              <div className="p-3 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
                <img 
                  src="/logooficial.png" 
                  alt="Ausauth Dev Logo" 
                  className="h-20 w-auto object-contain filter drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-4xl font-black tracking-widest uppercase italic leading-none">
                  <span className="text-secondary-400">AUS</span>
                  <span className="text-white">AUTH</span>
                </span>
                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.5em] leading-none mt-2">Architecting the future</span>
              </div>
            </div>
            
            <p className="text-gray-500 text-lg max-w-sm mb-10 leading-relaxed font-medium">
              Transformamos la complejidad técnica en ventaja competitiva. 
              Software de alto rendimiento diseñado para escalar.
            </p>

            <div className="flex gap-4">
              <a
                href={`https://wa.me/${waNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-green-500/10 hover:border-green-500/50 transition-all group"
                aria-label="WhatsApp"
              >
                <FaWhatsapp size={24} className="text-gray-400 group-hover:text-green-500 transition-colors" />
              </a>
              <a
                href={config.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-primary-500/10 hover:border-primary-500/50 transition-all group"
                aria-label="Instagram"
              >
                <FaInstagram size={24} className="text-gray-400 group-hover:text-primary-400 transition-colors" />
              </a>
              <a
                href={`mailto:${config.contactEmail}`}
                className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-secondary-500/10 hover:border-secondary-500/50 transition-all group"
                aria-label="Email"
              >
                <HiMail size={24} className="text-gray-400 group-hover:text-secondary-400 transition-colors" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-4 lg:col-span-2">
            <h3 className="font-black text-white mb-8 italic tracking-widest uppercase text-xs border-l-2 border-primary-400 pl-4">Ecosistema</h3>
            <ul className="space-y-4 text-sm font-bold uppercase tracking-tighter italic">
              <li><Link to="/proyectos" className="text-gray-500 hover:text-white transition-colors">Portfolio</Link></li>
              <li><Link to="/servicios" className="text-gray-500 hover:text-white transition-colors">Stack</Link></li>
              <li><Link to="/mis-presupuestos" className="text-gray-500 hover:text-white transition-colors">Quotes Hub</Link></li>
              <li><Link to="/downloads" className="text-gray-500 hover:text-white transition-colors">Resources</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4 lg:col-span-2">
            <h3 className="font-black text-white mb-8 italic tracking-widest uppercase text-xs border-l-2 border-primary-400 pl-4">Compañía</h3>
            <ul className="space-y-4 text-sm font-bold uppercase tracking-tighter italic">
              <li><Link to="/about" className="text-gray-500 hover:text-white transition-colors">Mission</Link></li>
              <li><Link to="/privacy" className="text-gray-500 hover:text-white transition-colors">Privacy</Link></li>
              <li><Link to="/terms" className="text-gray-500 hover:text-white transition-colors">Terms</Link></li>
              <li><Link to="/contact" className="text-gray-500 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold text-gray-700 uppercase tracking-[0.4em]">
            © {new Date().getFullYear()} AUSAUTH DEV. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8 text-[10px] font-bold text-gray-700 uppercase tracking-widest">
            <span>BUENOS AIRES, ARGENTINA</span>
            <span className="text-white/20 hidden md:block">|</span>
            <span>DEVELOPED WITH AUSAUTH CORE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
