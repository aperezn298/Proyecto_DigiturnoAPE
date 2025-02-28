import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Image,
  Checkbox,
} from "@nextui-org/react";
import IconServicios from "../../assets/servicio.png";
import { useEffect, useState } from "react";
import { ServicioAttributes, User } from "../../states/context/Interface";
import showToast from "../../utils/toastUtil";
import useFetchWithAuth from "../../utils/peticionesHttp";

const RUTA_API = import.meta.env.VITE_API_URL;

interface Empleado {
  id: number;
  serviciosFetch: ServicioAttributes[];
  empleados: User[];
  estado: string;
}

export const Servicios: React.FC<Empleado> = ({
  id,
  serviciosFetch,
  empleados,
  estado
}: any) => {
  const { fetchWithAuth } = useFetchWithAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [servicios, setServicios] = useState<ServicioAttributes[]>([]);
  const [selectedServicios, setSelectedServicios] = useState<number[]>([]);

  useEffect(() => {
    setServicios(serviciosFetch);

    // Obtener los servicios ya asociados al empleado
    const empleado = empleados.find((emp: any) => emp.id === id);
    if (empleado) {
      const serviciosDelEmpleado = empleado.servicios.map(
        (servicio: any) => servicio.id
      );
      setSelectedServicios(serviciosDelEmpleado);
    }
  }, [id, serviciosFetch, empleados]);

  // Manejar selección de servicios
  const handleCheckboxChange = (servicioId: number) => {
    setSelectedServicios(
      (prev) =>
        prev.includes(servicioId)
          ? prev.filter((id) => id !== servicioId) // Quitar si ya está seleccionado
          : [...prev, servicioId] // Agregar si no está seleccionado
    );
  };

  // Enviar servicios seleccionados al servidor
  const handleSubmit = async () => {
    try {
      const response = await fetchWithAuth(
        `${RUTA_API}api/empleado/servicios/${id}`,
        {
          method: "POST",
          body: JSON.stringify({
            servicioIds: selectedServicios,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al asignar servicios");
      }
      const successText = await response.json();
      showToast("success", successText.message);
      onClose(); // Cerrar el modal
    } catch (error) {
  
      showToast("error", `Ocurrió un error al asociar servicios ${error}`);
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-3" onClick={()=>{if(estado == "Activo"){onOpen()}}}>
        <Image
          src={IconServicios}
          aria-label="Servicios del Empleado"
          className={estado == "Activo" ? "w-8 mr-4 cursor-pointer" : "w-8 mr-4"}
          alt="Asociar Servicios"
        />
      </div>
      <Modal backdrop="blur" size="2xl" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Asignar un servicio a un empleado:
              </ModalHeader>
              <ModalBody>
                {servicios.map((servicio) => (
                  <Checkbox
                    aria-label="Servicio"
                    key={servicio.id}
                    value={servicio.nombre}
                    isSelected={selectedServicios.includes(servicio.id)}
                    onChange={() => handleCheckboxChange(servicio.id)}
                  >
                    {servicio.nombre}
                  </Checkbox>
                ))}
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
                  Asignar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
