import { Footer } from "../../components/Footer";
import { HeaderUsuario } from "../../components/Header";

import { TablaHistorial } from "./TablaHistorial";
import {Navegacion} from "../../components/Navegacion"
export const HistorialDeTurnos = () => {
  return (
    <>
      <HeaderUsuario />
      <div className="flex flex-col md:flex-row">
        {/* La barra de navegación se mostrará en la parte superior en pantallas pequeñas */}
        <Navegacion />
        <div className="w-full md:w-[80%]">
          <TablaHistorial />
        </div>
      </div>
      <Footer />
    </>
  );
};
