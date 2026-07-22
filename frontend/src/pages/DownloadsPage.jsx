import React from 'react';
import { useGetDownloadsQuery } from '../services/downloadApi';
import { HiOutlineDownload } from 'react-icons/hi';

const DownloadsPage = () => {
  const { data: downloads = [], isLoading, error } = useGetDownloadsQuery();

  return (
    <div className="min-h-screen bg-black pt-32 pb-24 text-white">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-20">
          <h1 className="text-5xl sm:text-7xl font-black italic tracking-tighter uppercase leading-[0.9] mb-6">
            CENTRO DE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400 inline-block pr-12 pb-4">DESCARGAS</span>
          </h1>
          <p className="text-gray-500 text-lg font-medium italic">Accede a todos nuestros recursos y documentos técnicos.</p>
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

        {/* Downloads List */}
        {!isLoading && downloads.length > 0 && (
          <div className="space-y-3">
            {downloads.map((download) => (
              <a
                key={download._id}
                href={download.enlace}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-gray-800 border border-gray-700 rounded-lg hover:border-primary-500 hover:bg-gray-750 transition-all group"
              >
                <div className="flex items-center gap-3 flex-1">
                  <HiOutlineDownload size={24} className="text-primary-500 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors">
                      {download.titulo}
                    </h3>
                    {download.descripcion && (
                      <p className="text-gray-400 text-sm">{download.descripcion}</p>
                    )}
                  </div>
                </div>
                <div className="text-primary-400 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-4">
                  →
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadsPage;
