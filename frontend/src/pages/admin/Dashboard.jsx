import React from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import { useGetProjectsQuery } from '../../services/projectsApi';
import { useGetAllQuotesQuery } from '../../services/quotesApi';
import { formatCurrency } from '../../utils/formatCurrency';
import { HiOutlineDocumentText, HiOutlineCube, HiOutlineCurrencyDollar, HiOutlineTrendingUp } from 'react-icons/hi';

const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-gray-900/50 backdrop-blur-xl border border-white/5 p-8 rounded-[2rem] flex items-center gap-6 hover:border-white/10 transition-all group cursor-default"
  >
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform ${color}`}>
      <Icon size={30} className="text-white" />
    </div>
    <div>
      <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-4xl font-black text-white italic tracking-tighter">{value}</p>
        <div className="text-emerald-400 flex items-center text-xs font-bold">
          <HiOutlineTrendingUp size={14} className="mr-1" />
          +12%
        </div>
      </div>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { data: projectsData, isFetching: isFetchingProjects } = useGetProjectsQuery({ limit: 1 });
  const { data: quotesData, isFetching: isFetchingQuotes } = useGetAllQuotesQuery({ page: 1, limit: 10 });

  const activeProjects = projectsData?.total || 0;
  const totalQuotes = quotesData?.total || 0;
  
  const acceptedQuotesCount = quotesData?.quotes?.filter(q => q.estado === 'aceptado').length || 0;

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <header className="mb-14">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-6xl font-black text-white italic tracking-tighter uppercase mb-2">
              Resumen <span className="text-primary-400">Ejecutivo</span>
            </h1>
            <p className="text-lg text-gray-500 font-medium tracking-wide">
              Bienvenido a la central de control de <span className="text-white">Ausauth Agency</span>.
            </p>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <StatCard 
            icon={HiOutlineCube} 
            label="Proyectos Activos" 
            value={isFetchingProjects ? '...' : activeProjects} 
            color="bg-gradient-to-br from-blue-600 to-indigo-700" 
            delay={0.1}
          />
          <StatCard 
            icon={HiOutlineDocumentText} 
            label="Presupuestos" 
            value={isFetchingQuotes ? '...' : totalQuotes} 
            color="bg-gradient-to-br from-purple-600 to-fuchsia-700" 
            delay={0.2}
          />
          <StatCard 
            icon={HiOutlineCurrencyDollar} 
            label="En ejecución" 
            value={acceptedQuotesCount} 
            color="bg-gradient-to-br from-emerald-600 to-teal-700" 
            delay={0.3}
          />
        </div>

        {/* Visual Activity Mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-gray-900/50 backdrop-blur-xl border border-white/5 rounded-[3rem] overflow-hidden"
          >
            <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Actividad Reciente</h2>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Últimos movimientos del sistema</p>
              </div>
              <button className="text-sm font-black text-primary-400 uppercase tracking-widest hover:underline">Ver reporte completo</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-gray-500 uppercase text-[10px] tracking-[0.2em] border-b border-white/5">
                    <th className="px-10 py-5 font-black">Proyecto/Ref</th>
                    <th className="px-10 py-5 font-black">Cliente</th>
                    <th className="px-10 py-5 font-black">Estado</th>
                    <th className="px-10 py-5 font-black">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {(quotesData?.quotes || []).slice(0, 5).map((quote, idx) => (
                    <tr key={quote._id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-10 py-5">
                        <span className="font-mono text-primary-400 font-black tracking-tighter">{quote.numero}</span>
                      </td>
                      <td className="px-10 py-5">
                        <div className="flex flex-col">
                          <span className="text-white font-bold">{quote.cliente?.nombre || quote.client?.nombre}</span>
                          <span className="text-gray-500 text-[10px] uppercase font-black tracking-tighter">{quote.cliente?.email || quote.client?.email}</span>
                        </div>
                      </td>
                      <td className="px-10 py-5">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border ${
                          quote.estado === 'aceptado' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          quote.estado === 'rechazado' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                          'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}>
                          {quote.estado}
                        </span>
                      </td>
                      <td className="px-10 py-5 text-gray-500 font-bold tabular-nums">
                        {new Date(quote.createdAt).toLocaleDateString('es-AR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Quick Tasks / Health */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-primary-400/5 border border-primary-400/10 rounded-[3rem] p-10 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none mb-6">Estado del <br/><span className="text-primary-400">Servidor</span></h3>
              <div className="space-y-6">
                <HealthBar label="Database Latency" value="12ms" percentage={85} color="bg-primary-400" />
                <HealthBar label="Cloudinary Storage" value="45%" percentage={45} color="bg-blue-400" />
                <HealthBar label="Email Service" value="Online" percentage={100} color="bg-emerald-400" />
              </div>
            </div>
            
            <div className="mt-10 p-6 bg-white rounded-3xl">
              <p className="text-black font-black text-xs uppercase tracking-widest mb-1">Tip de Agencia</p>
              <p className="text-gray-600 text-xs font-medium leading-relaxed">Revisa los presupuestos pendientes de envío para optimizar la tasa de conversión esta semana.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
};

const HealthBar = ({ label, value, percentage, color }) => (
  <div>
    <div className="flex justify-between items-baseline mb-2">
      <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{label}</span>
      <span className="text-xs text-white font-black">{value}</span>
    </div>
    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        className={`h-full ${color}`}
      ></motion.div>
    </div>
  </div>
);

export default Dashboard;
