import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// Componente para proteger rutas basándose en el rol del usuario
function RutaConRol({ children, rolesPermitidos, rutaRedireccion = "/" }) {
  const { usuario, cargando } = useContext(AuthContext);

  // Log para depuración de acceso y roles
  React.useEffect(() => {
    console.log("[RutaConRol] usuario:", usuario);
    console.log("[RutaConRol] usuario.roles:", usuario?.roles);
    console.log("[RutaConRol] rolesPermitidos:", rolesPermitidos);
  }, [usuario, rolesPermitidos]);

  if (cargando) {
    // Loader visual
    return (
      <div style={{
        minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center',
        fontSize: 24, color: '#2563eb', fontWeight: 700
      }}>
        Cargando...
        <span style={{
          marginLeft: 16,
          width: 32, height: 32, border: '4px solid #2563eb33', borderTop: '4px solid #2563eb', borderRadius: '50%',
          display: 'inline-block', animation: 'spin 1s linear infinite',
        }} />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`}</style>
      </div>
    );
  }

  // Si no hay usuario, redirigir al login
  if (!usuario) return <Navigate to="/login" replace />;

  // Si se especifican roles permitidos, verificar que el usuario tenga uno de esos roles
  if (rolesPermitidos && rolesPermitidos.length > 0) {
    if (!usuario.roles || usuario.roles.length === 0) {
      // Si el usuario está cargado pero no tiene roles, no mostrar nada (o loader)
      return null;
    }
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
