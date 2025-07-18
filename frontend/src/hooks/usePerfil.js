import { useState } from 'react';
import * as PerfilServicio from '../servicios/PerfilServicio';

export function usePerfil() {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPerfil = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await PerfilServicio.obtenerPerfil();
      setPerfil(res.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al obtener perfil');
    } finally {
      setLoading(false);
    }
  };

  const editarPerfil = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await PerfilServicio.actualizarPerfil(data);
      setPerfil(res.data.data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Error al actualizar perfil');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cambiarContrasena = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await PerfilServicio.cambiarPassword(data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cambiar contraseña');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const guardarConfiguracion = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await PerfilServicio.actualizarConfiguracion(data);
      setPerfil((prev) => ({ ...prev, configuracion: res.data.data }));
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar configuración');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    perfil,
    loading,
    error,
    fetchPerfil,
    editarPerfil,
    cambiarContrasena,
    guardarConfiguracion,
  };
} 