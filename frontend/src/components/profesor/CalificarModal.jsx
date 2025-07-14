import React from "react";

const CalificarModal = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.7)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#222",
          borderRadius: 12,
          padding: 32,
          minWidth: 320,
          maxWidth: 400,
        }}
      >
        <h2>Calificar Tarea</h2>
        <form>
          <div style={{ marginBottom: 16 }}>
            <label>Alumno</label>
            <input type="text" style={{ width: "100%" }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>Calificación</label>
            <input
              type="number"
              min="0"
              max="10"
              step="0.1"
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>Comentarios</label>
            <textarea style={{ width: "100%" }} />
          </div>
          <button type="submit">Guardar</button>
          <button type="button" onClick={onClose} style={{ marginLeft: 8 }}>
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default CalificarModal;
