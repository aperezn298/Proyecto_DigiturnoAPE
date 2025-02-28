/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Input } from "@nextui-org/react";
import { RectangleEllipsis } from "lucide-react";
import useFetchWithAuth from "../../../utils/peticionesHttp";
import showToast from "../../../utils/toastUtil";
import { useState } from "react";
const RUTA_API = import.meta.env.VITE_API_URL;

export const FormCodigo = ({
  formData,
  setFormData,
  handleChange,
  reiniciarRecuperar,
}: any) => {
  const { fetchWithAuth } = useFetchWithAuth();
  const [errorCodigo, setErrorCodigo] = useState("")
  const vistaNuevaContrasena = () => {
    setFormData((prevData: any) => ({
      ...prevData,
      vista: 3,
    }));
  };

  const validarCodigoRegex = (codigo: string) => {
    const regexCodigo = /^\d{6}$/;
    return regexCodigo.test(codigo);
  };

  const [enviandoCodigo, setEnviandoCodigo] = useState<boolean>(false);
  const validarCodigo = async () => {
    setEnviandoCodigo(true);

    if (!validarCodigoRegex(formData.codigo)) {
      setErrorCodigo("Ingresa el código de 6 dígitos");
      showToast("error", "Ingresa el código de 6 dígitos")
      setEnviandoCodigo(false);
      return;
    } else {
      setErrorCodigo("");
    }

    const data = {
      correo: formData.correoRecuperar,
      codigo: formData.codigo,
    };
    //validar datos
    const response = await fetchWithAuth(
      `${RUTA_API}api/acceso/validarCodigo`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      setEnviandoCodigo(false);
      return showToast("error", responseData.message);
    } else {
      vistaNuevaContrasena();
      setEnviandoCodigo(false);
      return showToast("success", responseData.message);
    }
  };

  return (
    <>
      <div className="sm:w-9/12 mx-auto">
        <p className="text-center text-[#BCBCBC] text-xl font-semibold md:text-2xl">
          Recuperar Contraseña
        </p>
        <br />
        <p className="text-center text-[#BCBCBC] text-sm md:text-lg">
          Ingresa el código enviado al correo
        </p>
        <form className="w-full flex flex-col items-center mt-4">
          <div className="flex items-center w-full">
            <RectangleEllipsis
              color="#BCBCBC"
              strokeWidth={1}
              size={40}
              className="mr-4"
            />
            <Input
              type="number"
              name="codigo"
              variant="underlined"
              onChange={handleChange}
              value={formData.codigo}
              label="Código"
              size="md"
              fullWidth
              isInvalid={errorCodigo === "Ingresa el código de 6 dígitos" ? true : false}
              errorMessage={errorCodigo}
            />
          </div>
          <div className="mt-7">
            <Button
              className="bg-gray-300 text-lg w-30 h-12"
              onPress={reiniciarRecuperar}
            >
              Cancelar
            </Button>
            <Button
              className="bg-[#00304D] text-white text-lg w-48 h-12 ml-3"
              onPress={validarCodigo}
              isLoading={enviandoCodigo ? true : false}
            >
              Enviar
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};
