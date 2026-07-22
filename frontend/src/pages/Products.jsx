import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetProductsQuery, useGetCategoriesQuery } from '../services/productsApi';
import { useGetExchangeRateQuery } from '../services/settingsApi';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/auth/authSlice';
import { getCurrencyByRole } from '../utils/getPriceByRole';
import ProductCard from '../components/products/ProductCard';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import { HiAdjustments, HiX } from 'react-icons/hi';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Más recientes' },
  { value: 'popular', label: 'Más vendidos' },
  { value: 'price-asc', label: 'Menor precio' },
  { value: 'price-desc', label: 'Mayor precio' },
];

const Products = () => {
  const user = useSelector(selectCurrentUser);
  const { data: rateData } = useGetExchangeRateQuery();
  const displayCurrency = getCurrencyByRole(user?.role);
  const exchangeRate = rateData?.rate || 1000;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Solo permitir valores válidos para filtros
  const categoria = searchParams.get('categoria') || '';
  const search = searchParams.get('search') || '';
  const sort = ['newest','popular','price-asc','price-desc'].includes(searchParams.get('sort')) ? searchParams.get('sort') : 'newest';

  const { data, isFetching } = useGetProductsQuery(
    { page, limit: 12, categoria, search, sort, currency: displayCurrency, exchangeRate },
    {
      selectFromResult: ({ data, isFetching }) => ({ data, isFetching }),
    }
  );

  const { data: categories = [] } = useGetCategoriesQuery();


  // Referencia para filtros previos
  const filtersRef = React.useRef({ categoria, search, sort });

  // Resetear productos y página al cambiar filtros
  React.useEffect(() => {
    setPage(1);
    setAllProducts([]);
    filtersRef.current = { categoria, search, sort };
  }, [categoria, search, sort]);

  // Acumular productos solo si los filtros no cambiaron
  React.useEffect(() => {
    if (!data?.products) return;
    const filtrosActuales = { categoria, search, sort };
    const filtrosPrevios = filtersRef.current;
    if (
      filtrosPrevios.categoria !== categoria ||
      filtrosPrevios.search !== search ||
      filtrosPrevios.sort !== sort ||
      page === 1
    ) {
      setAllProducts(data.products);
      filtersRef.current = filtrosActuales;
    } else {
      setAllProducts((prev) => {
        const ids = new Set(prev.map((p) => p._id));
        const newOnes = data.products.filter((p) => !ids.has(p._id));
        return [...prev, ...newOnes];
      });
    }
  }, [data, page]);

  const hasMore = data ? page < data.pages : false;

  const loadMore = useCallback(() => {
    if (!isFetching && hasMore) setPage((p) => p + 1);
  }, [isFetching, hasMore]);

  const sentinelRef = useInfiniteScroll({ onVisible: loadMore, hasMore, loading: isFetching });

  // Solo permitir valores válidos y limpiar filtros
  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (key === 'sort' && !['newest','popular','price-asc','price-desc'].includes(value)) return;
    if (key === 'categoria' && value === '') params.delete('categoria');
    else if (value) params.set(key, value);
    else params.delete(key);
    // Al cambiar filtro, resetear paginado
    setPage(1);
    setAllProducts([]);
    setSearchParams(params);
  };

  return (
    <div className="bg-[#050505] min-h-screen pt-32 pb-24 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h1 className="text-5xl sm:text-7xl font-black italic tracking-tighter uppercase leading-[0.9] mb-4">
              {search ? (
                <>RESULTADOS: <br /><span className="text-primary-400 inline-block pb-1">"{search}"</span></>
              ) : (
                <>TECH <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400 inline-block pr-12 pb-4">MARKET</span></>
              )}
            </h1>
            {data && (
              <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] italic">{data.total} UNIDADES EN STOCK DISPONIBLE</p>
            )}
          </div>
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="md:hidden flex items-center justify-center gap-2 bg-white/5 border border-white/10 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs italic"
          >
            <HiAdjustments size={16} />
            Filtros del Sistema
          </button>
        </div>

      <div className="flex gap-6">
        {/* Sidebar filters */}
        <aside className={`w-56 flex-shrink-0 ${filtersOpen ? 'block' : 'hidden md:block'}`}>
          <div className="card p-4 sticky top-20 space-y-5">
            <div>
              <h3 className="font-semibold text-sm mb-3">Ordenar por</h3>
              <div className="space-y-1">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => updateFilter('sort', opt.value)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      sort === opt.value ? 'bg-primary-900 text-primary-300 font-medium' : 'hover:bg-gray-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {categories.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm mb-3">Categoría</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => updateFilter('categoria', '')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      !categoria ? 'bg-primary-900 text-primary-300 font-medium' : 'hover:bg-gray-800'
                    }`}
                  >
                    Todas
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => updateFilter('categoria', cat._id)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        categoria === cat._id ? 'bg-primary-900 text-primary-300 font-medium' : 'hover:bg-gray-800'
                      }`}
                    >
                      {cat.nombre}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(categoria || search) && (
              <button
                onClick={() => {
                  setSearchParams({});
                }}
                className="w-full flex items-center gap-2 text-red-500 text-sm hover:text-red-700"
              >
                <HiX size={14} /> Limpiar filtros
              </button>
            )}
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {allProducts.length === 0 && !isFetching ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg mb-2">No hay productos</p>
              <p className="text-sm">Intentá con otros filtros</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {allProducts.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
                {isFetching &&
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="card animate-pulse">
                      <div className="aspect-square bg-gray-800" />
                      <div className="p-3 space-y-2">
                        <div className="h-3 bg-gray-800 rounded" />
                        <div className="h-4 bg-gray-800 rounded w-3/4" />
                        <div className="h-4 bg-gray-800 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
              </div>
              {/* Sentinel for infinite scroll */}
              <div ref={sentinelRef} className="h-4" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
