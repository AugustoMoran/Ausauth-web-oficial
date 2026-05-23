import React from 'react';
import MyRecommendations from '../components/recommendations/MyRecommendations';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/auth/authSlice';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const RecommendationsPage = () => {
  const user = useSelector(selectCurrentUser);

  return (
    <div className="min-h-screen bg-gray-900 py-8 md:py-12">
      <div className="container max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            to="/"
            className="flex items-center gap-1 text-gray-300 hover:text-white text-sm"
          >
            <HiOutlineArrowLeft size={16} />
            Volver
          </Link>
        </div>

        {/* Título */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Recomendaciones personalizadas
          </h1>
          <p className="text-gray-400 text-sm">
            Sugerencias especiales seleccionadas para ti
          </p>
        </div>

        {/* Contenido */}
        {user ? (
          <div>
            <MyRecommendations />
          </div>
        ) : (
          <div className="bg-blue-900 border border-blue-700 rounded-lg p-6 text-center">
            <p className="text-blue-200 mb-4">Debes estar logueado para ver tus recomendaciones</p>
            <Link
              to="/login"
              className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded font-medium transition-colors"
            >
              Ir a Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationsPage;
