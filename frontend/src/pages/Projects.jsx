import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetProjectsQuery, useGetCategoriesQuery } from '../services/projectsApi';
import { motion } from 'framer-motion';
import { Search, Loader2, Sparkles } from 'lucide-react';
import ProjectCard from '../components/projects/ProjectCard';

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

  const projects = data?.proyectos || [];
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
      {/* Background Glows Premium */}
      <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-primary-900/10 blur-[150px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-secondary-900/10 blur-[150px] rounded-full" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div className="max-w-5xl mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="w-12 h-[1px] bg-primary-500" />
              <span className="text-primary-400 font-black uppercase tracking-[0.4em] text-[10px]">
                Portfolio de Ingeniería Digital
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.95] md:leading-[0.85] mb-12">
              SOLUCIONES <br className="hidden md:block" />
              PENSADAS PARA <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400 inline-block pb-4">
                CRECER
              </span>
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
              <p className="text-gray-500 text-lg md:text-2xl font-medium leading-tight max-w-xl italic uppercase font-bold">
                Creamos plataformas digitales enfocadas en rendimiento, automatización y escalabilidad para empresas de cualquier tamaño.
              </p>
              
              <div className="flex flex-wrap gap-4 justify-end">
                <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
                  <div className="text-3xl font-black italic text-primary-400">+15</div>
                  <div className="text-[9px] font-black uppercase text-gray-500 tracking-widest">Proyectos Premium</div>
                </div>
                <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
                  <div className="text-3xl font-black italic text-secondary-400">100%</div>
                  <div className="text-[9px] font-black uppercase text-gray-500 tracking-widest">Satisfacción</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Improved Search & Filter Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-20">
          <div className="lg:col-span-8 flex flex-wrap gap-3">
            <button 
              onClick={() => updateFilter('categoria', '')}
              className={`px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${!categoria ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white hover:bg-white/10'}`}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button 
                key={cat._id}
                onClick={() => updateFilter('categoria', cat._id)}
                className={`px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${categoria === cat._id ? 'bg-primary-500 text-white border-primary-500 shadow-[0_0_20px_rgba(139,92,246,0.3)]' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white hover:bg-white/10'}`}
              >
                {cat.nombre}
              </button>
            ))}
          </div>

          <form onSubmit={handleSearchSubmit} className="lg:col-span-4 relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar tecnología o proyecto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-14 pr-8 focus:outline-none focus:border-white/30 transition-all font-bold placeholder:text-gray-700 text-white text-sm uppercase"
            />
          </form>
        </div>

        {/* Content Grid */}
        {isFetching ? (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Sincronizando Portfolio...</p>
          </div>
        ) : data?.proyectos?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {data.proyectos.map((project, index) => (
              <ProjectCard key={project._id} project={project} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-40 border border-white/5 rounded-[3rem] bg-white/5">
            <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">No se encontraron proyectos en esta categoría.</p>
          </div>
        )}

        {/* Footer CTA */}
        {!isFetching && data?.proyectos?.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-40 text-center border-t border-white/5 pt-20"
          >
            <Sparkles className="w-10 h-10 text-primary-400 mx-auto mb-6" />
            <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-8">
              ¿Listo para tu <br />
              <span className="text-primary-400">Próximo gran Salto?</span>
            </h2>
            <p className="text-gray-500 uppercase font-black tracking-widest text-xs mb-10">
              Transformamos tu visión en una realidad digital de alto impacto
            </p>
            <button className="px-12 py-6 bg-white text-black rounded-full font-black uppercase tracking-widest hover:bg-primary-400 transition-all hover:-translate-y-1">
              Iniciar Consultoría
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Projects;

