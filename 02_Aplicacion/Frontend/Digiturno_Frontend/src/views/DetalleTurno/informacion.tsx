import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UsuarioTurnoDetalle } from "../../states/context/Interface";
import { Image, Skeleton } from "@nextui-org/react";
import { Mail, User, Briefcase } from "lucide-react";
import { useWebSocketContext } from "../../utils/webSocketContext";
import showToast from "../../utils/toastUtil";
const RUTA_API = import.meta.env.VITE_API_URL;

export const InformacionUsuarioTurno = () => {
  const { eventoActual } = useWebSocketContext();
  const [hacerFetch, setHacerFetch] = useState<boolean>(true);
  const { turno } = useParams();
  const [datosTurno, setDatosTurno] = useState<UsuarioTurnoDetalle | null>();
  const [servicios, setServicios] = useState<any>();
  const [nRestantes, setNRestantes] = useState(0);
  const [usuario, setUsuario] = useState<any>();
  const [empleado, setEmpleado] = useState<boolean | any>(false);
  const [mensaje, setMensaje] = useState<string | null>("");

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const respuesta = await fetch(`${RUTA_API}api/tv/usuario/${turno}`);
        if (respuesta.status == 204) {
          setMensaje("El turno ha sido terminado");
          return showToast("info", "El turno ha sido terminado");
        }
        if (!respuesta.ok) {
            // const errorData = await respuesta.json();
            // showToast("error", errorData.message || "El turno ha sido terminado");
          throw new Error("Error al obtener los datos del turno");
        }

        const data = (await respuesta.json()) as UsuarioTurnoDetalle;

        setDatosTurno(data);
        setNRestantes(data.nRestantes);
        setServicios(data.servicios);
        setUsuario(data.usuario);
        setEmpleado(data.empleado);
        setMensaje("Turno Encontrado");
      } catch (error) {
        
        showToast("error", `Error al obtener los datos de los usuarios. ${error}`); 
      }
    };
    if (hacerFetch) {
      obtenerDatos();
      setHacerFetch(false);
    }
  }, [turno, hacerFetch]);

  useEffect(() => {
    if (eventoActual && (eventoActual.type === "turnosRestantes" || eventoActual.type === "estadoTurnoEspera")) {
      setHacerFetch(true);
    }
  }, [eventoActual]);

  if (mensaje == "El turno ha sido terminado") {
    return (
      <>
        <div className="w-full max-w-md mx-auto overflow-hidden transition-all duration-400 hover:shadow-2xl shadow-lg rounded-xl">
          <div className="bg-gradient-to-r bg-[#00CF53] text-white p-6">
            <div className="text-4xl font-bold text-center">
              {datosTurno != null ? turno : mensaje}
            </div>
          </div>
        </div>
      </>
    );
  } else if (!datosTurno) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Skeleton
          isLoaded={false}
          className="  w-11/12 h-80 max-w-md mx-auto overflow-hidden transition-all duration-400 hover:shadow-2xl shadow-lg rounded-xl"
        >
          <p className="text-lg text-black">
            Cargando información del turno...
          </p>
        </Skeleton>
      </div>
    );
  }

  const servicio = servicios.length > 1 ? servicios[0 + 1] : servicios[0]; // Tomamos el primer servicio de la lista

  return (
    <div className="w-full max-w-md mx-auto overflow-hidden transition-all duration-400 hover:shadow-2xl shadow-lg rounded-xl">
      <div className="bg-gradient-to-r bg-[#00CF53] text-white p-6">
        
          <div className="text-4xl font-bold text-center">{datosTurno == null || mensaje == "El turno ha sido terminado" ? mensaje : turno}</div>
        

      </div>
      {datosTurno != null ? (
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-gray-500" />

              <span className="text-lg font-medium">
                {usuario.nombres + " " + usuario.apellidos}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="h-5 text-gray-500" />
              <span className="text-lg"> {usuario.correo}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Image
                className="w-5 h-5 text-gray-500"
                src={
                  servicio?.icono ||
                  "https://res.cloudinary.com/doza0twgj/image/upload/v1732062707/uploads/swywcmskxbwddkkkv4eu.png"
                }
              />
              <span className="text-lg">{servicio?.nombre}</span>
            </div>
            <div className="pt-4">
              {empleado ? (<>
                <div className="text-lg px-2 py-2 bg-[#FFBE30] rounded-md text-center w-auto">
                  <p>¡Su turno ha sido tomado!</p>
                  <p>Diríjase al <b>módulo {empleado.modulo.modulo}</b></p>
                  <p><b>Orientador asignado:</b> {empleado.nombres + " " + empleado.apellidos}</p>
                </div>
              </>) :
                (<>
                  <div className="text-lg px-3 py-1 bg-slate-300 rounded-full text-center w-auto">
                    {nRestantes > 0 ? nRestantes : ""}
                    {nRestantes == 0 ? null : (
                      <>
                        {nRestantes === 1 ? " turno" : " turnos"}{" "}
                        {nRestantes === 1 && nRestantes > 0
                          ? "restante"
                          : "restantes"}
                      </>
                    )}
                    {nRestantes == 0 ? "Pronto será llamado" : ""}
                  </div>
                </>)}

            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
