import React from 'react';
import { motion } from 'framer-motion';
import { HiArrowRight, HiOutlineLightningBolt, HiOutlineCube, HiOutlineShieldCheck } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505] pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary-600/20 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 contrast-150" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-primary-400 animate-pulse" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Software Agency | Ausauth
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-[1.1] sm:leading-none mb-6">
              TRANSFORMAMOS <br />
              IDEAS EN <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400 italic py-2 leading-relaxed inline-block">
                SOLUCIONES DIGITALES
              </span>
            </h1>

            <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-lg mb-8 leading-relaxed">
              Desde sitios web hasta plataformas empresariales completas. Diseñamos soluciones tecnológicas a medida que ayudan a automatizar procesos, optimizar operaciones y generar resultados reales.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link 
                to="/proyectos" 
                className="px-8 py-4 bg-primary-400 text-black font-black uppercase tracking-tighter rounded-2xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(139,92,246,0.4)] flex items-center gap-2 group"
              >
                Ver Proyectos
                <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/servicios" 
                className="px-8 py-4 bg-white/5 text-white border border-white/10 font-black uppercase tracking-tighter rounded-2xl hover:bg-white/10 transition-all backdrop-blur-md"
              >
                Nuestra Experiencia
              </Link>
            </div>

            <div className="mt-12 flex gap-8 items-center border-t border-white/5 pt-8">
              <div>
                <p className="text-2xl font-black text-white leading-none">50+</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Sistemas Desplegados</p>
              </div>
              <div className="w-[1px] h-8 bg-white/10" />
              <div>
                <p className="text-2xl font-black text-white leading-none">99.9%</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Uptime SLA</p>
              </div>
            </div>
          </motion.div>

          {/* Right Visual / 3D Grid Elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-12">
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all group">
                  <div className="w-12 h-12 rounded-2xl bg-primary-500/20 flex items-center justify-center mb-4 text-primary-400 group-hover:scale-110 transition-transform">
                    <HiOutlineLightningBolt size={24} />
                  </div>
                  <h3 className="text-white font-bold mb-1 uppercase tracking-tighter italic text-sm">Desarrollo Ágil</h3>
                  <p className="text-gray-500 text-[10px] leading-relaxed">Entregas rápidas y procesos optimizados para lanzar proyectos de forma eficiente.</p>
                </div>
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all group">
                  <div className="w-12 h-12 rounded-2xl bg-secondary-500/20 flex items-center justify-center mb-4 text-secondary-400 group-hover:scale-110 transition-transform">
                    <HiOutlineShieldCheck size={24} />
                  </div>
                  <h3 className="text-white font-bold mb-1 uppercase tracking-tighter italic text-sm">Seguridad Empresarial</h3>
                  <p className="text-gray-500 text-[10px] leading-relaxed">Protección de datos y arquitecturas robustas diseñadas para operar con confianza.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all group">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform">
                    <img src="/logooficial.png" alt="Logo" className="w-8 h-8 object-contain" />
                  </div>
                  <h3 className="text-white font-bold mb-1 uppercase tracking-tighter italic text-sm">Crecimiento sin límites</h3>
                  <p className="text-gray-500 text-[10px] leading-relaxed">Soluciones preparadas para acompañar la evolución y expansión de tu empresa.</p>
                </div>
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all group">
                  <div className="w-12 h-12 rounded-2xl bg-primary-500/20 flex items-center justify-center mb-4 text-primary-400 group-hover:scale-110 transition-transform">
                    <HiOutlineCube size={24} />
                  </div>
                  <h3 className="text-white font-bold mb-1 uppercase tracking-tighter italic text-sm">Ecosistema Integrado</h3>
                  <p className="text-gray-500 text-[10px] leading-relaxed">Centraliza usuarios, procesos y servicios en una única plataforma escalable.</p>
                </div>
              </div>
            </div>
            
            {/* Glow Orbs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-600/30 rounded-full blur-[80px] -z-10 animate-pulse" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;