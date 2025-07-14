import { render, screen, fireEvent } from "@testing-library/react";
import Mascota from "../../branding/Mascota";

describe("Mascota Component", () => {
  test("renderiza la imagen de la mascota por defecto", () => {
    render(<Mascota />);
    const imagen = screen.getByAltText(/mascota/i);
    expect(imagen).toBeInTheDocument();
  });

  test("renderiza el video de bienvenida al hacer click si showVideo=true", () => {
    render(<Mascota showVideo={true} />);
    const imagen = screen.getByAltText(/mascota/i);
    fireEvent.click(imagen);
    // El video debe aparecer después del click
    const video = screen.getByRole("video");
    expect(video).toBeInTheDocument();
  });
});
