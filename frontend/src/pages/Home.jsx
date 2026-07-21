import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/layout/Hero';
import ProjectCard from '../components/projects/ProjectCard';
import { useGetProjectsQuery } from '../services/projectsApi';
import { HiArrowRight, HiOutlineChip, HiOutlineCode, HiOutlineGlobeAlt, HiOutlinePresentationChartBar } from 'react-icons/hi';
import { motion } from 'framer-motion';

const Home = () => {
  const { data: featuredData } = useGetProjectsQuery({ limit: 4, sort: 'popular' });
  const { data: newData } = useGetProjectsQuery({ limit: 4, sort: 'newest' });

  return (
    <div className="bg-[#050505] min-h-screen text-white">
      {/* Hero Agency Section */}
      <Hero />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Bento Services Section */}
        <section className="py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase mb-4">
              CAPACIDADES <span className="text-primary-400">CORE</span>
            </h2>
            <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-sm">Nuestra infraestructura a tu servicio</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-auto md:h-[600px]">
            {/* Box 1: Web Apps */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-2 md:row-span-1 bg-white/5 border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden group backdrop-blur-xl"
            >
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-primary-500/20 flex items-center justify-center mb-4 text-primary-400 group-hover:scale-110 transition-transform">
                    <HiOutlineCode size={24} />
                  </div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">Web Apps & SaaS</h3>
                  <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                    Plataformas integrales construidas con React, Node.js y arquitecturas cloud de alta disponibilidad.
                  </p>
                </div>
                <Link to="/proyectos" className="text-primary-400 font-black uppercase tracking-tighter text-xs mt-4 flex items-center gap-2 group-hover:gap-3 transition-all">
                  Explorar tecnología <HiArrowRight />
                </Link>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-400/10 blur-3xl -z-10" />
            </motion.div>

            {/* Box 2: E-commerce */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-1 md:row-span-1 bg-white/5 border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden group backdrop-blur-xl"
            >
              <div className="h-full flex flex-col justify-between">
                <div className="w-12 h-12 rounded-2xl bg-secondary-500/20 flex items-center justify-center mb-4 text-secondary-400 group-hover:scale-110 transition-transform">
                  <HiOutlineGlobeAlt size={24} />
                </div>
                <h3 className="text-xl font-black italic uppercase tracking-tighter leading-none mb-2">Omnichannel</h3>
                <p className="text-gray-500 text-xs">Escalabilidad global para negocios digitales.</p>
              </div>
            </motion.div>

            {/* Box 3: Enterprise */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-1 md:row-span-2 bg-gradient-to-br from-primary-600 to-primary-900 border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden group flex flex-col justify-between"
            >
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-6 text-white group-hover:rotate-12 transition-transform">
                  <HiOutlinePresentationChartBar size={24} />
                </div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-tight mb-4 text-white">
                  Fiscal & Secure Auth
                </h3>
                <p className="text-white/70 text-sm mb-6">
                  Expertos en integraciones con AFIP/ARCA y sistemas de autenticación JWT de doble factor.
                </p>
              </div>
              <div className="w-full h-1/3 bg-black/20 rounded-2xl backdrop-blur-sm border border-white/10 flex flex-col items-center justify-center font-black text-white italic tracking-widest text-xl">
                <span>AUSAUTH</span>
                <span className="text-[10px] opacity-50 tracking-[0.5em] mt-2">SECURED API</span>
              </div>
              {/* Animated lines effect could go here */}
            </motion.div>

            {/* Box 4: AI Engine */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-1 md:row-span-1 bg-white/5 border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden group backdrop-blur-xl"
            >
              <div className="h-full flex flex-col justify-between">
                <div className="w-12 h-12 rounded-2xl bg-primary-500/20 flex items-center justify-center mb-4 text-primary-400 group-hover:scale-110 transition-transform">
                  <HiOutlineChip size={24} />
                </div>
                <h3 className="text-xl font-black italic uppercase tracking-tighter leading-none mb-2">Automated QA</h3>
                <p className="text-gray-500 text-xs">Testeo riguroso con Vitest y Playwright.</p>
              </div>
            </motion.div>

            {/* Box 5: Big CTA */}
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="md:col-span-2 md:row-span-1 bg-white/5 border border-white/10 rounded-[2.5rem] p-4 flex flex-col sm:flex-row items-center gap-6 group hover:border-primary-400/30 transition-all backdrop-blur-md"
            >
              <div className="flex-1 p-4">
                <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-2">
                  ¿Listo para <span className="text-primary-400">Escalar?</span>
                </h2>
                <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Inicia tu transformación hoy</p>
              </div>
              <Link to="/proyectos" className="bg-primary-400 text-black font-black px-10 py-6 rounded-2xl hover:bg-white hover:scale-105 transition-all w-full sm:w-auto text-center uppercase tracking-tighter italic">
                Cotizar Proyecto
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Portfolio Highlights (Prev Featured Products) */}
        <section className="py-24 border-t border-white/5">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-primary-400 font-bold uppercase tracking-[0.4em] text-[10px] mb-2">Build History</p>
              <h2 className="text-4xl font-black italic uppercase tracking-tighter">PORTFOLIO <span className="text-gray-600">DE SELECCIÓN</span></h2>
            </div>
            <Link to="/proyectos" className="group text-white hover:text-primary-400 text-xs font-black uppercase tracking-widest flex items-center gap-3 border-b-2 border-primary-400/20 pb-1 transition-all">
              Ver Archivo <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {(featuredData?.projects || []).slice(0, 4).map((p) => (
              <ProjectCard key={p._id} project={p} />
            ))}
          </div>
        </section>

        {/* Trust Banner (Prev Banner CTA) */}
        <section className="py-12">
          <div className="bg-gradient-to-r from-gray-900 to-black rounded-[3rem] p-12 border border-white/5 relative overflow-hidden">
             <div className="absolute top-0 right-1/4 w-64 h-64 bg-primary-600/10 blur-[100px]" />
             <div className="max-w-3xl">
                <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-4">
                  SOPORTE DE <span className="text-primary-400">ALTO RENDIMIENTO</span>
                </h2>
                <p className="text-gray-400 text-lg mb-8">
                  No solo escribimos código. Construimos relaciones basadas en transparencia, 
                  velocidad de entrega y excelencia técnica garantizada por contrato.
                </p>
                <div className="flex flex-wrap gap-8 text-white/50">
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-white italic">24/7</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest leading-none mt-1">Monitoreo</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-white italic">100%</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest leading-none mt-1">Propiedad del Código</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-white italic">Cloud</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest leading-none mt-1">Native First</span>
                  </div>
                </div>
             </div>
          </div>
        </section>

        {/* Latest Tech/Projects (Prev New products) */}
        <section className="py-24 pb-32">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-secondary-400 font-bold uppercase tracking-[0.4em] text-[10px] mb-2">Latest Deployments</p>
              <h2 className="text-4xl font-black italic uppercase tracking-tighter">ÚLTIMAS <span className="text-gray-600">IMPLEMENTACIONES</span></h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {(newData?.projects || []).slice(0, 4).map((p) => (
              <ProjectCard key={p._id} project={p} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
