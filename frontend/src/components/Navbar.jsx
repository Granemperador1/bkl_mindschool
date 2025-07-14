import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  COLORS,
  FONTS,
  BORDER_RADIUS,
  SCHOOL_NAME,
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
  TRANSITIONS,
  SHADOWS,
} from "../theme/branding/branding";
import Logo from "../theme/branding/Logo";

const Navbar = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      admin: "Administrador",
      profesor: "Profesor",
      estudiante: "Estudiante",
    };
    return roleNames[role] || role;
  };

  const getDashboardPath = () => {
    if (!usuario) return "/login";
    const paths = {
      admin: "/admin/dashboard",
      profesor: "/profesor/dashboard",
      estudiante: "/estudiante/dashboard",
    };
    return paths[usuario.roles?.[0]] || "/dashboard";
  };

  // Agregar estilos y funciones para los enlaces de navegación
  const navLinkStyle = {
    color: COLORS.text,
    textDecoration: "none",
    fontWeight: FONT_WEIGHTS.medium,
    padding: `${SPACING[2]} ${SPACING[3]}`,
    borderRadius: BORDER_RADIUS.md,
    transition: TRANSITIONS.base,
    fontSize: FONT_SIZES.md,
  };
  const navLinkHover = (e) => {
    e.target.style.background = COLORS.surfaceHover;
    e.target.style.color = COLORS.primary;
  };
  const navLinkUnhover = (e) => {
    e.target.style.background = "transparent";
    e.target.style.color = COLORS.text;
  };

  return (
    <nav
      style={{
        background: COLORS.surface,
        border: `1.5px solid ${COLORS.border}`,
        padding: `${SPACING[4]} ${SPACING[10]}`,
        position: "sticky",
        top: 0,
        zIndex: 1000,
        fontFamily: FONTS.main,
        minHeight: 80,
        display: "flex",
        alignItems: "center",
        boxShadow: SHADOWS.lg,
        maxWidth: "1400px",
        margin: "32px auto 24px auto",
        borderRadius: "2.5rem",
        left: 0,
        right: 0,
        transition: "box-shadow 0.2s",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        {/* Logo y Nombre */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: SPACING[4],
          }}
        >
          <Link
            to={getDashboardPath()}
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              transition: TRANSITIONS.base,
            }}
          >
            <Logo width={90} height={54} style={{ filter: "none" }} />
          </Link>
        </div>

        {/* Navegación Desktop */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: SPACING[4],
          }}
        >
          {usuario && (
            <>
              <Link
                to={getDashboardPath()}
                style={navLinkStyle}
                onMouseEnter={navLinkHover}
                onMouseLeave={navLinkUnhover}
              >
                Dashboard
              </Link>
              {usuario.roles?.[0] === "admin" && (
                <>
                  <Link
                    to="/admin/usuarios"
                    style={navLinkStyle}
                    onMouseEnter={navLinkHover}
                    onMouseLeave={navLinkUnhover}
                  >
                    Usuarios
                  </Link>
                  <Link
                    to="/admin/cursos"
                    style={navLinkStyle}
                    onMouseEnter={navLinkHover}
                    onMouseLeave={navLinkUnhover}
                  >
                    Cursos
                  </Link>
                  <Link
                    to="/examenes"
                    style={navLinkStyle}
                    onMouseEnter={navLinkHover}
                    onMouseLeave={navLinkUnhover}
                  >
                    Exámenes
                  </Link>
                  <Link
                    to="/asistencias"
                    style={navLinkStyle}
                    onMouseEnter={navLinkHover}
                    onMouseLeave={navLinkUnhover}
                  >
                    Asistencias
                  </Link>
                  <Link
                    to="/recursos"
                    style={navLinkStyle}
                    onMouseEnter={navLinkHover}
                    onMouseLeave={navLinkUnhover}
                  >
                    Recursos
                  </Link>
                  <Link
                    to="/mensajes"
                    style={navLinkStyle}
                    onMouseEnter={navLinkHover}
                    onMouseLeave={navLinkUnhover}
                  >
                    Mensajes
                  </Link>
                </>
              )}
              {usuario.roles?.[0] === "profesor" && (
                <>
                  <Link
                    to="/profesor/cursos"
                    style={navLinkStyle}
                    onMouseEnter={navLinkHover}
                    onMouseLeave={navLinkUnhover}
                  >
                    Mis Cursos
                  </Link>
                  <Link
                    to="/profesor/pagos"
                    style={navLinkStyle}
                    onMouseEnter={navLinkHover}
                    onMouseLeave={navLinkUnhover}
                  >
                    Pagos
                  </Link>
                  <Link
                    to="/examenes"
                    style={navLinkStyle}
                    onMouseEnter={navLinkHover}
                    onMouseLeave={navLinkUnhover}
                  >
                    Exámenes
                  </Link>
                  <Link
                    to="/asistencias"
                    style={navLinkStyle}
                    onMouseEnter={navLinkHover}
                    onMouseLeave={navLinkUnhover}
                  >
                    Asistencias
                  </Link>
                  <Link
                    to="/recursos"
                    style={navLinkStyle}
                    onMouseEnter={navLinkHover}
                    onMouseLeave={navLinkUnhover}
                  >
                    Recursos
                  </Link>
                  <Link
                    to="/mensajes"
                    style={navLinkStyle}
                    onMouseEnter={navLinkHover}
                    onMouseLeave={navLinkUnhover}
                  >
                    Mensajes
                  </Link>
                </>
              )}
              {usuario.roles?.[0] === "estudiante" && (
                <>
                  <Link
                    to="/estudiante/cursos"
                    style={navLinkStyle}
                    onMouseEnter={navLinkHover}
                    onMouseLeave={navLinkUnhover}
                  >
                    Cursos Disponibles
                  </Link>
                  <Link
                    to="/estudiante/inscripciones"
                    style={navLinkStyle}
                    onMouseEnter={navLinkHover}
                    onMouseLeave={navLinkUnhover}
                  >
                    Mis Inscripciones
                  </Link>
                  <Link
                    to="/recursos"
                    style={navLinkStyle}
                    onMouseEnter={navLinkHover}
                    onMouseLeave={navLinkUnhover}
                  >
                    Recursos
                  </Link>
                  <Link
                    to="/mensajes"
                    style={navLinkStyle}
                    onMouseEnter={navLinkHover}
                    onMouseLeave={navLinkUnhover}
                  >
                    Mensajes
                  </Link>
                </>
              )}
            </>
          )}
        </div>

        {/* Perfil y Logout */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: SPACING[4],
          }}
        >
          {usuario && (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: SPACING[2],
                  padding: `${SPACING[2]} ${SPACING[4]}`,
                  background: COLORS.surfaceLight,
                  borderRadius: BORDER_RADIUS.full,
                  fontSize: FONT_SIZES.sm,
                  border: `1px solid ${COLORS.border}`,
                  transition: TRANSITIONS.base,
                }}
              >
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    background: COLORS.primary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: COLORS.white,
                    fontSize: FONT_SIZES.base,
                    fontWeight: FONT_WEIGHTS.bold,
                    transition: TRANSITIONS.base,
                  }}
                >
                  {usuario.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: FONT_WEIGHTS.semibold,
                      color: COLORS.text,
                      fontSize: FONT_SIZES.sm,
                    }}
                  >
                    {usuario.name}
                  </div>
                  <div
                    style={{
                      fontSize: FONT_SIZES.xs,
                      color: COLORS.primary,
                    }}
                  >
                    {getRoleDisplayName(usuario.roles?.[0])}
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  marginLeft: SPACING[4],
                  background: "none",
                  color: COLORS.error,
                  border: `1px solid ${COLORS.error}`,
                  borderRadius: BORDER_RADIUS.md,
                  padding: `${SPACING[2]} ${SPACING[4]}`,
                  fontSize: FONT_SIZES.sm,
                  fontWeight: FONT_WEIGHTS.medium,
                  cursor: "pointer",
                  transition: TRANSITIONS.base,
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = COLORS.error;
                  e.target.style.color = COLORS.text;
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.color = COLORS.error;
                }}
              >
                Cerrar Sesión
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
