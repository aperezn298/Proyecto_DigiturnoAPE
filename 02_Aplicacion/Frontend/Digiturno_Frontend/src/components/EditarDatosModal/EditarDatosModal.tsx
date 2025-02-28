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
import ImagenEmail from "../../assets/correo-electronico.png";
import telefono from "../../assets/llamar.png";
import useFetchWithAuth from "../../utils/peticionesHttp";
import { UsuarioContext } from "../../utils/usuarioContext";
import { useContext, useEffect, useState } from "react";
import showToast from "../../utils/toastUtil";
import { validartelefono, validarCorreo } from "../../views/Empleados/Validaciones";

const RUTA_API = import.meta.env.VITE_API_URL;

export const EditarContrasenaModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { fetchWithAuth } = useFetchWithAuth();
  const context = useContext(UsuarioContext);

  const [formData, setFormData] = useState({
    telefono: "",
    correo: "",
  });

  const [errors, setErrors] = useState({
    telefono: "",
    correo: "",
  });

  // Inicializar datos del formulario desde el contexto
  useEffect(() => {
    if (context?.usuario) {
      setFormData({
        telefono: context.usuario.telefono || "",
        correo: context.usuario.correo || "",
      });
    }
  }, [context]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validar el campo cambiado
    validateField(name, value);
  };

  const validateField = (name: string, value: string) => {
    let error = "";

    if (name === "telefono") {
      error = validartelefono(Number(value)) as string;
    } else if (name === "correo") {
      error = validarCorreo(value) as string;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = async () => {
    const { telefono, correo } = formData;

    // Validar todos los campos antes de enviar
    validateField("telefono", telefono);
    validateField("correo", correo);

    if (errors.telefono || errors.correo) {
      return showToast("error", "Corrige los errores antes de continuar");
    }

    if (!telefono.trim() || !correo.trim()) {
      return showToast("error", "Complete el formulario");
    }

    try {
      const response = await fetchWithAuth(
        `${RUTA_API}api/empleado/cambiarDatos/${context?.usuario.id}`,
        {
          method: "POST",
          body: JSON.stringify({ correo, telefono }),
        }
      );

      if (response.ok) {
        showToast("success", "Datos cambiada exitosamente");
        context?.editarCorreoTelefono(correo, telefono);
        onClose();
      } else {
        const errorText = await response.text();
        const errorJson = JSON.parse(errorText);
        showToast("error", errorJson.message || "Ocurrió un error");
      }
    } catch (error:any) {
      console.error(error);
      showToast("error", "Error al actualizar los datos");
      showToast("error", error.message || "Ocurrió un error inesperado");
    }
  };

  return (
    <>
      <Button onPress={onOpen} className="w-full bg-[#00304D] text-white">
        Editar
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onClose}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
      >
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">Editar Datos</ModalHeader>
            <ModalBody>
              <Input
                type="email"
                name="correo"
                label="Email"
                labelPlacement="outside"
                startContent={<Image width={40} src={ImagenEmail} />}
                value={formData.correo}
                onChange={handleChange}
                isInvalid={errors.correo ? true : false}
                errorMessage={errors.correo}
              />
              <Input
                type="text"
                name="telefono"
                label="Teléfono"
                labelPlacement="outside"
                startContent={<Image width={40} src={telefono} />}
                value={formData.telefono}
                onChange={handleChange}
                isInvalid={errors.telefono ? true : false}
                errorMessage={errors.telefono}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onPress={onClose}>
                Cancelar
              </Button>
              <Button color="primary" onPress={handleSubmit}>
                Enviar
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
};