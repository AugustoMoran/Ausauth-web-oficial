import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useGetPopupConfigQuery, useUpdatePopupConfigMutation } from '../../services/popupApi';
import { useUploadImageMutation } from '../../services/cartApi';
import toast from 'react-hot-toast';
import { 
  HiOutlinePhotograph, 
  HiOutlineSave, 
  HiOutlineRefresh, 
  HiOutlineFilm, 
  HiX,
  HiOutlineSpeakerphone 
} from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa';
import { motion } from 'framer-motion';

const DEFAULTS = {
  activo: true,
  titulo: '¿Buscás atención personalizada?',
  descripcion: 'Hablá con nosotros por WhatsApp y te ayudamos a encontrar exactamente lo que necesitás.',
  ctaTexto: 'Hablar por WhatsApp',
  whatsappNumero: '5491100000000',
  mensajePrellenado: 'Hola, estuve viendo la página y me gustaría recibir atención personalizada.',
  imagen: '',
  imagenPublicId: '',
  video: '',
  videoPublicId: '',
  tiempoAparicion: 5,
};

const PopupAdmin = () => {
  const { data: config, isLoading } = useGetPopupConfigQuery();
  const [updatePopupConfig, { isLoading: isSaving }] = useUpdatePopupConfigMutation();
  const [uploadImage] = useUploadImageMutation();

  const [form, setForm] = useState(DEFAULTS);
  const [uploading, setUploading] = useState(false);
  const [newVideoPreview, setNewVideoPreview] = useState('');

  useEffect(() => {
    if (config) {
      setForm({
        activo: config.activo ?? true,
        titulo: config.titulo || '',
        descripcion: config.descripcion || '',
        ctaTexto: config.ctaTexto || '',
        whatsappNumero: config.whatsappNumero || '',
        mensajePrellenado: config.mensajePrellenado || '',
        imagen: config.imagen || '',
        imagenPublicId: config.imagenPublicId || '',
        video: config.video || '',
        videoPublicId: config.videoPublicId || '',
        tiempoAparicion: config.tiempoAparicion ?? 5,
      });
    }
  }, [config]);

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { url, publicId } = await uploadImage(fd).unwrap();
      setForm((f) => ({ ...f, imagen: url, imagenPublicId: publicId }));
      toast.success('Imagen subida');
    } catch {
      toast.error('Error al subir imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { url, publicId } = await uploadImage(fd).unwrap();
      setForm((f) => ({ ...f, video: url, videoPublicId: publicId }));
      setNewVideoPreview(URL.createObjectURL(file));
      toast.success('Video subido');
    } catch {
      toast.error('Error al subir video');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveVideo = () => {
    setForm((f) => ({ ...f, video: '', videoPublicId: '' }));
    setNewVideoPreview('');
  };

  const handleReset = () => setForm(DEFAULTS);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePopupConfig(form).unwrap();
      toast.success('Configuración guardada');
    } catch (err) {
      toast.error(err?.data?.message || 'Error al guardar');
    }
  };

  const waPreview = `https://wa.me/${form.whatsappNumero || '5491100000000'}?text=${encodeURIComponent(
    form.mensajePrellenado || ''
  )}`;

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-400 rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header Premium */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-primary-400/10 rounded-[2rem] border border-primary-400/20 flex items-center justify-center text-primary-400 shadow-[0_0_50px_rgba(139,92,246,0.1)]">
              <HiOutlineSpeakerphone size={40} className="rotate-[-10deg]" />
            </div>
            <div>
              <h1 className="text-6xl font-black text-white italic tracking-tighter uppercase mb-2">
                Conversion <span className="text-primary-400">HUB</span>
              </h1>
              <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px]">Gestión de anuncios y llamadas a la acción</p>
            </div>
          </div>
          
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-3 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] border border-white/5 transition-all italic"
          >
            <HiOutlineRefresh size={16} /> Restore Systems
          </button>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Config Area */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Status Card */}
            <div className="bg-gray-900/50 backdrop-blur-xl border border-white/5 p-10 rounded-[3rem] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-400/5 blur-3xl -z-10" />
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-2">Estado del Sistema</h3>
                  <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Visibilidad global del popup</p>
                </div>
                <button
                  type="button"
                  onClick={() => set('activo', !form.activo)}
                  className={`relative w-20 h-10 rounded-full transition-all duration-500 overflow-hidden border ${
                    form.activo 
                      ? 'bg-primary-400 border-primary-300 shadow-[0_0_30px_rgba(139,92,246,0.4)]' 
                      : 'bg-black border-white/10'
                  }`}
                >
                  <motion.div
                    animate={{ x: form.activo ? 40 : 4 }}
                    className={`w-8 h-8 rounded-full shadow-2xl ${
                      form.activo ? 'bg-white' : 'bg-gray-800'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Content Card */}
            <div className="bg-gray-900/50 backdrop-blur-xl border border-white/5 p-10 rounded-[3rem] space-y-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-[10px] font-black text-primary-400 uppercase tracking-[0.3em]">Module 01</span>
                <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Copywriting & Logic</h3>
                <span className="h-px flex-1 bg-white/5"></span>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 mb-3 uppercase tracking-[0.2em] italic">Headline Principal</label>
                    <input
                      type="text"
                      value={form.titulo}
                      onChange={(e) => set('titulo', e.target.value)}
                      placeholder="¿Buscás atención personalizada?"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:border-primary-400 outline-none transition-all placeholder:text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 mb-3 uppercase tracking-[0.2em] italic">Delay de Aparición (s)</label>
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={form.tiempoAparicion}
                      onChange={(e) => set('tiempoAparicion', Number(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:border-primary-400 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-500 mb-3 uppercase tracking-[0.2em] italic">Mensaje Descriptivo</label>
                  <textarea
                    value={form.descripcion}
                    onChange={(e) => set('descripcion', e.target.value)}
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-6 py-5 text-white font-medium focus:border-primary-400 outline-none transition-all resize-none placeholder:text-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-500 mb-3 uppercase tracking-[0.2em] italic">Call to Action (Botón)</label>
                  <input
                    type="text"
                    value={form.ctaTexto}
                    onChange={(e) => set('ctaTexto', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:border-primary-400 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Media Card */}
            <div className="bg-gray-900/50 backdrop-blur-xl border border-white/5 p-10 rounded-[3rem] space-y-8">
               <div className="flex items-center gap-4 mb-4">
                <span className="text-[10px] font-black text-primary-400 uppercase tracking-[0.3em]">Module 02</span>
                <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Visual Identity</h3>
                <span className="h-px flex-1 bg-white/5"></span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image Section */}
                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-gray-500 mb-3 uppercase tracking-[0.2em] italic">Background Image</label>
                  <div className="aspect-video bg-black rounded-[2rem] border border-white/5 overflow-hidden relative group/img">
                    {form.imagen ? (
                      <>
                        <img src={form.imagen} className="w-full h-full object-cover opacity-60 group-hover/img:scale-110 transition-transform duration-700" />
                        <button 
                          onClick={() => setForm(f => ({ ...f, imagen: '', imagenPublicId: '' }))}
                          className="absolute top-4 right-4 p-2 bg-rose-500/20 text-rose-400 rounded-xl backdrop-blur-md opacity-0 group-hover/img:opacity-100 transition-opacity"
                        >
                          <HiX />
                        </button>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-700">
                        <HiOutlinePhotograph size={40} className="mb-2" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">No Media</span>
                      </div>
                    )}
                  </div>
                  <label className="flex items-center justify-center gap-3 w-full bg-white/5 hover:bg-white text-gray-400 hover:text-black py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all cursor-pointer">
                    <HiOutlinePhotograph size={16} /> {uploading ? 'Uploading...' : 'Upload Image'}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>

                {/* Video Section */}
                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-gray-500 mb-3 uppercase tracking-[0.2em] italic">Background Video (MP4)</label>
                  <div className="aspect-video bg-black rounded-[2rem] border border-white/5 overflow-hidden relative group/vid">
                    {form.video ? (
                      <>
                        <video src={form.video} className="w-full h-full object-cover opacity-60" muted loop />
                        <button 
                          onClick={handleRemoveVideo}
                          className="absolute top-4 right-4 p-2 bg-rose-500/20 text-rose-400 rounded-xl backdrop-blur-md opacity-0 group-hover/vid:opacity-100 transition-opacity"
                        >
                          <HiX />
                        </button>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-700">
                        <HiOutlineFilm size={40} className="mb-2" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">No Media</span>
                      </div>
                    )}
                  </div>
                  <label className="flex items-center justify-center gap-3 w-full bg-white/5 hover:bg-white text-gray-400 hover:text-black py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all cursor-pointer">
                    <HiOutlineFilm size={16} /> {uploading ? 'Uploading...' : 'Upload Video'}
                    <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-5 space-y-8">
            {/* WhatsApp Integration Card */}
            <div className="bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/20 p-10 rounded-[3rem] space-y-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400">
                  <FaWhatsapp size={24} />
                </div>
                <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Direct Connect</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-emerald-500/50 mb-3 uppercase tracking-[0.2em] italic">Número de Contacto</label>
                  <input
                    type="text"
                    value={form.whatsappNumero}
                    onChange={(e) => set('whatsappNumero', e.target.value.replace(/\D/g, ''))}
                    placeholder="5491100000000"
                    className="w-full bg-black/40 border border-emerald-500/10 rounded-2xl px-6 py-4 text-emerald-400 font-bold focus:border-emerald-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-emerald-500/50 mb-3 uppercase tracking-[0.2em] italic">Mensaje Automático</label>
                  <textarea
                    value={form.mensajePrellenado}
                    onChange={(e) => set('mensajePrellenado', e.target.value)}
                    rows={4}
                    className="w-full bg-black/40 border border-emerald-500/10 rounded-[2rem] px-6 py-5 text-emerald-200 text-sm font-medium focus:border-emerald-500 outline-none transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Save Card */}
            <div className="sticky top-8 space-y-4">
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 0 50px rgba(139,92,246,0.3)" }}
                whileTap={{ scale: 0.98 }}
                disabled={isSaving}
                className="w-full bg-primary-400 text-black py-8 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-sm italic flex items-center justify-center gap-4 shadow-2xl transition-all"
              >
                <HiOutlineSave size={24} />
                {isSaving ? 'Synchronizing...' : 'Update Ad System'}
              </motion.button>
              
              <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 text-center">
                 <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.5em]">Realtime Deployment Protocol v2.5</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default PopupAdmin;
