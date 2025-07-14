import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// Componente para proteger rutas basándose en el rol del usuario
function RutaConRol({ children, rolesPermitidos, rutaRedireccion = "/" }) {
  const { usuario, cargando } = useContext(AuthContext);

  if (cargando) return null; // O un loader

  // Si no hay usuario, redirigir al login
  if (!usuario) return <Navigate to="/login" replace />;

  // Si se especifican roles permitidos, verificar que el usuario tenga uno de esos roles
  if (rolesPermitidos && rolesPermitidos.length > 0) {
    const tieneRolPermitido = rolesPermitidos.some(
      (rol) => usuario.roles && usuario.roles.includes(rol),
    );

    if (!tieneRolPermitido) {
      return <Navigate to={rutaRedireccion} replace />;
    }
  }

  return children;
}

export default RutaConRol;
