import api from '../utils/axiosConfig';

const NotificacionesServicio = {
  listar: () => api.get('/notificaciones'),
  marcarLeida: (id) => api.post(`/notificaciones/${id}/leer`),
  marcarTodasLeidas: () => api.post('/notificaciones/leertodas'),
  eliminar: (id) => api.delete(`/notificaciones/${id}`),
};

export default NotificacionesServicio; 