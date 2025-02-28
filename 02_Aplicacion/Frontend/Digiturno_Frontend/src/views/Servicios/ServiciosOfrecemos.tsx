import { ArrowLeft } from "lucide-react";
import { FooterUsuario } from "../../components/Footer";
import { Header } from "../../components/Header";
import { ContainerServicios } from "./index";
import { Link } from "react-router-dom";

export const ServiciosOfrecemos = () => {
  return (
    <>
      <Header />
      <div className="w-10/12 h-full flex flex-col items-center bg-gray-100 px-16 rounded-lg m-auto my-5">

        <div className="grid sm:grid-cols-4 w-full">
          <div className="col-span-1 mt-2 sm:mt-0 sm:ml-16 place-content-center">
            <Link to={"/"}>
              <ArrowLeft className="hover:scale-90" strokeWidth={1} size={30} />
            </Link>

          </div>

          <p className="text-3xl mx-auto my-3 col-span-2 font-semibold">Servicios de la APE</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full m-auto my-4">
          <ContainerServicios />
        </div>

      </div>

      <FooterUsuario />
    </>
  );
};