
import Imagen1 from "../../assets/turno-imagen-1.png";
import Imagen2 from "../../assets/turno-imagen-2.png";
import Imagen3 from "../../assets/turno-imagen-3.png";

import { Image } from "@nextui-org/react";
export const Pasos = () => {
    return (
        <>
            <div className="container sm:mx-auto mb-7  px-11  text-sm">
                <div className="flex flex-col md:flex-row justify-between gap-4 mx-3 ">
                    <div className="bg-[#F3F3F3] p-6 shadow-md rounded-xl w-full md:w-1/4 flex  h-44">
                        <div className="text-pretty text-center w-60 my-auto">
                            <p className="font-bold text-center">Paso 01:</p>
                            <p>
                                Presione el botón <span className="font-bold">Generar un turno</span> y seleccione el servicio que desea solicitar.
                            </p>
                        </div>

                        <Image src={Imagen1} alt="Imagen" width={100} className="m-3 my-6 justify-center items-center" />
                    </div>
                    <div className="bg-[#F3F3F3] p-6 shadow-md rounded-xl w-full md:w-1/4 flex sm:mx-3  h-44">

                        <div className=" text-pretty text-center w-60 my-auto ">
                        <p className="font-bold text-center">Paso 02:</p>
                            Una vez selecionado  el servicio, Ingrese la información personal.
                        </div>
                        <Image src={Imagen2} alt="Imagen" width={100} className="m-6 my-2" />
                    </div>
                    <div className="bg-[#F3F3F3] p-6 shadow-md rounded-xl w-full md:w-1/4 flex sm:mx-3  h-44">
                        <div className=" text-pretty text-center w-60 my-auto ">
                        <p className="font-bold text-center">Paso 03:</p>
                            El sistema generará un turno con la información necesaria del servicio requerido.
                        </div>
                        <Image src={Imagen3} alt="Imagen" width={100} className="m-3 my-6" />
                    </div>
                </div>
            </div>
        </>
    );
};
