import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Select,
  SelectItem,
  Input,
} from "@nextui-org/react";
import {
  NumeroDocumento,
  ValidarConfirmarContrsena,
  validarApellidos,
  validartelefono,
  validarContrasena,
  validarCorreo,
  validarNombre,
} from "./Validaciones";
import showToast from "../../utils/toastUtil";
import { User } from "../../states/context/Interface";
import useFetchWithAuth from "../../utils/peticionesHttp";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
const RUTA_API = import.meta.env.VITE_API_URL;

//#region Leo te quiero 💕 :D
const tipoDocumento = [
  { key: "CC", label: "C.C." },
  { key: "CE", label: "C.E." },
];

export const CrearEmpleado: React.FC<{
  onServicioCreado: (nuevoServicio: User) => void;
}> = ({ onServicioCreado }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { fetchWithAuth } = useFetchWithAuth();

  // Estado para los datos del formulario y mensajes de error
  const [formData, setFormData] = useState({
    numeroDocumento: "",
    nombres: "",
    apellidos: "",
    telefono: "",
    correo: "",
    contrasena: "",
    confirmarContrasena: "",
    tipoDocumento: "",
  });

  const [formErrors, setFormErrors] = useState({
    numeroDocumento: null,
    nombres: null,
    apellidos: null,
    telefono: null,
    correo: null,
    contrasena: null,
    confirmarContrasena: null,
  });

  // Función de manejo de cambios
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Actualizar el valor en el estado del formulario
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Validar el campo y actualizar los errores
    let errorMessage: string | null = null;
    switch (name) {
      case "numeroDocumento":
        errorMessage = NumeroDocumento(Number(value)) as string | null;
        break;
      case "nombres":
        errorMessage = validarNombre(value) as string | null;
        break;
      case "apellidos":
        errorMessage = validarApellidos(value) as string | null;
        break;
      case "telefono":
        errorMessage = validartelefono(Number(value)) as string | null;
        break;
      case "correo":
        errorMessage = validarCorreo(value) as string | null;
        break;
      case "contrasena":
        errorMessage = validarContrasena(value) as string | null;
        break;
      case "confirmarContrasena":
        errorMessage = ValidarConfirmarContrsena(formData.contrasena, value) as
          | string
          | null;
        break;
      default:
        break;
    }

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };
  const handleSelectChange = (value: any) => {
    setFormData({
      ...formData,
      tipoDocumento: value,
    });
  };
  const SubirInformacion = async () => {
    const {
      apellidos,
      telefono,
      contrasena,
      correo,
      nombres,
      numeroDocumento,
      tipoDocumento,
      confirmarContrasena
    } = formData;
    if (
      apellidos == null ||
      apellidos.trim() === "" ||
      telefono == null ||
      telefono.trim() === "" ||
      contrasena == null ||
      contrasena.trim() === "" ||
      correo == null ||
      correo.trim() === "" ||
      nombres == null ||
      nombres.trim() === "" ||
      numeroDocumento == null ||
      numeroDocumento.trim() === "" ||
      tipoDocumento == null ||
      tipoDocumento.trim() === ""
    ) {
      return showToast("error", "Complete el formulario");
    }
    if(confirmarContrasena != contrasena){
      return showToast("error", "Las contraseñas no coinciden")
    }
    const tipoId = 2; //id del orientador

    try {
      const response = await fetchWithAuth(`${RUTA_API}api/empleado`, {
        method: "POST",
        body: JSON.stringify({
          nombres,
          apellidos,
          telefono,
          contrasena,
          correo,
          numeroDocumento,
          tipoDocumento,
          tipoId,
        }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        showToast("error", responseData.message);
        throw new Error("Error en la solicitud: " + response);
      }
      onServicioCreado(responseData);
      showToast("success", "Empleado creado exitosamente");

      handleOnClose()
    } catch (error) {
    
      showToast("error", `Error al crear el empleado ${error}`);
    }
  };

  //Ojo contraseña siempre disponible
  const [isVisible1, setIsVisible1] = React.useState(false);
  const [isVisible2, setIsVisible2] = React.useState(false);
  const toggleVisibility1 = () => setIsVisible1(!isVisible1);
  const toggleVisibility2 = () => setIsVisible2(!isVisible2);

  //limpiar form al salir
  const handleOnClose = (()=>{
    onClose()
    setFormData({
    numeroDocumento: "",
    nombres: "",
    apellidos: "",
    telefono: "",
    correo: "",
    contrasena: "",
    confirmarContrasena: "",
    tipoDocumento: "",
    });
    setFormErrors({
      numeroDocumento: null,
      nombres: null,
      apellidos: null,
      telefono: null,
      correo: null,
      contrasena: null,
      confirmarContrasena: null,
    })
  })

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button
          className="bg-[#007832] text-[#fff]"
          radius="sm"
          onPress={onOpen}
        >
          + Crear Empleado
        </Button>
      </div>
      <Modal backdrop="blur" isOpen={isOpen} onClose={handleOnClose} isDismissable={false} size="2xl">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 font-semibold text-2xl">
            Crear Empleado
          </ModalHeader>
          <ModalBody>
            <form>
              <div className="flex">
                <Select
                  label="T. Documento"
                  className="w-[50%] mx-5"
                  onChange={(e) => handleSelectChange(e.target.value)}
                  value={formData.tipoDocumento}
                >
                  {tipoDocumento.map((item) => (
                    <SelectItem key={item.key} value={item.key}>
                      {item.label}
                    </SelectItem>
                  ))}
                </Select>

                <Input
                  label="Número Documento"
                  type="number"
                  name="numeroDocumento"
                  value={formData.numeroDocumento}
                  onChange={handleInputChange}
                  isInvalid={!!formErrors.numeroDocumento}
                  errorMessage={formErrors.numeroDocumento || ""}
                  className=" mx-5"
                />
              </div>
              <div className="flex my-3">
                <Input
                  label="Nombres"
                  type="text"
                  name="nombres"
                  value={formData.nombres}
                  onChange={handleInputChange}
                  isInvalid={!!formErrors.nombres}
                  errorMessage={formErrors.nombres || ""}
                  className="mx-5"
                />
                <Input
                  label="Apellidos"
                  type="text"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleInputChange}
                  isInvalid={!!formErrors.apellidos}
                  errorMessage={formErrors.apellidos || ""}
                  className="mx-5"
                />
              </div>
              <div className="flex my-3">
                <Input
                  label="Teléfono"
                  type="number"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  isInvalid={!!formErrors.telefono}
                  errorMessage={formErrors.telefono || ""}
                  className="w-[50%] mx-5"
                />
                <Input
                  label="Correo"
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleInputChange}
                  isInvalid={!!formErrors.correo}
                  errorMessage={formErrors.correo || ""}
                  className="w-full mx-5"
                />
              </div>
              <div className="flex my-3">
                <Input
                  endContent={
                    <button className="focus:outline-none" type="button" onClick={toggleVisibility1}>
                      {isVisible1 ? (
                        <EyeIcon className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <EyeClosedIcon className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                  type={isVisible1 ? "text" : "password"}
                  label="Contraseña"
                  name="contrasena"
                  value={formData.contrasena}
                  onChange={handleInputChange}
                  isInvalid={!!formErrors.contrasena}
                  errorMessage={formErrors.contrasena || ""}
                  className="mx-5"
                />
                <Input
                  endContent={
                    <button className="focus:outline-none" type="button" onClick={toggleVisibility2}>
                      {isVisible2 ? (
                        <EyeIcon className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <EyeClosedIcon className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                  type={isVisible2 ? "text" : "password"}
                  label="Confirmar Contraseña"
                  name="confirmarContrasena"
                  value={formData.confirmarContrasena}
                  onChange={handleInputChange}
                  isInvalid={!!formErrors.confirmarContrasena}
                  errorMessage={formErrors.confirmarContrasena || ""}
                  className="mx-5"
                />
              </div>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onPress={handleOnClose}>
              Cerrar
            </Button>
            <Button
              color="primary"
              onPress={SubirInformacion}
              className="bg-[#007832] text-[#fff]"
            >
              Crear
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
