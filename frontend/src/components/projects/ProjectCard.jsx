import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiOutlineExternalLink, HiOutlineCollection } from 'react-icons/hi';

const ProjectCard = ({ project }) => {
  return (
    <motion.div
      layout
      className="group flex flex-col h-full"
    >
      <Link 
        to={`/proyectos/${project._id}`} 
        className="block relative aspect-[16/10] overflow-hidden rounded-[2.5rem] bg-zinc-900 border border-white/5 mb-6 group-hover:border-primary-400/50 transition-colors shadow-2xl"
      >
        <img 
          src={project.imagenes?.[0]?.url || "https://via.placeholder.com/800x600"} 
          alt={project.nombre}
          className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110 opacity-60 group-hover:opacity-100"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-8">
          <div className="flex gap-2 mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            {project.tecnologias?.slice(0, 2).map((tech, i) => (
              <span key={i} className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/10">
                {tech}
              </span>
            ))}
          </div>
          <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2 group-hover:text-primary-400 transition-colors">
            {project.nombre}
          </h3>
          <p className="text-gray-400 text-xs font-medium line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            {project.descripcion}
          </p>
        </div>
      </Link>
      
      <div className="flex items-center justify-between px-2 mt-auto">
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 italic">
          {project.categoria?.nombre || "Software Architecture"}
        </span>
        <Link 
          to={`/proyectos/${project._id}`} 
          className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-primary-400 hover:text-black transition-all group/btn border border-white/5"
        >
          <HiOutlineExternalLink className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
};

export default ProjectCard;