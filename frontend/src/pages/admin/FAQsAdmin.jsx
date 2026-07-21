import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  useGetFAQsQuery,
  useCreateFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,
} from '../../services/faqApi';
import toast from 'react-hot-toast';
import { 
  HiOutlinePlus, 
  HiOutlineTrash, 
  HiOutlinePencil, 
  HiX,
  HiOutlineQuestionMarkCircle
} from 'react-icons/hi';

const EMPTY = { 
  pregunta: '', 
  respuesta: '', 
  categoria: 'General',
  orden: 0
};

const FAQsAdmin = () => {
  const { data: faqs = [], isLoading, refetch } = useGetFAQsQuery();
  const [createFAQ] = useCreateFAQMutation();
  const [updateFAQ] = useUpdateFAQMutation();
  const [deleteFAQ] = useDeleteFAQMutation();

  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editing) {
        await updateFAQ({ id: editing, ...form }).unwrap();
        toast.success('Pregunta actualizada');
      } else {
        await createFAQ(form).unwrap();
        toast.success('Pregunta creada');
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

  const handleEdit = (f) => {
    setEditing(f._id);
    setForm({
      pregunta: f.pregunta,
      respuesta: f.respuesta,
      categoria: f.categoria || 'General',
      orden: f.orden || 0
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta FAQ?')) return;
    try {
      await deleteFAQ(id).unwrap();
      toast.success('Eliminada');
    } catch {
      toast.error('Error al eliminar');
    }
  };

  return (
    <AdminLayout title="Gestión de FAQs">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold text-white">Preguntas Frecuentes</h2>
        <button
          onClick={() => {
            setEditing(null);
            setForm(EMPTY);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-bold transition-all"
        >
          <HiOutlinePlus size={20} /> Nueva Pregunta
        </button>
      </div>

      <div className="space-y-4">
        {faqs.map((f) => (
          <div key={f._id} className="bg-zinc-900 border border-white/5 p-6 rounded-2xl flex items-start gap-6 group">
            <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center flex-shrink-0 text-gray-500">
               <HiOutlineQuestionMarkCircle size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-md">
                  {f.categoria}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                  Orden: {f.orden}
                </span>
              </div>
              <h3 className="font-bold text-lg text-white mb-2">{f.pregunta}</h3>
              <p className="text-gray-400 text-sm">{f.respuesta}</p>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleEdit(f)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400">
                <HiOutlinePencil />
              </button>
              <button onClick={() => handleDelete(f._id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400">
                <HiOutlineTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-zinc-900 border border-white/10 w-full max-w-lg rounded-3xl p-8 relative my-auto">
            <h2 className="text-2xl font-bold mb-6">{editing ? 'Editar FAQ' : 'Nueva FAQ'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Pregunta</label>
                <input type="text" required value={form.pregunta} onChange={(e) => setForm({...form, pregunta: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Respuesta</label>
                <textarea rows="4" required value={form.respuesta} onChange={(e) => setForm({...form, respuesta: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Categoría</label>
                  <input type="text" value={form.categoria} onChange={(e) => setForm({...form, categoria: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Orden</label>
                  <input type="number" value={form.orden} onChange={(e) => setForm({...form, orden: Number(e.target.value)})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 text-gray-400 font-bold">Cancelar</button>
                <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-2 rounded-xl font-bold disabled:opacity-50">
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default FAQsAdmin;
