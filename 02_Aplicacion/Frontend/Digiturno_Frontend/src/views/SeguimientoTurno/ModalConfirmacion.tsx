import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { CircleHelp } from "lucide-react";
import { useEffect, useState } from "react";
import { ModalFinalizacion } from "./ModalFinalizacion";

export const ModalConfirmacion = ({
  setValue,
  formData,
  setFormData,
  setTurno,
  selectedValue,
  setEstadoModal,
  servicios,
  setReiniciarSelect
}: any) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [confirmacion, setConfirmacion] = useState<boolean>(false);
  //const [prevValue, setPrevValue] = useState(formData.estado ?? "");

  const cancelarCambioEstado = () => {
    setValue("");
    setReiniciarSelect((prevKey:any) => prevKey + 1);
    setEstadoModal("");
    onClose();
  };

  const confirmarBoton = () => {
    setValue(selectedValue);
    setTurno((prevData: any) => ({
      ...prevData,
      estado: selectedValue,
    }));
    setConfirmacion(true);
    onClose();
  };

  useEffect(() => {
    if (selectedValue === "Cancelado" || selectedValue === "Atendido") {
      onOpen();
    }
    if(formData.estado === "Cancelado" || formData.estado === "Atendido"){
      setConfirmacion(false)
    }
  }, [selectedValue]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        isDismissable={false}
        hideCloseButton={true}
        onClose={() => {
          cancelarCambioEstado();
        }}
        backdrop="blur"
        className="p-10"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 content-center place-items-center">
            <CircleHelp strokeWidth={1} size={130}/>
          </ModalHeader>
          <ModalBody className="text-center">
            <p>
              ¿Está seguro de cambiar el estado del turno a{" "}
              <b>{selectedValue}</b>?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              className="bg-[#FF4B2B] text-white text-lg"
              onPress={() => {
                cancelarCambioEstado();
              }}
            >
              Cancelar
            </Button>
            <Button
              className="bg-[#007832] text-white text-lg"
              onPress={confirmarBoton}
            >
              Cambiar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <ModalFinalizacion
      formData={formData}
      setFormData={setFormData}
      servicios={servicios}
      confirmacion={confirmacion}
      setConfirmacion={setConfirmacion}
      selectedValue={selectedValue}
    />
    </>
  );
};
