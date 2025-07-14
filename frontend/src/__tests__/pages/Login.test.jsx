import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../../paginas/Login";

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

describe("Login Page", () => {
  beforeEach(() => {
    mockAuthContext.login.mockClear();
    mockNavigate.mockClear();
  });

  test("renderiza el formulario de login", () => {
    renderWithRouter(<Login />);

    expect(screen.getByText(/mindschool/i)).toBeInTheDocument();
    expect(screen.getByText(/¡bienvenido de vuelta!/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /iniciar sesión/i }),
    ).toBeInTheDocument();
  });

  test("muestra enlace para registrarse", () => {
    renderWithRouter(<Login />);

    const registerLink = screen.getByText(/¿no tienes una cuenta?/i);
    expect(registerLink).toBeInTheDocument();
  });

  test("permite ingresar credenciales", () => {
    renderWithRouter(<Login />);

    const emailInput = screen.getByPlaceholderText(/correo electrónico/i);
    const passwordInput = screen.getByPlaceholderText(/contraseña/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  test("llama a la función de login al enviar el formulario", async () => {
    mockAuthContext.login.mockResolvedValue();

    renderWithRouter(<Login />);

    const emailInput = screen.getByPlaceholderText(/correo electrónico/i);
    const passwordInput = screen.getByPlaceholderText(/contraseña/i);
    const submitButton = screen.getByRole("button", {
      name: /iniciar sesión/i,
    });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAuthContext.login).toHaveBeenCalledWith(
        "test@example.com",
        "password123",
      );
    });
  });
});
