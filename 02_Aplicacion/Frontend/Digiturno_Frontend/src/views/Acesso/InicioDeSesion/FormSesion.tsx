/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Input } from "@nextui-org/react";
//import email from "../../../assets/correo-electronico.png";
//import password from "../../../assets/contrasena.png";
import { Mail, LockKeyhole, ArrowLeft } from "lucide-react";
import { useContext, useState, ChangeEvent } from "react";
import { UsuarioContext } from "../../../utils/usuarioContext";
import useFetchWithAuth from "../../../utils/peticionesHttp";
import showToast from "../../../utils/toastUtil";
import { Link } from "react-router-dom";
const RUTA_API = import.meta.env.VITE_API_URL;

export const FormSesion = ({ formData, setFormData, handleChange }: any) => {
  const { fetchWithAuth } = useFetchWithAuth();
  const context = useContext(UsuarioContext);

  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const validarCorreo = (correo: string) => {
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(
      !regexCorreo.test(correo) && correo != "" ? "Correo inválido" : ""
    );
  };
  const validarContrasena = (contrasena: string) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
    const mensajeError =
      "La contraseña debe tener al menos 6 caracteres, una mayúscula, un número y un carácter especial";

    setPasswordError(
      !regex.test(contrasena) && contrasena != "" ? mensajeError : ""
    );
  };

  const vistaCorreo = () => {
    setFormData((prevData: any) => ({
      ...prevData,
      vista: 1,
    }));
  };

  const [enviandoForm, setEnviandoForm] = useState<boolean>(false);

  const iniciarSesion = async () => {
    if (emailError || passwordError) return;

    if (
      formData.correo == null ||
      formData.correo == "" ||
      formData.contrasena == null ||
      formData.contrasena == ""
    ) {
      if (formData.correo == null || formData.correo == "") {
        return showToast("error", "Debe ingresar un email");
      }
      return showToast("error", "Debe ingresar una contraseña");
    }

    setEnviandoForm(true);

    const data = {
      correo: formData.correo,
      contrasena: formData.contrasena,
    };

    const response = await fetchWithAuth(
      `${RUTA_API}api/acceso/iniciarSesion`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    const usuarioData = await response.json();

    if (!response.ok) {
      setEnviandoForm(false);
      return showToast("error", usuarioData.message);
    } else {
      if (context?.actualizarUsuario) {
        context.actualizarUsuario({
          id: usuarioData.id,
          nombre: usuarioData.nombre,
          correo: usuarioData.correo,
          telefono: usuarioData.telefono,
          tipoEmpleado: usuarioData.tipoEmpleado,
          token: usuarioData.token,
        });
        setEnviandoForm(false);
        return (window.location.href = "../../dashboard");
      } else {
        showToast( "error", "Error al guardar sesión");
      }
    }
  };
  return (
    <>
      <div className="sm:w-9/12 mx-auto">
        <p className="text-center text-[#BCBCBC] font-semibold text-xl md:text-2xl">
          Inicia Sesión
        </p>
        <form>
          <div className="w-full flex flex-col items-center">
            <div className="flex items-center w-full mt-2">
              <Mail
                size={40}
                strokeWidth={1}
                color="#BCBCBC"
                className="mr-4"
              />
              <Input
                type="email"
                autoComplete="email"
                name="correo"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  handleChange(e);
                  validarCorreo(e.target.value);
                }}
                value={formData.correo}
                variant="underlined"
                label="Email"
                size="md"
                fullWidth
                isInvalid={emailError === "Correo inválido" ? true : false}
                errorMessage={emailError}
              />
            </div>
            <div className="flex items-center w-full mt-2">
              <LockKeyhole
                strokeWidth={1}
                size={40}
                color="#BCBCBC"
                className="mr-4"
              />
              <Input
                autoComplete="current-password"
                type="password"
                name="contrasena"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  handleChange(e);
                  validarContrasena(e.target.value);
                }}
                value={formData.contrasena}
                variant="underlined"
                label="Contraseña"
                size="md"
                fullWidth
                isInvalid={
                  passwordError ===
                    "La contraseña debe tener al menos 6 caracteres, una mayúscula, un número y un carácter especial"
                    ? true
                    : false
                }
                errorMessage={passwordError}
              />
            </div>
            <Button
              className="bg-[#00304D] text-white text-lg w-48 h-12 mt-6"
              onPress={iniciarSesion}
              isLoading={enviandoForm}
              disabled={!!emailError || !!passwordError}
            >
              Ingresar
            </Button>
          </div>
        </form>
      </div>
      <div className="grid grid-cols-12">
        <div className="col-span-3 w-fit">
          <Link to={"/"}>
            <ArrowLeft
              strokeWidth={1}
              size={40}
              className="self-center hover:scale-90"
            />
          </Link>
        </div>

        <p
          className="text-[#BCBCBC] underline decoration-2 cursor-pointer decoration-[#BCBCBC] text-lg lg:text-lg mt-2 ml-2 col-span-6 hover:text-black hover:decoration-black"
          onClick={vistaCorreo}
        >
          Olvidé mi contraseña
        </p>
      </div>
    </>
  );
};
