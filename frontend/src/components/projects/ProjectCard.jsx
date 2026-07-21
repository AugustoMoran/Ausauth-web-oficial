import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiOutlineExternalLink, HiOutlineArrowNarrowRight } from 'react-icons/hi';

const ProjectGraphic = ({ name }) => {
  // Generar un gráfico abstracto basado en el nombre del proyecto
  const getGradient = (name) => {
    const gradients = {
      'AusAuth Blog': 'from-blue-600 to-indigo-900',
      'E-commerce Pro': 'from-purple-600 to-pink-900',
      'Sistema de Gestión Comercial': 'from-emerald-600 to-teal-900',
      'Dashboard Analytics': 'from-orange-600 to-red-900',
      'Sistema de Turnos': 'from-cyan-600 to-blue-900',
      'Landing Page Premium': 'from-amber-600 to-orange-900',
      'Plataforma Educativa': 'from-rose-600 to-purple-900',
      'Chat en Tiempo Real': 'from-green-600 to-emerald-900',
      'Inmobiliaria Digital': 'from-sky-600 to-indigo-900',
      'SaaS Empresarial': 'from-violet-600 to-fuchsia-900'
    };
    return gradients[name] || 'from-gray-600 to-gray-900';
  };

  return (
    <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(name)} opacity-40 group-hover:opacity-60 transition-opacity duration-700`}>
      <svg className="w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <pattern id={`pattern-${name}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="currentColor" className="text-white/20" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill={`url(#pattern-${name})`} />
        
        {/* Elementos abstractos animados */}
        <motion.circle 
          cx="70" cy="30" r="20" 
          fill="currentColor" className="text-white/10"
          animate={{ x: [0, 10, 0], y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path 
          d="M0,80 Q50,20 100,80" 
          stroke="currentColor" strokeWidth="0.5" fill="none" className="text-white/20"
          animate={{ d: ["M0,80 Q50,20 100,80", "M0,80 Q50,140 100,80", "M0,80 Q50,20 100,80"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
      
      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/20 blur-[60px] rounded-full group-hover:bg-white/40 transition-all duration-700" />
    </div>
  );
};

const ProjectCard = ({ project, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className="group relative"
    >
      <Link to={`/proyectos/${project._id}`} className="block">
        <div className="relative h-[480px] w-full bg-[#0a0a0a] rounded-[2.5rem] border border-white/5 overflow-hidden transition-all duration-700 hover:border-primary-500/30 hover:shadow-[0_0_50px_rgba(139,92,246,0.15)] group-hover:-translate-y-2">
          {/* Card Background / Graphic */}
          <ProjectGraphic name={project.nombre} />

          {/* Content Overlay */}
          <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
            {/* Glass Header */}
            <div className="mb-auto flex justify-between items-start">
              <div className="px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-400">
                  {project.categoria?.nombre || project.categoria_nombre || "Premium Software"}
                </span>
              </div>
            </div>

            {/* Project Details */}
            <div className="space-y-4">
              <h3 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-white leading-none">
                {project.nombre}
              </h3>
              
              <p className="text-gray-400 text-sm font-medium leading-relaxed line-clamp-2 uppercase">
                {project.descripcion}
              </p>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-2 py-2">
                {project.tecnologias?.map((tech, i) => (
                  <span key={i} className="text-[9px] font-black uppercase tracking-widest text-white/50 border border-white/10 px-2 py-1 rounded-md bg-white/5">
                    {tech}
                  </span>
                ))}
              </div>

              {/* Footer Action */}
              <div className="pt-4 flex items-center justify-between border-t border-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-widest text-primary-400">
                    Concepto de Alta Ingeniería
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-600 border border-white/10 px-3 py-1 rounded-lg">
                    Ausauth Original
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Shine Animation */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;