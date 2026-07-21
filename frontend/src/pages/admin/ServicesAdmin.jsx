import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  useGetServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} from '../../services/servicesApi';
import toast from 'react-hot-toast';
import { 
  HiOutlinePlus, 
  HiOutlineTrash, 
  HiOutlinePencil, 
  HiX,
  HiOutlineLightningBolt,
  HiOutlineCheck
} from 'react-icons/hi';

const EMPTY = { 
  titulo: '', 
  descripcion: '', 
  icono: '',
  orden: 0,
  beneficios: ''
};

const ServicesAdmin = () => {
  const { data: services = [], isLoading, refetch } = useGetServicesQuery();
  const [createService] = useCreateServiceMutation();
  const [updateService] = useUpdateServiceMutation();
  const [deleteService] = useDeleteServiceMutation();

  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        beneficios: form.beneficios.split('\n').filter(Boolean)
      };

      if (editing) {
        await updateService({ id: editing, ...payload }).unwrap();
        toast.success('Servicio actualizado');
      } else {
        await createService(payload).unwrap();
        toast.success('Servicio creado');
      }
      
      setForm(EMPTY);
      setEditing(null);
      setShowForm(false);
      refetch();
    } catch (err) {
      toast.error('Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (s) => {
    setEditing(s._id);
    setForm({
      titulo: s.titulo,
      descripcion: s.descripcion,
      icono: s.icono || '',
      orden: s.orden || 0,
      beneficios: s.beneficios?.join('\n') || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este servicio?')) return;
    try {
      await deleteService(id).unwrap();
      toast.success('Servicio eliminado');
    } catch {
      toast.error('Error al eliminar');
    }
  };

  return (
    <AdminLayout title="Catálogo de Soluciones">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-6xl font-black text-white italic tracking-tighter uppercase mb-2">
              Engineering <span className="text-primary-400">Services</span>
            </h1>
            <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-xs">Propuesta de Valor de Ausauth Dev Agency</p>
          </motion.div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setEditing(null);
              setForm(EMPTY);
              setShowForm(true);
            }}
            className="flex items-center gap-3 bg-white text-black px-10 py-4 rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-2xl hover:bg-primary-400 transition-all italic"
          >
            <HiOutlinePlus size={20} /> Crear Solución
          </motion.button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {services.map((s, idx) => (
              <motion.div 
                key={s._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gray-900/50 backdrop-blur-xl border border-white/5 p-10 rounded-[3rem] group hover:border-primary-400/30 transition-all flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="w-16 h-16 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center justify-center text-primary-400 group-hover:bg-primary-400 group-hover:text-black transition-all shadow-2xl">
                    <HiOutlineLightningBolt size={32} />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(s)} 
                      className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 transition-colors"
                    >
                      <HiOutlinePencil />
                    </button>
                    <button 
                      onClick={() => handleDelete(s._id)} 
                      className="w-10 h-10 flex items-center justify-center bg-rose-500/10 hover:bg-rose-500/20 rounded-xl text-rose-400 transition-colors"
                    >
                      <HiOutlineTrash />
                    </button>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] font-black text-primary-400 uppercase tracking-[0.3em]">Module {idx + 1}</span>
                    <span className="h-px flex-1 bg-white/5"></span>
                  </div>
                  <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-4">{s.titulo}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed font-medium mb-8 line-clamp-4">{s.descripcion}</p>
                </div>

                <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HiOutlineCheck className="text-emerald-400" />
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{s.beneficios?.length || 0} Features</span>
                  </div>
                  <span className="text-[10px] font-black text-white/20 uppercase">PR_INDEX: 0{s.orden}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-zinc-950 border border-white/10 w-full max-w-xl rounded-[3rem] p-12 shadow-[0_0_100px_rgba(3,252,186,0.1)] relative"
            >
              <button 
                onClick={() => setShowForm(false)}
                className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-2xl transition-all"
              >
                <HiX size={20} className="text-white" />
              </button>
              
              <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-10">
                {editing ? 'Update' : 'Deploy'} <span className="text-primary-400">Solution</span>
              </h2>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label className="block text-xs font-black text-gray-500 mb-3 uppercase tracking-[0.2em] italic">Título del Servicio</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. Fullstack Engineering"
                    value={form.titulo}
                    onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:border-primary-400 outline-none transition-all"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-500 mb-3 uppercase tracking-[0.2em] italic">Prioridad Visual</label>
                    <input
                      type="number"
                      value={form.orden}
                      onChange={(e) => setForm({ ...form, orden: parseInt(e.target.value) })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:border-primary-400 outline-none transition-all"
                    />
                  </div>
                   <div>
                    <label className="block text-xs font-black text-gray-500 mb-3 uppercase tracking-[0.2em] italic">Icon Identif.</label>
                    <input
                      type="text"
                      placeholder="lightning"
                      value={form.icono}
                      onChange={(e) => setForm({ ...form, icono: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:border-primary-400 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 mb-3 uppercase tracking-[0.2em] italic">Cuerpo de la Oferta</label>
                  <textarea
                    rows="3"
                    required
                    placeholder="Describe el valor técnico de esta solución..."
                    value={form.descripcion}
                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-6 py-5 text-white font-medium focus:border-primary-400 outline-none transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 mb-3 uppercase tracking-[0.2em] italic">Value Props (una por línea)</label>
                  <textarea
                    rows="3"
                    required
                    placeholder="E.g. Soporte 24/7\nEscalabilidad Global"
                    value={form.beneficios}
                    onChange={(e) => setForm({ ...form, beneficios: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-6 py-5 text-white font-medium focus:border-primary-400 outline-none transition-all resize-none"
                  />
                </div>

                <div className="pt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                    type="submit"
                    className="w-full bg-primary-400 text-black py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-[0_0_50px_rgba(3,252,186,0.2)] hover:bg-white transition-all italic"
                  >
                    {loading ? 'Sincronizando...' : (editing ? 'Confirmar Cambios' : 'Integrar al Catálogo')}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default ServicesAdmin;
