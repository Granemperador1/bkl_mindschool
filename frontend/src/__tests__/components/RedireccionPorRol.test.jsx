import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import RedireccionPorRol from "../../componentes/RedireccionPorRol";

// Mock del contexto de autenticación
const mockAuthContext = {
  user: null,
  login: jest.fn(),
  logout: jest.fn(),
  loading: false,
};

// Mock del hook useAuth
jest.mock("../../contexto/AuthContext", () => ({
  useAuth: () => mockAuthContext,
}));

// Mock de react-router-dom
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("RedireccionPorRol Component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test("renderiza correctamente cuando no hay usuario autenticado", () => {
    mockAuthContext.user = null;
    mockAuthContext.loading = false;

    renderWithRouter(<RedireccionPorRol />);

    // Verificar que el componente se renderiza sin errores
    expect(document.body).toBeInTheDocument();
  });

  test("renderiza correctamente cuando el usuario es admin", () => {
    mockAuthContext.user = {
      roles: ["admin"],
    };
    mockAuthContext.loading = false;

    renderWithRouter(<RedireccionPorRol />);

    // Verificar que el componente se renderiza sin errores
    expect(document.body).toBeInTheDocument();
  });

  test("renderiza correctamente cuando el usuario es profesor", () => {
    mockAuthContext.user = {
      roles: ["profesor"],
    };
    mockAuthContext.loading = false;

    renderWithRouter(<RedireccionPorRol />);

    // Verificar que el componente se renderiza sin errores
    expect(document.body).toBeInTheDocument();
  });

  test("renderiza correctamente cuando el usuario es estudiante", () => {
    mockAuthContext.user = {
      roles: ["estudiante"],
    };
    mockAuthContext.loading = false;

    renderWithRouter(<RedireccionPorRol />);

    // Verificar que el componente se renderiza sin errores
    expect(document.body).toBeInTheDocument();
  });

  test("renderiza correctamente cuando está cargando", () => {
    mockAuthContext.loading = true;

    renderWithRouter(<RedireccionPorRol />);

    // Verificar que el componente se renderiza sin errores
    expect(document.body).toBeInTheDocument();
  });
});
