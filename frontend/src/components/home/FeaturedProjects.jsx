import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useGetProjectsQuery } from '../../services/projectsApi';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';

const FeaturedProjects = () => {
  const { data, isLoading } = useGetProjectsQuery({ isFeatured: true, limit: 6 });
  const projects = data?.projects || [];

  if (isLoading) return <div className="py-20 text-center text-white">Cargando proyectos...</div>;

  return (
    <section className="py-24 bg-zinc-950 text-white" id="proyectos">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Proyectos <span className="text-purple-500">Destacados</span>
            </motion.h2>
            <p className="text-gray-400 max-w-xl">
              Una selección de trabajos donde convertimos ideas complejas en soluciones digitales elegantes y funcionales.
            </p>
          </div>
          <Link to="/proyectos" className="group flex items-center gap-2 text-white font-medium hover:text-purple-400 transition-colors">
            Ver todo el portfolio
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {projects.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-zinc-900 border border-white/5">
                {project.imagenes && project.imagenes.length > 0 ? (
                  <img 
                    src={project.imagenes[0].url} 
                    alt={project.nombre}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-700">
                    Sin imagen
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 p-8 w-full">
                    <div className="flex gap-2 mb-3">
                      {project.tecnologias?.slice(0, 3).map((tech, i) => (
                        <span key={i} className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-medium border border-white/5 uppercase">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-3xl font-bold mb-2 group-hover:text-purple-400 transition-colors">{project.nombre}</h3>
                    <p className="text-gray-300 line-clamp-1 mb-6">{project.descripcion}</p>
                    
                    <div className="flex items-center gap-4">
                      <Link 
                        to={`/proyectos/${project._id}`}
                        className="px-6 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-gray-200 transition-colors"
                      >
                        Ver Detalles
                      </Link>
                      {project.urlProyecto && (
                        <a href={project.urlProyecto} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                      {project.urlGitHub && (
                        <a href={project.urlGitHub} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                          <Github className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
