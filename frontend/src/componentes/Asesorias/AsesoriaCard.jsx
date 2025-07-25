import React from 'react';

const AsesoriaCard = ({ asesoria, onJoin }) => {
  return (
    <div className="asesoria-card" style={{border: '1px solid #ccc', borderRadius: 8, padding: 16, marginBottom: 12}}>
      <p><strong>Profesor:</strong> {asesoria.profesorNombre || asesoria.profesor_id}</p>
      <p><strong>Estudiante:</strong> {asesoria.estudianteNombre || asesoria.estudiante_id}</p>
      <p><strong>Fecha:</strong> {asesoria.fecha_hora_inicio} - {asesoria.fecha_hora_fin}</p>
      <p><strong>Estado:</strong> {asesoria.estado}</p>
      {asesoria.enlace_videollamada && asesoria.estado === 'confirmada' && (
        <>
          <button onClick={() => onJoin(asesoria.enlace_videollamada)}>
            Unirse a la videollamada
          </button>
          <div style={{ marginTop: 8, fontSize: 13, color: '#2563eb', wordBreak: 'break-all' }}>
            <span style={{ fontWeight: 500 }}>Enlace:</span> <a href={asesoria.enlace_videollamada} target="_blank" rel="noopener noreferrer">{asesoria.enlace_videollamada}</a>
          </div>
        </>
      )}
    </div>
  );
};

export default AsesoriaCard; 