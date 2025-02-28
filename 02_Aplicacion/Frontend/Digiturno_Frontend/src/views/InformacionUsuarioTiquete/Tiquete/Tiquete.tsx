import { Image } from "@nextui-org/react";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion"; // Importamos framer motion
import Icono from "../../../assets/icono.png";
import { ServicioAttributes } from "../../../states/context/Interface";
const RUTA = import.meta.env.VITE_URL_PAGUINA;
interface TiqueteProps {
  servicios: any;
  nombre: string;
  registradoEnLaAPE: boolean;
  codigo: string;
}
interface Servicio {
  id: number;
  nombre: string;
  duracion: string;
}


export const Tiquete: React.FC<TiqueteProps> = ({
  servicios,
  nombre,
  registradoEnLaAPE,
  codigo,
}) => {
  const [dateTime, setDateTime] = useState(new Date());
  const [isExpanded, setIsExpanded] = useState(false);
  const [Servicio, setServicio] = useState<Servicio[]>([]);

  useEffect(() => {
    setServicio(servicios);
  }, [servicios]);
  // Actualiza la fecha y hora cada segundo para que el QR refleje el tiempo en tiempo real.
  useEffect(() => {
    const interval = setInterval(() => {
      const newDate = new Date();
      const currentMinutes = newDate.getMinutes();
      const currentHours = newDate.getHours();

      // Solo actualiza si los minutos u horas han cambiado
      if (
        currentMinutes !== dateTime.getMinutes() ||
        currentHours !== dateTime.getHours()
      ) {
        setDateTime(newDate);
      }
    }, 1000); // Se ejecuta cada 20 segundos
    return () => clearInterval(interval);
  }, [dateTime]); // Dependencia de la fecha actual
  const formattedDate = `${dateTime.getDate()}/${dateTime.getMonth() + 1
    }/${dateTime.getFullYear()}`;
  let hours = dateTime.getHours();
  const minutes = dateTime.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const formattedTime = `${hours}:${minutes < 10 ? "0" + minutes : minutes
    } ${ampm}`;
  return (
    // Usamos framer motion en el contenedor para aplicar la animación
    <motion.div
      className="border-1 border-[#00304D] bg-white rounded-lg w-full md:w-7/12 mx-auto cursor-pointer z-10"
      onClick={() => setIsExpanded(!isExpanded)} // Cambia el estado al hacer clic
      animate={isExpanded ? { scale: 1.2, x: "-50%", y: "-50%" } : { scale: 1 }} // Ampliar cuando isExpanded es true
      transition={{ type: "spring", stiffness: 120 }} // Transición suave
      initial={false}
      style={{
        position: isExpanded ? "fixed" : "relative",
        top: isExpanded ? "50%" : "auto",
        left: isExpanded ? "50%" : "auto",
        borderRightWidth: "40px",
        borderLeftWidth: "40px",
      }}
    >
      <div className="flex flex-col lg:flex-row items-center justify-end w-full mt-4 lg:mt-0 text-end border-y-1 border-[#00304D]">
        <div className="flex mb-4 lg:mb-0 lg:mr-24">
          <Image src={Icono} width={70} alt="Icono" className="" />
          <div className="text-black text-left lg:ml-4">
            <p className="font-bold text-lg lg:text-lg">APE Digiturno</p>
            <p className="text-xl lg:text-xl">Sistema de Gestión de Turnos</p>
          </div>
        </div>
        <div className="flex flex-col text-left mb-4 lg:mb-0 lg:mr-20">
          <p>
            <span className="font-semibold">Fecha:</span> {formattedDate}
          </p>
          <p>
            <span className="font-semibold">Hora:</span> {formattedTime}
          </p>
        </div>
      </div>
      <div className="ml-4 lg:ml-12 flex flex-col lg:flex-row justify-between">
        <div className="flex-none mb-4">
          <p className="text-xl w-full my-2">
            <span className="font-bold">Usuario :</span>{" "}
            {nombre === undefined ? "" : nombre}
          </p>
          <p className="text-xl my-2">
            <span className="font-bold ">Servicios:</span>
          </p>
          <ul>
            {Servicio.map((s, index) => (
              <li className="list-disc font-semibold ml-4 my-2" key={s.id || `servicio-${index}`}>
                {s?.nombre}
              </li>
            ))}
          </ul>

          <p className="text-xl my-2">
            <span className="font-bold ">Tiempo aprox espera: </span>
            {Servicio.find((s) => s.nombre != "Registro en la APE")?.duracion}
          </p>
          <p className="text-xl my-2">
            <span className="font-bold ">Código: </span>
            {codigo}
          </p>
        </div>

        <div className="flex items-center ml-auto mr-4 lg:mr-10">
          <QRCodeCanvas
            className="w-32 h-32 md:w-40 lg:h-40"
            value={`${RUTA}/turnousuario/${codigo}`}
            size={100}
          />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center w-full mt-4 text-center border-y-1 border-[#00304D]">
        <p className="text-base w-full items-center justify-center my-2">
          <span className="font-bold">Importante:</span> Escanee este código QR
          para ver el seguimiento del turno asignado.
        </p>
      </div>
    </motion.div>
  );
};
