import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useGetProjectsQuery, useGetCategoriesQuery } from '../services/projectsApi';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ExternalLink, Search } from 'lucide-react';

const Projects = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  const categoria = searchParams.get('categoria') || '';
  const search = searchParams.get('search') || '';

  const { data, isFetching } = useGetProjectsQuery({ 
    page: 1, 
    limit: 100,
    categoria, 
    search 
  });

  const { data: categories = [] } = useGetCategoriesQuery();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchQuery) params.set('search', searchQuery);
    else params.delete('search');
    setSearchParams(params);
  };

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    setSearchParams(params);
  };

  return (
    <div className="bg-black min-h-screen text-white pt-32 pb-24 overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-400/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary-400/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div className="max-w-4xl mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary-400 font-black uppercase tracking-[0.4em] text-xs mb-4 block">
              Showcase de Ingeniería
            </span>
            <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.9] mb-8">
              Nuestro <br />
              <span className="text-primary-400">Master Portfolio</span>
            </h1>
            <p className="text-gray-500 text-lg md:text-xl font-medium leading-relaxed max-w-2xl italic">
              Desde arquitecturas distribuidas hasta experiencias disruptivas. 
              Explora cómo transformamos desafíos complejos en soluciones de alto rendimiento.
            </p>
          </motion.div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => updateFilter('categoria', '')}
              className={`px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border ${!categoria ? 'bg-primary-400 text-black border-primary-400 shadow-[0_0_30px_rgba(139,92,246,0.3)]' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white hover:bg-white/10'}`}
            >
              Todos los Proyectos
            </button>
            {categories.map((cat) => (
              <button 
                key={cat._id}
                onClick={() => updateFilter('categoria', cat._id)}
                className={`px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border ${categoria === cat._id ? 'bg-primary-400 text-black border-primary-400 shadow-[0_0_30px_rgba(139,92,246,0.3)]' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white hover:bg-white/10'}`}
              >
                {cat.nombre}
              </button>
            ))}
          </div>

          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Filtro de tecnología o nombre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-8 focus:outline-none focus:border-primary-400 transition-all font-bold placeholder:text-gray-600 text-white"
            />
          </form>
        </div>

        {/* Content Grid */}
        {isFetching ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="aspect-[16/10] bg-white/5 rounded-[2.5rem] animate-pulse border border-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {data?.projects?.map((project, index) => (
                <motion.div
                  key={project._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="group"
                >
                  <Link to={`/proyectos/${project._id}`} className="block relative aspect-[16/11] overflow-hidden rounded-[2.5rem] bg-zinc-900 border border-white/5 mb-6 group-hover:border-primary-400/50 transition-colors shadow-2xl">
                    <img 
                      src={project.imagenes?.[0]?.url || "https://via.placeholder.com/800x600"} 
                      alt={project.nombre}
                      className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110 opacity-60 group-hover:opacity-100"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-8">
                      <div className="flex gap-2 mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        {project.tecnologias?.slice(0, 3).map((tech, i) => (
                          <span key={i} className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/10">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-2 group-hover:text-primary-400 transition-colors">
                        {project.nombre}
                      </h3>
                      <p className="text-gray-400 text-sm font-medium line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        {project.descripcion}
                      </p>
                    </div>
                  </Link>
                  
                  <div className="flex items-center justify-between px-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 italic">
                      {project.categoria?.nombre || "Software Architecture"}
                    </span>
                    <Link to={`/proyectos/${project._id}`} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-primary-400 hover:text-black transition-all group/btn border border-white/5">
                      <ExternalLink className="w-5 h-5" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {(!data?.projects || data?.projects.length === 0) && !isFetching && (
          <div className="text-center py-32 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
            <h3 className="text-4xl font-black italic text-gray-700 uppercase tracking-tighter mb-4">No se detectaron coincidencias</h3>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Prueba con otros términos de ingeniería</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
