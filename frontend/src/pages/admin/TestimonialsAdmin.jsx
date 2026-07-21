import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  useGetTestimonialsQuery,
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
  useDeleteTestimonialMutation,
} from '../../services/testimonialsApi';
import { useUploadImageMutation } from '../../services/cartApi';
import toast from 'react-hot-toast';
import { 
  HiOutlinePlus, 
  HiOutlineTrash, 
  HiOutlinePencil, 
  HiX,
  HiOutlineUserCircle,
  HiOutlineStar,
  HiOutlinePhotograph
} from 'react-icons/hi';

const EMPTY = { 
  nombre: '', 
  puesto: '', 
  empresa: '',
  comentario: '',
  estrellas: 5,
  habilitado: true
};

const TestimonialsAdmin = () => {
  const { data: testimonials = [], isLoading, refetch } = useGetTestimonialsQuery();
  const [createTestimonial] = useCreateTestimonialMutation();
  const [updateTestimonial] = useUpdateTestimonialMutation();
  const [deleteTestimonial] = useDeleteTestimonialMutation();
  const [uploadImage] = useUploadImageMutation();

  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageData = editing ? testimonials.find(t => t._id === editing)?.imagen : null;

      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const res = await uploadImage(formData).unwrap();
        imageData = { url: res.image.url, publicId: res.image.public_id };
      }

      const payload = { ...form, imagen: imageData };

      if (editing) {
        await updateTestimonial({ id: editing, ...payload }).unwrap();
        toast.success('Testimonio actualizado');
      } else {
        await createTestimonial(payload).unwrap();
        toast.success('Testimonio creado');
      }
      
      setForm(EMPTY);
      setEditing(null);
      setImageFile(null);
      setImagePreview(null);
      setShowForm(false);
      refetch();
    } catch (err) {
      toast.error('Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (t) => {
    setEditing(t._id);
    setForm({
      nombre: t.nombre,
      puesto: t.puesto || '',
      empresa: t.empresa || '',
      comentario: t.comentario,
      estrellas: t.estrellas || 5,
      habilitado: t.habilitado
    });
    setImagePreview(t.imagen?.url || null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar testimonio?')) return;
    try {
      await deleteTestimonial(id).unwrap();
      toast.success('Eliminado');
    } catch {
      toast.error('Error al eliminar');
    }
  };

  return (
    <AdminLayout title="Gestión de Testimonios">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold text-white">Lo que dicen los clientes</h2>
        <button
          onClick={() => {
            setEditing(null);
            setForm(EMPTY);
            setImagePreview(null);
            setImageFile(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-bold transition-all"
        >
          <HiOutlinePlus size={20} /> Nuevo Testimonio
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div key={t._id} className="bg-zinc-900 border border-white/5 p-6 rounded-2xl relative group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-800 flex-shrink-0">
                {t.imagen?.url ? (
                  <img src={t.imagen.url} className="w-full h-full object-cover" />
                ) : (
                  <HiOutlineUserCircle className="w-full h-full text-gray-700" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white truncate">{t.nombre}</h3>
                <p className="text-xs text-gray-500 truncate">{t.puesto} {t.empresa && `@ ${t.empresa}`}</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm italic mb-4 line-clamp-4">"{t.comentario}"</p>
            <div className="flex items-center justify-between">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <HiOutlineStar key={i} className={i < t.estrellas ? 'text-amber-500' : 'text-zinc-700'} />
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(t)} className="p-2 text-gray-500 hover:text-white transition-colors"><HiOutlinePencil /></button>
                <button onClick={() => handleDelete(t._id)} className="p-2 text-gray-500 hover:text-red-500 transition-colors"><HiOutlineTrash /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-zinc-900 border border-white/10 w-full max-w-lg rounded-3xl p-8 relative my-auto">
            <button onClick={() => setShowForm(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white"><HiX size={24} /></button>
            <h2 className="text-2xl font-bold mb-6">{editing ? 'Editar Testimonio' : 'Nuevo Testimonio'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-center mb-6">
                <label className="relative group cursor-pointer">
                  <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden group-hover:border-blue-500 transition-colors">
                    {imagePreview ? (
                      <img src={imagePreview} className="w-full h-full object-cover" />
                    ) : (
                      <HiOutlinePhotograph size={32} className="text-zinc-700" />
                    )}
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Nombre</label>
                  <input type="text" required value={form.nombre} onChange={(e) => setForm({...form, nombre: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Puesto</label>
                  <input type="text" value={form.puesto} onChange={(e) => setForm({...form, puesto: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Empresa</label>
                <input type="text" value={form.empresa} onChange={(e) => setForm({...form, empresa: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Comentario</label>
                <textarea rows="4" required value={form.comentario} onChange={(e) => setForm({...form, comentario: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Estrellas</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(n => (
                    <button key={n} type="button" onClick={() => setForm({...form, estrellas: n})} className={`p-2 rounded-lg border transition-all ${form.estrellas === n ? 'bg-amber-500 border-amber-500 text-black' : 'bg-black border-white/10 text-gray-500 hover:border-white/30'}`}>
                      {n}
                    </button>
                  ))}
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

export default TestimonialsAdmin;
