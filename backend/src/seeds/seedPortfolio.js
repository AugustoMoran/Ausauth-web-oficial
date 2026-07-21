const mongoose = require('mongoose');
const Project = require('../models/Project');
const Service = require('../models/Service');
const FAQ = require('../models/FAQ');
require('dotenv').config();

const projects = [
  {
    nombre: "AusAuth Blog",
    subtitulo: "Blog Engine con Seguridad Avanzada",
    categoria_nombre: "Plataforma Web",
    descripcion: "Sistema de blogs con autenticación JWT, roles y gestión de contenido de alto rendimiento. Optimizado para SEO y velocidad de carga extrema.",
    tecnologias: ["React", "Node.js", "Express", "MongoDB", "JWT"],
    caracteristicas: [
      "Registro e inicio de sesión seguro",
      "Roles y permisos administrativos",
      "Publicación de artículos con editor Rich Text",
      "Gestión de comentarios en tiempo real",
      "Seguridad mediante JWT y Refresh Tokens"
    ],
    enlace: "https://ausauth.com/blog",
    github: "https://github.com/ausauth/blog",
    extra_premium: true
  },
  {
    nombre: "E-commerce Pro",
    subtitulo: "Tienda Online de Próxima Generación",
    categoria_nombre: "Tienda Online",
    descripcion: "Plataforma completa de ventas con arquitectura de microservicios, carrito persistente, pasarela de pagos y panel administrativo integral.",
    tecnologias: ["React", "Redux", "Node.js", "MongoDB", "Mercado Pago"],
    caracteristicas: [
      "Catálogo dinámico con filtros avanzados",
      "Integración de pagos con Mercado Pago/Stripe",
      "Panel de administración de stock y ventas",
      "Checkout optimizado en un solo paso",
      "Notificaciones automáticas por email"
    ],
    enlace: "https://ecommerce.ausauth.com",
    github: "https://github.com/ausauth/ecommerce-pro",
    extra_premium: true
  },
  {
    nombre: "Sistema de Gestión Comercial",
    subtitulo: "Control Total de tu Negocio",
    categoria_nombre: "ERP",
    descripcion: "Software de gestión empresarial (ERP) para control de stock, ventas, clientes y facturación electrónica automatizada.",
    tecnologias: ["React", "Node.js", "MongoDB", "Tailwind CSS"],
    caracteristicas: [
      "Control de inventario en tiempo real",
      "Facturación electrónica integrada (ARCA)",
      "Reportes de ventas y rentabilidad",
      "Gestión de múltiples sucursales",
      "Seguimiento de cuenta corriente de clientes"
    ],
    enlace: "https://erp.ausauth.com",
    github: "https://github.com/ausauth/erp-system",
    extra_premium: true
  },
  {
    nombre: "Dashboard Analytics",
    subtitulo: "Inteligencia de Datos en Tiempo Real",
    categoria_nombre: "Business Intelligence",
    descripcion: "Plataforma de visualización de métricas críticas, con gráficos interactivos holográficos y reportes avanzados de performance.",
    tecnologias: ["React", "Recharts", "Express", "D3.js"],
    caracteristicas: [
      "Métricas y KPIs en tiempo real",
      "Gráficos interactivos de alto rendimiento",
      "Exportación de reportes en PDF y Excel",
      "Alertas inteligentes basadas en datos",
      "Panel personalizable por usuario"
    ],
    enlace: "https://analytics.ausauth.com",
    extra_premium: true
  },
  {
    nombre: "Sistema de Turnos",
    subtitulo: "Automatización de Reservas",
    categoria_nombre: "Automatización",
    descripcion: "Plataforma de reservas online para profesionales y empresas que buscan optimizar su agenda y atención al cliente.",
    tecnologias: ["React", "Node.js", "PostgreSQL", "FullCalendar"],
    caracteristicas: [
      "Calendario interactivo para reservas",
      "Recordatorios automáticos vía WhatsApp/Email",
      "Gestión de perfiles de profesionales",
      "Pago de seña para confirmar sesiones",
      "Historial de turnos y feedback de clientes"
    ],
    enlace: "https://turnos.ausauth.com",
    extra_premium: true
  },
  {
    nombre: "Landing Page Premium",
    subtitulo: "Conversión de Alta Calidad",
    categoria_nombre: "Marketing",
    descripcion: "Páginas de aterrizaje diseñadas con precisión para maximizar la conversión de clientes y fortalecer la identidad de marca.",
    tecnologias: ["React", "Tailwind CSS", "Framer Motion"],
    caracteristicas: [
      "Diseño ultra moderno y responsive",
      "Animaciones de alto impacto visual",
      "Optimización de velocidad (Score 100 en PageSpeed)",
      "Formularios de contacto inteligentes",
      "SEO técnico de alto nivel"
    ],
    enlace: "https://landing.ausauth.com",
    extra_premium: true
  },
  {
    nombre: "Plataforma Educativa",
    subtitulo: "LMS de Alto Rendimiento",
    categoria_nombre: "Educación",
    descripcion: "Sistema de gestión de aprendizaje (LMS) para cursos online, con exámenes, entrega de certificados y progreso de alumnos.",
    tecnologias: ["React", "Node.js", "MongoDB", "Cloudinary"],
    caracteristicas: [
      "Streaming de video optimizado",
      "Sistema de evaluación y tests automáticos",
      "Generación de certificados digitales PDF",
      "Foros de discusión por cada módulo",
      "Pasarela de pago para cursos"
    ],
    enlace: "https://educativa.ausauth.com",
    extra_premium: true
  },
  {
    nombre: "Chat en Tiempo Real",
    subtitulo: "Comunicación Instantánea",
    categoria_nombre: "Comunicación",
    descripcion: "Aplicación de mensajería escalable con WebSockets, notificaciones push y encriptación de extremo a extremo.",
    tecnologias: ["React", "Socket.IO", "Node.js", "Redis"],
    caracteristicas: [
      "Mensajería instantánea uno a uno",
      "Canales grupales públicos y privados",
      "Estado de conexión en línea/offline",
      "Notificaciones en tiempo real",
      "Burbujas de mensaje con diseño 3D"
    ],
    enlace: "https://chat.ausauth.com",
    extra_premium: true
  },
  {
    nombre: "Inmobiliaria Digital",
    subtitulo: "Real Estate Tech",
    categoria_nombre: "Bienes Raíces",
    descripcion: "Portal de gestión y publicación de propiedades con filtros de búsqueda avanzados e integración de mapas dinámicos.",
    tecnologias: ["React", "Node.js", "MongoDB", "Leaflet"],
    caracteristicas: [
      "Catálogo de propiedades con filtros inteligentes",
      "Mapas interactivos con geolocalización",
      "Formulario de consulta directa por propiedad",
      "Publicación automática desde panel admin",
      "Vista 360 y galerías premium"
    ],
    enlace: "https://propiedades.ausauth.com",
    extra_premium: true
  },
  {
    nombre: "SaaS Empresarial",
    subtitulo: "Solución Escalable Multi-Tenant",
    categoria_nombre: "Software como Servicio",
    descripcion: "Plataforma multiusuario para empresas, con suscripciones recurrentes, roles jerárquicos y panel administrativo centralizado.",
    tecnologias: ["React", "Express", "MongoDB", "Stripe"],
    caracteristicas: [
      "Modelo de suscripciones con Stripe",
      "Gestión de membresías y pagos recurrentes",
      "Dashboard de administración para empresas",
      "Arquitectura escalable en la nube",
      "Reportes consolidados por organización"
    ],
    enlace: "https://saas.ausauth.com",
    extra_premium: true
  }
];

