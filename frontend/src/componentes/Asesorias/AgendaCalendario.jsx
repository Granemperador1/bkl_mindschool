import React from 'react';

const AgendaCalendario = ({ disponibilidad, onSelectSlot, mostrarSeleccion = true }) => {
  return (
    <div style={{
      background: '#17213a',
      borderRadius: 16,
      boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
      padding: '32px 24px',
      marginBottom: 32,
      maxWidth: 700,
      width: '100%',
    }}>
      <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 26, marginBottom: 24 }}>Agenda</h3>
      {disponibilidad && disponibilidad.length > 0 ? (
        <table style={{width: '100%', borderCollapse: 'separate', borderSpacing: '0 18px'}}>
          <thead>
            <tr style={{ background: 'transparent' }}>
              <th style={{ color: '#b0b8c1', fontWeight: 700, fontSize: 18, padding: '10px 8px', textAlign: 'left' }}>Día</th>
              <th style={{ color: '#b0b8c1', fontWeight: 700, fontSize: 18, padding: '10px 8px', textAlign: 'left' }}>Hora inicio</th>
              <th style={{ color: '#b0b8c1', fontWeight: 700, fontSize: 18, padding: '10px 8px', textAlign: 'left' }}>Hora fin</th>
              <th style={{ color: '#b0b8c1', fontWeight: 700, fontSize: 18, padding: '10px 8px', textAlign: 'right' }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {disponibilidad.map((slot, idx) => (
              <tr key={slot.id || idx} style={{ background: '#1e2947', borderRadius: 12, boxShadow: '0 2px 8px #0002' }}>
                <td style={{ color: '#fff', fontSize: 17, padding: '12px 8px', borderRadius: '12px 0 0 12px' }}>{slot.dia_semana}</td>
                <td style={{ color: '#fff', fontSize: 17, padding: '12px 8px' }}>{slot.hora_inicio}</td>
                <td style={{ color: '#fff', fontSize: 17, padding: '12px 8px' }}>{slot.hora_fin}</td>
                <td style={{ textAlign: 'right', padding: '12px 8px', borderRadius: '0 12px 12px 0' }}>
                  {mostrarSeleccion && (
                    <button
                      onClick={() => onSelectSlot(slot)}
                      style={{
                        background: '#2563eb',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 10,
                        padding: '10px 28px',
                        fontWeight: 700,
                        fontSize: 16,
                        boxShadow: '0 2px 8px #2563eb33',
                        cursor: 'pointer',
                        transition: 'background 0.18s, box-shadow 0.18s',
                        outline: 'none',
                      }}
                      onMouseEnter={e => e.target.style.background = '#1d4ed8'}
                      onMouseLeave={e => e.target.style.background = '#2563eb'}
                    >
                      Seleccionar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ color: '#b0b8c1', fontSize: 17, textAlign: 'center', margin: '32px 0' }}>No hay disponibilidad.</p>
      )}
    </div>
  );
};

export default AgendaCalendario; 