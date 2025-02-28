import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Image,
} from "@nextui-org/react";
import { ChevronRight } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { validarModulo } from "./Validaciones";
import showToast from "../../utils/toastUtil";
import useFetchWithAuth from "../../utils/peticionesHttp";
import { UsuarioContext } from "../../utils/usuarioContext";
const RUTA_API = import.meta.env.VITE_API_URL; 
export const ModalModulo = ({ formData, setFormData }: any) => {
  const { fetchWithAuth } = useFetchWithAuth();
  const context = useContext(UsuarioContext);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [nuevoModulo, setModulo] = useState(formData.modulo);
  const [error, setError] = useState<string | null>(null);

  const handleModuloChange = (value: string) => {
    setModulo(value);
    const validationError = validarModulo(Number(value));
    setError(validationError);
  };

  const cambiarModulo = async () => {
    if (!error) {
      if (formData.modulo !== nuevoModulo) {
        setFormData((prevData: any) => ({
          ...prevData,
          modulo: nuevoModulo,
        }));
        const response = await fetchWithAuth(
          `${RUTA_API}api/turno/modulo/` + context?.usuario.id,
          {
            method: "POST",
            body: JSON.stringify({ modulo: nuevoModulo }),
          }
        );
        const responseData = await response.json();
        if (response.ok) {
          localStorage.setItem("modulo", nuevoModulo);
          showToast("success", responseData.message);
          onClose();
        } else {
          showToast("error", responseData.message);
        }
      } else {
        onClose();
      }
    } else {
      showToast("error", error);
    }
  };

  useEffect(() => {
    if (formData.modulo == null) {
      onOpen();
    }
  }, [formData.modulo]);

  return (
    <>
      <Button onPress={onOpen}>Módulo {nuevoModulo}</Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        hideCloseButton={true}
        isDismissable={false}
        backdrop="blur"
        className="p-10"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h1 className="font-semibold text-5xl">Módulo</h1>
              </ModalHeader>
              <ModalBody>
                <p>Digite el número del módulo asignado:</p>
                <Input
                  name="modulo"
                  type="text"
                  label="Módulo"
                  value={nuevoModulo}
                  onValueChange={handleModuloChange}
                  isInvalid={!!error}
                  errorMessage={error || ""}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  className="bg-[#007832] text-white text-lg"
                  onPress={cambiarModulo}
                  endContent={<ChevronRight />}
                >
                  Guardar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
