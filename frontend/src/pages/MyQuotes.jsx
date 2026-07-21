import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetMyQuotesQuery } from '../services/quotesApi';
import QuoteCard from '../components/quotes/QuoteCard';
import { formatQuoteMoney } from '../utils/quoteCurrencyFormat';
import { HiOutlineDocumentText, HiOutlineClock, HiOutlineCheckCircle, HiOutlineExclamationCircle } from 'react-icons/hi';

const SkeletonCard = () => (
  <div className="bg-gray-900/50 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 animate-pulse">
    <div className="flex justify-between mb-6">
      <div className="space-y-2">
        <div className="h-6 w-48 bg-white/10 rounded-lg"></div>
        <div className="h-4 w-32 bg-white/10 rounded-lg"></div>
      </div>
      <div className="h-8 w-24 bg-white/10 rounded-full"></div>
    </div>
    <div className="h-32 bg-white/5 rounded-2xl mb-6"></div>
    <div className="h-10 w-full bg-white/10 rounded-xl"></div>
  </div>
);

const MyQuotes = () => {
  const { data: quotesData, isLoading } = useGetMyQuotesQuery();
  const quotes = Array.isArray(quotesData?.quotes) ? quotesData.quotes : (Array.isArray(quotesData) ? quotesData : []);

  const getStatusIcon = (estado) => {
    switch (estado) {
      case 'borrador': return <HiOutlineClock className="text-amber-400" />;
      case 'enviado': return <HiOutlineDocumentText className="text-blue-400" />;
      case 'aceptado': return <HiOutlineCheckCircle className="text-emerald-400" />;
      case 'rechazado': return <HiOutlineExclamationCircle className="text-rose-400" />;
      default: return null;
    }
  };

  const getStatusLabel = (estado) => {
    switch (estado) {
      case 'borrador': return 'En Revisión';
      case 'enviado': return 'Recibido';
      case 'aceptado': return 'Confirmado';
      case 'rechazado': return 'Cancelado';
      default: return estado;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] py-20">
      <div className="max-w-4xl mx-auto px-4">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <h1 className="text-6xl font-black text-white italic tracking-tighter uppercase mb-2">
            Mis <span className="text-primary-400">Presupuestos</span>
          </h1>
          <p className="text-gray-500 font-medium max-w-lg mx-auto leading-relaxed">
            Aquí puedes gestionar y aprobar todas tus cotizaciones activas de <span className="text-white">Ausauth Agency</span>.
          </p>
        </motion.header>

        {isLoading ? (
          <div className="grid gap-8">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : quotes.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 bg-gray-900/30 backdrop-blur-xl border border-white/5 rounded-[3rem]"
          >
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-600">
              <HiOutlineDocumentText size={40} />
            </div>
            <p className="text-white text-xl font-black uppercase italic tracking-tighter">No hay cotizaciones activas</p>
            <p className="text-gray-500 mt-2 font-medium">Los presupuestos que nos solicites aparecerán aquí.</p>
          </motion.div>
        ) : (
          <div className="grid gap-10">
            <AnimatePresence>
              {quotes.map((quote, idx) => (
                <motion.div
                  key={quote._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-gray-900/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-white/10 transition-all group"
                >
                  <div className="p-8 md:p-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono text-xl font-black text-primary-400 tracking-tighter">
                            {quote.numero}
                          </span>
                          <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                          <span className="text-gray-500 text-xs font-black uppercase tracking-[0.2em]">
                            {new Date(quote.createdAt).toLocaleDateString('es-AR')}
                          </span>
                        </div>
                        <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                          Proyecto Adquirido
                        </h2>
                      </div>

                      <div className={`flex items-center gap-2 px-6 py-2.5 rounded-full border text-[10px] font-black uppercase tracking-[0.2em] ${
                        quote.estado === 'borrador' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        quote.estado === 'enviado' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        quote.estado === 'aceptado' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]' :
                        'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {getStatusIcon(quote.estado)}
                        {getStatusLabel(quote.estado)}
                      </div>
                    </div>

                    {/* Stepper Visual */}
                    <div className="flex items-center gap-2 mb-10 overflow-hidden">
                      {[
                        { id: 'borrador', label: 'Estimación' },
                        { id: 'enviado', label: 'Cotización' },
                        { id: 'aceptado', label: 'Aprobación' },
                        { id: 'pago', label: 'Ejecución' }
                      ].map((step, sIdx, arr) => {
                        const isCompleted = quotes.indexOf(step.id) <= quotes.indexOf(quote.estado) || (quote.estado === 'aceptado' && sIdx <= 2) || (quote.estado === 'enviado' && sIdx <= 1);
                        const isActive = step.id === quote.estado;
                        return (
                          <React.Fragment key={step.id}>
                            <div className="flex flex-col items-center flex-1">
                              <div className={`h-1 w-full rounded-full mb-3 ${isCompleted ? 'bg-primary-400' : 'bg-white/5'}`}></div>
                              <span className={`text-[8px] font-black uppercase tracking-widest ${isCompleted ? 'text-white' : 'text-gray-600'}`}>
                                {step.label}
                              </span>
                            </div>
                          </React.Fragment>
                        );
                      })}
                    </div>

                    {/* Detalle Proyectos */}
                    <div className="mb-10 bg-white shadow-2xl rounded-[2rem] p-8">
                       <h3 className="text-black font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                         <div className="w-1.5 h-1.5 bg-primary-400 rounded-full"></div>
                         Resumen de Servicios
                       </h3>
                       <div className="space-y-4">
                        {quote.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm">
                            <span className="text-gray-500 font-bold">{item.nombre} <span className="text-gray-300">x{item.cantidad}</span></span>
                            <span className="text-black font-black font-mono">
                              {formatQuoteMoney((item.cantidad * item.precioUnitario), item.currency || 'USD')}
                            </span>
                          </div>
                        ))}
                        {quote.instalacion.incluye && (
                          <div className="flex justify-between items-center text-sm border-t border-gray-100 pt-4">
                            <span className="text-gray-500 font-bold">Implementación & Setup</span>
                            <span className="text-black font-black font-mono">
                              {formatQuoteMoney(quote.instalacion.monto, quote.instalacion.currency || 'USD')}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="mt-8 pt-8 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-black font-black uppercase text-sm tracking-tighter italic">Inversión Final</span>
                        <div className="text-primary-600 font-black text-3xl flex flex-col items-end tracking-tighter">
                          {quote.totales?.USD?.total > 0 && (
                            <div>{formatQuoteMoney(quote.totales.USD.total, 'USD')}</div>
                          )}
                          {quote.totales?.ARS?.total > 0 && (
                            <div className="text-xs text-gray-400 font-medium">~ {formatQuoteMoney(quote.totales.ARS.total, 'ARS')}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <QuoteCard quote={quote} isAdmin={false} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyQuotes;

export default MyQuotes;
