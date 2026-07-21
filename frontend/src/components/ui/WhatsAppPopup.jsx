import React, { useState, useEffect, useRef } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { HiX, HiSparkles } from 'react-icons/hi';
import { useGetPopupConfigQuery } from '../../services/popupApi';
import config from '../../config/app';

// Imagen default: Tech Premium Agency (Unsplash)
const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80';

const DEFAULTS = {
  titulo: '¿Listo para escalar tu Proyecto?',
  descripcion:
    'Hablemos hoy sobre tu próxima solución digital. Arquitectura de software y diseño premium a un clic.',
  ctaTexto: 'Iniciar Consultoría',
  whatsappNumero: config.whatsappNumber,
  mensajePrellenado:
    'Hola, estuve viendo la página y me gustaría recibir atención personalizada.',
  imagen: DEFAULT_IMAGE,
  tiempoAparicion: 5,
  activo: true,
};

const WhatsAppPopup = () => {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef(null);

  const { data: rawConfig } = useGetPopupConfigQuery();

  // Merge config con defaults — si un campo está vacío, cae al default
  const cfg = {
    ...DEFAULTS,
    ...rawConfig,
    titulo: rawConfig?.titulo?.trim() || DEFAULTS.titulo,
    descripcion: rawConfig?.descripcion?.trim() || DEFAULTS.descripcion,
    ctaTexto: rawConfig?.ctaTexto?.trim() || DEFAULTS.ctaTexto,
    whatsappNumero: rawConfig?.whatsappNumero?.trim() || DEFAULTS.whatsappNumero,
    mensajePrellenado: rawConfig?.mensajePrellenado?.trim() || DEFAULTS.mensajePrellenado,
    imagen: rawConfig?.imagen?.trim() || DEFAULTS.imagen,
    tiempoAparicion:
      Number(rawConfig?.tiempoAparicion) > 0
        ? Number(rawConfig.tiempoAparicion)
        : DEFAULTS.tiempoAparicion,
    activo: rawConfig?.activo !== false, // true por defecto
  };

  useEffect(() => {
    if (!cfg.activo) return;

    // No mostrar si ya se cerró en esta sesión
    if (sessionStorage.getItem('wa_popup_closed') === '1') return;

    timerRef.current = setTimeout(() => {
      setVisible(true);
      // Pequeño delay para disparar la animación de entrada
      requestAnimationFrame(() => setAnimating(true));
    }, cfg.tiempoAparicion * 1000);

    return () => clearTimeout(timerRef.current);
  }, [cfg.activo, cfg.tiempoAparicion]);

  const handleClose = () => {
    setAnimating(false);
    setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem('wa_popup_closed', '1');
    }, 350);
  };

  const waUrl = `https://wa.me/${cfg.whatsappNumero}?text=${encodeURIComponent(
    cfg.mensajePrellenado
  )}`;

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-8 right-4 z-[9999] w-[320px] max-w-[calc(100vw-2rem)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
        animating
          ? 'opacity-100 translate-y-0 scale-100 rotate-0'
          : 'opacity-0 translate-y-12 scale-90 rotate-2'
      }`}
      style={{ transitionProperty: 'opacity, transform' }}
      role="dialog"
      aria-modal="false"
      aria-label="Consultoría Digital"
    >
      {/* GLOW EFFECT */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-[2rem] blur opacity-20" />

      {/* CARD BODY */}
      <div className="relative rounded-[2rem] overflow-hidden border border-white/10 bg-gray-950/90 backdrop-blur-2xl shadow-2xl">

        {/* HEADER MEDIA */}
        <div className="relative h-44 overflow-hidden group">
          <img
            src={cfg.imagen}
            alt="Ausauth Agency"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
          <div className="absolute inset-0 bg-primary-400/10 mix-blend-overlay" />

          {/* BADGE */}
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em]">
            <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-pulse" />
            Software Agency
          </div>

          {/* CLOSE */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleClose();
            }}
            className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-black/80 hover:bg-rose-500 text-white flex items-center justify-center transition-all duration-300 active:scale-90 z-[100] cursor-pointer border border-white/20"
            aria-label="Cerrar"
          >
            <HiX size={20} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="px-6 pt-4 pb-6">
          <div className="mb-4">
            <h3 className="text-white font-black text-lg italic uppercase tracking-tighter leading-none mb-2">
              {cfg.titulo.split(' ').map((word, i) => i === cfg.titulo.split(' ').length - 1 ? <span key={i} className="text-primary-400">{word}</span> : word + ' ')}
            </h3>
            <p className="text-gray-400 text-[11px] font-medium leading-relaxed">
              {cfg.descripcion}
            </p>
          </div>

          {/* CTA */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClose}
            className="group relative flex items-center justify-center gap-3 w-full bg-white text-black font-black uppercase tracking-widest text-[10px] py-4 rounded-2xl transition-all duration-300 hover:bg-primary-400 hover:text-white active:scale-95 shadow-[0_10px_20px_rgba(0,0,0,0.3)]"
          >
            <FaWhatsapp size={16} className="transition-transform group-hover:rotate-12" />
            {cfg.ctaTexto}
            <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
          </a>

          {/* FOOTER */}
          <div className="flex items-center justify-center gap-4 mt-5">
            <span className="h-px flex-1 bg-white/5" />
            <p className="text-gray-600 font-bold uppercase tracking-[0.3em] text-[8px] whitespace-nowrap">
              EST. 2024 · AUSAUTH DEV
            </p>
            <span className="h-px flex-1 bg-white/5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppPopup;
