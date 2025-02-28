/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
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
  Image,
  CircularProgress,
  Tooltip,
} from "@nextui-org/react";
import { LucideFileSpreadsheet, Pencil } from "lucide-react";
import {
   Codigo,
  Nombre,
  validarDescripcion,
  validarFecha,
} from "./Validaciones";
import {
  ServicioAttributes,
  ServicioSinIDYEstado,
} from "../../states/context/Interface";
import showToast from "../../utils/toastUtil";
import useFetchWithAuth from "../../utils/peticionesHttp";

const RUTA_API = import.meta.env.VITE_API_URL;

interface EditarServicioProps {
  id: number;
  onUpdate: (updatedServicio: ServicioAttributes) => void;
  estado: string;
}

export const EditarServicio: React.FC<EditarServicioProps> = ({
  id,
  onUpdate,
  estado,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const { fetchWithAuth } = useFetchWithAuth();

  const [formData, setFormData] = useState<ServicioSinIDYEstado | null>(null);
  const [formErrors, setFormErrors] = useState({
    codigo: null,
    nombre: null,
    descripcion: null,
    duracion: null,
  });
  const [ActulizarImagen, setActulizarImagen] = useState<string>("");
  const cargarDatos = async () => {
    setLoading(true);
    try {
        const response = await fetchWithAuth(
            `${RUTA_API}api/servicio/${id}`,
            {
                method: "GET",
            }
        );
        const data = await response.json();
        const [hours, minutes] = data.duracion.split(":").map(Number);
        setFormData({
            codigo: data.codigo || "",
            nombre: data.nombre || "",
            descripcion: data.descripcion || "",
            duracion: { hour: hours, minute: minutes, second: 0 }, // Asegurarse de que es un objeto
            icono: data.icono || "",
        });
    } catch (error) {
      showToast("error", `${(error as any).message}` || "Ocurrió un error");

    } finally {
        setLoading(false);
    }
};
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData!,
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
  };

  const handleFileChange = async (e: any) => {
    const files = Array.from(e.target.files);

    if (files.length > 0) {
      const formDataimagen: any = new FormData();
      formDataimagen.append("files", files[0]); // Solo sube la primera imagen

      try {
        const response = await fetch(`${RUTA_API}public`, {
          method: "POST",
          body: formDataimagen,
        });

        if (response.ok) {
          const result = await response.json(); // Suponiendo que devuelve la URL de la imagen
          const imageUrl = result.files[0];
          setActulizarImagen(imageUrl); // Actualiza la URL de la imagen en el estado
          showToast("success", "Imagen subida exitosamente");
        } else {
          const errorText = await response.text();
          const errorJson = JSON.parse(errorText);
          // Mostrar solo el mensaje si es JSON
        
          showToast("error", errorJson.message || "Ocurrió un error");
        }
      } catch (error) {
     
        showToast("error", `Ocurrió un error al subir la imagen  ${error}`);
      }
    }
  };

  useEffect(() => {
    if (isOpen) cargarDatos();
}, [isOpen, id]);

    const guardarCambios = async () => {
        const { codigo, nombre, descripcion, duracion }: any = formData;
        const icono: any = ActulizarImagen || formData?.icono; // Si hay una nueva imagen, la usamos; sino, mantenemos la actual
   
        const formatTime = () => {
          const { hour, minute } = duracion;
          const formattedHour = hour < 10 ? `0${hour}` : hour;
          const formattedMinute = minute < 10 ? `0${minute}` : minute;
          return `${formattedHour}:${formattedMinute}`;
        };


        const estado = "Activo";

        try {
          const formattedDuracion = formatTime(); // Llamar a la función para obtener el tiempo formateado

          const response = await fetchWithAuth(`${RUTA_API}api/servicio/${id}`, {
              method: "PUT",
              body: JSON.stringify({
                  codigo,
                  nombre,
                  descripcion,
                  duracion: formattedDuracion, // Usar el valor formateado
                  icono,
                  estado, 
                }),
          });

          if (response.ok) {
              showToast("success", "Servicio actualizado correctamente.");
              onUpdate({
                  id,
                  codigo,
                  nombre,
                  descripcion,
                  duracion: formattedDuracion + ":00",
                  icono,
                  estado,
              });
              onClose();
          } else {
            showToast("error", `Hubo un error al actualizar el servicio. ${ response.text()}`);
         
          }
      } catch (error) {
          
        showToast("error", `Error al guardar cambios: ${error}`)

      }
  };


    return (
        <>
            <div
                className="flex flex-wrap w-10"
                onClick={() => {
                    if (estado == "Activo") {
                      onOpen();
                    }
                  }}
                aria-labelledby={"Tabla Servicos"}
            >
                <Pencil
                    strokeWidth={1}
                    size={30}
                    color="#BCBCBC"
                 
                    className={
                        estado == "Activo"
                          ? "w-8 mr-4 cursor-pointer"
                          : "w-8 mr-4"
                      }
                />
            </div>

            <Modal
                backdrop="blur"
                isOpen={isOpen}
                onClose={onClose}
                size="2xl"
             aria-label="Editar Servicio"
                aria-labelledby="Editar Servicio"
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1 font-semibold text-2xl"
                       aria-label="modal Editar Servicio"
                    >
                        Editar Servicio
                    </ModalHeader>
                    <ModalBody
                     aria-label="modal Editar Servicio"
                    >
                        {loading ? (
                            <CircularProgress size="sm" className="m-auto" />
                        ) : (
                            <>
                                <div className="flex">
                                    <Input
                                        label="Código"
                                        type="text"
                                        name="codigo"
                                        value={formData?.codigo || ""}
                                        onChange={handleInputChange}
                                        isInvalid={!!formErrors.codigo}
                                        errorMessage={formErrors.codigo || ""}
                                        className="mx-5"
                                         aria-label="input Código"
                                    />
                                    <Input
                                        label="Nombre"
                                        type="text"
                                        name="nombre"
                                        value={formData?.nombre || ""}
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
                                        value={formData?.descripcion || ""}
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
                                        value={formData?.duracion}  // Valor inicial
                                        onChange={(newTime:any) => {
                                            if (
                                                newTime &&
                                                typeof newTime.hour === "number" &&
                                                typeof newTime.minute === "number" &&
                                                typeof newTime.second === "number"
                                            ) {
                                                setFormData((prevData):any => ({
                                                    ...prevData,
                                                    duracion: newTime, // Guardamos el objeto con hora, minuto y segundo
                                                }));
                                            } else {
                                              showToast("error", "Valor de tiempo no válido:", newTime);
                                     
                                                
                                            }
                                        }}
                                        className="mx-5"
                                    />

                                    <div className="flex my-3">
                                        {ActulizarImagen && (
                                            <img
                                                src={ActulizarImagen}
                                                alt="Imagen seleccionada"
                                                className="w-20 h-20 object-cover"
                                            />
                                        )}
                                        <div className="flex flex-col items-start p-4 bg-white rounded-lg shadow-md">
                                            <div className="text-lg font-medium mb-2 mr-10 mt-2 flex">
                                                Icono:
                                                <label
                                                    htmlFor="file-upload"
                                                    className="flex items-center cursor-pointer mb-4"
                                                >
                                                    <LucideFileSpreadsheet
                                                        strokeWidth={1}
                                                        size={40}
                                                        className="text-gray-600 hover:text-gray-800 transition mx-5"
                                                    />
                                                    <Image
                                                        width={50}
                                                        src={
                                                            formData?.icono
                                                                ? formData.icono
                                                                : "https://media.istockphoto.com/id/827247322/es/vector/se%C3%B1al-de-peligro-vector-icono-ilustraci%C3%B3n-de-atenci%C3%B3n-atenci%C3%B3n-negocio-concepto-simple-plana.jpg?s=612x612&w=0&k=20&c=iEXTniBp9NMjwYdYvsAuaV6NyvMHAmOtTlfXT5ipR-w="
                                                        }
                                                        alt="Icono del servicio"
                                                    />
                                                </label>
                                            </div>
                                            <input
                                                id="file-upload"
                                                type="file"
                                                accept="image/*"
                                                style={{ display: "none" }}
                                                onChange={handleFileChange}
                                            />{" "}
                                            <p className="text-sm text-gray-500">
                                                Permite formato en "jpg", "png", "jpeg", "gif", "mp4",
                                                "mov".
                                            </p>{" "}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onPress={onClose}>
                            Cerrar
                        </Button>
                        <Button color="primary" onPress={guardarCambios}>
                            Guardar Cambios
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
