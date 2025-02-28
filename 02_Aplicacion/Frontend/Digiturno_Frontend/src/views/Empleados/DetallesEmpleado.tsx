import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";
interface EditarEmpleadoProps {
  id: number;
  empleados: User[]
}

import { EyeIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { User } from "../../states/context/Interface";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const DetallesEmpleado: React.FC<EditarEmpleadoProps> = ({ id, empleados }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [Empleado, setEmpleados] = useState<User>();
  useEffect(() => {
    const empleado = empleados.find((t: any) => t.id == id);
    setEmpleados(empleado);
  }, [id]);
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
          <ModalHeader className="flex flex-col gap-1 font-semibold text-2xl">
            Detalle Empleado
          </ModalHeader>
          <ModalBody>
            <div className="flex">
              <Input
                value={Empleado?.tipoDocumento}
                label="T. Documento"
                className="w-[50%] mx-5"
                isDisabled
              />

              <Input
                isDisabled
                label="Número Documento"
                type="number"
                name="numeroDocumento"
                value={Empleado?.numeroDocumento}
                className="mx-5"
              />
            </div>
            <div className="flex my-3">
              <Input
                isDisabled
                value={Empleado?.nombres}
                label="Nombres"
                type="text"
                name="nombre"
                className="mx-5"
              />
              <Input
                isDisabled
                value={Empleado?.apellidos}
                label="Apellidos"
                type="text"
                name="apellidos"
                className="mx-5"
              />
            </div>
            <div className="flex my-3">
              <Input
                isDisabled
                label="Teléfono"
                type="number"
                name="celular"
                value={Empleado?.telefono}
                className="w-[50%] mx-5"
              />
              <Input
                isDisabled
                value={Empleado?.correo}
                label="Correo"
                type="email"
                name="correo"
                className="w-full mx-5"
              />
            </div>
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