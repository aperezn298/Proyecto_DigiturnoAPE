import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Tooltip,
  Textarea,
} from "@nextui-org/react";
import { Circle, CircleAlert, EyeIcon, Star } from "lucide-react";
import { HistorialTurnos } from "../../states/context/Interface";
const estados = [
  { estado: "Cancelado", color: "#FF4B2B" },
  { estado: "Atendido", color: "#00304D" },
];

interface DetallesEmpleadoProps {
  item: HistorialTurnos;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const DetallesHistorialTurnos: React.FC<DetallesEmpleadoProps> = ({
  item,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <div className="flex flex-wrap gap-3" onClick={onOpen}>
        <EyeIcon
          strokeWidth={1}
          size={30}
          color="#BCBCBC"
          className="mr-4 cursor-pointer"
        />
      </div>
      <Modal backdrop="blur" isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <ModalHeader className="font-semibold text-2xl place-items-center space-x-2">
            <p>Informacion de Turno</p>
            <Tooltip content={"Turno " + item.estado}>
              <Circle
                fill={
                  estados.find((e) => e.estado === item.estado)?.color ?? "#000"
                }
                strokeWidth={0}
                size={25}
              />
            </Tooltip>
            {item.prioridad == true ? (
              <Tooltip content={"Turno Preferencial"}>
                <CircleAlert strokeWidth={1} size={25} />
              </Tooltip>
            ) : (
              ""
            )}
            {item.calificacion != null ? (
                <div className="flex place-items-center">
                    <Tooltip
                content={`${item.calificacion.calificacion} Estrella${
                  item.calificacion.calificacion > 1 ? "s" : ""
                }`} >
                <Star size={30} fill="#FFBE30" strokeWidth={0} />
                
              </Tooltip>
              <p className="text-base">{item.calificacion.calificacion}</p>
                </div>
              
            ) : (
              ""
            )}
          </ModalHeader>
          <ModalBody className="grid sm:grid-cols-2">
            <Input
              label="Nombre"
              type="text"
              name="nombre"
              isDisabled
              value={item.usuario.nombres + " " + item.usuario.apellidos}
            />
            <Input
              label="Código"
              type="text"
              name="Código"
              isDisabled
              value={item.codigo}
            />
            <Input
              label="Tipo de Usuario"
              type="text"
              name="tipoUsuario"
              isDisabled
              value={item.usuario.tipoUsuario.nombre}
            />
            <Input
              label="Tipo de Población"
              type="text"
              name="tipoPoblacion"
              isDisabled
              value={item.usuario.tipoPoblacion.nombre}
            />
            <Input
              label="Orientador"
              type="text"
              name="Orientador"
              isDisabled
              value={item.empleado.nombres + " " + item.empleado.apellidos}
            />

            <Input
              label="Fecha"
              type="text"
              name="Fecha"
              isDisabled
              value={item.fecha}
            />
            <Input
              label="Tiempo de Espera"
              type="text"
              name="tiempoEspera"
              isDisabled
              value={parseInt(item.tiempoEspera).toString() + " minutos"}
            />
            <Input
              label="Tiempo de Atención"
              type="text"
              name="tiempoAtencion"
              isDisabled
              value={parseInt(item.tiempoProceso).toString() + " minutos"}
            />
            {item.observacion != null ? (
              <Textarea
                label="Observación"
                type="text"
                name="Observacion"
                isDisabled
                value={item.observacion}
              />
            ) : (
              ""
            )}
            <div className="mx-2">
              <p className="font-semibold text-[12px] text-zinc-400">
                Servicios:{" "}
              </p>
              <ol className="pl-5">
                {item.servicios.map((servicio) => (
                  <li
                    className="list-disc text-[15px] text-zinc-500"
                    key={servicio.id}
                  >
                    {servicio.nombre}
                  </li>
                ))}
              </ol>
            </div>
            {item.calificacion != null && item.calificacion.observacion != "" ? (
              <Textarea
                label="Observación del Usuario"
                type="text"
                name="Observacion del usuario"
                isDisabled
                value={item.calificacion.observacion}
              />
            ) : (
              ""
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onPress={onClose}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
