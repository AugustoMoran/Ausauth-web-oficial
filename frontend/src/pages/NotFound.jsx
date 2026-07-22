import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 text-center text-white">
    <h1 className="text-[10rem] md:text-[15rem] font-black italic tracking-tighter leading-none text-white/5 absolute select-none">404</h1>
    <div className="relative z-10">
      <h2 className="text-6xl md:text-8xl font-black mb-4 italic uppercase tracking-tighter leading-none">PÁGINA <span className="text-primary-400">INEXISTENTE</span></h2>
      <p className="text-gray-500 mb-12 font-bold uppercase tracking-widest text-xs italic">El recurso solicitado fue reubicado o no se encuentra disponible.</p>
      <Link to="/" className="inline-block bg-primary-400 text-black px-12 py-5 rounded-2xl font-black uppercase tracking-widest italic shadow-[0_0_50px_rgba(139,92,246,0.2)] hover:scale-105 transition-transform">Volver a la Terminal</Link>
    </div>
  </div>
);

export default NotFound;