const seedDB = async () => {
  try {
    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ausauth";
    await mongoose.connect(uri);
    console.log("Conectado a MongoDB para sembrar Portfolio...");

    // Limpiar proyectos existentes
    await Project.deleteMany({});
    
    // Crear categorías
    const categoriesMap = {};
    const categoriesNames = [...new Set(projects.map(p => p.categoria_nombre))];
    
    const Category = require('../models/Category');
    await Category.deleteMany({ nombre: { $in: categoriesNames } });
    
    for (const catName of categoriesNames) {
      const category = new Category({ nombre: catName, slug: catName.toLowerCase().replace(/ /g, '-') });
      await category.save();
      categoriesMap[catName] = category._id;
    }
    
    for (const [index, p] of projects.entries()) {
      // Intentamos asignar una imagen placeholder premium según el nombre si no tiene
      p.imagenes = [{
        url: `https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop`,
        publicId: `placeholder_${Date.now()}`
      }];
      
      // Asignar ID de categoría
      p.categoria = categoriesMap[p.categoria_nombre];
      
      // Marcar los primeros 4 como destacados
      if (index < 4) {
        p.isFeatured = true;
      }
      
      const newProject = new Project(p);
      await newProject.save();
      console.log(`Proyecto guardado: ${p.nombre}`);
    }

    console.log("Seed finalizado con éxito.");
    process.exit(0);
  } catch (err) {
    console.error("Error al sembrar la base de datos:", err);
    process.exit(1);
  }
};

seedDB();
