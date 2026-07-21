import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../services/authApi';
import { useSyncCartMutation } from '../services/cartApi';
import { clearGuestCart, selectCartItems } from '../features/cart/cartSlice';
import { selectCurrentUser } from '../features/auth/authSlice';
import toast from 'react-hot-toast';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const [form, setForm] = useState({ email: '', password: '' });
  const [login, { isLoading }] = useLoginMutation();
  const [syncCart] = useSyncCartMutation();
  const guestItems = useSelector(selectCartItems);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const guestCart = guestItems.map((i) => ({
        producto: i.producto?._id || i.producto,
        cantidad: i.cantidad,
      }));
      const result = await login({ ...form, guestCart }).unwrap();
      // authApi automatically dispatches setCredentials with user data
      // Backend sets HttpOnly cookies - they're sent automatically

      // Sync guest cart to DB
      if (guestCart.length > 0) {
        await syncCart(guestCart).unwrap().catch(() => {});
        dispatch(clearGuestCart());
      }

      toast.success(`¡Bienvenido, ${result.user.nombre}!`);
      
      // Todos los roles comienzan en la página de inicio
      navigate('/');
    } catch (err) {
      toast.error(err?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-[#050505] relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="text-center mb-12">
            <div className="inline-block p-4 bg-white/5 rounded-3xl border border-white/10 mb-6 group hover:border-primary-400/50 transition-all">
              <img src="/logooficial.png" alt="Ausauth Dev" className="h-16 w-auto object-contain filter drop-shadow-[0_0_10px_rgba(139,92,246,0.5)] group-hover:scale-110 transition-transform" />
            </div>
            <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
              ACCESO <span className="text-primary-400">CORE</span>
            </h1>
            <p className="text-gray-500 text-[10px] font-bold mt-4 uppercase tracking-[0.4em] italic">System Authentication</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-400 italic uppercase tracking-widest ml-1">Identity Endpoint</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full bg-black/50 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400/50 transition-all text-sm font-bold placeholder:text-gray-700"
                placeholder="EMAIL@AUSAUTH.DEV"
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-400 italic uppercase tracking-widest ml-1">Access Token</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full bg-black/50 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400/50 transition-all text-sm font-bold placeholder:text-gray-700"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full bg-primary-400 hover:bg-white text-black font-black py-5 rounded-2xl shadow-[0_10px_30px_rgba(139,92,246,0.3)] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 mt-4 uppercase italic tracking-tighter text-lg"
            >
              {isLoading ? 'HANDSHAKING...' : 'INITIATE SESSION'}
            </button>
          </form>

          <p className="text-center text-[10px] text-gray-600 mt-10 font-bold uppercase tracking-widest">
            ¿NO TIENES ACCESO?{' '}
            <Link to="/registro" className="text-primary-400 hover:text-white transition-colors border-b border-primary-400/20 pb-0.5">
              SOLICITAR CREDENCIALES
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
