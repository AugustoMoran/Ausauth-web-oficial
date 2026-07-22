import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useGetProjectQuery } from "../services/projectsApi";
import { motion } from "framer-motion";
import { 
  HiOutlineChevronLeft, 
  HiOutlineTag, 
  HiOutlineExternalLink,
  HiOutlineLightBulb,
  HiOutlineShieldCheck,
  HiOutlineTrendingUp,
  HiOutlineCode
} from "react-icons/hi";
import { FaWhatsapp } from "react-icons/fa";
import config from "../config/app";

const ProjectDetail = () => {
  const { id } = useParams();
  const waNumber = config.whatsappNumber;
  const { data: project, isLoading, error } = useGetProjectQuery(id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-primary-400/20 border-t-primary-400 rounded-full animate-spin"></div>
    </div>
  );

  if (error || !project) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6 text-center">
      <h2 className="text-4xl sm:text-6xl font-black mb-4 italic uppercase tracking-tighter leading-none">Falla de <span className="text-primary-400">Sistema</span></h2>
      <p className="text-gray-500 mb-12 font-bold uppercase tracking-widest text-xs">El recurso solicitado no fue hallado en el servidor.</p>
      <Link to="/proyectos" className="bg-primary-400 text-black px-12 py-5 rounded-2xl font-black uppercase tracking-widest italic shadow-[0_0_50px_rgba(139,92,246,0.3)]">Reiniciar Búsqueda</Link>
    </div>
  );

  return (
    <div className="bg-black min-h-screen text-white overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary-400/10 blur-[150px] rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary-400/5 blur-[150px] rounded-full translate-x-1/2 translate-y-1/2" />

      {/* Header / Nav */}
      <div className="container mx-auto px-6 py-12 relative z-10">
        <Link to="/proyectos" className="inline-flex items-center gap-4 text-gray-500 hover:text-white transition-all group">
          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group-hover:bg-primary-400 group-hover:text-black transition-all">
            <HiOutlineChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </div>
          <span className="font-black uppercase tracking-[0.3em] text-[10px] italic">Volver al Master Portfolio</span>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pb-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <span className="px-5 py-2 bg-primary-400/10 text-primary-400 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] border border-primary-400/20">
                {project.categoria?.nombre || "Core Engineering"}
              </span>
              <span className="w-12 h-[1px] bg-white/10" />
              <span className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] italic">Case Study 0{Math.floor(Math.random() * 99)}</span>
            </div>
            
            <h1 className="text-5xl sm:text-7xl md:text-9xl font-black mb-10 italic uppercase tracking-tighter leading-[0.95] md:leading-[0.85] py-2">
              {project.nombre}
            </h1>
            
            <p className="text-xl text-gray-500 leading-relaxed mb-12 font-medium italic max-w-xl">
              {project.descripcion}
            </p>
            
            <div className="flex flex-wrap gap-6 mt-16">
              <a 
                href={`https://wa.me/${waNumber}?text=Hola%20Ausauth!%20Vi%20su%20proyecto%20${encodeURIComponent(project.nombre)}%20y%20me%20gustaría%20desarrollar%20algo%20similar.`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary-400 hover:bg-cyan-400 text-black px-12 py-6 rounded-2xl font-black flex items-center gap-4 transition-all hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(139,92,246,0.3)] italic uppercase tracking-widest text-sm"
              >
                <FaWhatsapp size={20} /> Iniciar Consulta
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary-400/20 blur-[120px] rounded-full animate-pulse" />
            <div className="relative rounded-[4rem] overflow-hidden border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)]">
              <img 
                src={project.imagenes?.[0]?.url || "https://via.placeholder.com/1200x900"} 
                alt={project.nombre}
                className="w-full aspect-[4/3] object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Case Study Details */}
      <section className="bg-zinc-950 py-40 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="p-12 rounded-[3.5rem] bg-black border border-white/5 relative overflow-hidden group hover:border-primary-400/30 transition-all"
            >
              <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-primary-400 mb-10 border border-white/10 group-hover:bg-primary-400 group-hover:text-black transition-all">
                <HiOutlineLightBulb size={28} />
              </div>
              <h3 className="text-3xl font-black mb-6 uppercase tracking-tighter italic">El Desafío</h3>
              <p className="text-gray-500 leading-relaxed font-bold italic text-sm group-hover:text-gray-300 transition-colors">
                {project.problema || "Análisis exhaustivo de la arquitectura legacy y detección de cuellos de botella en la infraestructura de datos."}
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-12 rounded-[3.5rem] bg-black border border-white/5 relative overflow-hidden group hover:border-primary-400/30 transition-all shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            >
              <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-primary-400 mb-10 border border-white/10 group-hover:bg-primary-400 group-hover:text-black transition-all">
                <HiOutlineShieldCheck size={28} />
              </div>
              <h3 className="text-3xl font-black mb-6 uppercase tracking-tighter italic">Ingeniería</h3>
              <p className="text-gray-500 leading-relaxed font-bold italic text-sm group-hover:text-gray-300 transition-colors">
                {project.solucion || "Desarrollo de una solución cloud-native distribuida con escalamiento predictivo y seguridad perimetral de grado miliar."}
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-12 rounded-[3.5rem] bg-black border border-white/5 relative overflow-hidden group hover:border-primary-400/30 transition-all"
            >
              <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-primary-400 mb-10 border border-white/10 group-hover:bg-primary-400 group-hover:text-black transition-all">
                <HiOutlineTrendingUp size={28} />
              </div>
              <h3 className="text-3xl font-black mb-6 uppercase tracking-tighter italic">Resultados</h3>
              <p className="text-gray-500 leading-relaxed font-bold italic text-sm group-hover:text-gray-300 transition-colors">
                {project.resultado || "Aumento masivo del rendimiento y reducción del 40% en costos operativos mediante optimización de microservicios."}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      {project.tecnologias && project.tecnologias.length > 0 && (
        <section className="py-40 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-xs font-black uppercase tracking-[0.5em] text-gray-600 mb-12 italic">Ecosistema Tecnológico</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {project.tecnologias.map((tech) => (
                <span 
                  key={tech}
                  className="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl font-black text-gray-400 hover:text-primary-400 hover:border-primary-400/50 transition-all cursor-default uppercase tracking-widest text-[10px] italic shadow-2xl"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* Images Gallery */}
      {project.imagenes && project.imagenes.length > 1 && (
        <section className="py-24 bg-zinc-950 relative overflow-hidden">
          <div className="container mx-auto px-6 relative z-10">
            <h2 className="text-4xl font-black mb-20 uppercase tracking-tighter italic">Visual <span className="text-primary-400">Captures</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {project.imagenes.slice(1).map((img, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  className="rounded-[3rem] overflow-hidden border border-white/10 shadow-3xl group relative aspect-video"
                >
                  <img 
                    src={img.url} 
                    alt={`Capture ${i}`} 
                    className="w-full h-full object-cover transition-all duration-1000 grayscale group-hover:grayscale-0 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-primary-400/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProjectDetail;
