import React, { useState, useEffect } from 'react';
import { useGetMeQuery, useUpdateProfileMutation } from '../services/authApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/auth/authSlice';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const Profile = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: user, isLoading } = useGetMeQuery();
  const dispatch = useDispatch();
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();
  const [form, setForm] = useState(null);

  React.useEffect(() => {
    if (user && !form) {
      setForm({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        telefono: user.telefono || '',
        direccion: user.direccion?.calle || '',
        ciudad: user.direccion?.ciudad || '',
        provincia: user.direccion?.provincia || '',
      });
    }
  }, [user]);

  if (isLoading || !form) return (
    <div className="max-w-xl mx-auto px-4 py-12 animate-pulse space-y-4">
      <div className="h-8 bg-gray-800 rounded w-1/3" />
      <div className="h-12 bg-gray-800 rounded" />
      <div className="h-12 bg-gray-800 rounded" />
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        nombre: form.nombre,
        apellido: form.apellido,
        telefono: form.telefono,
        direccion: { calle: form.direccion, ciudad: form.ciudad, provincia: form.provincia },
      };
      const result = await updateProfile(payload).unwrap();
      dispatch(setCredentials({ user: result }));
      toast.success('Perfil actualizado');
    } catch (err) {
      toast.error(err?.data?.message || 'Error al actualizar');
    }
  };

  return (
    <div className="bg-black min-h-screen pt-32 pb-24 text-white">
      <div className="max-w-xl mx-auto px-6">
        <h1 className="text-5xl sm:text-7xl font-black italic tracking-tighter uppercase leading-none mb-12">
          MI <span className="text-primary-400">PERFIL</span>
        </h1>

        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
          <div className="flex items-center gap-6 mb-10 pb-10 border-b border-white/10">
            <div className="w-20 h-20 bg-primary-400 rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.2)]">
              <span className="text-black font-black text-3xl italic">
                {user.nombre?.[0]?.toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-2xl font-black italic uppercase tracking-tighter">{user.nombre} {user.apellido}</p>
              <p className="text-gray-500 font-medium">{user.email}</p>
              {user.role === 'admin' && (
                <span className="inline-block px-3 py-1 bg-primary-400/10 text-primary-400 text-[10px] font-black uppercase tracking-widest mt-2 rounded-lg border border-primary-400/20">Administrador del Sistema</span>
              )}
            </div>
          </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 ml-4">Nombre</label>
              <input type="text" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="w-full bg-black/50 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400/50 transition-all text-sm font-bold" required />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 ml-4">Apellido</label>
              <input type="text" value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })} className="w-full bg-black/50 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400/50 transition-all text-sm font-bold" required />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 ml-4">Teléfono de Contacto</label>
            <input type="tel" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} className="w-full bg-black/50 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400/50 transition-all text-sm font-bold" />
          </div>

          <div className="pt-6 border-t border-white/10">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-primary-400 mb-6 italic">Geolocalización y Despacho</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 ml-4">Calle y número</label>
                <input type="text" value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} className="w-full bg-black/50 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400/50 transition-all text-sm font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 ml-4">Ciudad</label>
                  <input type="text" value={form.ciudad} onChange={(e) => setForm({ ...form, ciudad: e.target.value })} className="w-full bg-black/50 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400/50 transition-all text-sm font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 ml-4">Provincia</label>
                  <input type="text" value={form.provincia} onChange={(e) => setForm({ ...form, provincia: e.target.value })} className="w-full bg-black/50 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400/50 transition-all text-sm font-bold" />
                </div>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest italic opacity-50">
            * El sistema calcula automáticamente tu zona de cobertura para servicios de instalación técnica.
          </p>

          {user.zone ? (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl">
              <p className="text-[10px] text-green-400 font-black uppercase tracking-widest">
                📍 ZONA DETECTADA: {user.zone} — SERVICIO DISPONIBLE
              </p>
            </div>
          ) : (
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest italic">
                📍 Sin zona detectada. Guardá tu dirección para activar el servicio técnico.
              </p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isSaving}
            className="w-full bg-primary-400 hover:bg-white text-black font-black py-5 rounded-2xl shadow-[0_10px_30px_rgba(139,92,246,0.3)] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 mt-4 uppercase italic tracking-tighter text-lg"
          >
            {isSaving ? 'Sincronizando...' : 'Guardar Cambios'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
