import React from 'react';
import { motion } from 'framer-motion';
import { useGetTestimonialsQuery } from '../../services/testimonialsApi';
import { Star, MessageSquare } from 'lucide-react';

const TestimonialsSection = () => {
  const { data: testimonials = [], isLoading } = useGetTestimonialsQuery();

  if (isLoading || testimonials.length === 0) return null;

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] -z-10 rounded-full"></div>
      
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 text-sm font-bold mb-6"
          >
            <MessageSquare size={16} /> CASOS DE ÉXITO
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 italic">
            Confían en nuestra <span className="text-blue-500 underline decoration-2 underline-offset-8">visión</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            La mejor forma de conocer nuestro trabajo es escuchando a quienes ya lo han experimentado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[2rem] bg-zinc-900 border border-white/5 relative group hover:border-blue-500/30 transition-all"
            >
              <div className="flex gap-1 mb-6 text-amber-500">
                {[...Array(t.estrellas)].map((_, j) => (
                  <Star key={j} size={16} fill="currentColor" />
                ))}
              </div>
              
              <p className="text-lg text-gray-300 mb-8 italic leading-relaxed">
                "{t.comentario}"
              </p>

              <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-800 grayscale group-hover:grayscale-0 transition-all duration-500">
                  {t.imagen?.url ? (
                    <img src={t.imagen.url} alt={t.nombre} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 font-bold bg-zinc-800">
                      {t.nombre[0]}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-white">{t.nombre}</h4>
                  <p className="text-xs text-gray-600 font-bold uppercase tracking-widest">
                    {t.puesto} {t.empresa && `/ ${t.empresa}`}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
