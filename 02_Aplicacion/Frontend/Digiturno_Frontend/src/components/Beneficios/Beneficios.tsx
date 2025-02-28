import imgen1 from "../../assets/reminder-note-8 1.png";
import imgen2 from "../../assets/career-3-39 1.png";
import imgen3 from "../../assets/undraw_shared_workspace_re_3gsu 1.png";
import { Image } from "@nextui-org/react";

export const Beneficios = () => {
  return (
    <>
      <div className="container sm:mx-auto sm:mb-80 ">
        <div className="flex flex-col md:flex-row  justify-between gap-6">
          {/* Primer bloque */}
          <div className="p-6  rounded-xl w-full md:w-1/3 flex flex-col items-center h-auto md:h-52">

            <Image src={imgen1} alt="Imagen" width={500} className="w-80 md:w-96 h-auto m-4" />
            <p className="text-pretty text-center w-full md:w-8/12 my-4 text-sm md:text-base">

              <span className="font-bold">Eficiencia operativa:</span> Al implementar un sistema de gestión de turnos con códigos QR, se minimizan los errores humanos y se optimiza el flujo de trabajo. Esto se traduce en una mayor precisión en la asignación de turnos y una reducción significativa en el tiempo de espera.
            </p>
          </div>

          {/* Segundo bloque */}
          <div className="p-6  rounded-xl w-full md:w-1/3 flex flex-col items-center h-auto md:h-52 sm:mt-28">
            <Image src={imgen3} alt="Imagen" width={500} className="w-80 md:w-96 h-auto m-4 " />
            <p className="text-pretty text-center w-full md:w-8/12 my-4 text-sm md:text-base mt-28">

              <span className="font-bold">Flexibilidad y conveniencia:</span> Gestiona el turno desde cualquier lugar con el móvil, en cualquier momento del día. No importa dónde se encuentre, siempre tendrás la posibilidad de acceder al sistema y organizar las citas de manera rápida y sencilla.
            </p>
          </div>

          {/* Tercer bloque */}
          <div className="p-6  rounded-xl w-full md:w-1/3 flex flex-col items-center h-auto md:h-52 sm:mt-2">
            <Image src={imgen2} alt="Imagen" width={500} className="w-80 md:w-80 h-auto m-4" />
            <p className="text-pretty text-center w-full md:w-8/12 my-4 text-sm md:text-base mt-20">
              <span className="font-bold">Mejora de la experiencia del usuario:</span> Permite a los usuarios acceder a cualquier servicio en cualquier momento, brindando flexibilidad y conveniencia sin precedentes. Esta capacidad asegura que los usuarios puedan satisfacer sus necesidades de manera eficiente y sin restricciones de horario, mejorando significativamente su satisfacción y lealtad.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};