import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  COLORS,
  FONTS,
  SHADOWS,
  BORDER_RADIUS,
} from "../theme/branding/branding";
import api from "../utils/axiosConfig";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        ...(searchTerm && { search: searchTerm }),
        ...(roleFilter && { role: roleFilter }),
      });

      const response = await api.get(`/admin/users?${params}`);
      setUsers(response.data.data);
      setTotalPages(response.data.last_page);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      await api.post("/admin/users", userData);
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleUpdateUser = async (id, userData) => {
    try {
      await api.put(`/admin/users/${id}`, userData);
      setShowModal(false);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      try {
        await api.delete(`/admin/users/${id}`);
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const UserModal = ({ user = null, onSave, onClose }) => {
    const [formData, setFormData] = useState({
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      role: user?.roles?.[0] || "estudiante",
      avatar_url: user?.avatar_url || "",
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      const dataToSend = { ...formData };
      if (!user && !dataToSend.password) {
        alert("La contraseña es requerida para nuevos usuarios");
        return;
      }
      if (user && !dataToSend.password) {
        delete dataToSend.password;
      }
      onSave(user?.id, dataToSend);
    };

    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            background: COLORS.surface,
            borderRadius: BORDER_RADIUS.lg,
            padding: "30px",
            width: "90%",
            maxWidth: "500px",
            boxShadow: SHADOWS.xl,
          }}
        >
          <h2
            style={{
              color: COLORS.text,
              fontSize: "1.5rem",
              fontWeight: "600",
              marginBottom: "20px",
              fontFamily: FONTS.heading,
            }}
          >
            {user ? "Editar Usuario" : "Crear Nuevo Usuario"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  color: COLORS.text,
                  fontWeight: "500",
                }}
              >
                Nombre
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: BORDER_RADIUS.md,
                  fontSize: "14px",
                }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  color: COLORS.text,
                  fontWeight: "500",
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: BORDER_RADIUS.md,
                  fontSize: "14px",
                }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  color: COLORS.text,
                  fontWeight: "500",
                }}
              >
                Contraseña {user && "(dejar vacío para mantener)"}
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required={!user}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: BORDER_RADIUS.md,
                  fontSize: "14px",
                }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  color: COLORS.text,
                  fontWeight: "500",
                }}
              >
                Rol
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: BORDER_RADIUS.md,
                  fontSize: "14px",
                }}
              >
                <option value="estudiante">Estudiante</option>
                <option value="profesor">Profesor</option>
              </select>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  color: COLORS.text,
                  fontWeight: "500",
                }}
              >
                URL del Avatar (opcional)
              </label>
              <input
                type="url"
                value={formData.avatar_url}
                onChange={(e) =>
                  setFormData({ ...formData, avatar_url: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: BORDER_RADIUS.md,
                  fontSize: "14px",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: "10px 20px",
                  background: COLORS.textSecondary,
                  color: COLORS.surface,
                  border: "none",
                  borderRadius: BORDER_RADIUS.md,
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                style={{
                  padding: "10px 20px",
                  background: COLORS.primary,
                  color: COLORS.surface,
                  border: "none",
                  borderRadius: BORDER_RADIUS.md,
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                {user ? "Actualizar" : "Crear"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      admin: "Administrador",
      profesor: "Profesor",
      estudiante: "Estudiante",
    };
    return roleNames[role] || role;
  };

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
            marginBottom: "30px",
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
              Gestión de Usuarios
            </h1>
            <p
              style={{
                color: COLORS.textSecondary,
                fontSize: "1rem",
              }}
            >
              Administra profesores y estudiantes de la plataforma
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              padding: "12px 24px",
              background: COLORS.primary,
              color: COLORS.surface,
              border: "none",
              borderRadius: BORDER_RADIUS.md,
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            + Nuevo Usuario
          </button>
        </div>

        {/* Filtros */}
        <div
          style={{
            background: COLORS.surface,
            borderRadius: BORDER_RADIUS.lg,
            padding: "20px",
            marginBottom: "20px",
            boxShadow: SHADOWS.md,
            border: `1px solid ${COLORS.border}`,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "15px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  color: COLORS.text,
                  fontWeight: "500",
                }}
              >
                Buscar
              </label>
              <input
                type="text"
                placeholder="Nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: BORDER_RADIUS.md,
                  fontSize: "14px",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  color: COLORS.text,
                  fontWeight: "500",
                }}
              >
                Filtrar por Rol
              </label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: BORDER_RADIUS.md,
                  fontSize: "14px",
                }}
              >
                <option value="">Todos los roles</option>
                <option value="profesor">Profesores</option>
                <option value="estudiante">Estudiantes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabla de usuarios */}
        <div
          style={{
            background: COLORS.surface,
            borderRadius: BORDER_RADIUS.lg,
            overflow: "hidden",
            boxShadow: SHADOWS.md,
            border: `1px solid ${COLORS.border}`,
          }}
        >
          {loading ? (
            <div
              style={{
                padding: "40px",
                textAlign: "center",
                color: COLORS.textSecondary,
              }}
            >
              Cargando usuarios...
            </div>
          ) : (
            <>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: COLORS.background,
                      borderBottom: `1px solid ${COLORS.border}`,
                    }}
                  >
                    <th
                      style={{
                        padding: "15px",
                        textAlign: "left",
                        fontWeight: "600",
                        color: COLORS.text,
                      }}
                    >
                      Usuario
                    </th>
                    <th
                      style={{
                        padding: "15px",
                        textAlign: "left",
                        fontWeight: "600",
                        color: COLORS.text,
                      }}
                    >
                      Email
                    </th>
                    <th
                      style={{
                        padding: "15px",
                        textAlign: "left",
                        fontWeight: "600",
                        color: COLORS.text,
                      }}
                    >
                      Rol
                    </th>
                    <th
                      style={{
                        padding: "15px",
                        textAlign: "left",
                        fontWeight: "600",
                        color: COLORS.text,
                      }}
                    >
                      Fecha de Registro
                    </th>
                    <th
                      style={{
                        padding: "15px",
                        textAlign: "center",
                        fontWeight: "600",
                        color: COLORS.text,
                      }}
                    >
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      style={{
                        borderBottom: `1px solid ${COLORS.border}`,
                      }}
                    >
                      <td style={{ padding: "15px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <div
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              background: COLORS.primary,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: COLORS.surface,
                              fontWeight: "600",
                            }}
                          >
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span
                            style={{ color: COLORS.text, fontWeight: "500" }}
                          >
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td
                        style={{ padding: "15px", color: COLORS.textSecondary }}
                      >
                        {user.email}
                      </td>
                      <td style={{ padding: "15px" }}>
                        <span
                          style={{
                            padding: "4px 8px",
                            borderRadius: BORDER_RADIUS.sm,
                            fontSize: "0.8rem",
                            fontWeight: "500",
                            background:
                              user.roles?.[0] === "profesor"
                                ? COLORS.accent
                                : COLORS.success,
                            color: COLORS.surface,
                          }}
                        >
                          {getRoleDisplayName(user.roles?.[0])}
                        </span>
                      </td>
                      <td
                        style={{ padding: "15px", color: COLORS.textSecondary }}
                      >
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "15px", textAlign: "center" }}>
                        <div
                          style={{
                            display: "flex",
                            gap: "5px",
                            justifyContent: "center",
                          }}
                        >
                          <button
                            onClick={() => {
                              setEditingUser(user);
                              setShowModal(true);
                            }}
                            style={{
                              padding: "5px 10px",
                              background: COLORS.accent,
                              color: COLORS.surface,
                              border: "none",
                              borderRadius: BORDER_RADIUS.sm,
                              cursor: "pointer",
                              fontSize: "0.8rem",
                            }}
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            style={{
                              padding: "5px 10px",
                              background: COLORS.error,
                              color: COLORS.surface,
                              border: "none",
                              borderRadius: BORDER_RADIUS.sm,
                              cursor: "pointer",
                              fontSize: "0.8rem",
                            }}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Paginación */}
              {totalPages > 1 && (
                <div
                  style={{
                    padding: "20px",
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                    borderTop: `1px solid ${COLORS.border}`,
                  }}
                >
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{
                      padding: "8px 12px",
                      background:
                        currentPage === 1
                          ? COLORS.textSecondary
                          : COLORS.primary,
                      color: COLORS.surface,
                      border: "none",
                      borderRadius: BORDER_RADIUS.sm,
                      cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    }}
                  >
                    Anterior
                  </button>
                  <span
                    style={{
                      padding: "8px 12px",
                      color: COLORS.text,
                    }}
                  >
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{
                      padding: "8px 12px",
                      background:
                        currentPage === totalPages
                          ? COLORS.textSecondary
                          : COLORS.primary,
                      color: COLORS.surface,
                      border: "none",
                      borderRadius: BORDER_RADIUS.sm,
                      cursor:
                        currentPage === totalPages ? "not-allowed" : "pointer",
                    }}
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <UserModal
          user={editingUser}
          onSave={editingUser ? handleUpdateUser : handleCreateUser}
          onClose={() => {
            setShowModal(false);
            setEditingUser(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminUsers;
