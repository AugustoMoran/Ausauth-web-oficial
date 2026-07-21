import React from 'react';
import { motion } from 'framer-motion';
import { useGetServicesQuery } from '../../services/servicesApi';
import { 
  Globe, 
  ShoppingCart, 
  Settings, 
  Layout, 
  Zap, 
  Lock, 
  Cpu, 
  Cloud, 
  Terminal,
  ShieldCheck,
  Smartphone,
  BarChart
} from 'lucide-react';

const iconMap = {
  Globe: <Globe className="w-8 h-8 text-blue-400" />,
  ShoppingCart: <ShoppingCart className="w-8 h-8 text-purple-400" />,
  Settings: <Settings className="w-8 h-8 text-orange-400" />,
  Layout: <Layout className="w-8 h-8 text-cyan-400" />,
  Zap: <Zap className="w-8 h-8 text-yellow-400" />,
  Lock: <Lock className="w-8 h-8 text-red-400" />,
  Cpu: <Cpu className="w-8 h-8 text-indigo-400" />,
  Cloud: <Cloud className="w-8 h-8 text-sky-400" />,
  Terminal: <Terminal className="w-8 h-8 text-emerald-400" />,
  ShieldCheck: <ShieldCheck className="w-8 h-8 text-rose-400" />,
  Smartphone: <Smartphone className="w-8 h-8 text-pink-400" />,
  BarChart: <BarChart className="w-8 h-8 text-amber-400" />
};

const ServicesSection = () => {
  const { data: services = [], isLoading } = useGetServicesQuery();

  return (
    <section className="py-24 bg-black text-white relative overflow-hidden" id="servicios">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 blur-[180px] -z-10 rounded-full"></div>
      
      <div className="container mx-auto px-6">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase mb-6"
          >
            NUESTRO ARSENAL
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-bold mb-8 italic"
          >
            Servicios <span className="text-blue-500">Core</span>
          </motion.h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-xl font-light">
            No adaptamos tu negocio al software. Construimos software que se adapta a tu visión, escalando con eficiencia y elegancia técnica.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="h-[300px] rounded-3xl bg-zinc-900 animate-pulse border border-white/5"></div>
            ))
          ) : (
            services.map((service, index) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="p-10 rounded-[2.5rem] bg-zinc-900 border border-white/5 hover:border-blue-500/40 transition-all group relative overflow-hidden"
              >
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl group-hover:bg-blue-600/10 transition-colors"></div>
                
                <div className="mb-8 p-4 rounded-2xl bg-black border border-white/5 inline-block group-hover:scale-110 transition-transform duration-500">
                  {iconMap[service.icono] || <Settings className="w-8 h-8 text-blue-400" />}
                </div>
                
                <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-400 transition-colors">{service.titulo}</h3>
                <p className="text-gray-500 leading-relaxed mb-6 group-hover:text-gray-400 transition-colors">
                  {service.descripcion}
                </p>

                {service.beneficios && service.beneficios.length > 0 && (
                  <ul className="space-y-3 mt-8">
                    {service.beneficios.map((b, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-600 group-hover:text-gray-400 transition-colors">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50"></div>
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
