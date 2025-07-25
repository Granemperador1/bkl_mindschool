import { useState, useCallback, useEffect } from 'react';
import NotificacionesServicio from '../servicios/NotificacionesServicio';

export default function useNotificaciones() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await NotificacionesServicio.listar();
      setNotificaciones(res.data.data || []);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar(); // Carga inicial
    const interval = setInterval(() => {
      cargar();
    }, 10000); // 10 segundos (antes 30s)
    return () => clearInterval(interval);
  }, [cargar]);

  const marcarLeida = async (id) => {
    try {
      await NotificacionesServicio.marcarLeida(id);
      setNotificaciones((prev) => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
    } catch (e) {
      setError(e);
    }
  };

  const marcarTodasLeidas = async () => {
    try {
      await NotificacionesServicio.marcarTodasLeidas();
      setNotificaciones((prev) => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
    } catch (e) {
      setError(e);
    }
  };

  const eliminar = async (id) => {
    try {
      await NotificacionesServicio.eliminar(id);
      setNotificaciones((prev) => prev.filter(n => n.id !== id));
    } catch (e) {
      setError(e);
    }
  };

  return {
    notificaciones,
    loading,
    error,
    cargar,
    marcarLeida,
    marcarTodasLeidas,
    eliminar,
  };
} 