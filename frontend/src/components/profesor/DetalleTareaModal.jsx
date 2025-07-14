import React from "react";

const DetalleTareaModal = ({ open, onClose }) => {
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
        <h2>Detalle de Tarea</h2>
        <div style={{ marginBottom: 16 }}>
          <strong>Título:</strong> Proyecto Final
          <br />
          <strong>Descripción:</strong> Desarrollar una app web.
          <br />
          <strong>Fecha de entrega:</strong> 15/12/2023
          <br />
          <strong>Estado:</strong> Por calificar
          <br />
        </div>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default DetalleTareaModal;
