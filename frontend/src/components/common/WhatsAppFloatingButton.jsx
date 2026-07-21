import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import { HiX } from 'react-icons/hi';

const WhatsAppFloatingButton = () => {
  const [showTooltip, setShowTooltip] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            className="mb-4 bg-white text-black p-4 rounded-2xl rounded-br-none shadow-2xl border border-white/20 max-w-[240px] relative"
          >
            <button 
              onClick={() => setShowTooltip(false)}
              className="absolute -top-2 -left-2 bg-black text-white rounded-full p-1"
            >
              <HiX size={12} />
            </button>
            <p className="text-sm font-bold leading-tight">
              ¿Hablamos de tu próximo proyecto hoy? 🚀
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        href={`https://wa.me/${config.whatsappNumber}?text=Hola!%20Vi%20tu%20web%20y%20me%20gustar%C3%ADa%20consultar%20por%20un%20proyecto.`}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-colors group relative"
      >
        <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
        <FaWhatsapp size={32} />
      </motion.a>
    </div>
  );
};

export default WhatsAppFloatingButton;
