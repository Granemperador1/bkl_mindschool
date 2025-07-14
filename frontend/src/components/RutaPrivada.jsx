import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// Componente para proteger rutas privadas
function RutaPrivada({ children }) {
  const { usuario, cargando } = useContext(AuthContext);

  if (cargando) return null; // O un loader
  if (!usuario) return <Navigate to="/login" replace />;
  return children;
}

export default RutaPrivada;
