import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  useGetProjectsQuery,
  useDeleteProjectMutation,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useGetCategoriesQuery,
  useAddProjectImageMutation,
  useRemoveProjectImageMutation,
} from '../../services/projectsApi';
import { useUploadImageMutation } from '../../services/cartApi';
import toast from 'react-hot-toast';
import { 
  HiOutlinePlus, 
  HiOutlineTrash, 
  HiOutlinePencil, 
  HiX, 
  HiOutlinePhotograph, 
  HiOutlineSearch, 
  HiOutlineCollection,
  HiOutlineBadgeCheck,
  HiOutlineExternalLink,
  HiOutlineCode
} from 'react-icons/hi';

const EMPTY = { 
  nombre: '', 
  descripcion: '', 
  problema: '',
  solucion: '',
  resultado: '',
  tecnologias: '',
  categoria: '', 
  isFeatured: false,
  urlProyecto: '',
  urlGithub: ''
};

const ProjectsAdmin = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  
  const { data, isLoading, refetch } = useGetProjectsQuery({ 
    page, 
    limit: 50, 
    search: search || undefined, 
    categoria: filterCat || undefined 
  });
  
  const { data: categories = [] } = useGetCategoriesQuery();
  
  const [deleteProject] = useDeleteProjectMutation();
  const [createProject] = useCreateProjectMutation();
  const [updateProject] = useUpdateProjectMutation();
  const [addImage] = useAddProjectImageMutation();
  const [removeImage] = useRemoveProjectImageMutation();
  const [uploadImage] = useUploadImageMutation();

  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  const handleAddImages = (e) => {
    const files = Array.from(e.target.files || []);
    setNewImageFiles((prev) => [...prev, ...files]);
    setNewImagePreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
    e.target.value = '';
  };

  const removeNewImage = (index) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = async (publicId) => {
    if (!editingProject) return;
    try {
      await removeImage({ id: editingProject._id, publicId }).unwrap();
      setEditingProject((prev) => ({ 
        ...prev, 
        imagenes: prev.imagenes.filter((img) => img.publicId !== publicId) 
      }));
      toast.success('Imagen eliminada');
    } catch {
      toast.error('Error al eliminar imagen');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const payload = {
        ...form,
        tecnologias: form.tecnologias ? form.tecnologias.split(',').map(t => t.trim()).filter(Boolean) : []
      };

      let projectId = editing;
      if (editing) {
        await updateProject({ id: editing, ...payload }).unwrap();
        toast.success('Proyecto actualizado');
      } else {
        const created = await createProject(payload).unwrap();
        projectId = created._id;
        toast.success('Proyecto creado');
      }
      
      // Upload new images
      for (const file of newImageFiles) {
        const formData = new FormData();
        formData.append('image', file);
        const uploadRes = await uploadImage(formData).unwrap();
        await addImage({ 
          id: projectId, 
          url: uploadRes.image.url, 
          publicId: uploadRes.image.public_id 
        }).unwrap();
      }

      setForm(EMPTY);
      setEditing(null);
      setEditingProject(null);
      setShowForm(false);
      setNewImageFiles([]);
      setNewImagePreviews([]);
      refetch();
    } catch (err) {
      toast.error(err.data?.message || 'Error al guardar proyecto');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (proj) => {
    setEditing(proj._id);
    setEditingProject(proj);
    setForm({
      nombre: proj.nombre || '',
      descripcion: proj.descripcion || '',
      problema: proj.problema || '',
      solucion: proj.solucion || '',
      resultado: proj.resultado || '',
      tecnologias: proj.tecnologias?.join(', ') || '',
      categoria: proj.categoria?._id || proj.categoria || '',
      isFeatured: proj.isFeatured || false,
      urlProyecto: proj.urlProyecto || '',
      urlGithub: proj.urlGithub || ''
    });
    setNewImageFiles([]);
    setNewImagePreviews([]);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este proyecto?')) return;
    try {
      await deleteProject(id).unwrap();
      toast.success('Proyecto eliminado');
    } catch {
      toast.error('Error al eliminar');
    }
  };

  return (
    <AdminLayout title="Catálogo de Proyectos">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase mb-2">
              Gestión de <span className="text-primary-400">Proyectos</span>
            </h1>
            <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-xs">Portafolio de Ausauth Dev Agency</p>
          </motion.div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setEditing(null);
              setEditingProject(null);
              setForm(EMPTY);
              setShowForm(true);
            }}
            className="flex items-center gap-3 bg-primary-400 text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-[0_0_30px_rgba(3,252,186,0.2)] hover:shadow-cyan-500/30 transition-all italic"
          >
            <HiOutlinePlus size={20} /> Nuevo Proyecto
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar / Filters */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-gray-900/50 backdrop-blur-xl border border-white/5 p-8 rounded-[2rem]">
              <h3 className="text-white font-black uppercase italic tracking-tighter mb-6">Búsqueda avanzada</h3>
              <div className="relative mb-8 text-black">
                <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="ID, Nombre o Tecnología..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl font-bold placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
              </div>

              <h3 className="text-white font-black uppercase italic tracking-tighter mb-4">Categorías</h3>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => setFilterCat('')}
                  className={`px-6 py-3 rounded-xl text-left text-sm font-black uppercase tracking-widest transition-all ${!filterCat ? 'bg-primary-400 text-black' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                >
                  Todos los Proyectos
                </button>
                {categories.map(c => (
                  <button 
                    key={c._id}
                    onClick={() => setFilterCat(c._id)}
                    className={`px-6 py-3 rounded-xl text-left text-sm font-black uppercase tracking-widest transition-all ${filterCat === c._id ? 'bg-primary-400 text-black' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                  >
                    {c.nombre}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-8 bg-primary-400/5 border border-primary-400/10 rounded-[2.5rem]">
              <p className="text-primary-400 font-black text-xs uppercase tracking-widest mb-2">Tip de Portafolio</p>
              <p className="text-gray-400 text-sm leading-relaxed">Los proyectos marcados como <b>Destacados</b> aparecerán en la sección principal de la home.</p>
            </div>
          </div>

          {/* Grid */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="popLayout">
              <motion.div 
                layout
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {data?.projects?.map((proj, idx) => (
                  <motion.div 
                    key={proj._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-gray-900/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-white/10 transition-all"
                  >
                    <div className="aspect-[16/10] relative overflow-hidden bg-black">
                      <img 
                        src={proj.imagenes?.[0]?.url || 'https://via.placeholder.com/800x500'} 
                        alt={proj.nombre}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                      />
                      <div className="absolute top-4 right-4 flex gap-2">
                        {proj.isFeatured && (
                          <div className="bg-amber-400 text-black p-2 rounded-xl shadow-2xl" title="Destacado">
                            <HiOutlineBadgeCheck size={20} />
                          </div>
                        )}
                        <div className="bg-primary-400 text-black p-2 rounded-xl shadow-2xl">
                          <HiOutlineCollection size={20} />
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                      <div className="absolute bottom-6 left-6 right-6">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-400 mb-2 block">
                          {categories.find(c => c._id === proj.categoria || c._id === proj.categoria?._id)?.nombre || 'General'}
                        </span>
                        <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter truncate">{proj.nombre}</h3>
                      </div>
                    </div>

                    <div className="p-8">
                      <div className="flex flex-wrap gap-2 mb-6">
                        {proj.tecnologias?.slice(0, 3).map((t, i) => (
                          <span key={i} className="px-3 py-1 bg-white/5 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-white/5">
                            {t}
                          </span>
                        ))}
                        {proj.tecnologias?.length > 3 && (
                          <span className="px-3 py-1 bg-white/5 text-gray-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-white/5">
                            +{proj.tecnologias.length - 3}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEdit(proj)}
                          className="flex-1 flex items-center justify-center gap-2 bg-white text-black py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-transform italic"
                        >
                          <HiOutlinePencil /> Editar
                        </button>
                        <button
                          onClick={() => handleDelete(proj._id)}
                          className="w-12 h-12 flex items-center justify-center text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 rounded-2xl transition-all border border-rose-500/20"
                        >
                          <HiOutlineTrash />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              className="fixed inset-0 bg-black/90 backdrop-blur-xl"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-black border border-white/10 w-full max-w-5xl rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] relative z-10 overflow-hidden"
            >
              <div className="flex justify-between items-center p-10 border-b border-white/5">
                <div>
                   <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                    {editing ? <HiOutlinePencil /> : <HiOutlinePlus />}
                    {editing ? 'Editar' : 'Nuevo'} <span className="text-primary-400">Proyecto</span>
                  </h2>
                </div>
                <button 
                  onClick={() => setShowForm(false)}
                  className="w-14 h-14 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-white"
                >
                  <HiX size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* Left Column */}
                  <div className="space-y-8">
                    <div>
                      <label className="block text-xs font-black text-gray-500 mb-3 uppercase tracking-[0.2em] italic">Identidad</label>
                      <input
                        type="text"
                        required
                        placeholder="Nombre del Proyecto"
                        value={form.nombre}
                        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:border-primary-400 outline-none transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black text-gray-500 mb-3 uppercase tracking-[0.2em] italic">Ecosistema</label>
                        <select
                          required
                          value={form.categoria}
                          onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                          className="w-full bg-white text-black rounded-2xl px-6 py-4 font-black uppercase text-xs focus:ring-4 focus:ring-primary-400/20 outline-none transition-all appearance-none"
                        >
                          <option value="">Clasificación</option>
                          {categories.map(c => (
                            <option key={c._id} value={c._id}>{c.nombre}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-end">
                        <label className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl cursor-pointer transition-all border ${form.isFeatured ? 'bg-amber-400/20 border-amber-400 text-amber-400' : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10'}`}>
                          <input 
                            type="checkbox" 
                            className="hidden"
                            checked={form.isFeatured}
                            onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                          />
                          <HiOutlineBadgeCheck size={20} />
                          <span className="text-xs font-black uppercase tracking-widest">Destacado</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-gray-500 mb-3 uppercase tracking-[0.2em] italic">Elevator Pitch</label>
                      <textarea
                        rows="3"
                        required
                        placeholder="Breve descripción orientada a resultados..."
                        value={form.descripcion}
                        onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-6 py-5 text-white font-medium focus:border-primary-400 outline-none transition-all resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-gray-500 mb-3 uppercase tracking-[0.2em] italic">Stack Tecnológico (comas)</label>
                      <input
                        type="text"
                        placeholder="React, Next.js, etc."
                        value={form.tecnologias}
                        onChange={(e) => setForm({ ...form, tecnologias: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:border-primary-400 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Right Column / Case Study */}
                  <div className="space-y-8">
                    <div>
                      <label className="block text-xs font-black text-gray-500 mb-3 uppercase tracking-[0.2em] italic">El Desafío</label>
                      <textarea
                        rows="2"
                        value={form.problema}
                        onChange={(e) => setForm({ ...form, problema: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-medium focus:border-primary-400 outline-none resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-500 mb-3 uppercase tracking-[0.2em] italic">Nuestra Ingeniería</label>
                      <textarea
                        rows="2"
                        value={form.solucion}
                        onChange={(e) => setForm({ ...form, solucion: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-medium focus:border-primary-400 outline-none resize-none"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black text-gray-500 mb-3 uppercase tracking-[0.2em] italic">Live Demo</label>
                        <div className="relative">
                          <HiOutlineExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                          <input 
                            type="url"
                            placeholder="https://..."
                            value={form.urlProyecto}
                            onChange={(e) => setForm({ ...form, urlProyecto: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-xs font-bold focus:border-primary-400 outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-black text-gray-500 mb-3 uppercase tracking-[0.2em] italic">Source Code</label>
                        <div className="relative">
                          <HiOutlineCode className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                          <input 
                            type="url"
                            placeholder="GitHub Link"
                            value={form.urlGithub}
                            onChange={(e) => setForm({ ...form, urlGithub: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-xs font-bold focus:border-primary-400 outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <label className="block text-xs font-black text-gray-500 mb-4 uppercase tracking-[0.2em] italic">Visual Performance Assets</label>
                      <div className="flex flex-wrap gap-4 p-6 bg-white/5 rounded-[2rem] border border-dashed border-white/10">
                        {editingProject?.imagenes?.map((img) => (
                          <div key={img.publicId} className="relative w-24 h-24 rounded-2xl overflow-hidden group shadow-2xl">
                            <img src={img.url} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemoveExistingImage(img.publicId)}
                              className="absolute inset-0 bg-rose-600/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"
                            >
                              <HiOutlineTrash size={24} className="text-white" />
                            </button>
                          </div>
                        ))}
                        
                        {newImagePreviews.map((url, i) => (
                          <div key={i} className="relative w-24 h-24 rounded-2xl overflow-hidden group shadow-2xl">
                            <img src={url} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeNewImage(i)}
                              className="absolute inset-0 bg-rose-600/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"
                            >
                              <HiOutlineTrash size={24} className="text-white" />
                            </button>
                          </div>
                        ))}

                        <label className="w-24 h-24 rounded-2xl border-2 border-dashed border-white/10 hover:border-primary-400 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-primary-400/5 group">
                          <HiOutlinePhotograph size={24} className="text-gray-600 group-hover:text-primary-400" />
                          <input type="file" multiple accept="image/*" onChange={handleAddImages} className="hidden" />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Row */}
                <div className="mt-16 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="text-gray-500 font-black uppercase text-xs tracking-[0.3em] hover:text-white transition-colors italic"
                  >
                    Descartar Cambios
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="bg-primary-400 hover:bg-cyan-400 text-black px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-[0_0_50px_rgba(3,252,186,0.3)] transition-all flex items-center gap-4 italic"
                  >
                    {uploading ? 'Procesando...' : (editing ? 'Actualizar Master' : 'Publicar Proyecto')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default ProjectsAdmin;
