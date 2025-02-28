
import { Beneficios } from "../../components/Beneficios";
import { FooterUsuario } from "../../components/Footer";
import { GaleriaImagenes } from "../../components/GaleriaImagenes/GaleriaImagenes";
import { GenerarTurno } from "../../components/GenerarTurno";
import { Header } from "../../components/Header";
import { Pasos } from "../../components/PasosParaGenerarUnTurno/Pasos";
import { Sesion } from "../../components/Sesion/Sesion";
import { InFormacionDelSena } from "../../components/InformacionDelSena";
export const Landing = () => {
  return (
    <>
      <Header />
      <GaleriaImagenes />
      <p className="sm:text-4xl sm:my-10 my-10 mx-24 text-2xl">
        Pasos para <span className="font-bold">generar un turno</span>
      </p>
      <Pasos />
      <div className="flex flex-col md:flex-row mx-4 md:mx-10 sm:my-10 my-16">
        <Sesion />
        <GenerarTurno />
      </div>
      <p className="sm:text-4xl   mx-24 text-2xl">
        <span className="font-bold ">Beneficios de solicitar un turno  </span>
      </p>
      <Beneficios />
      <div className="m-auto flex justify-center sm:py-20">
        <InFormacionDelSena></InFormacionDelSena>
      </div>
      <FooterUsuario />
    </>
  );
};
