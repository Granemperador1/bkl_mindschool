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
import { FaBars, FaTimes, FaBell, FaUserCircle, FaCog, FaSignOutAlt, FaUserEdit, FaKey } from "react-icons/fa";
import useNotificaciones from '../hooks/useNotificaciones';

const Navbar = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const {
    notificaciones,
    loading: loadingNotificaciones,
    error: errorNotificaciones,
    cargar: cargarNotificaciones,
    marcarLeida,
    eliminar: eliminarNotificacion,
  } = useNotificaciones();

  // Ejemplo de notificaciones simuladas
  const notifications = [
    { id: 1, text: "Tienes una nueva tarea asignada", read: false },
    { id: 2, text: "Tu profesor comentó tu entrega", read: true },
    { id: 3, text: "Nueva calificación disponible", read: false },
  ];

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

  // Abrir panel de notificaciones y cargar si no se ha hecho
  const handleOpenNotifications = () => {
    setShowNotifications((v) => !v);
    if (!showNotifications) cargarNotificaciones();
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

        {/* Botón hamburguesa para móvil */}
        <button
          className="navbar-hamburger"
          onClick={() => setIsMenuOpen(true)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            fontSize: 32,
            color: COLORS.primary,
            cursor: "pointer",
            marginLeft: 12,
            zIndex: 1201,
          }}
          aria-label="Abrir menú"
        >
          <FaBars />
        </button>

        {/* Navegación Desktop */}
        <div
          className="navbar-links"
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
                    to="/profesor/mensajes"
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
                    to="/cursos"
                    style={navLinkStyle}
                    onMouseEnter={navLinkHover}
                    onMouseLeave={navLinkUnhover}
                  >
                    Cursos Disponibles
                  </Link>
                  <Link
                    to="/inscripciones"
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

        {/* Usuario, Notificaciones y Perfil (solo desktop) */}
        {usuario && (
          <div className="navbar-user-block" style={{ display: "flex", alignItems: "center", gap: 12, position: "relative" }}>
            {/* Notificaciones */}
            <button
              onClick={handleOpenNotifications}
              style={{
                background: "none",
                border: "none",
                fontSize: 26,
                color: COLORS.primary,
                cursor: "pointer",
                position: "relative",
              }}
              aria-label="Ver notificaciones"
            >
              <FaBell />
              {/* Indicador de notificaciones no leídas */}
              {notificaciones.some((n) => !n.read_at) && (
                <span style={{
                  position: "absolute",
                  top: 2,
                  right: 2,
                  width: 10,
                  height: 10,
                  background: COLORS.error,
                  borderRadius: "50%",
                  border: "2px solid #fff",
                  display: "inline-block",
                }} />
              )}
            </button>
            {/* Panel de notificaciones */}
            {showNotifications && (
              <div style={{
                position: "absolute",
                top: 38,
                right: 0,
                background: COLORS.surface,
                boxShadow: SHADOWS.lg,
                borderRadius: BORDER_RADIUS.lg,
                minWidth: 260,
                zIndex: 2000,
                padding: "12px 0",
                maxHeight: 340,
                overflowY: "auto",
              }}>
                <div style={{ fontWeight: 700, padding: "0 16px 8px 16px", color: COLORS.primary, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  Notificaciones
                  <button onClick={cargarNotificaciones} style={{ background: 'none', border: 'none', color: COLORS.primary, fontSize: 18, cursor: 'pointer' }} title="Refrescar">⟳</button>
                </div>
                {loadingNotificaciones && <div style={{ padding: '8px 16px', color: COLORS.textSecondary }}>Cargando...</div>}
                {errorNotificaciones && <div style={{ padding: '8px 16px', color: COLORS.error }}>Error al cargar</div>}
                {notificaciones.length === 0 && !loadingNotificaciones && (
                  <div style={{ padding: "8px 16px", color: COLORS.textSecondary }}>Sin notificaciones</div>
                )}
                {notificaciones.map((n) => (
                  <div key={n.id} style={{
                    padding: "8px 16px",
                    background: n.read_at ? "none" : COLORS.surfaceLight,
                    color: n.read_at ? COLORS.textSecondary : COLORS.text,
                    fontWeight: n.read_at ? 400 : 600,
                    borderLeft: n.read_at ? "none" : `3px solid ${COLORS.primary}`,
                    cursor: "pointer",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                  }}>
                    <span onClick={() => !n.read_at && marcarLeida(n.id)} style={{ flex: 1 }}>{n.data?.mensaje || n.data?.text || n.data || 'Notificación'}</span>
                    <button onClick={() => eliminarNotificacion(n.id)} style={{ background: 'none', border: 'none', color: COLORS.error, fontSize: 16, cursor: 'pointer' }} title="Eliminar">✕</button>
                  </div>
                ))}
              </div>
            )}
            {/* Menú de perfil/configuración */}
            <button
              onClick={() => setShowProfileMenu((v) => !v)}
              style={{
                background: "none",
                border: "none",
                fontSize: 28,
                color: COLORS.primary,
                cursor: "pointer",
                borderRadius: "50%",
                marginLeft: 6,
              }}
              aria-label="Abrir menú de perfil"
            >
              <FaUserCircle />
            </button>
            {showProfileMenu && (
              <div style={{
                position: "absolute",
                top: 38,
                right: 0,
                background: COLORS.surface,
                boxShadow: SHADOWS.lg,
                borderRadius: BORDER_RADIUS.lg,
                minWidth: 200,
                zIndex: 2000,
                padding: "10px 0",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}>
                <div style={{ padding: "8px 18px", fontWeight: 700, color: COLORS.primary }}>{usuario.name}</div>
                <Link to="/perfil" style={{ ...navLinkStyle, display: "flex", alignItems: "center", gap: 8 }} onClick={() => setShowProfileMenu(false)}><FaUserEdit /> Editar perfil</Link>
                <Link to="/configuracion" style={{ ...navLinkStyle, display: "flex", alignItems: "center", gap: 8 }} onClick={() => setShowProfileMenu(false)}><FaCog /> Configuración</Link>
                <Link to="/cambiar-password" style={{ ...navLinkStyle, display: "flex", alignItems: "center", gap: 8 }} onClick={() => setShowProfileMenu(false)}><FaKey /> Cambiar contraseña</Link>
                <button onClick={handleLogout} style={{ ...navLinkStyle, color: COLORS.error, display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", fontWeight: 700, marginTop: 8 }}><FaSignOutAlt /> Cerrar sesión</button>
              </div>
            )}
          </div>
        )}

        {/* Menú lateral para móvil */}
        {isMenuOpen && (
          <div
            className="navbar-side-menu"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "78vw",
              maxWidth: 320,
              height: "100vh",
              background: COLORS.surface,
              boxShadow: "2px 0 16px #0005",
              zIndex: 1200,
              display: "flex",
              flexDirection: "column",
              padding: "32px 18px 18px 18px",
              transition: "transform 0.3s cubic-bezier(.4,2,.6,1)",
              transform: isMenuOpen ? "translateX(0)" : "translateX(-100%)",
            }}
          >
            <button
              onClick={() => setIsMenuOpen(false)}
              style={{
                background: "none",
                border: "none",
                fontSize: 32,
                color: COLORS.primary,
                alignSelf: "flex-end",
                marginBottom: 18,
                cursor: "pointer",
              }}
              aria-label="Cerrar menú"
            >
              <FaTimes />
            </button>
            {/* Enlaces de navegación (igual que en desktop) */}
            {usuario && (
              <>
                <Link to={getDashboardPath()} style={navLinkStyle} onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                </Link>
                {usuario.roles?.[0] === "admin" && (
                  <>
                    <Link to="/admin/usuarios" style={navLinkStyle} onClick={() => setIsMenuOpen(false)}>
                      Usuarios
                    </Link>
                    <Link to="/admin/cursos" style={navLinkStyle} onClick={() => setIsMenuOpen(false)}>
                      Cursos
                    </Link>
                    <Link to="/examenes" style={navLinkStyle} onClick={() => setIsMenuOpen(false)}>
                      Exámenes
                    </Link>
                    <Link to="/asistencias" style={navLinkStyle} onClick={() => setIsMenuOpen(false)}>
                      Asistencias
                    </Link>
                    <Link to="/recursos" style={navLinkStyle} onClick={() => setIsMenuOpen(false)}>
                      Recursos
                    </Link>
                    <Link to="/mensajes" style={navLinkStyle} onClick={() => setIsMenuOpen(false)}>
                      Mensajes
                    </Link>
                  </>
                )}
                {usuario.roles?.[0] === "profesor" && (
                  <>
                    <Link to="/profesor/cursos" style={navLinkStyle} onClick={() => setIsMenuOpen(false)}>
                      Mis Cursos
                    </Link>
                    <Link to="/profesor/pagos" style={navLinkStyle} onClick={() => setIsMenuOpen(false)}>
                      Pagos
                    </Link>
                    <Link to="/profesor/mensajes" style={navLinkStyle} onClick={() => setIsMenuOpen(false)}>
                      Mensajes
                    </Link>
                  </>
                )}
                {usuario.roles?.[0] === "estudiante" && (
                  <>
                    <Link to="/cursos" style={navLinkStyle} onClick={() => setIsMenuOpen(false)}>
                      Cursos Disponibles
                    </Link>
                    <Link to="/inscripciones" style={navLinkStyle} onClick={() => setIsMenuOpen(false)}>
                      Mis Inscripciones
                    </Link>
                    <Link to="/recursos" style={navLinkStyle} onClick={() => setIsMenuOpen(false)}>
                      Recursos
                    </Link>
                    <Link to="/mensajes" style={navLinkStyle} onClick={() => setIsMenuOpen(false)}>
                      Mensajes
                    </Link>
                  </>
                )}
                {/* Bloque de usuario, notificaciones y perfil en móvil */}
                <div style={{ marginTop: 32, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10 }}>
                  {/* Notificaciones */}
                  <div style={{ width: "100%" }}>
                    <div style={{ fontWeight: 700, color: COLORS.primary, marginBottom: 6 }}><FaBell style={{ marginRight: 6 }} /> Notificaciones</div>
                    {notifications.length === 0 && (
                      <div style={{ color: COLORS.textSecondary, fontSize: 15 }}>Sin notificaciones</div>
                    )}
                    {notifications.map((n) => (
                      <div key={n.id} style={{
                        padding: "6px 0",
                        background: n.read ? "none" : COLORS.surfaceLight,
                        color: n.read ? COLORS.textSecondary : COLORS.text,
                        fontWeight: n.read ? 400 : 600,
                        borderLeft: n.read ? "none" : `3px solid ${COLORS.primary}`,
                        cursor: "pointer",
                        fontSize: 15,
                      }}>
                        {n.text}
                      </div>
                    ))}
                  </div>
                  {/* Menú de perfil/configuración */}
                  <div style={{ width: "100%", marginTop: 12 }}>
                    <div style={{ fontWeight: 700, color: COLORS.primary, marginBottom: 6 }}><FaUserCircle style={{ marginRight: 6 }} /> Perfil</div>
                    <Link to="/perfil" style={{ ...navLinkStyle, display: "flex", alignItems: "center", gap: 8 }} onClick={() => setIsMenuOpen(false)}><FaUserEdit /> Editar perfil</Link>
                    <Link to="/configuracion" style={{ ...navLinkStyle, display: "flex", alignItems: "center", gap: 8 }} onClick={() => setIsMenuOpen(false)}><FaCog /> Configuración</Link>
                    <Link to="/cambiar-password" style={{ ...navLinkStyle, display: "flex", alignItems: "center", gap: 8 }} onClick={() => setIsMenuOpen(false)}><FaKey /> Cambiar contraseña</Link>
                    <button onClick={handleLogout} style={{ ...navLinkStyle, color: COLORS.error, display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", fontWeight: 700, marginTop: 8 }}><FaSignOutAlt /> Cerrar sesión</button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      {/* Estilos responsivos */}
      <style>{`
        @media (max-width: 900px) {
          .navbar-links {
            display: none !important;
          }
          .navbar-hamburger {
            display: block !important;
          }
          .navbar-user-block {
            display: none !important;
          }
        }
        @media (min-width: 901px) {
          .navbar-side-menu {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
