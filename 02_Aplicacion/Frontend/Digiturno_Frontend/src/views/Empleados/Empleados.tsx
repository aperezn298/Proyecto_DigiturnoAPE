import { Footer } from "../../components/Footer";
import { HeaderUsuario } from "../../components/Header";
import { Navegacion } from "../../components/Navegacion";
import { TablaEmpleados } from "./TablaEmpleados";

export const Empleados = () => {
  return (
    <>
      <HeaderUsuario />
      <div className="flex flex-col md:flex-row">
        {/* La barra de navegación estará arriba en pantallas pequeñas */}
        <Navegacion />
        <div className="w-full md:w-[80%]">
          <TablaEmpleados />
        </div>
      </div>
      <Footer />
    </>
  );
};
