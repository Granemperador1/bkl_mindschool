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

  useEffect(() => {
    fetchDashboardData();
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
