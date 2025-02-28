import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Input,
    DateInput,
    Textarea,
    Image,
    TimeInput,
} from "@nextui-org/react";
import { EyeIcon, LucideFileSpreadsheet } from "lucide-react";
import { useEffect, useState } from "react";
import { ServicioAttributes } from "../../states/context/Interface";
import useFetchWithAuth from "../../utils/peticionesHttp";
import showToast from "../../utils/toastUtil";
const RUTA_API = import.meta.env.VITE_API_URL; 
interface DetallesEmpleadoProps {
    id: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const DetallesEmpleado: React.FC<DetallesEmpleadoProps> = ({ id }) => {
    const { fetchWithAuth } = useFetchWithAuth();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [servicio, setServicio] = useState<ServicioAttributes>();

    useEffect(() => {
        const getServicio = async () => {
            try {
           
                const response = await fetchWithAuth(
                    `${RUTA_API}api/servicio/${id}`,
                    { method: "GET" }
                  );
                const data = await response.json();
                setServicio(data);
            } catch (error) {
                showToast("error", `Hubo un error al actualizar el servicio. ${ error}`);
  
            }
        };
        getServicio();
    }, [id]);

    return (
        <>
            <div className="flex flex-wrap gap-3" onClick={onOpen}>
                <EyeIcon
                    strokeWidth={1}
                    size={30}
                    color="#BCBCBC"
                    className="mr-4 cursor-pointer"
                />
            </div>
            <Modal backdrop="blur" isOpen={isOpen} onClose={onClose} size="2xl">
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1 font-semibold text-2xl">
                        Detalle Servicio
                    </ModalHeader>
                    <ModalBody>
                        <div className="flex">
                            <Input
                                label="Código"
                                type="text"
                                name="Codigo"
                                isDisabled
                                value={servicio?.codigo}
                                className="mx-5"
                            />
                            <Input
                                label="Nombre"
                                type="text"
                                name="nombre"
                                isDisabled
                                value={servicio?.nombre}
                                className="mx-5"
                            />
                        </div>
                        <div className="flex my-3">
                            <Textarea
                                label="Descripción"
                                type="text"
                                name="Descripcion"
                                isDisabled
                                value={servicio?.descripcion}
                                className="mx-5"
                            />
                        </div>
                        <div className="flex my-3">
                            <Input
                               
                                label="Duración Aproximada:"
                                className="mx-5 w-[50%]"
                                isDisabled
                                value={servicio?.duracion}
                            />
                            <p className="ml-10 mt-2">Icono:</p>
                            <Image
                            width={50}
                                src={
                                    servicio?.icono
                                        ? servicio.icono
                                        : "https://media.istockphoto.com/id/827247322/es/vector/se%C3%B1al-de-peligro-vector-icono-ilustraci%C3%B3n-de-atenci%C3%B3n-atenci%C3%B3n-negocio-concepto-simple-plana.jpg?s=612x612&w=0&k=20&c=iEXTniBp9NMjwYdYvsAuaV6NyvMHAmOtTlfXT5ipR-w="
                                }
                                alt="Icono del servicio"
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onPress={onClose}>
                            Cerrar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
