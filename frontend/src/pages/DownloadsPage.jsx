import React from 'react';
import { useGetDownloadsQuery } from '../services/downloadApi';
import { HiOutlineDownload } from 'react-icons/hi';
import toast from 'react-hot-toast';

const DownloadsPage = () => {
  const { data: downloads = [], isLoading, error } = useGetDownloadsQuery();

  const handleDownload = (enlace) => {
    try {
      if (enlace.startsWith('http')) {
        window.open(enlace, '_blank');
      } else {
        const link = document.createElement('a');
        link.href = enlace;
        link.download = true;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      toast.success('Descarga iniciada');
    } catch (err) {
      toast.error('Error al descargar');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Centro de Descargas</h1>
          <p className="text-gray-400 text-lg">Accede a todos nuestros recursos y documentos</p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900/20 border border-red-700 text-red-400 px-6 py-4 rounded-lg text-center">
            Error al cargar las descargas
          </div>
        )}

        {/* Empty State */}
        {!isLoading && downloads.length === 0 && (
          <div className="text-center py-12">
            <HiOutlineDownload size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400">No hay descargas disponibles en este momento</p>
          </div>
        )}

        {/* Downloads Grid */}
        {!isLoading && downloads.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {downloads.map((download) => (
              <div
                key={download._id}
                className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-primary-500 transition-all hover:shadow-lg hover:shadow-primary-500/20"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{download.titulo}</h3>
                    {download.descripcion && (
                      <p className="text-gray-400 text-sm mb-4">{download.descripcion}</p>
                    )}
                  </div>
                  <HiOutlineDownload size={24} className="text-primary-500 flex-shrink-0 ml-4" />
                </div>

                <button
                  onClick={() => handleDownload(download.enlace)}
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold py-3 rounded-lg hover:from-primary-700 hover:to-primary-600 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  <HiOutlineDownload size={18} />
                  Descargar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadsPage;
