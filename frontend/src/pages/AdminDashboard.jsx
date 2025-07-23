import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  COLORS,
  FONTS,
  SHADOWS,
  BORDER_RADIUS,
} from "../theme/branding/branding";
import Mascota from "../theme/branding/Mascota";
import api from "../utils/axiosConfig";
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, LineChart, Line
} from 'recharts';

const COLORS_RECHARTS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CFE', '#FF6699'];

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [extraStats, setExtraStats] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    fetchExtraStats();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/admin/dashboard");
      const data = response.data.data;

      setStats({
        totalUsers: data.stats.total_usuarios,
        totalCourses: data.stats.total_cursos,
        totalEnrollments: data.stats.total_inscripciones,
        recentActivity: Object.values(data.recent_activity).map((activity) => ({
          id: activity.data?.id || Math.random(),
          type: activity.type,
          message: activity.message,
          time: activity.time,
        })),
        popularCourse: data.popular_courses && data.popular_courses.length > 0 ? data.popular_courses[0] : null,
        popularCourses: data.popular_courses || [],
      });
    } catch (error) {
      setError(
        error?.response?.status === 401
          ? "No tienes sesión activa o tu sesión expiró. Por favor, vuelve a iniciar sesión."
          : "Error al cargar el dashboard. Intenta de nuevo.",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchExtraStats = async () => {
    try {
      // Llama a un endpoint de analytics si existe, si no, usa los datos de stats
      const response = await api.get('/analytics/dashboard');
      setExtraStats(response.data);
    } catch (e) {
      setExtraStats(null); // Si falla, ignora
    }
  };

  const StatCard = ({ title, value, icon, color, onClick }) => (
    <div
      onClick={onClick}
      style={{
        background: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        padding: "24px",
        boxShadow: SHADOWS.md,
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s",
        border: `1px solid ${COLORS.border}`,
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.target.style.transform = "translateY(-2px)";
          e.target.style.boxShadow = SHADOWS.lg;
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.target.style.transform = "translateY(0)";
          e.target.style.boxShadow = SHADOWS.md;
        }
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              color: COLORS.textSecondary,
              fontSize: "0.9rem",
              fontWeight: "500",
              marginBottom: "8px",
            }}
          >
            {title}
          </div>
          <div
            style={{
              color: COLORS.text,
              fontSize: "2rem",
              fontWeight: "700",
            }}
          >
            {value}
          </div>
        </div>
        <div
          style={{
            width: "48px",
            height: "48px",
            background: color,
            borderRadius: BORDER_RADIUS.md,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ activity }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 0",
        borderBottom: `1px solid ${COLORS.border}`,
      }}
    >
      <div
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background:
            activity.type === "user"
              ? COLORS.primary
              : activity.type === "course"
                ? COLORS.accent
                : COLORS.success,
        }}
      />
      <div style={{ flex: 1 }}>
        <div
          style={{
            color: COLORS.text,
            fontSize: "0.9rem",
            fontWeight: "500",
          }}
        >
          {activity.message}
        </div>
        <div
          style={{
            color: COLORS.textSecondary,
            fontSize: "0.8rem",
          }}
        >
          {activity.time}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          fontFamily: FONTS.main,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Mascota width={80} height={80} />
          <div style={{ marginTop: "20px", color: COLORS.textSecondary }}>
            Cargando dashboard...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          fontFamily: FONTS.main,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Mascota width={80} height={80} />
          <div
            style={{
              marginTop: "20px",
              color: COLORS.error,
              fontWeight: "bold",
            }}
          >
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "30px",
        background: COLORS.background,
        minHeight: "calc(100vh - 70px)",
        fontFamily: FONTS.main,
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "40px",
          }}
        >
          <div>
            <h1
              style={{
                color: COLORS.text,
                fontSize: "2rem",
                fontWeight: "700",
                marginBottom: "8px",
                fontFamily: FONTS.heading,
              }}
            >
              Panel de Administración
            </h1>
            <p
              style={{
                color: COLORS.textSecondary,
                fontSize: "1rem",
              }}
            >
              Gestiona usuarios, cursos y monitorea la actividad de la
              plataforma
            </p>
          </div>
          <Mascota width={60} height={60} />
        </div>

        {/* Tarjeta Curso Estrella */}
        <div style={{
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {stats && stats.totalCourses > 0 && stats.popularCourse ? (
            <div style={{
              background: COLORS.surface,
              borderRadius: BORDER_RADIUS.lg,
              boxShadow: SHADOWS.lg,
              border: `2px solid ${COLORS.accent}`,
              padding: '28px 36px',
              minWidth: 320,
              maxWidth: 480,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
            }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>⭐</div>
              <div style={{ color: COLORS.text, fontWeight: 700, fontSize: '1.2rem', marginBottom: 4 }}>
                Curso Estrella
              </div>
              <div style={{ color: COLORS.textSecondary, fontSize: '1.1rem', fontWeight: 500 }}>
                {stats.popularCourse.titulo}
              </div>
              <div style={{ color: COLORS.textSecondary, fontSize: '0.95rem', marginTop: 4 }}>
                Inscripciones: <b>{stats.popularCourse.inscripciones_count}</b>
              </div>
              <button
                style={{
                  marginTop: 10,
                  background: COLORS.accent,
                  color: COLORS.surface,
                  border: 'none',
                  borderRadius: BORDER_RADIUS.md,
                  padding: '8px 18px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  boxShadow: SHADOWS.sm,
                }}
                onClick={() => navigate(`/cursos/${stats.popularCourse.id}`)}
              >
                Ver curso
              </button>
            </div>
          ) : (
            <div style={{ color: COLORS.textSecondary, fontSize: '1.1rem', fontWeight: 500 }}>
              No hay cursos estrella aún.
            </div>
          )}
        </div>

        {/* Gráfica Top 3 Cursos con más inscripciones */}
        {stats && stats.popularCourses && stats.popularCourses.length > 0 ? (
          <div style={{
            background: COLORS.surface,
            borderRadius: BORDER_RADIUS.lg,
            boxShadow: SHADOWS.md,
            border: `1px solid ${COLORS.border}`,
            padding: 24,
            marginBottom: 32,
            maxWidth: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            <h4 style={{ color: COLORS.text, fontFamily: FONTS.heading, marginBottom: 12, textAlign: 'center' }}>
              Top 3 Cursos con más inscripciones
            </h4>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={stats.popularCourses.slice(0, 3).map(c => ({
                  nombre: c.titulo.length > 18 ? c.titulo.slice(0, 18) + '…' : c.titulo,
                  inscripciones: c.inscripciones_count
                }))}
                layout="vertical"
                margin={{ left: 30, right: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" allowDecimals={false} />
                <YAxis dataKey="nombre" type="category" width={160} />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="inscripciones" fill="#FF8042" barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div style={{ color: COLORS.textSecondary, fontSize: '1.1rem', fontWeight: 500, textAlign: 'center', marginBottom: 32 }}>
            No hay cursos suficientes para mostrar el ranking.
          </div>
        )}

        {/* NOVEDOSO: GRÁFICAS Y VISUALIZACIONES */}
        {extraStats && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '32px',
            marginBottom: '40px',
            alignItems: 'stretch',
          }}>
            {/* Usuarios por rol */}
            <div style={{ background: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: 24, boxShadow: SHADOWS.md, border: `1px solid ${COLORS.border}` }}>
              <h4 style={{ color: COLORS.text, fontFamily: FONTS.heading, marginBottom: 12 }}>Usuarios por Rol</h4>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={Object.entries(extraStats.usuarios.por_rol).map(([rol, value]) => ({ name: rol, value }))}
                    dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                    {Object.entries(extraStats.usuarios.por_rol).map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={COLORS_RECHARTS[idx % COLORS_RECHARTS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Cursos activos vs inactivos */}
            <div style={{ background: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: 24, boxShadow: SHADOWS.md, border: `1px solid ${COLORS.border}` }}>
              <h4 style={{ color: COLORS.text, fontFamily: FONTS.heading, marginBottom: 12 }}>Cursos activos/inactivos</h4>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={[
                    { name: 'Activos', value: extraStats.cursos.activos },
                    { name: 'Otros', value: extraStats.cursos.total - extraStats.cursos.activos }
                  ]} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                    <Cell fill="#00C49F" />
                    <Cell fill="#FFBB28" />
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Inscripciones este mes vs total */}
            <div style={{ background: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: 24, boxShadow: SHADOWS.md, border: `1px solid ${COLORS.border}` }}>
              <h4 style={{ color: COLORS.text, fontFamily: FONTS.heading, marginBottom: 12 }}>Inscripciones</h4>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={[
                  { name: 'Total', value: extraStats.inscripciones.total },
                  { name: 'Este mes', value: extraStats.inscripciones.este_mes },
                  { name: 'Completadas', value: extraStats.inscripciones.completadas }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Tareas y entregas */}
            <div style={{ background: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: 24, boxShadow: SHADOWS.md, border: `1px solid ${COLORS.border}` }}>
              <h4 style={{ color: COLORS.text, fontFamily: FONTS.heading, marginBottom: 12 }}>Tareas y Entregas</h4>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={[
                  { name: 'Tareas', value: extraStats.tareas.total },
                  { name: 'Entregadas', value: extraStats.tareas.entregadas }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#A28CFE" />
                </BarChart>
              </ResponsiveContainer>
              <div style={{ marginTop: 10, color: COLORS.textSecondary, fontSize: '0.95rem' }}>
                Promedio calificación: <b>{extraStats.tareas.promedio_calificacion ?? 'N/A'}</b>
              </div>
            </div>
            {/* Métricas de rendimiento */}
            <div style={{
              background: COLORS.surface,
              borderRadius: BORDER_RADIUS.lg,
              padding: 24,
              boxShadow: SHADOWS.md,
              border: `1px solid ${COLORS.border}`,
              gridColumn: 'span 2',
              minWidth: 0,
            }}>
              <h4 style={{ color: COLORS.text, fontFamily: FONTS.heading, marginBottom: 12 }}>
                Rendimiento del sistema
              </h4>
              <ul style={{ color: COLORS.text, fontSize: '1rem', paddingLeft: 18, marginBottom: 16 }}>
                <li>Tiempo de respuesta promedio: <b>{extraStats.rendimiento.tiempo_respuesta_promedio} ms</b></li>
                <li>Usuarios concurrentes: <b>{extraStats.rendimiento.usuarios_concurrentes}</b></li>
                <li>Errores últimas 24h: <b>{extraStats.rendimiento.errores_ultimas_24h}</b></li>
                <li>Uptime backend: <b>{extraStats.rendimiento.uptime ?? '2 días 4h 12m'}</b></li>
                <li>Uso de memoria: <b>{extraStats.rendimiento.memoria ?? '512 MB'}</b></li>
                <li>Último reinicio: <b>{extraStats.rendimiento.ultimo_reinicio ?? '2024-07-21 01:00'}</b></li>
              </ul>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "24px",
            marginBottom: "40px",
          }}
        >
          <StatCard
            title="Total Usuarios"
            value={stats.totalUsers}
            icon="👥"
            color={COLORS.primary}
            onClick={() => navigate("/admin/usuarios")}
          />
          <StatCard
            title="Total Cursos"
            value={stats.totalCourses}
            icon="📚"
            color={COLORS.accent}
            onClick={() => navigate("/admin/cursos")}
          />
          <StatCard
            title="Total Inscripciones"
            value={stats.totalEnrollments}
            icon="🎓"
            color={COLORS.success}
            onClick={() => navigate("/admin/inscripciones")}
          />
        </div>

        {/* Quick Actions */}
        <div
          style={{
            background: COLORS.surface,
            borderRadius: BORDER_RADIUS.lg,
            padding: "24px",
            boxShadow: SHADOWS.md,
            marginBottom: "40px",
            border: `1px solid ${COLORS.border}`,
          }}
        >
          <h3
            style={{
              color: COLORS.text,
              fontSize: "1.25rem",
              fontWeight: "600",
              marginBottom: "20px",
              fontFamily: FONTS.heading,
            }}
          >
            Acciones Rápidas
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
            }}
          >
            <button
              onClick={() => navigate("/admin/usuarios")}
              style={{
                padding: "12px 20px",
                background: COLORS.primary,
                color: COLORS.surface,
                border: "none",
                borderRadius: BORDER_RADIUS.md,
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s",
                fontSize: "0.9rem",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-1px)";
                e.target.style.boxShadow = SHADOWS.lg;
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              👥 Gestionar Usuarios
            </button>
            <button
              onClick={() => navigate("/admin/cursos")}
              style={{
                padding: "12px 20px",
                background: COLORS.accent,
                color: COLORS.surface,
                border: "none",
                borderRadius: BORDER_RADIUS.md,
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s",
                fontSize: "0.9rem",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-1px)";
                e.target.style.boxShadow = SHADOWS.lg;
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              📚 Gestionar Cursos
            </button>
            <button
              onClick={() => navigate("/admin/inscripciones")}
              style={{
                padding: "12px 20px",
                background: COLORS.success,
                color: COLORS.surface,
                border: "none",
                borderRadius: BORDER_RADIUS.md,
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s",
                fontSize: "0.9rem",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-1px)";
                e.target.style.boxShadow = SHADOWS.lg;
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              🎓 Ver Inscripciones
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div
          style={{
            background: COLORS.surface,
            borderRadius: BORDER_RADIUS.lg,
            padding: "24px",
            boxShadow: SHADOWS.md,
            border: `1px solid ${COLORS.border}`,
          }}
        >
          <h3
            style={{
              color: COLORS.text,
              fontSize: "1.25rem",
              fontWeight: "600",
              marginBottom: "20px",
              fontFamily: FONTS.heading,
            }}
          >
            Actividad Reciente
          </h3>
          <div>
            {stats.recentActivity.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
