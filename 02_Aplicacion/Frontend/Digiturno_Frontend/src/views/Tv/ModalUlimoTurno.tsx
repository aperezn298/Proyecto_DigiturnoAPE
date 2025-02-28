import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { Ticket } from "lucide-react";
import { useEffect, useState } from "react";

export const ModalUltimoTurno = ({ ultimoTurno, numeroTurnos }: any) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [numTurnosPrevio, setNumTurnosPrevio] = useState<number>(0)
  useEffect(() => {
    if(ultimoTurno != null && numeroTurnos > numTurnosPrevio){
        onOpen();
    setTimeout(() => {
      onClose();
    }, 10000);
    }
    setNumTurnosPrevio(numeroTurnos)
    
  }, [ultimoTurno]);
  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        hideCloseButton={true}
        isDismissable={false}
        backdrop="blur"
        className=" border-x-50 border-[#00304d] min-w-max"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col border-b-2 border-[#00304d] p-0">
                <div className="flex self-center space-x-3 my-2">
                <Ticket
                size={200}
                className="rotate-[225deg] self-center"
                strokeWidth={1}
                color="#00304d"
              />
              <div className="place-content-center">
                <h1 className="font-bold text-6xl lg:text-8xl place-content-center text-center">Nuevo</h1>
                <h1 className="font-bold text-6xl lg:text-8xl place-content-center text-center">Turno</h1>
              </div>
                </div>
                
              </ModalHeader>
              <ModalBody>
                <div className="text-center text-7xl font-semibold my-3">
                    <h1>{ultimoTurno.usuario.nombres+" "+ultimoTurno.usuario.apellidos}</h1>
                </div>
                <div className="grid grid-cols-5 place-items-center my-8">
                <div className="text-center flex space-x-4 col-span-2"> 
                    <p className="text-6xl">Módulo: </p>
                    <h1 className="font-bold text-9xl">{ultimoTurno.empleado.modulo.modulo}</h1>
                </div>
                <div className="text-center flex space-x-4 col-span-3">
                <p className="text-6xl">Turno: </p>
                <h1 className="font-bold text-9xl">{ultimoTurno.codigo}</h1>
                </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
