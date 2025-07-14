import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../utils/axiosConfig";

// Crear el contexto de autenticación
export const AuthContext = createContext();

// Proveedor del contexto de autenticación
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [cargando, setCargando] = useState(true);

  // Cargar usuario autenticado al iniciar
  useEffect(() => {
    if (token) {
      api
        .get("/user")
        .then((res) => {
          // Aseguramos que los roles sean un array de strings
          let user = res.data;
          if (user.roles && Array.isArray(user.roles)) {
            user.roles = user.roles.map((r) =>
              typeof r === "string" ? r : r.name || r,
            );
          }
          setUsuario(user);
        })
        .catch(() => {
          setUsuario(null);
          setToken(null);
          localStorage.removeItem("token");
        })
        .finally(() => setCargando(false));
    } else {
      setCargando(false);
    }
  }, [token]);

  // Función para cerrar sesión
  const logout = async () => {
    try {
      // Llamar al endpoint de logout del backend
      if (token) {
        await api.post("/logout");
      }
    } catch (error) {
      console.error("Error al hacer logout:", error);
    } finally {
      setUsuario(null);
      setToken(null);
      localStorage.removeItem("token");
    }
  };

  // Función para guardar token y usuario tras login/registro
  const loginExitoso = (nuevoToken, usuarioData = null) => {
    setToken(nuevoToken);
    localStorage.setItem("token", nuevoToken);

    // Si se proporciona información del usuario, actualizarla inmediatamente
    if (usuarioData) {
      // Aseguramos que los roles sean un array de strings
      if (usuarioData.roles && Array.isArray(usuarioData.roles)) {
        usuarioData.roles = usuarioData.roles.map((r) =>
          typeof r === "string" ? r : r.name || r,
        );
      }
      setUsuario(usuarioData);
    }
  };

  // FUNCIÓN LOGIN REAL
  const login = async (email, password) => {
    try {
      const res = await api.post("/login", { email, password });
      const { token, user } = res.data;
      loginExitoso(token, user);
      return true;
    } catch (err) {
      throw err;
    }
  };

  // FUNCIÓN REGISTER REAL
  const register = async (userData) => {
    try {
      const res = await api.post("/register", userData);
      const { token, user } = res.data;
      loginExitoso(token, user);
      return true;
    } catch (err) {
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        cargando,
        login,
        register,
        loginExitoso,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
