import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetFAQsQuery } from '../../services/faqApi';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const FAQItem = ({ faq, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`border-b border-white/5 transition-all ${isOpen ? 'bg-zinc-900/50' : ''}`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <span className="text-xl font-bold text-gray-200 group-hover:text-white transition-colors">
          {faq.pregunta}
        </span>
        <div className={`p-2 rounded-full transition-all ${isOpen ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-500'}`}>
          {isOpen ? <Minus size={18} /> : <Plus size={18} />}
        </div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-0 text-gray-400 text-lg leading-relaxed max-w-4xl">
              {faq.respuesta}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FAQSection = () => {
  const { data: faqs = [], isLoading } = useGetFAQsQuery();

  if (isLoading || faqs.length === 0) return null;

  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="sticky top-24"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 text-sm font-bold mb-6">
                <HelpCircle size={16} /> FAQ
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 italic leading-tight">
                Preguntas <br /> <span className="text-blue-500">Recurrentes</span>
              </h2>
              <p className="text-gray-500 text-lg mb-8">
                Despejamos tus dudas iniciales. Si no encuentras lo que buscas, nuestro equipo de soporte está a un click de distancia.
              </p>
              <a 
                href="/contacto" 
                className="inline-block px-8 py-4 border border-white/10 rounded-full font-bold text-white hover:bg-white hover:text-black transition-all"
              >
                Hacer otra pregunta
              </a>
            </motion.div>
          </div>
          
          <div className="lg:col-span-8">
            <div className="border-t border-white/5">
              {faqs.map((faq, index) => (
                <FAQItem key={faq._id} faq={faq} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
