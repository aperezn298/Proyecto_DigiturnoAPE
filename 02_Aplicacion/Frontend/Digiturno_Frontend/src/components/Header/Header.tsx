import { Image } from "@nextui-org/react";

import Icono from "../../assets/icono.png";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <>
      <header className="text-white py-3 border-b-4 border-[#00304D] sm:w-[90%] w-full  mx-auto">
        <div className="container mx-auto flex flex-col md:flex-row justify-start items-center">
          {/* Imagen a la izquierda */}
          <div className="w-full md:w-1/2  flex justify-start md:justify-start">
        <Link to={"/"}>
            <Image
              src="https://res.cloudinary.com/doza0twgj/image/upload/v1734039010/LOGO_APE_color_gjlabc.png"
              alt="Agencia Pública de Empleo"
              className="max-w-[200px] md:max-w-full "
              width={280}
            />
        
        </Link> 
          </div>

          {/* Texto y icono a la derecha */}
          <div className="flex  md:flex-row items-center justify-end w-full md:w-full mt-4 md:mt-0 text-end">
            <div className="text-black text-center md:text-right md:mr-4">
              <p className="font-bold text-lg md:text-xl">APE Digiturno</p>
              <p className="text-xl md:text-2xl">
                Sistema de Gestión de Turnos
              </p>
            </div>

            <Image src={Icono} width={70} alt="Icono" className="" />
          </div>
        </div>
      </header>
    </>
  );
};
