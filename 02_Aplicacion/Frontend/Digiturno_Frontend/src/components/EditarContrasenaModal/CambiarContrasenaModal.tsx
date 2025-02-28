import React, { useContext, useState } from "react";
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
import { validarContrasena } from "../../views/Empleados/Validaciones";
import useFetchWithAuth from "../../utils/peticionesHttp";
import showToast from "../../utils/toastUtil";
import { UsuarioContext } from "../../utils/usuarioContext";

const RUTA_API = import.meta.env.VITE_API_URL;

interface FormData {
  contrasenaActual: string;
  contrasenaNueva: string;
}

interface FormErrors {
  contrasenaActual?: string | any;
  contrasenaNueva?: string | any;
}

export const CambiarContrasenaModal: React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { fetchWithAuth } = useFetchWithAuth();
  const { usuario }:any = useContext(UsuarioContext);
  const [formData, setFormData] = useState<FormData>({
    contrasenaActual: "",
    contrasenaNueva: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const correo = usuario?.correo;

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    let errorMessage: string | any = null;

    switch (field) {
      case "contrasenaActual":
        errorMessage = value.trim() ? null : "Este campo es obligatorio";
        break;
      case "contrasenaNueva":
        errorMessage = validarContrasena(value);
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: errorMessage }));
  };

  const handleSubmit = async () => {
    const { contrasenaActual, contrasenaNueva } = formData;

    const contrasenaActualError = contrasenaActual.trim()
      ? null
      : "Este campo es obligatorio";
    const contrasenaNuevaError = validarContrasena(contrasenaNueva);

    setErrors({
      contrasenaActual: contrasenaActualError,
      contrasenaNueva: contrasenaNuevaError,
    });

    if (contrasenaActualError || contrasenaNuevaError) {
      showToast("error", "Corrige los errores antes de continuar");
      return;
    }

    try {
      const response = await fetchWithAuth(
        `${RUTA_API}api/empleado/cambiarContrasena`,
        {
          method: "POST",
          body: JSON.stringify({ correo, contrasenaActual, contrasenaNueva }),
        }
      );

      if (response.ok) {
        showToast("success", "Contraseña cambiada exitosamente");
        onOpenChange(); // Cerrar el modal
      } else {
        const errorText = await response.text();
        const errorJson = JSON.parse(errorText);
        showToast("error", errorJson.message || "Ocurrió un error");
      }
    } catch (error: any) {
      console.error("Error:", error);
      showToast("error", error.message || "Ocurrió un error inesperado");
    }
  };

  return (
    <>
      <Button onPress={onOpen} className="w-full bg-[#00304D] text-white">
        Cambiar Contraseña
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Cambiar Contraseña
              </ModalHeader>
              <ModalBody>
                <Input
                  type="password"
                  variant="bordered"
                  label="Contraseña Actual"
                  size="md"
                  fullWidth
                  value={formData.contrasenaActual}
                  onChange={(e) =>
                    handleInputChange("contrasenaActual", e.target.value)
                  }
                  errorMessage={errors.contrasenaActual}
                />
                <Input
                  type="password"
                  variant="bordered"
                  label="Nueva Contraseña"
                  size="md"
                  fullWidth
                  value={formData.contrasenaNueva}
                  onChange={(e) =>
                    handleInputChange("contrasenaNueva", e.target.value)
                  }
                  errorMessage={errors.contrasenaNueva}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={handleSubmit}>
                  Enviar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
