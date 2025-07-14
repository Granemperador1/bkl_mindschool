import { useState, useCallback, useMemo } from 'react';

/**
 * Hook personalizado para manejar paginación
 * @param {Array} data - Array de datos a paginar
 * @param {number} itemsPerPage - Número de elementos por página
 * @returns {Object} - Objeto con funciones y estado de paginación
 */
export const usePagination = (data = [], itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calcular datos paginados
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage]);

  // Calcular información de paginación
  const paginationInfo = useMemo(() => {
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      startItem,
      endItem,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    };
  }, [data.length, currentPage, itemsPerPage]);

  // Ir a página específica
  const goToPage = useCallback((page) => {
    const totalPages = Math.ceil(data.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [data.length, itemsPerPage]);

  // Ir a la siguiente página
  const nextPage = useCallback(() => {
    if (paginationInfo.hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, paginationInfo.hasNextPage]);

  // Ir a la página anterior
  const prevPage = useCallback(() => {
    if (paginationInfo.hasPrevPage) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage, paginationInfo.hasPrevPage]);

  // Ir a la primera página
  const goToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  // Ir a la última página
  const goToLastPage = useCallback(() => {
    setCurrentPage(paginationInfo.totalPages);
  }, [paginationInfo.totalPages]);

  // Resetear a la primera página
  const resetPagination = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    // Datos paginados
    data: paginatedData,
    
    // Información de paginación
    pagination: paginationInfo,
    
    // Funciones de navegación
    goToPage,
    nextPage,
    prevPage,
    goToFirstPage,
    goToLastPage,
    resetPagination,
    
    // Estado actual
    currentPage,
  };
};

/**
 * Hook para paginación con API
 * @param {Function} fetchFunction - Función que hace la llamada a la API
 * @param {number} itemsPerPage - Número de elementos por página
 * @returns {Object} - Objeto con funciones y estado de paginación con API
 */
export const useApiPagination = (fetchFunction, itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalItems, setTotalItems] = useState(0);

  // Calcular información de paginación
  const paginationInfo = useMemo(() => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      startItem,
      endItem,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    };
  }, [totalItems, currentPage, itemsPerPage]);

  // Cargar datos de la página actual
  const loadPage = useCallback(async (page = currentPage) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetchFunction(page, itemsPerPage);
      
      if (response.data) {
        setData(response.data);
        setTotalItems(response.total || response.data.length);
      }
    } catch (err) {
      setError(err.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, currentPage, itemsPerPage]);

  // Ir a página específica
  const goToPage = useCallback(async (page) => {
    if (page >= 1 && page <= paginationInfo.totalPages) {
      setCurrentPage(page);
      await loadPage(page);
    }
  }, [paginationInfo.totalPages, loadPage]);

  // Ir a la siguiente página
  const nextPage = useCallback(async () => {
    if (paginationInfo.hasNextPage) {
      const nextPageNum = currentPage + 1;
      setCurrentPage(nextPageNum);
      await loadPage(nextPageNum);
    }
  }, [currentPage, paginationInfo.hasNextPage, loadPage]);

  // Ir a la página anterior
  const prevPage = useCallback(async () => {
    if (paginationInfo.hasPrevPage) {
      const prevPageNum = currentPage - 1;
      setCurrentPage(prevPageNum);
      await loadPage(prevPageNum);
    }
  }, [currentPage, paginationInfo.hasPrevPage, loadPage]);

  // Resetear paginación
  const resetPagination = useCallback(async () => {
    setCurrentPage(1);
    await loadPage(1);
  }, [loadPage]);

  return {
    // Datos y estado
    data,
    loading,
    error,
    
    // Información de paginación
    pagination: paginationInfo,
    
    // Funciones de navegación
    goToPage,
    nextPage,
    prevPage,
    resetPagination,
    loadPage,
    
    // Estado actual
    currentPage,
  };
}; 