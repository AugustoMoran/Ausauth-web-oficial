import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useGetProjectsQuery } from '../../services/projectsApi';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';
import ProjectCard from '../projects/ProjectCard';

const FeaturedProjects = () => {
  const { data, isLoading } = useGetProjectsQuery({ isFeatured: true, limit: 4 });
  const projects = data?.proyectos || [];

  if (isLoading) return <div className="py-20 text-center text-white bg-black">Cargando la elite...</div>;

  return (
    <section className="py-32 bg-black text-white relative overflow-hidden" id="proyectos">
      {/* Glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary-400/5 blur-[120px] rounded-full" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="w-12 h-[1px] bg-primary-500" />
                <span className="text-primary-400 font-black uppercase tracking-[0.4em] text-[10px]">
                  Master Portfolio
                </span>
              </div>
              <h2 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.9] mb-8">
                Arquitectura <br />
                <span className="text-primary-400">Digital Premium</span>
              </h2>
              <p className="text-gray-500 text-xl font-medium leading-tight max-w-xl italic uppercase font-bold">
                Una selección exclusiva de sistemas complejos <br />
                y experiencias de alto rendimiento.
              </p>
            </motion.div>
          </div>
          
          <Link 
            to="/proyectos" 
            className="group flex items-center gap-4 px-10 py-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all"
          >
            <span className="text-[10px] font-black uppercase tracking-widest">Explorar Todo</span>
            <HiOutlineArrowNarrowRight className="w-5 h-5 text-primary-400 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {projects.map((project, index) => (
            <ProjectCard key={project._id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
