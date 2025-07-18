import axios from '../utils/axiosConfig';

export const obtenerPerfil = () => axios.get('/perfil');
export const actualizarPerfil = (data) => axios.put('/perfil', data);
export const cambiarPassword = (data) => axios.put('/perfil/password', data);
export const actualizarConfiguracion = (data) => axios.put('/perfil/configuracion', data); 