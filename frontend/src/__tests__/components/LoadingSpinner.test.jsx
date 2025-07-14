import { render, screen } from "@testing-library/react";
import LoadingSpinner from "../../componentes/LoadingSpinner";

describe("LoadingSpinner Component", () => {
  test("renderiza el spinner con el texto de cargando", () => {
    render(<LoadingSpinner />);
    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });

  test("aplica el tamaño por defecto (40px)", () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByRole("progressbar");
    expect(spinner).toHaveStyle("width: 40px");
    expect(spinner).toHaveStyle("height: 40px");
  });

  test("permite personalizar el tamaño (large = 60px)", () => {
    render(<LoadingSpinner size="large" />);
    const spinner = screen.getByRole("progressbar");
    expect(spinner).toHaveStyle("width: 60px");
    expect(spinner).toHaveStyle("height: 60px");
  });

  test("permite personalizar el tamaño (small = 24px)", () => {
    render(<LoadingSpinner size="small" />);
    const spinner = screen.getByRole("progressbar");
    expect(spinner).toHaveStyle("width: 24px");
    expect(spinner).toHaveStyle("height: 24px");
  });
});
