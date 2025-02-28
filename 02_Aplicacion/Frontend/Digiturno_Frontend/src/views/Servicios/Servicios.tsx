import { Footer } from "../../components/Footer";
import { HeaderUsuario } from "../../components/Header";
import { Navegacion } from "../../components/Navegacion";
import { TablaServicio } from "./TablaServicio";
import {NavagacionMovil} from "../../components/Navegacion"
export const Servicios = () => {
  return (
    <>
      <HeaderUsuario />
      <div className="flex flex-col md:flex-row">
        {/* La barra de navegación se mostrará en la parte superior en pantallas pequeñas */}
        <Navegacion />
        <div className="w-full md:w-[80%]">
          <TablaServicio />
        </div>
      </div>
      <Footer />
    </>
  );
};
