import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Textarea,
  TimeInput,
} from "@nextui-org/react";
import { format } from "date-fns";
import {
  Codigo,
  Nombre,
  validarDescripcion,
  validarFecha,
} from "./Validaciones";
import { LucideFileSpreadsheet } from "lucide-react";
import showToast from "../../utils/toastUtil";
import {
  ServicioAttributes,
  ServicioSinIDYEstado,
} from "../../states/context/Interface";
import useFetchWithAuth from "../../utils/peticionesHttp";

const RUTA_API = import.meta.env.VITE_API_URL;

export const CrearServicio: React.FC<{
  onServicioCreado: (nuevoServicio: ServicioAttributes) => void;
}> = ({ onServicioCreado }) => {
  const { fetchWithAuth } = useFetchWithAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [boton, setBoton] = useState(true);
  const [formularioInformacion, setformularioInformacion] =
    useState<ServicioSinIDYEstado>({
      codigo: "",
      nombre: "",
      descripcion: "",
      duracion: "",
      icono: "",
    });
  const [formErrors, setFormErrors] = useState({
    codigo: null,
    nombre: null,
    descripcion: null,
    duracion: null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setformularioInformacion((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    let errorMessage: string | null = null;
    switch (name) {
      case "codigo":
        errorMessage = Codigo(value);
        break;
      case "nombre":
        errorMessage = Nombre(value);
        break;
      case "descripcion":
        errorMessage = validarDescripcion(value);
        break;
      case "duracion":
        errorMessage = validarFecha(value);
        break;
      default:
        break;
    }
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
    validarFormulario();
  };

  const validarFormulario = () => {
    const { codigo, nombre, descripcion, duracion } = formularioInformacion;
    const formularioCompleto =
      codigo &&
      nombre &&
      descripcion &&
      duracion &&
      !formErrors.codigo &&
      !formErrors.nombre &&
      !formErrors.descripcion &&
      !formErrors.duracion;
    setBoton(!formularioCompleto);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const formData = new FormData();
      formData.append("files", files[0]);
      try {
        const response = await fetch(`${RUTA_API}public`, {
          method: "POST",
          body: formData,
        });
        if (response.ok) {
          const result = await response.json();
          const imageUrl = result.files[0];
          setformularioInformacion((prevData) => ({
            ...prevData,
            icono: imageUrl,
          }));
          showToast("success", "Imagen subida exitosamente");
        } else {
          const errorText = await response.text();
      
          showToast("error", `Error al subir la imagen ${errorText}`);
        }
      } catch (error) {

        showToast("error", `Ocurrió un error al subir la imagen ${error}`);
      }
    }
  };

  const limpiarFormulario = () => {
    setformularioInformacion({
      codigo: "",
      nombre: "",
      descripcion: "",
      duracion: "",
      icono: "",
    });
    setFormErrors({
      codigo: null,
      nombre: null,
      descripcion: null,
      duracion: null,
    });
  };

  const SubirInformacion = async () => {
    const { codigo, nombre, descripcion, duracion, icono } =
      formularioInformacion;

    // Función para formatear la hora y los minutos
    const formatTime = () => {
      const { hour, minute } = duracion;
      const formattedHour = hour < 10 ? `0${hour}` : hour;
      const formattedMinute = minute < 10 ? `0${minute}` : minute;
      return `${formattedHour}:${formattedMinute}`;
    };

    try {
      const formattedDuracion = formatTime(); // Llamar a la función para obtener el tiempo formateado

      const response = await fetchWithAuth(`${RUTA_API}api/servicio`, {
        method: "POST",
        body: JSON.stringify({
          codigo,
          nombre,
          descripcion,
          duracion: formattedDuracion, // Usar el valor formateado
          icono,
        }),
      });

      if (response.ok) {
        const nuevoServicio = await response.json();
        onServicioCreado(nuevoServicio);
        showToast("success", "Servicio creado exitosamente");
        limpiarFormulario();
        onClose();
      } else {
        const errorText = await response.text();
        const errorJson = JSON.parse(errorText);
        
        showToast("error", errorJson.message || errorText || "Ocurrió un error");
      }
    } catch (error) {

      showToast("error", `Ocurrió un error al crear el servicio ${error}`);
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button
          className="bg-[#007832] text-[#fff]"
          radius="sm"
          onPress={onOpen}
        >
          + Crear Servicio
        </Button>
      </div>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onClose={onClose}
        size="2xl"
        aria-label="Crear Servicio"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 font-semibold text-2xl">
            Crear Servicio
          </ModalHeader>
          <ModalBody>
            <div className="flex">
              <Input
                label="Código"
                type="text"
                name="codigo"
                value={formularioInformacion.codigo}
                onChange={handleInputChange}
                isInvalid={!!formErrors.codigo}
                errorMessage={formErrors.codigo || ""}
                className="mx-5"
              />
              <Input
                label="Nombre"
                type="text"
                name="nombre"
                value={formularioInformacion.nombre}
                onChange={handleInputChange}
                isInvalid={!!formErrors.nombre}
                errorMessage={formErrors.nombre || ""}
                className="mx-5"
              />
            </div>
            <div className="flex my-3">
              <Textarea
                label="Descripción"
                name="descripcion"
                value={formularioInformacion.descripcion}
                onChange={handleInputChange}
                isInvalid={!!formErrors.descripcion}
                errorMessage={formErrors.descripcion || ""}
                className="mx-5"
              />
            </div>
            <div className="flex my-3">
              <TimeInput
                granularity="second"
                label="Duración"
                value={
                  formularioInformacion.duracion || {
                    hour: 1,
                    minute: 0,
                    second: 0,
                  }
                }
                onChange={(newTime) => {
                  // Validar que el objeto tenga las propiedades necesarias
                  if (
                    newTime &&
                    typeof newTime.hour === "number" &&
                    typeof newTime.minute === "number" &&
                    typeof newTime.second === "number"
                  ) {
                    setformularioInformacion((prevData) => ({
                      ...prevData,
                      duracion: newTime, // Guardamos el objeto en el estado
                    }));

                    validarFormulario(); // Revalidar el formulario después de actualizar la duración
                  } else {
         
                    showToast("error", `Valor de tiempo no válido: ${newTime}`);
                  }
                }}
                className="mx-5"
              />

              <div className="flex flex-col items-start p-4 bg-white rounded-lg shadow-md">
                <p className="text-lg font-medium mb-2 flex">
                  Icono:
                  <label
                    htmlFor="file-upload"
                    className="flex items-center cursor-pointer mb-4 ml-6"
                  >
                    {formularioInformacion.icono ? (
                      <img
                        src={`${formularioInformacion.icono}`}
                        alt="Icono subido"
                        className="w-10 h-10 object-cover rounded"
                      />
                    ) : (
                                            <LucideFileSpreadsheet
                        strokeWidth={1}
                        size={40}
                        className="text-gray-600 hover:text-gray-800 transition"
                      />
                    )}
                  </label>
                </p>

                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <p className="text-sm text-gray-500">
                  Permite formato en "jpg", "png", "jpeg", "gif", "mp4", "mov".
                </p>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onPress={onClose}>
              Cancelar
            </Button>
            <Button
              color="primary"
              onPress={SubirInformacion}
              className="bg-[#007832] text-[#fff]"
              isDisabled={boton} // Deshabilitar el botón dinámicamente
            >
              Crear
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
