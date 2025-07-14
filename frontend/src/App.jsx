import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import { COLORS, FONTS } from "./theme/branding/branding";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import RedireccionPorRol from "./components/RedireccionPorRol";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminCourses from "./pages/AdminCourses";
import ProfesorPanel from "./pages/ProfesorPanel";
import EstudianteDashboard from "./pages/EstudianteDashboard";
import CalificacionesPanel from "./pages/CalificacionesPanel";
import ExamenesPanel from "./pages/ExamenesPanel";
import AsistenciasPanel from "./pages/AsistenciasPanel";
import RecursosPanel from "./pages/RecursosPanel";
import MensajesPanel from "./pages/MensajesPanel";
import RutaConRol from "./components/RutaConRol";
import Bienvenida from "./pages/Bienvenida";
import ProfesorPagos from "./pages/ProfesorPagos";
import EstudianteCursos from "./pages/EstudianteCursos";
import EstudianteInscripciones from "./pages/EstudianteInscripciones";
import EstudianteProgreso from "./pages/EstudianteProgreso";
import ProfesorCursos from "./pages/ProfesorCursos";

// Layout base para la aplicación
function AppContent() {
  const location = useLocation();
  // Ocultar Navbar en login, registro y bienvenida
  const hideNavbar = ["/login", "/registro", "/"].includes(location.pathname);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.background,
        fontFamily: FONTS.main,
      }}
    >
      {!hideNavbar && <Navbar />}
      <main>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* Redirección automática según rol */}
          <Route path="/" element={<Bienvenida />} />
          <Route path="/dashboard" element={<RedireccionPorRol />} />

          {/* Rutas de administrador */}
          <Route
            path="/admin/dashboard"
            element={
              <RutaConRol rolesPermitidos={["admin"]}>
                <AdminDashboard />
              </RutaConRol>
            }
          />
          <Route
            path="/admin/usuarios"
            element={
              <RutaConRol rolesPermitidos={["admin"]}>
                <AdminUsers />
              </RutaConRol>
            }
          />
          <Route
            path="/admin/cursos"
            element={
              <RutaConRol rolesPermitidos={["admin"]}>
                <AdminCourses />
              </RutaConRol>
            }
          />
          <Route
            path="/admin/inscripciones"
            element={
              <RutaConRol rolesPermitidos={["admin"]}>
                <div style={{ padding: "30px", textAlign: "center" }}>
                  <h1>Gestión de Inscripciones</h1>
                  <p>Página en desarrollo...</p>
                </div>
              </RutaConRol>
            }
          />

          {/* Rutas compartidas para admin y profesor */}
          <Route
            path="/examenes"
            element={
              <RutaConRol rolesPermitidos={["admin", "profesor"]}>
                <ExamenesPanel />
              </RutaConRol>
            }
          />
          <Route
            path="/asistencias"
            element={
              <RutaConRol rolesPermitidos={["admin", "profesor"]}>
                <AsistenciasPanel />
              </RutaConRol>
            }
          />
          <Route
            path="/recursos"
            element={
              <RutaConRol rolesPermitidos={["admin", "profesor", "estudiante"]}>
                <RecursosPanel />
              </RutaConRol>
            }
          />
          <Route
            path="/mensajes"
            element={
              <RutaConRol rolesPermitidos={["admin", "profesor", "estudiante"]}>
                <MensajesPanel />
              </RutaConRol>
            }
          />

          {/* Rutas de profesor */}
          <Route
            path="/profesor/dashboard"
            element={
              <RutaConRol rolesPermitidos={["profesor"]}>
                <ProfesorPanel />
              </RutaConRol>
            }
          />
          <Route
            path="/profesor/cursos"
            element={
              <RutaConRol rolesPermitidos={["profesor"]}>
                <ProfesorCursos />
              </RutaConRol>
            }
          />
          <Route
            path="/profesor/lecciones"
            element={
              <RutaConRol rolesPermitidos={["profesor"]}>
                <div style={{ padding: "30px", textAlign: "center" }}>
                  <h1>Gestión de Lecciones</h1>
                  <p>Página en desarrollo...</p>
                </div>
              </RutaConRol>
            }
          />
          <Route
            path="/profesor/multimedia"
            element={
              <RutaConRol rolesPermitidos={["profesor"]}>
                <div style={{ padding: "30px", textAlign: "center" }}>
                  <h1>Gestión de Multimedia</h1>
                  <p>Página en desarrollo...</p>
                </div>
              </RutaConRol>
            }
          />
          <Route
            path="/profesor/estudiantes"
            element={
              <RutaConRol rolesPermitidos={["profesor"]}>
                <div style={{ padding: "30px", textAlign: "center" }}>
                  <h1>Mis Estudiantes</h1>
                  <p>Página en desarrollo...</p>
                </div>
              </RutaConRol>
            }
          />
          <Route path="/profesor/pagos" element={<ProfesorPagos />} />

          {/* Rutas de estudiante */}
          <Route
            path="/estudiante/dashboard"
            element={
              <RutaConRol rolesPermitidos={["estudiante"]}>
                <EstudianteDashboard />
              </RutaConRol>
            }
          />
          <Route
            path="/estudiante/calificaciones"
            element={
              <RutaConRol rolesPermitidos={["estudiante"]}>
                <CalificacionesPanel />
              </RutaConRol>
            }
          />
          <Route
            path="/estudiante/cursos"
            element={
              <RutaConRol rolesPermitidos={["estudiante"]}>
                <EstudianteCursos />
              </RutaConRol>
            }
          />
          <Route
            path="/estudiante/inscripciones"
            element={
              <RutaConRol rolesPermitidos={["estudiante"]}>
                <EstudianteInscripciones />
              </RutaConRol>
            }
          />
          <Route
            path="/estudiante/progreso"
            element={
              <RutaConRol rolesPermitidos={["estudiante"]}>
                <EstudianteProgreso />
              </RutaConRol>
            }
          />
          <Route
            path="/estudiante/curso/:id"
            element={
              <RutaConRol rolesPermitidos={["estudiante"]}>
                <div style={{ padding: "30px", textAlign: "center" }}>
                  <h1>Detalle del Curso</h1>
                  <p>Página en desarrollo...</p>
                </div>
              </RutaConRol>
            }
          />

          {/* Ruta por defecto */}
          <Route path="*" element={<RedireccionPorRol />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
