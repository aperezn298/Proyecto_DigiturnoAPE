import React, { useContext, useState } from "react";
import {
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Button,
  Popover,
  PopoverTrigger,
} from "@nextui-org/react";
import ImagenAgenciaPublicadeEmpleo from "../../assets/avatar.png";
import Icono from "../../assets/icono.png";
import { CambiarContrasenaModal } from "../EditarContrasenaModal/";
import { EditarContrasenaModal } from "../EditarDatosModal/";
import { useMediaQuery } from "react-responsive";
import { UsuarioContext } from "../../utils/usuarioContext";

export const HeaderUsuario = () => {
  const [isModalOpen, setModalOpen] = useState(false); // Estado para controlar el modal
  const context = useContext(UsuarioContext);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const closeModal = () => setModalOpen(false); // Cierra el modal
  const openModal = () => setModalOpen(true); // Abre el modal

  return (
    <header className="text-white py-1 border-b-4 border-[#00304D] w-full">
      <div className="flex justify-between items-center w-full">
        {/* Icono y título */}
        <div className="flex md:flex-row w-full mt-4 md:mt-0 text-end">
          <Image src={Icono} width={70} alt="Icono" />
          <div className="text-black text-center md:text-left">
            <p className="font-bold text-lg md:text-xl">APE Digiturno</p>
            <p className="text-xl md:text-2xl">Sistema de Gestión de Turnos</p>
          </div>
        </div>

        {/* Usuario y opciones */}
        <div className="flex justify-end items-center w-full mr-3">
          <div className="flex flex-col items-end justify-end text-end">
            {/* Imagen con evento para abrir modal */}
            <Image
              width={40}
              src={ImagenAgenciaPublicadeEmpleo}
              alt="Agencia Pública de Empleo"
              className="cursor-pointer"
              onClick={openModal}
            />
            <div className="text-black text-right text-xs">
              {context?.usuario.nombre}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} backdrop="blur">
        <ModalContent>
          <ModalHeader>
            <span className="text-lg font-bold">Información Personal</span>
          </ModalHeader>
          <ModalBody>
            <div className="px-4">
              {/* Botón para cerrar modal */}
             

              {/* Contenido del modal */}
              <div className="text-sm font-normal">
                <div className="my-2">
                  <label className="text-xs block text-pretty font-semibold">
                    Nombre:
                  </label>
                  <span>{context?.usuario.nombre}</span>
                </div>
                <div className="my-2">
                  <label className="text-xs block text-pretty font-semibold">
                    Celular:
                  </label>
                  <span>{context?.usuario.telefono}</span>
                </div>
                <div className="my-2">
                  <label className="text-xs block text-pretty font-semibold">
                    Email:
                  </label>
                  <span>{context?.usuario.correo}</span>
                </div>
                <div className="my-2 mb-7">
                  <label className="text-xs block text-pretty font-semibold">
                    Rol:
                  </label>
                  <span>{context?.usuario.tipoEmpleado}</span>
                </div>
                <div className="my-2">
                  <CambiarContrasenaModal />
                </div>
                <div className="my-2">
                  <EditarContrasenaModal />
                </div>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </header>
  );
};
