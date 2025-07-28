import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { COLORS, FONTS } from "../theme/branding/branding";
import Mascota from "../theme/branding/Mascota";

// Componente para redirigir automáticamente según el rol del usuario
const RedireccionPorRol = () => {
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: COLORS.background,
          fontFamily: FONTS.main,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Mascota width={100} height={100} showVideo={true} />
          <div
            style={{
              marginTop: "20px",
              color: COLORS.textSecondary,
              fontSize: "1.1rem",
            }}
          >
            Cargando...
          </div>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return <Navigate to="/" replace />;
  }

  // Redirigir según el rol del usuario
  if (usuario.roles?.includes("admin")) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  if (usuario.roles?.includes("profesor")) {
    return <Navigate to="/profesor/dashboard" replace />;
  }
  if (usuario.roles?.includes("estudiante")) {
    return <Navigate to="/estudiante/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
};

export default RedireccionPorRol;
