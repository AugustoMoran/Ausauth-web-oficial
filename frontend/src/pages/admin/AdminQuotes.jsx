import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import { useGetAllQuotesQuery } from '../../services/quotesApi';
import QuoteForm from '../../components/quotes/QuoteForm';
import QuoteCard from '../../components/quotes/QuoteCard';
import { formatQuoteMoney } from '../../utils/quoteCurrencyFormat';
import { HiOutlineDocumentAdd, HiOutlineFilter, HiOutlineExternalLink } from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa';

const SkeletonRow = () => (
  <tr className="border-b border-white/5 animate-pulse">
    <td className="px-6 py-4"><div className="h-4 w-16 bg-white/10 rounded"></div></td>
    <td className="px-6 py-4">
      <div className="h-4 w-32 bg-white/10 rounded mb-2"></div>
      <div className="h-3 w-24 bg-white/10 rounded"></div>
    </td>
    <td className="px-6 py-4"><div className="h-4 w-20 bg-white/10 rounded"></div></td>
    <td className="px-6 py-4"><div className="h-6 w-20 bg-white/10 rounded-full"></div></td>
    <td className="px-6 py-4"><div className="h-4 w-24 bg-white/10 rounded"></div></td>
    <td className="px-6 py-4"><div className="h-8 w-16 bg-white/10 rounded"></div></td>
  </tr>
);

const AdminQuotes = () => {
  const { data: quotesData, isLoading } = useGetAllQuotesQuery();
  const quotes = Array.isArray(quotesData?.quotes) ? quotesData.quotes : (Array.isArray(quotesData) ? quotesData : []);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('todos');

  const filteredQuotes = quotes.filter((quote) => {
    if (filter === 'todos') return true;
    return quote.estado === filter;
  });

  const getStatusStyle = (estado) => {
    switch (estado) {
      case 'borrador': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'enviado': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'aceptado': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]';
      case 'rechazado': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const handleWhatsAppShare = (quote) => {
    const text = `Hola ${quote.client.nombre}, te envío el presupuesto ${quote.numero} de Ausauth. Puedes revisarlo aquí y avisarme cualquier duda. ¡Saludos!`;
    const phone = quote.client.telefono?.replace(/\D/g, '') || '';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase mb-2">
              Gestión de <span className="text-primary-400">Presupuestos</span>
            </h1>
            <p className="text-gray-400 font-medium">Control total de ventas y cotizaciones Ausauth Dev.</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="bg-primary-400 text-black px-8 py-4 rounded-2xl flex items-center gap-3 transition-all font-black uppercase text-sm shadow-xl shadow-primary-400/10"
          >
            <HiOutlineDocumentAdd size={20} />
            Nuevo Presupuesto
          </motion.button>
        </header>

        {showForm && (
          <QuoteForm onClose={() => setShowForm(false)} />
        )}

        {/* Filtros Premium */}
        <div className="flex flex-wrap items-center gap-3 mb-8 bg-gray-900/50 p-2 rounded-3xl border border-white/5 backdrop-blur-xl w-fit">
          <div className="flex items-center gap-2 px-4 text-gray-500">
            <HiOutlineFilter size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Filtrar</span>
          </div>
          {['todos', 'borrador', 'enviado', 'aceptado', 'rechazado'].map((estado) => (
            <button
              key={estado}
              onClick={() => setFilter(estado)}
              className={`px-6 py-2.5 rounded-2xl capitalize transition-all text-xs font-black tracking-widest ${
                filter === estado
                  ? 'bg-white text-black shadow-lg scale-105'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {estado}
            </button>
          ))}
        </div>

        {/* Tabla Minimalista */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 uppercase text-[10px] tracking-[0.2em] border-b border-white/5">
                  <th className="px-8 py-6 font-black">Referencia</th>
                  <th className="px-8 py-6 font-black">Cliente</th>
                  <th className="px-8 py-6 font-black">Total</th>
                  <th className="px-8 py-6 font-black">Estado</th>
                  <th className="px-8 py-6 font-black">Fecha</th>
                  <th className="px-8 py-6 font-black text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  <>
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                  </>
                ) : filteredQuotes.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-8 py-20 text-center">
                      <p className="text-gray-500 font-bold italic">No se encontraron presupuestos en esta categoría.</p>
                    </td>
                  </tr>
                ) : (
                  <AnimatePresence mode='popLayout'>
                    {filteredQuotes.map((quote) => (
                      <motion.tr
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={quote._id}
                        className="group hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-8 py-6">
                          <span className="font-mono text-primary-400 font-black tracking-tighter text-lg">{quote.numero}</span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="text-white font-black text-base">{quote.client.nombre}</span>
                            <span className="text-gray-500 text-xs font-medium">{quote.client.email}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 font-black">
                          <div className="flex flex-col gap-0.5">
                            {quote.totales?.USD?.total > 0 && (
                              <span className="text-emerald-400 text-lg">
                                {formatQuoteMoney(quote.totales.USD.total, 'USD')}
                              </span>
                            )}
                            {quote.totales?.ARS?.total > 0 && (
                              <span className="text-gray-300 text-xs">
                                {formatQuoteMoney(quote.totales.ARS.total, 'ARS')}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(quote.estado)}`}>
                            {quote.estado}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-gray-400 font-bold tabular-nums">
                          {new Date(quote.createdAt).toLocaleDateString('es-AR')}
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center justify-center gap-3">
                            <QuoteCard quote={quote} isAdmin={true} />
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleWhatsAppShare(quote)}
                              className="w-10 h-10 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center hover:bg-green-500 hover:text-white transition-all shadow-lg shadow-green-500/5"
                              title="Compartir por WhatsApp"
                            >
                              <FaWhatsapp size={18} />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminQuotes;
