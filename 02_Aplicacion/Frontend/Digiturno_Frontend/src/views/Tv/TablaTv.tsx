import { useEffect, useRef, useState } from "react";
import { FooterTV } from "../../components/Footer/FooterTV";
import { Circle } from "lucide-react";
import useFetchWithAuth from "../../utils/peticionesHttp";
import { Image } from "@nextui-org/react";
import { ModalUltimoTurno } from "./ModalUlimoTurno";
import { useWebSocketContext } from "../../utils/webSocketContext";
const RUTA_API = import.meta.env.VITE_API_URL; 

export const TablaTV = () => {
  const { eventoActual } = useWebSocketContext();
  const [ hacerFetch, setHacerFetch ] = useState<boolean>(true)
  const { fetchWithAuth } = useFetchWithAuth();
  const [turnos, setTurnos] = useState<any>([]);
  const [ultimoTurno, setUltimoTurno] = useState(null);

  const estados = [
    { estado: "Espera", color: "#FFBE30" },
    { estado: "Proceso", color: "#00CF53" },
    { estado: "Cancelado", color: "#FF4B2B" },
    { estado: "Atendido", color: "#00304D" },
  ];

  useEffect(() => {
    const getTurnos = async () => {
      const response = await fetchWithAuth(`${RUTA_API}api/tv`, {
        method: "GET",
      });
      const data = await response.json();
      if (response.ok) {
        setTurnos(data);
        setUltimoTurno(data[0]);
      }
    };
    if(hacerFetch){
      getTurnos();
      setUltimoTurno(turnos[0]);
      setHacerFetch(false);
    };
    
  }, [hacerFetch]);

  useEffect(()=>{
    if(eventoActual && eventoActual.type === "estadoTurnoCambiado"){
      setHacerFetch(true);
    };
  }, [eventoActual])

  //Activar Animacion si el contenido se desborda  
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // calcular altura
    const containerHeight = containerRef.current?.offsetHeight || 0;
    const contentHeight = contentRef.current?.scrollHeight || 0;

    //si el contenido es mas alto que su div padre, activamos la animacion
    if (contentHeight > containerHeight) {
      setShouldAnimate(true);
    }
  }, [turnos]);

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Header */}
      <div className="grid grid-cols-10 text-center text-3xl py-3 border-b border-black h-fit">
        <div className="col-span-1">
          <p>Módulo</p>
        </div>
        <div className="col-span-4">
          <p>Turnos en Asesoría</p>
        </div>
        <div className="col-span-5">
          <p>Nombre</p>
        </div>
      </div>

      <div
      ref={containerRef}
      className="flex-grow max-h-96 overflow-y-hidden z-0 relative">
        {/* Registros */}
        <div 
        ref={contentRef}
        className={`flex-grow ${shouldAnimate ? "scroll-animation" : ""}`}
        >
          {turnos.map((turno: any, index: number) => (
            <div
              key={index}
              style={{
                backgroundColor: index % 2 !== 0 ? "#D9D9D9" : "white",
              }}
              className="grid grid-cols-10 py-2"
            >
              <div className="col-span-1 text-center text-5xl">
                {turno.empleado?.modulo?.modulo ?? "N/A"}
              </div>
              <div className="col-span-4 grid grid-cols-5 justify-self-center">
                <div className="col-span-1 flex justify-center items-center">
                  {turno.servicios?.[0]?.icono ? (
                    <Image
                      width={40}
                      src={turno.servicios[0].icono}
                      alt="Icono del servicio"
                    />
                  ) : (
                    <p>Sin Icono</p>
                  )}
                </div>
                <div className="text-4xl font-bold flex items-center">
                  {turno.codigo}
                </div>
              </div>
              <div className="col-span-5 grid grid-cols-12">
                <Circle
                  fill={
                    estados.find((e) => e.estado === turno.estado)?.color ?? "#000"
                  }
                  strokeWidth={0}
                  size={30}
                  className="self-center"
                />
                <div className="col-span-11 font-semibold text-4xl flex items-center">
                  {turno.usuario
                    ? `${turno.usuario.nombres} ${turno.usuario.apellidos}`
                    : "Sin Usuario"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-20  w-full bg-white z-10">
        {ultimoTurno && <FooterTV ultimoTurno={ultimoTurno} />}
      </div>
      {ultimoTurno && <ModalUltimoTurno ultimoTurno={ultimoTurno} numeroTurnos={turnos.length} />}
    </div>
  );
};
