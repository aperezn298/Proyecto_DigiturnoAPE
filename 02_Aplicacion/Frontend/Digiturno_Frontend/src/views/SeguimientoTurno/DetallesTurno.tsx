import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    useDisclosure,
    Input,
    Image,
  } from "@nextui-org/react";
import { Eye } from "lucide-react";
  
  export const DetallesTurno = ({
    turnos,
    turnoId
  }: any) => {
    function obtenerHoraActual(): Date {
      const fechaUTC = new Date();
  
      const opciones: Intl.DateTimeFormatOptions = {
          timeZone: 'America/Bogota',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
      };
  
      const formatoColombiano = fechaUTC.toLocaleString('es-CO', opciones);
  
      const [fecha, hora] = formatoColombiano.split(', ');
      const [dia, mes, anio] = fecha.split('/');
      const [horas, minutos, segundos] = hora.split(':');
  
      return new Date(
          parseInt(anio), 
          parseInt(mes) - 1, 
          parseInt(dia), 
          parseInt(horas), 
          parseInt(minutos), 
          parseInt(segundos)
      );
  }
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const turno = turnos.find((t:any) => t.id == turnoId);
    const tiempoEspera= ()=>{
        const ahora = obtenerHoraActual()
        const [horas, minutos] = turno.horaCreacion.split(":").map(Number);
        const fechaCreacion = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), horas, minutos);
        const diferenciaMs = ahora.getTime() - fechaCreacion.getTime();
        const diferenciaMinutos = Math.floor(diferenciaMs / (1000 * 60));
        return `${diferenciaMinutos} minutos`;
    }
  
    return (
      <>
      <div onClick={onOpen}>
        <Eye size={40} strokeWidth={1} className="cursor-pointer hover:scale-90"/>
      </div>
        
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur" className="p-10">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <h1 className="font-semibold text-5xl">
                    Turno {turno.codigo}
                  </h1>
                </ModalHeader>
                <ModalBody>
                  <Input
                    type="text"
                    label="Nombre"
                    value={turno.usuario.nombres+" "+turno.usuario.apellidos}
                    isDisabled={true}
                    size="lg"
                  />
                  
                  <Input
                    type="text"
                    label="Fecha"
                    value={turno.fecha}
                    isDisabled={true}
                    size="lg"
                  />
                  <Input
                    type="text"
                    label="Hora de Creación"
                    value={turno.horaCreacion}
                    isDisabled={true}
                    size="lg"
                  />
                  <Input
                    type="text"
                    label="Tiempo Esperado"
                    value={tiempoEspera()}
                    isDisabled={true}
                    size="lg"
                  />

                  <h1 className="font-semibold text-lg">
                    Servicios
                  </h1>
                  <ul className="list-disc pl-5 space-y-2">
                  {turno.servicios.map((servicio:any, index:any) => (
                     <li key={index}>{servicio.nombre}</li>
                ))}
                  </ul>
                  
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  };
  