import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  HiOutlineSearch,
  HiOutlineUser,
  HiX,
  HiMenu,
  HiChevronDown,
} from 'react-icons/hi';
import useAuth from '../../hooks/useAuth';
import { toggleMenu, closeMenu } from '../../features/ui/uiSlice';
import { 
  useGetCategoriesQuery, 
  useGetProjectSuggestionsQuery 
} from '../../services/projectsApi';
import config from '../../config/app';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAdmin, isAuthenticated, logout } = useAuth();
  const menuOpen = useSelector((s) => s.ui.menuOpen);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: suggestions = [] } = useGetProjectSuggestionsQuery(debouncedSearch, {
    skip: debouncedSearch.length < 2
  });
  
  const suggestionsRef = useRef(null);
  const debounceTimerRef = useRef(null);
  
  // Debounce para evitar demasiadas requests
  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    
    debounceTimerRef.current = setTimeout(() => {
      if (search.trim()) {
        setDebouncedSearch(search.trim());
        setShowSuggestions(true);
      } else {
        setDebouncedSearch('');
        setShowSuggestions(false);
      }
    }, 300);
    
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [search]);
  
  const safeSuggestions = Array.isArray(suggestions)
    ? suggestions.filter((item) => item && typeof item === 'object')
    : [];

  const formatSuggestionPrice = (product) => {
    const rawPrice = product?.precioOferta ?? product?.precio ?? 0;
    const numericPrice = Number(rawPrice);
    const safePrice = Number.isFinite(numericPrice) ? numericPrice : 0;
    return `$${safePrice.toLocaleString('es-AR')}`;
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const term = search.trim();
    if (term) {
      setSearch('');
      setDebouncedSearch('');
      setShowSuggestions(false);
      navigate(`/proyectos?search=${encodeURIComponent(term)}`);
      dispatch(closeMenu());
    }
  };

  const handleSuggestionClick = (product) => {
    if (!product?._id) return;
    navigate(`/proyectos/${product._id}`);
    setSearch('');
    setDebouncedSearch('');
    setShowSuggestions(false);
    dispatch(closeMenu());
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 ${
          scrolled 
            ? 'py-2 px-4' 
            : 'py-6 px-4 md:px-8'
        }`}
      >
      <div className="max-w-7xl mx-auto">
        <nav 
          className={`flex items-center justify-between px-6 py-3 rounded-2xl transition-all duration-500 border border-white/10 backdrop-blur-xl ${
            scrolled 
              ? 'bg-black/60 shadow-[0_8px_32px_rgba(0,0,0,0.5)] scale-[0.98]' 
              : 'bg-white/5 shadow-none scale-100'
          }`}
        >
          {/* Menu & Logo Group */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => dispatch(toggleMenu())}
              className="text-white hover:text-primary-400 transition-colors p-2 rounded-xl bg-white/5 md:hidden"
              aria-label="Menú"
            >
              {menuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>

            <Link to="/" className="flex items-center gap-4 group" onClick={() => dispatch(closeMenu())}>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <img 
                  src="/logooficial.png" 
                  alt="Ausauth" 
                  className="h-10 md:h-20 w-auto object-contain transition-all duration-500 drop-shadow-[0_0_15px_rgba(139,92,246,0.3)] group-hover:drop-shadow-[0_0_20px_rgba(139,92,246,0.6)]"
                />
              </motion.div>
              <div className="hidden lg:flex flex-col">
                <span className="text-2xl font-black tracking-widest uppercase italic leading-none">
                  <span className="text-secondary-400">AUS</span>
                  <span className="text-white">AUTH</span>
                </span>
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.4em] leading-none mt-1">Software Architecture</span>
              </div>
            </Link>
          </div>

          {/* Nav Links Desktop */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/proyectos" className="text-sm font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest">PROYECTOS</Link>
            <Link to="/servicios" className="text-sm font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest">TECNOLOGÍA</Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-1 max-w-[150px] relative" ref={suggestionsRef}>
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative w-full">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => debouncedSearch && setShowSuggestions(true)}
                    placeholder="Buscar..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-4 pr-10 focus:outline-none focus:ring-1 focus:ring-primary-400/50 transition-all text-xs text-white placeholder:text-gray-600"
                  />
                  <HiOutlineSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                </div>
              </form>
            </div>

            <div className="h-6 w-[1px] bg-white/10 hidden md:block" />

            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white/10 transition-all border border-transparent hover:border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-black">
                    <HiOutlineUser size={22} />
                  </div>
                  <HiChevronDown size={14} className="text-gray-500" />
                </button>
                <div className="absolute right-0 top-full mt-2 w-56 bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="px-4 py-2 border-b border-white/5 mb-1">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none">Agencia</p>
                    <p className="text-sm font-bold text-white truncate">{user?.nombre}</p>
                  </div>
                  <Link to="/perfil" className="block px-4 py-2.5 text-sm hover:bg-white/10 text-gray-300 font-bold transition-colors">Mi perfil</Link>
                  <Link to="/mis-presupuestos" className="block px-4 py-2.5 text-sm hover:bg-white/10 text-gray-300 font-bold transition-colors">Mis presupuestos</Link>
                  {isAdmin && <Link to="/admin" className="block px-4 py-2.5 text-sm hover:bg-primary-400/10 text-primary-400 font-bold transition-colors">Panel Admin</Link>}
                  <button onClick={logout} className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 border-t border-white/5 mt-1 transition-colors font-bold">Cerrar sesión</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="px-6 py-2.5 bg-primary-400 text-black font-black uppercase tracking-tighter rounded-xl hover:scale-105 transition-all shadow-lg active:scale-95">
                Ingresar
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>

      {/* Mobile slide-in menu */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 ${
          menuOpen ? 'visible' : 'invisible'
        }`}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => dispatch(closeMenu())}
        />

        {/* Drawer */}
        <nav
          className={`absolute top-0 left-0 w-72 h-full bg-gray-900 shadow-2xl flex flex-col transition-transform duration-300 ${
            menuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
            <span className="font-bold text-lg text-gray-100">Menú</span>
            <button onClick={() => dispatch(closeMenu())} className="p-1 rounded-lg hover:bg-gray-800 text-primary-400">
              <HiX size={22} />
            </button>
          </div>

          {/* Mobile search */}
          <form onSubmit={handleSearch} className="px-5 py-3 border-b border-gray-700 relative">
            <div className="relative">
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => debouncedSearch && setShowSuggestions(true)}
                placeholder="Buscar..."
                className="input-field pl-9 py-2 text-sm bg-gray-800 text-gray-100 border-gray-700 focus:ring-2 focus:ring-primary-400 w-full"
              />
            </div>
            
            {/* Suggestions dropdown mobile */}
            {showSuggestions && debouncedSearch.length > 0 && safeSuggestions.length > 0 && (
              <div className="absolute top-full left-5 right-5 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                {safeSuggestions.map((product) => (
                  <button
                    key={product._id}
                    onClick={() => handleSuggestionClick(product)}
                    className="w-full px-3 py-2 flex items-center gap-2 hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-b-0 text-left text-sm"
                  >
                    <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0 bg-gray-800">
                      {product.imagenes?.[0]?.url ? (
                        <img src={product.imagenes[0].url} alt={product.nombre} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <HiOutlineSearch size={14} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-100 truncate text-xs">{product.nombre}</p>
                      <p className="text-xs text-gray-400">{formatSuggestionPrice(product)}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </form>

          {/* Nav Links */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1">
            <Link
              to="/"
              onClick={() => dispatch(closeMenu())}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 font-bold transition-colors text-white"
            >
              Inicio
            </Link>

            <Link
              to="/proyectos"
              onClick={() => dispatch(closeMenu())}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 font-bold transition-colors text-white"
            >
              Proyectos
            </Link>

            <Link
              to="/downloads"
              onClick={() => dispatch(closeMenu())}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 font-bold transition-colors text-white"
            >
              Downloads & Assets
            </Link>

            {categories.length > 0 && (
              <div className="pt-4 border-t border-white/5 mt-4">
                <p className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Especialidades</p>
                {categories.map((cat) => (
                  <Link
                    key={cat._id}
                    to={`/proyectos?categoria=${cat._id}`}
                    onClick={() => dispatch(closeMenu())}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-sm transition-colors text-gray-400 font-medium"
                  >
                    {cat.nombre}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/5 space-y-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/perfil"
                  onClick={() => dispatch(closeMenu())}
                  className="block w-full text-center py-3 rounded-xl bg-white/5 text-white font-bold text-sm"
                >
                  Mi Perfil
                </Link>
                <button 
                  onClick={() => { logout(); dispatch(closeMenu()); }} 
                  className="w-full py-3 rounded-xl text-red-400 font-bold text-sm hover:bg-red-500/10 transition-colors"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => dispatch(closeMenu())} className="block w-full text-center py-3 rounded-xl bg-primary-400 text-black font-black uppercase text-xs">
                  Iniciar Sesión
                </Link>
                <Link to="/registro" onClick={() => dispatch(closeMenu())} className="block w-full text-center py-3 rounded-xl border border-white/10 text-white font-bold text-xs uppercase">
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;
