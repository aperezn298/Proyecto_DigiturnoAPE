import React, { useState, useEffect } from "react";
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
  CircularProgress,
} from "@nextui-org/react";
import { Pencil } from "lucide-react";
import {
  NumeroDocumento,
  validarApellidos,
  validartelefono,
  validarCorreo,
  validarNombre,
} from "./Validaciones";
import showToast from "../../utils/toastUtil";
import { User } from "../../states/context/Interface";
import useFetchWithAuth from "../../utils/peticionesHttp";

const tipoDocumento = [
  { key: "CC", label: "C.C." },
  { key: "CE", label: "C.E." },
];

interface EditarEmpleadoProps {
  id: number;
  onUpdate: (updatedServicio: User) => void; // Función que actualiza el servicio
  empleados: User[];
  estado: string;
}
const RUTA_API = import.meta.env.VITE_API_URL;

export const EditarEmpleado: React.FC<EditarEmpleadoProps> = ({
  id,
  onUpdate,
  empleados,
  estado,
}) => {
  const { fetchWithAuth } = useFetchWithAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({
    tipoDocumento: "",
    numeroDocumento: "",
    nombres: "",
    apellidos: "",
    telefono: "",
    correo: "",
    estado: "",
    tipoId: "",
    servicios: [{ id: 0, nombre: "" }],
  });
  const [formErrors, setFormErrors] = useState({
    numeroDocumento: null,
    nombres: null,
    apellidos: null,
    telefono: null,
    correo: null,
  });
  const [loading, setLoading] = useState(true);

  // Obtener datos del empleado
  useEffect(() => {
    if (isOpen) {
      const empleado = empleados.find((t: any) => t.id == id);
      if (empleado) {
        formData.apellidos = empleado.apellidos;
        formData.correo = empleado.correo;
        formData.estado = empleado.estado;
        formData.nombres = empleado.nombres;
        formData.numeroDocumento = empleado.numeroDocumento;
        formData.telefono = empleado.telefono;
        formData.tipoDocumento = empleado.tipoDocumento;
        formData.tipoId = empleado.tipoId.toString();
        formData.servicios = empleado.servicios;
        setLoading(false);
      } else {
        return showToast("error", "Hubo un error al traer al empleado");
      }
    }
  }, [isOpen, id]);

  // Manejar cambios de input y validación
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

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
      default:
        break;
    }
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };
  const handleSubmit = async () => {
    const {
      apellidos,
      telefono,
      correo,
      nombres,
      numeroDocumento,
      tipoDocumento,
      estado,
      tipoId,
      servicios,
    } = formData;

    if (
      apellidos == null ||
      apellidos.trim() === "" ||
      telefono == null ||
      telefono.trim() === "" ||
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
    const formatoTipoId = Number(tipoId);
    const estadoActual = estado as "Activo" | "Deshabilitado";

    try {
      const response = await fetchWithAuth(`${RUTA_API}api/empleado/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          nombres,
          apellidos,
          telefono,
          correo,
          numeroDocumento,
          tipoDocumento,
          estado,
          tipoId: formatoTipoId,
        }),
      });
      if (!response.ok) {
        throw new Error("Error al actualizar los datos del empleado");
      }

      // Asegúrate de incluir el `id` en el objeto actualizado
      onUpdate({
        id,
        nombres,
        apellidos,
        telefono,
        correo,
        numeroDocumento,
        tipoDocumento,
        estado: estadoActual,
        tipoId: formatoTipoId,
        servicios,
      });

      showToast("success", "Empleado Editado exitosamente");
      onClose();
    } catch (error) {
      showToast("error", `Hubo un error al actualizar los datos del empleado ${error}`);
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
      >
        <Pencil
          strokeWidth={1}
          size={30}
          color="#BCBCBC"
          className={estado == "Activo" ? "mr-4 cursor-pointer" : "mr-4"}
        />
      </div>
      <Modal backdrop="blur" isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 font-semibold text-2xl">
            Editar Empleado
          </ModalHeader>
          <ModalBody>
            {loading ? (
              <CircularProgress size="sm" className="m-auto">
                {" "}
              </CircularProgress>
            ) : (
              <>
                <div className="flex">
                  <Select
                    defaultSelectedKeys={[formData.tipoDocumento]}
                    label="T. Documento"
                    className="w-[50%] mx-5"
                    value={formData.tipoDocumento}
                    onChange={(value) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        tipoDocumento: value,
                      }))
                    }
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
                    className="mx-5"
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
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onPress={onClose}>
              Cerrar
            </Button>
            <Button
              color="primary"
              onPress={handleSubmit}
              className="bg-[#007832] text-[#fff]"
            >
              Guardar Cambios
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
