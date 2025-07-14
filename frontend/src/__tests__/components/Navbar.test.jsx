import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "../../componentes/Navbar";

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

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("Navbar Component", () => {
  test("renderiza el logo de MindSchool", () => {
    renderWithRouter(<Navbar />);

    const logo = screen.getByAltText(/logo/i);
    expect(logo).toBeInTheDocument();
  });

  test("renderiza el logo de MindSchool", () => {
    renderWithRouter(<Navbar />);

    const logo = screen.getByAltText(/mindschool logo/i);
    expect(logo).toBeInTheDocument();
  });

  test("muestra el nombre de MindSchool", () => {
    renderWithRouter(<Navbar />);

    expect(screen.getByText(/mindschool/i)).toBeInTheDocument();
  });

  test("renderiza correctamente cuando el usuario está autenticado", () => {
    mockAuthContext.user = {
      name: "Juan Pérez",
      email: "juan@example.com",
      roles: ["estudiante"],
    };

    renderWithRouter(<Navbar />);

    // Verificar que el navbar se renderiza sin errores
    expect(screen.getByText(/mindschool/i)).toBeInTheDocument();
  });
});
