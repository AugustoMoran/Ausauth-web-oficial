import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FiSend, FiX, FiMessageSquare, FiShoppingBag, FiShoppingCart, FiArrowRight } from 'react-icons/fi';
import { RiRobot2Line } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { sendChatMessage } from '../../services/chatApi';
import { formatCurrency } from '../../utils/formatCurrency';
import useCart from '../../hooks/useCart';

// ─── Session ID ───────────────────────────────────────────────────────────────
// Persisted per browser tab so the analytics plugin can track sessions
const SESSION_ID = `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

// ─── Initial greeting ─────────────────────────────────────────────────────────
const INITIAL_MESSAGE = {
  id:   'init',
  role: 'assistant',
  text: '¡Hola! 🤖 Soy el consultor digital de AUSAUTH. Puedo asesorarte sobre desarrollo web, aplicaciones móviles, integraciones fiscales (AFIP) y arquitectura de software. ¿En qué proyecto estás pensando?',
  products: [],
  actions:  [],
};

// ─── Sub-components ───────────────────────────────────────────────────────────
function ProductCard({ product, onAddToCart, onBuyNow }) {
  // Normalizar campos comunes que pueden venir con nombres distintos
  const name = product.name || product.nombre || 'Producto';
  const image = product.image || (product.imagenes && product.imagenes[0]?.url) || null;
  const priceVal = (
    product.salePrice ?? product.precioOferta ?? product.price ?? product.precio ?? null
  );
  const priceNum = Number(priceVal);
  const price = Number.isFinite(priceNum) && priceNum > 0 ? formatCurrency(priceNum) : 'Sin precio';

  return (
    <div className="flex flex-col gap-1.5 p-2 rounded-lg border border-gray-700 bg-gray-900 hover:border-primary-400 transition-colors w-full">
      {/* Top row: image, name, price */}
      <div className="flex items-start gap-2">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-12 h-12 object-cover rounded-md flex-shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-md bg-pearl flex items-center justify-center flex-shrink-0">
            <FiShoppingBag size={16} className="text-primary-600" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-gray-100 truncate">{name}</p>
          <p className="text-xs font-bold text-primary-400">{price}</p>
        </div>
      </div>

      {/* Bottom row: buttons */}
      <div className="flex gap-1">
        <button
          onClick={() => onAddToCart(product)}
          className="flex-1 px-2 py-1 text-xs rounded-md bg-primary-400 hover:bg-primary-500 text-white font-medium transition-colors flex items-center justify-center gap-1"
          title="Agregar al carrito"
        >
          <FiShoppingCart size={12} />
          Carrito
        </button>
        <button
          onClick={() => onBuyNow(product)}
          className="flex-1 px-2 py-1 text-xs rounded-md bg-gray-700 hover:bg-gray-600 text-gray-100 font-medium transition-colors flex items-center justify-center gap-1"
          title="Comprar ahora"
        >
          <FiArrowRight size={12} />
          Comprar
        </button>
      </div>
    </div>
  );
}

function Message({ msg, onAddToCart, onBuyNow }) {
  const isUser = msg.role === 'user';

  return (
    <div className={`flex gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-primary-400 flex items-center justify-center flex-shrink-0 mt-0.5">
          <RiRobot2Line size={15} className="text-gray-900" />
        </div>
      )}

      <div className={`flex flex-col gap-1.5 max-w-[82%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Bubble */}
        <div
          className={`px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
            isUser
              ? 'bg-primary-400 text-white rounded-tr-sm'
              : 'bg-gray-900 border border-gray-700 text-gray-100 rounded-tl-sm shadow-sm'
          }`}
        >
          {msg.text}
        </div>

        {/* Product cards */}
        {msg.products?.length > 0 && (
          <div className="w-full flex flex-col gap-1.5">
            {msg.products.map((p, idx) => (
              <ProductCard
                key={p.id ? `${p.id}_${idx}` : idx}
                product={p}
                onAddToCart={onAddToCart}
                onBuyNow={onBuyNow}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-2">
      <div className="w-7 h-7 rounded-full bg-primary-400 flex items-center justify-center flex-shrink-0">
        <RiRobot2Line size={15} className="text-ink" />
      </div>
      <div className="px-3 py-2.5 rounded-2xl rounded-tl-sm bg-white border border-pearl-dark shadow-sm">
        <div className="flex gap-1 items-center h-4">
          <span className="w-1.5 h-1.5 rounded-full bg-ink/30 animate-bounce [animation-delay:0ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-ink/30 animate-bounce [animation-delay:150ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-ink/30 animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

// ─── Main widget ──────────────────────────────────────────────────────────────
export default function ChatWidget() {
  const [open, setOpen]           = useState(false);
  const [messages, setMessages]   = useState([INITIAL_MESSAGE]);
  const [input, setInput]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [unread, setUnread]       = useState(0);

  const navigate = useNavigate();
  const { addToCart } = useCart();

  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);

  // ─── Product handlers ─────────────────────────────────────────────────────
  const handleAddToCart = (product) => {
    // Transform product from AI format to cart format
    const productForCart = {
      _id:           product.id || product._id,
      nombre:        product.name || product.nombre || 'Producto',
      precio:        product.price || product.precio || 0,
      precioOferta:  product.salePrice || product.precioOferta || null,
      stock:         product.stock || 1,
      imagenes:      product.image ? [{ url: product.image }] : [],
      descripcion:   product.description || product.descripcion || '',
      categoria:     product.category || product.categoria || '',
      tags:          product.tags || [],
    };
    console.log('[ChatWidget] Adding to cart:', productForCart);
    addToCart(productForCart, 1);
  };

  const handleBuyNow = async (product) => {
    // Transform product from AI format to cart format
    const productForCart = {
      _id:           product.id || product._id,
      nombre:        product.name || product.nombre || 'Producto',
      precio:        product.price || product.precio || 0,
      precioOferta:  product.salePrice || product.precioOferta || null,
      stock:         product.stock || 1,
      imagenes:      product.image ? [{ url: product.image }] : [],
      descripcion:   product.description || product.descripcion || '',
      categoria:     product.category || product.categoria || '',
      tags:          product.tags || [],
    };
    await addToCart(productForCart, 1);
    navigate('/checkout');
  };

  // Scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Build conversation history for the API (last 8 exchanges to limit tokens)
  const buildHistory = useCallback(() =>
    messages
      .filter((m) => m.id !== 'init')
      .slice(-8)
      .map((m) => ({ role: m.role, content: m.text })),
    [messages]
  );

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setError(null);

    const userMsg = {
      id:   `u_${Date.now()}`,
      role: 'user',
      text,
      products: [],
      actions:  [],
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const history = buildHistory();
      const response = await sendChatMessage(text, SESSION_ID, history);

      const assistantMsg = {
        id:       `a_${Date.now()}`,
        role:     'assistant',
        text:     response.text     || 'No pude procesar tu consulta.',
        products: response.products || [],
        actions:  response.actions  || [],
        intent:   response.intent,
        source:   response.meta?.source,
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Badge for unread when window is closed
      if (!open) setUnread((n) => n + 1);
    } catch (err) {
      setError(err.message || 'Error al conectar con el asistente. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  }, [input, loading, buildHistory, open]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Quick suggestions shown only on the first interaction ─────────────────
  const showSuggestions = messages.length === 1;
  const suggestions = [
    '¿Qué servicios de desarrollo ofrecen?',
    'Presupuesto para una App Móvil',
    'Integración con AFIP / Sistemas',
    'Consultoría en Arquitectura Cloud',
  ];

  return (
    <>
      {/* ── Chat window ───────────────────────────────────────────────────── */}
      {open && (
        <div className="fixed bottom-[140px] right-4 z-[10002] w-[350px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-200px)] flex flex-col rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden bg-black/95 backdrop-blur-3xl border border-white/10 animate-slide-up">

          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-3.5 bg-white/5 text-white border-b border-white/5">
            <div className="w-8 h-8 rounded-full bg-primary-400 flex items-center justify-center">
              <RiRobot2Line size={18} className="text-black" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-xs uppercase tracking-widest text-white leading-tight">Consultor Digital</p>
              <p className="text-[10px] text-primary-400 font-bold uppercase tracking-tighter leading-tight">
                {loading ? 'Procesando arquitectura...' : 'Sistemas Activos'}
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
              aria-label="Cerrar chat"
            >
              <FiX size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 min-h-[200px] custom-scrollbar">
            {messages.map((msg, idx) => (
              <Message 
                key={msg.id ? `${msg.id}_${idx}` : idx} 
                msg={msg}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
              />
            ))}

            {loading && <TypingIndicator />}

            {error && (
              <p className="text-xs text-red-400 text-center py-1 px-3 bg-gray-800 rounded-lg">
                {error}
              </p>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Quick suggestions */}
          {showSuggestions && !loading && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => { setInput(s); setTimeout(handleSend, 0); }}
                  className="text-xs px-2.5 py-1 rounded-full border border-primary-400 text-primary-400 hover:bg-primary-400 hover:text-gray-900 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 bg-white/5 border-t border-white/5 flex gap-2 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describí tu requerimiento técnico..."
              rows={1}
              disabled={loading}
              className="flex-1 resize-none rounded-2xl border border-white/10 bg-black/40 px-4 py-2 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-primary-400/50 transition-all disabled:opacity-50 max-h-24"
              style={{ lineHeight: '1.5' }}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="w-10 h-10 rounded-xl bg-primary-400 flex items-center justify-center hover:scale-105 transition-all disabled:opacity-30 disabled:grayscale flex-shrink-0 shadow-lg shadow-primary-400/20"
              aria-label="Enviar"
            >
              <FiSend size={16} className="text-black" />
            </button>
          </div>
        </div>
      )}

      {/* ── Floating toggle button ─────────────────────────────────────────── */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 bg-black ring-2 ring-primary-400 relative border border-white/10"
        aria-label={open ? 'Cerrar chat' : 'Abrir consultor digital'}
      >
        {open ? (
          <FiX size={24} color="white" />
        ) : (
          <RiRobot2Line size={28} className="text-primary-400" />
        )}

        {/* Unread badge */}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary-400 text-black text-[10px] font-black flex items-center justify-center border-2 border-black">
            {unread}
          </span>
        )}
      </button>
    </>
  );
}
