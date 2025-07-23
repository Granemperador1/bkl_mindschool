import api from '../../../utils/axiosConfig';

const AsesoriasServicio = {
  getDisponibilidadProfesor: (profesorId) =>
    api.get(`/asesorias/disponibilidad-profesor/${profesorId}`),

  definirDisponibilidad: (data) =>
    api.post('/asesorias/definir-disponibilidad', data),

  reservarAsesoria: (data) =>
    api.post('/asesorias/reservar', data),

  listarAsesorias: () =>
    api.get('/asesorias/mis-asesorias'),

  cancelarAsesoria: (asesoriaId) =>
    api.post(`/asesorias/cancelar/${asesoriaId}`),

  reprogramarAsesoria: (asesoriaId, data) =>
    api.post(`/asesorias/reprogramar/${asesoriaId}`, data),

  eliminarDisponibilidad: (bloqueId) =>
    api.delete(`/asesorias/disponibilidad/${bloqueId}`),
};

export default AsesoriasServicio; 