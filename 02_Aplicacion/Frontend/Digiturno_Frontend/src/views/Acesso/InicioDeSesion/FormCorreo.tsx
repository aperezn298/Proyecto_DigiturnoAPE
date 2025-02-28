/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Input } from "@nextui-org/react";
import { Mail } from "lucide-react";
import showToast from "../../../utils/toastUtil";
import useFetchWithAuth from "../../../utils/peticionesHttp";
import { useState } from "react";

interface FormCorreoProps {
  formData: { correoRecuperar: string; vista: number };
  setFormData: (data: any) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  reiniciarRecuperar: () => void;
}
const RUTA_API = import.meta.env.VITE_API_URL;

export const FormCorreo = ({
  formData,
  setFormData,
  handleChange,
  reiniciarRecuperar,
}: FormCorreoProps) => {
  const { fetchWithAuth } = useFetchWithAuth();
  const [enviandoCorreo, setEnviandoCorreo] = useState(false);
  const [errorCorreo, setErrorCorreo] = useState("");

  const vistaCodigo = () => {
    setFormData((prevData: any) => ({
      ...prevData,
      vista: 2,
    }));
  };

  const validarCorreo = (correo: string) => {
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexCorreo.test(correo);
  };

  const enviarCorreo = async () => {
    if (!validarCorreo(formData.correoRecuperar)) {
      setErrorCorreo("Por favor, ingresa un correo electrónico válido.");
      return;
    } else {
      setErrorCorreo("");
    }

    setEnviandoCorreo(true);
    try {
      const response = await fetchWithAuth(
        `${RUTA_API}api/acceso/enviarCodigo`,
        {
          method: "POST",
          body: JSON.stringify({ correo: formData.correoRecuperar }),
          headers: { "Content-Type": "application/json" },
        }
      );

      const responseData = await response.json();
      if (!response.ok) {
        showToast("error", responseData.message);
      } else {
        vistaCodigo();
        showToast("success", responseData.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showToast("error", "Hubo un error al enviar el correo. Inténtalo de nuevo.");
    } finally {
      setEnviandoCorreo(false);
    }
  };

  return (
    <div className="sm:w-9/12 mx-auto">
      <p className="text-center text-[#BCBCBC] text-xl font-semibold md:text-2xl">
        Recuperar Contraseña
      </p>
      <br />
      <p className="text-center text-[#BCBCBC] text-sm md:text-lg">
        Ingresa el correo
      </p>
      <form className="w-full flex flex-col items-center mt-4">
        <div className="flex items-center w-full">
          <Mail color="#BCBCBC" strokeWidth={1} size={40} className="mr-4" />
          <Input
            type="email"
            name="correoRecuperar"
            variant="underlined"
            onChange={handleChange}
            value={formData.correoRecuperar}
            label="Email"
            size="md"
            isInvalid={errorCorreo === "Por favor, ingresa un correo electrónico válido." ? true : false}
            fullWidth
            errorMessage={errorCorreo}
          />
        </div>
        <div className="mt-7 flex">
          <Button
            className="bg-gray-300 text-lg w-30 h-12"
            onPress={reiniciarRecuperar}
            disabled={enviandoCorreo}
          >
            Cancelar
          </Button>
          <Button
            className="bg-[#00304D] text-white text-lg w-48 h-12 ml-3"
            onPress={enviarCorreo}
            isLoading={enviandoCorreo}
          >
            Enviar
          </Button>
        </div>
      </form>
    </div>
  );
};
