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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input type="text" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Apellido</label>
              <input type="text" value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })} className="input-field" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Teléfono</label>
            <input type="tel" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} className="input-field" />
          </div>
          <h3 className="font-medium text-sm text-gray-600 pt-2">Dirección</h3>
          <div>
            <label className="block text-sm font-medium mb-1">Calle y número</label>
            <input type="text" value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Ciudad</label>
              <input type="text" value={form.ciudad} onChange={(e) => setForm({ ...form, ciudad: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Provincia</label>
              <input type="text" value={form.provincia} onChange={(e) => setForm({ ...form, provincia: e.target.value })} className="input-field" />
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-1">
            Al guardar, se detectará automáticamente tu zona de cobertura para instalación.
          </p>

          {user.zone ? (
            <div className="mt-2 p-3 bg-green-900/40 border border-green-700 rounded-lg">
              <p className="text-sm text-green-400 font-medium">
                📍 Zona detectada: <strong>{user.zone}</strong> — Servicio de instalación disponible en tu zona.
              </p>
            </div>
          ) : (
            <div className="mt-2 p-3 bg-gray-800 border border-gray-700 rounded-lg">
              <p className="text-sm text-gray-400">
                📍 Sin zona detectada. Guardá tu dirección para activar el servicio de instalación (solo AMBA/CABA).
              </p>
            </div>
          )}

          <button type="submit" disabled={isSaving} className="btn-primary w-full mt-2">
            {isSaving ? 'Detectando zona y guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
