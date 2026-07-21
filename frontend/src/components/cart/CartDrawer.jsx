import React from 'react';
import { useDispatch } from 'react-redux';
import { HiX, HiOutlineTrash, HiOutlineShoppingBag } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { closeCart, selectCartIsOpen } from '../../features/cart/cartSlice';
import { useSelector } from 'react-redux';
import useCart from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatCurrency';
import { getCurrencyByRole, getPriceByRole } from '../../utils/getPriceByRole';
import { useGetExchangeRateQuery } from '../../services/settingsApi';
import { selectCurrentUser } from '../../features/auth/authSlice';

const CartDrawer = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectCartIsOpen);
  const { items, removeFromCart, updateQuantity, clearCart } = useCart();
  const user = useSelector(selectCurrentUser);
  const { data: rateData } = useGetExchangeRateQuery();
  const exchangeRate = rateData?.rate || 1000;
  const userCurrency = getCurrencyByRole(user?.role);

  const cartTotal = items.reduce((sum, item) => {
    const price = getPriceByRole(item.producto, user?.role, exchangeRate);
    return sum + price * item.cantidad;
  }, 0);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => dispatch(closeCart())}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-gray-900 z-50 shadow-2xl flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <HiOutlineShoppingBag size={20} />
            <span className="font-bold text-lg">Consultas</span>
            {items.length > 0 && (
              <span className="badge bg-primary-100 text-black">{items.length}</span>
            )}
          </div>
          <button onClick={() => dispatch(closeCart())} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400">
            <HiX size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 gap-3">
              <HiOutlineShoppingBag size={48} className="opacity-30" />
              <p className="text-sm">No tienes consultas pendientes</p>
              <Link
                to="/proyectos"
                onClick={() => dispatch(closeCart())}
                className="btn-primary text-sm bg-primary-400 text-black"
              >
                Explorar Soluciones
              </Link>
            </div>
          ) : (
            <>
              <ul className="space-y-4 text-white">
                {items.map((item) => {
                  const producto = item.producto;
                  const id = producto?._id || producto;
                  const price = getPriceByRole(producto, user?.role, exchangeRate);
                  const imagen = producto?.imagenes?.[0]?.url || '';
                  const nombre = producto?.nombre || item.nombre || 'Proyecto sin nombre';

                  return (
                    <li key={id} className="flex gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                        {imagen && <img src={imagen} alt={nombre} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2 mb-1">{nombre}</p>
                        <div className="text-xs text-gray-500 mb-2 space-y-0.5">
                          <p>{userCurrency === 'USD' ? `USD $${price.toFixed(2)}` : formatCurrency(price)} c/u</p>
                          {item.talla && <p>Talla: <span className="font-medium">{item.talla}</span></p>}
                          {item.color && <p>Color: <span className="font-medium">{item.color}</span></p>}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(id, item.cantidad - 1, item.talla, item.color)}
                            className="w-6 h-6 rounded-full border border-gray-700 flex items-center justify-center text-sm hover:bg-white/10"
                          >
                            -
                          </button>
                          <span className="text-sm font-medium w-5 text-center">{item.cantidad}</span>
                          <button
                            onClick={() => updateQuantity(id, item.cantidad + 1, item.talla, item.color)}
                            className="w-6 h-6 rounded-full border border-gray-700 flex items-center justify-center text-sm hover:bg-white/10"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => removeFromCart(id, item.talla, item.color)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        >
                          <HiOutlineTrash size={16} />
                        </button>
                        <span className="text-sm font-bold">{userCurrency === 'USD' ? `USD $${(price * item.cantidad).toFixed(2)}` : formatCurrency(price * item.cantidad)}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-100/10 space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-500 text-sm italic uppercase tracking-widest">Presupuesto Estimado</span>
                <span className="font-bold text-xl text-primary-400">
                  {userCurrency === 'USD' ? `USD $${cartTotal.toFixed(2)}` : formatCurrency(cartTotal)}
                </span>
              </div>
            </div>
            <Link
              to="/checkout"
              onClick={() => dispatch(closeCart())}
              className="btn-primary block text-center w-full bg-primary-400 text-black font-black uppercase tracking-widest py-4 rounded-xl"
            >
              Confirmar Solicitud
            </Link>
            <button
              onClick={() => clearCart()}
              className="w-full py-2 px-4 rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors font-bold text-xs uppercase tracking-widest"
            >
              Borrar todo
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
