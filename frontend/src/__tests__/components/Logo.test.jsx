import { render, screen } from "@testing-library/react";
import Logo from "../../branding/Logo";

describe("Logo Component", () => {
  test("renderiza el logo con el alt correcto", () => {
    render(<Logo />);
    const logo = screen.getByAltText(/mindschool logo/i);
    expect(logo).toBeInTheDocument();
  });

  test("aplica el ancho y alto por defecto usando estilos", () => {
    render(<Logo />);
    const logo = screen.getByAltText(/mindschool logo/i);
    expect(logo).toHaveStyle({ width: "200px" });
    expect(logo).toHaveStyle({ height: "auto" });
  });

  test("permite personalizar el tamaño usando estilos", () => {
    render(<Logo width={100} height={50} />);
    const logo = screen.getByAltText(/mindschool logo/i);
    expect(logo).toHaveStyle({ width: "100px" });
    expect(logo).toHaveStyle({ height: "50px" });
  });
});
