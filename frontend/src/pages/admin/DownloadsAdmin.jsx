import React, { useState } from 'react';
import { useGetDownloadsQuery, useCreateDownloadMutation, useUpdateDownloadMutation, useDeleteDownloadMutation } from '../../services/downloadApi';
import toast from 'react-hot-toast';
import { HiOutlineTrash, HiOutlinePencilAlt, HiOutlinePlus } from 'react-icons/hi';

const DownloadsAdmin = () => {
  const { data: downloads = [], isLoading } = useGetDownloadsQuery();
  const [createDownload] = useCreateDownloadMutation();
  const [updateDownload] = useUpdateDownloadMutation();
  const [deleteDownload] = useDeleteDownloadMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    enlace: '',
    descripcion: '',
    isActive: true,
    orden: 0,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.titulo.trim() || !formData.enlace.trim()) {
      toast.error('Título y enlace son requeridos');
      return;
    }

    try {
      if (editingId) {
        await updateDownload({ id: editingId, ...formData }).unwrap();
        toast.success('Descarga actualizada');
      } else {
        await createDownload(formData).unwrap();
        toast.success('Descarga creada');
      }
      
      resetForm();
    } catch (error) {
      toast.error(error?.data?.message || 'Error al guardar descarga');
    }
  };

  const handleEdit = (download) => {
    setFormData(download);
    setEditingId(download._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta descarga?')) return;
    
    try {
      await deleteDownload(id).unwrap();
      toast.success('Descarga eliminada');
    } catch (error) {
      toast.error('Error al eliminar descarga');
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      enlace: '',
      descripcion: '',
      isActive: true,
      orden: 0,
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Gestión de Descargas</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white px-4 py-2 rounded-lg hover:from-primary-700 hover:to-primary-600 transition-all"
        >
          <HiOutlinePlus size={20} />
          Nueva Descarga
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            {editingId ? 'Editar Descarga' : 'Nueva Descarga'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Título *</label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Ej: Catálogo de productos"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Orden</label>
                <input
                  type="number"
                  value={formData.orden}
                  onChange={(e) => setFormData({ ...formData, orden: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Enlace *</label>
              <input
                type="text"
                value={formData.enlace}
                onChange={(e) => setFormData({ ...formData, enlace: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Ej: https://ejemplo.com/archivo.pdf"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Descripción (opcional)</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Descripción corta de la descarga"
                rows={3}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <label htmlFor="isActive" className="ml-2 text-sm text-gray-300">
                Activo
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-primary-600 text-white font-semibold py-2 rounded-lg hover:bg-primary-700 transition-all"
              >
                {editingId ? 'Actualizar' : 'Crear'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-gray-700 text-gray-300 font-semibold py-2 rounded-lg hover:bg-gray-600 transition-all"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary-500"></div>
        </div>
      )}

      {/* Downloads Table */}
      {!isLoading && downloads.length > 0 && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-900 border-b border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Título</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Descripción</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Orden</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Estado</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {downloads.map((download) => (
                <tr key={download._id} className="hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 text-white font-medium">{download.titulo}</td>
                  <td className="px-6 py-4 text-gray-400 text-sm truncate">
                    {download.descripcion || '—'}
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{download.orden}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        download.isActive
                          ? 'bg-green-900/30 text-green-400'
                          : 'bg-red-900/30 text-red-400'
                      }`}
                    >
                      {download.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-3">
                    <button
                      onClick={() => handleEdit(download)}
                      className="text-primary-400 hover:text-primary-300 transition-colors"
                      title="Editar"
                    >
                      <HiOutlinePencilAlt size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(download._id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                      title="Eliminar"
                    >
                      <HiOutlineTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && downloads.length === 0 && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
          <p className="text-gray-400 mb-4">No hay descargas registradas</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-all"
          >
            <HiOutlinePlus size={18} />
            Crear primera descarga
          </button>
        </div>
      )}
    </div>
  );
};

export default DownloadsAdmin;
