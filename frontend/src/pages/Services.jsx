import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineCode, HiOutlineServer, HiOutlineShieldCheck, HiOutlineCube, HiOutlineLightningBolt, HiOutlineGlobeAlt, HiOutlineChartBar, HiOutlineAcademicCap } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import config from '../config/app';

const ServiceCard = ({ icon: Icon, title, description, features, color }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl relative overflow-hidden group"
  >
    <div className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
      <Icon size={32} />
    </div>
    <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-4">{title}</h3>
    <p className="text-gray-400 text-lg mb-8 leading-relaxed font-medium">
      {description}
    </p>
    <ul className="space-y-4">
      {features.map((f, i) => (
        <li key={i} className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-gray-500 italic">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />
          {f}
        </li>
      ))}
    </ul>
    <div className="absolute top-0 right-0 w-32 h-32 opacity-10 bg-gradient-to-br from-white to-transparent blur-3xl -z-10" />
  </motion.div>
);

const Services = () => {
  const serviceList = [
    {
      icon: HiOutlineCode,
      title: "APLICACIONES WEB",
      description: "Desarrollamos plataformas modernas capaces de gestionar operaciones, usuarios y procesos empresariales a gran escala.",
      features: ["React", "Vite", "Redux Toolkit", "Node.js", "Express", "JWT", "PWA", "MongoDB"],
      color: "bg-primary-500/20 text-primary-400"
    },
    {
      icon: HiOutlineServer,
      title: "GESTIÓN DE DATOS",
      description: "Diseñamos estructuras robustas para mantener tu información organizada, segura y disponible cuando la necesites.",
      features: ["MongoDB", "Mongoose", "SQL Server", "MVC", "Clean Architecture"],
      color: "bg-secondary-500/20 text-secondary-400"
    },
    {
      icon: HiOutlineCube,
      title: "CALIDAD Y RENDIMIENTO",
      description: "Aplicamos procesos de validación y despliegue que garantizan estabilidad, seguridad y continuidad operativa.",
      features: ["Vitest", "Playwright", "Docker", "CI/CD", "Vercel", "Fly.io"],
      color: "bg-white/10 text-white"
    },
    {
      icon: HiOutlineShieldCheck,
      title: "AUTOMATIZACIÓN EMPRESARIAL",
      description: "Integramos sistemas externos y procesos críticos para reducir tareas manuales y aumentar la productividad.",
      features: ["AFIP", "ARCA", "WSFE", "Cloudinary", "SDK Integrations", "API Bridges"],
      color: "bg-emerald-500/20 text-emerald-400"
    }
  ];

  return (
    <div className="bg-[#050505] min-h-screen pt-32 pb-24 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header Section */}
        <div className="max-w-3xl mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6"
          >
            <HiOutlineLightningBolt className="text-primary-400" size={12} />
            <span className="text-[10px] font-black text-primary-400 uppercase tracking-[0.3em]">Full Stack Capabilities</span>
          </motion.div>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.95] md:leading-[0.9] mb-8">
            TECNOLOGÍA DETRÁS <br className="hidden md:block" />
            DE CADA <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400 inline-block pb-1">SOLUCIÓN</span>
          </h1>
          <p className="text-gray-400 text-xl font-medium leading-relaxed">
            Utilizamos herramientas modernas y probadas para construir plataformas rápidas, seguras y preparadas para crecer junto a tu negocio.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {serviceList.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>

        {/* Tech Stack Banner */}
        <div className="mt-32 p-12 bg-white/5 border border-white/10 rounded-[3rem] relative overflow-hidden backdrop-blur-md">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
            {/* These would be tech icons in a real app, using text for now to maintain style */}
            <span className="font-black italic tracking-tighter text-2xl uppercase">REACT</span>
            <span className="font-black italic tracking-tighter text-2xl uppercase">TYPESCRIPT</span>
            <span className="font-black italic tracking-tighter text-2xl uppercase">NODE.JS</span>
            <span className="font-black italic tracking-tighter text-2xl uppercase">MONGODB</span>
            <span className="font-black italic tracking-tighter text-2xl uppercase">DOCKER</span>
            <span className="font-black italic tracking-tighter text-2xl uppercase">AFIP SDK</span>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-32 flex flex-col items-center text-center">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-8 max-w-lg">
                ¿TIENES UN DESAFÍO QUE REQUIERA <span className="text-primary-400">MÁXIMA PRECISIÓN?</span>
            </h2>
            <a 
                href={`https://wa.me/${config.whatsappNumber}?text=Hola%20Ausauth!%20Me%20gustaría%20consultar%20por%20un%20servicio%20especializado.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-12 py-5 bg-white text-black font-black uppercase italic tracking-tighter rounded-2xl hover:bg-primary-400 transition-all scale-100 hover:scale-105"
            >
                Iniciar Consultoría
            </a>
        </div>
      </div>
    </div>
  );
};

export default Services;

// import { Link } from 'react-router-dom';