/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Input } from "@nextui-org/react";
import { KeyRound } from "lucide-react";
import useFetchWithAuth from "../../../utils/peticionesHttp";
import showToast from "../../../utils/toastUtil";
import { useState } from "react";
const RUTA_API = import.meta.env.VITE_API_URL;

interface FormNuevaContrasenaProps {
  formData: {
    correoRecuperar: string;
    nuevaContrasena: string;
    confirmarNuevaContrasena: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  reiniciarRecuperar: () => void;
}

export const FormNuevaContrasena = ({
  formData,
  handleChange,
  reiniciarRecuperar,
}: FormNuevaContrasenaProps) => {
  const { fetchWithAuth } = useFetchWithAuth();
  const [enviandoContrasena, setEnviandoContrasena] = useState(false);
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

  const validarContrasena = (contrasena: string) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
    const mensajeError = "La contraseña debe tener al menos 6 caracteres, una mayúscula, un número y un carácter especial";
    setPasswordError(regex.test(contrasena) ? "" : mensajeError);
  };

  const validarConfirmacionContrasena = (contrasena: string, confirmarContrasena: string) => {
    const mensajeError = "Las contraseñas no coinciden";
    setConfirmPasswordError(contrasena === confirmarContrasena ? "" : mensajeError);
  };

  const cambiarContrasena = async () => {
    if (passwordError != "" || confirmPasswordError != "") {
      return showToast("error", "Verifique que las contraseñas coincidan con el formato y entre sí")
    };

    setEnviandoContrasena(true);

    if (formData.confirmarNuevaContrasena != formData.nuevaContrasena) {
      setEnviandoContrasena(false);
      return showToast("error", "Las contraseñas no coinciden")
    }
    const data = {
      correo: formData.correoRecuperar,
      contrasena: formData.nuevaContrasena,
    };

    const response = await fetchWithAuth(
      `${RUTA_API}api/acceso/cambiarContrasena`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    const responseData = await response.json();
    setEnviandoContrasena(false);

    if (!response.ok) {
      return showToast("error", responseData.message);
    } else {
      reiniciarRecuperar();
      return showToast("success", responseData.message);
    }
  };

  return (
    <div className="sm:w-9/12 mx-auto">
      <p className="text-center text-[#BCBCBC] text-xl font-semibold md:text-2xl">
        Recuperar Contraseña
      </p>
      <form className="w-full flex flex-col items-center mt-4">
        <div className="flex items-center w-full">
          <KeyRound color="#BCBCBC" strokeWidth={1} size={40} className="mr-4" />
          <Input
            type="password"
            name="nuevaContrasena"
            onChange={(e) => {
              handleChange(e);
              validarContrasena(e.target.value);
            }}
            value={formData.nuevaContrasena}
            variant="underlined"
            label="Nueva Contraseña"
            size="md"
            fullWidth
            isInvalid={Boolean(passwordError)}
            errorMessage={passwordError}
          />
        </div>
        <div className="flex items-center w-full mt-2">
          <KeyRound color="#BCBCBC" strokeWidth={1} size={40} className="mr-4" />
          <Input
            type="password"
            name="confirmarNuevaContrasena"
            onChange={(e) => {
              handleChange(e);
              validarConfirmacionContrasena(formData.nuevaContrasena, e.target.value);
            }}
            value={formData.confirmarNuevaContrasena}
            variant="underlined"
            label="Confirmar Contraseña"
            size="md"
            fullWidth
            isInvalid={Boolean(confirmPasswordError)}
            errorMessage={confirmPasswordError}
          />
        </div>
        <div className="mt-7">
          <Button
            className="bg-gray-300 text-lg w-30 h-12"
            onPress={reiniciarRecuperar}
            disabled={enviandoContrasena}
          >
            Cancelar
          </Button>
          <Button
            className="bg-[#00304D] text-white text-lg w-48 h-12 ml-3"
            onPress={cambiarContrasena}
            isLoading={enviandoContrasena}
          >
            Enviar
          </Button>
        </div>
      </form>
    </div>
  );
};
