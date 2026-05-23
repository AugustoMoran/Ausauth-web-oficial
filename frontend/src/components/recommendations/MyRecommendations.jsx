import React from 'react';
import { useGetMyRecommendationsQuery, useRejectRecommendationMutation } from '../../services/recommendationApi';
import { HiOutlineTrash, HiSparkles, HiOutlineShoppingCart } from 'react-icons/hi';
import { useAddToCartMutation } from '../../services/cartApi';
import toast from 'react-hot-toast';

const MyRecommendations = () => {
  const { data, isLoading, error, refetch } = useGetMyRecommendationsQuery();
  const [rejectRecommendation] = useRejectRecommendationMutation();
  const [addToCart] = useAddToCartMutation();

  const recommendations = data?.recommendations || [];

  const handleAddToCart = async (productId) => {
    try {
      await addToCart({
        productoId: productId,
        cantidad: 1,
      }).unwrap();
      toast.success('Producto agregado al carrito');
    } catch (err) {
      toast.error(err?.data?.message || 'Error al agregar al carrito');
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectRecommendation(id).unwrap();
      toast.success('Recomendación rechazada');
      refetch();
    } catch (err) {
      toast.error('Error al rechazar');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900 border border-red-700 rounded-lg p-4 text-red-200">
        Error al cargar recomendaciones
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="text-center py-12">
        <HiSparkles className="w-12 h-12 text-gray-600 mx-auto mb-3" />
        <p className="text-gray-400 text-sm">No tienes recomendaciones aún</p>
        <p className="text-gray-500 text-xs mt-1">El equipo te enviará sugerencias personalizadas aquí</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <HiSparkles className="w-5 h-5 text-primary-400" />
        <h2 className="text-lg font-semibold text-white">Recomendaciones para ti</h2>
        <span className="ml-auto text-sm text-gray-400">
          {recommendations.length} {recommendations.length === 1 ? 'recomendación' : 'recomendaciones'}
        </span>
      </div>

      {recommendations.map((rec) => (
        <div
          key={rec._id}
          className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          {/* Header con mensaje */}
          {rec.message && (
            <div className="mb-3 pb-3 border-b border-gray-700">
              <p className="text-sm text-gray-300">
                <span className="font-semibold text-white">Mensaje:</span> {rec.message}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                De: {rec.createdBy?.nombre || 'Equipo'}
              </p>
            </div>
          )}

          {/* Productos */}
          <div className="space-y-3">
            {rec.productIds && rec.productIds.map((product) => (
              <div
                key={product._id}
                className="flex items-center justify-between bg-gray-700 p-3 rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white text-sm truncate">
                    {product.nombre}
                  </h3>
                  <p className="text-primary-400 font-semibold text-sm mt-1">
                    ${product.priceUSD || product.precio}
                  </p>
                </div>

                {/* Botones */}
                <div className="flex items-center gap-2 ml-3">
                  <button
                    onClick={() => handleAddToCart(product._id)}
                    className="flex items-center gap-1 bg-primary-500 hover:bg-primary-600 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors"
                    title="Agregar al carrito"
                  >
                    <HiOutlineShoppingCart size={14} />
                    Agregar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer con acciones */}
          <div className="mt-3 pt-3 border-t border-gray-700 flex justify-end">
            <button
              onClick={() => handleReject(rec._id)}
              className="flex items-center gap-1 text-gray-400 hover:text-red-400 text-xs transition-colors"
            >
              <HiOutlineTrash size={14} />
              No interesa
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyRecommendations;
