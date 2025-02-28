import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Textarea,
    CheckboxGroup,
    Checkbox,
  } from "@nextui-org/react";
  import { ChevronRight } from "lucide-react";
  import { useEffect, useState, useCallback } from "react";
  import { validarObservacion } from "./Validaciones";
  import showToast from "../../utils/toastUtil";
  
  export const ModalFinalizacion = ({
    formData,
    setFormData,
    servicios,
    confirmacion,
    setConfirmacion,
    selectedValue,
  }: any) => {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [serviciosFinales, setServiciosFinales] = useState(
      formData.servicioIds?.map((id: number) => id.toString()) || []
    );
    const [observacion, setObservacion] = useState<string>("");
  
    const [error, setError] = useState<string | null>(null);
  
    const handleObservacionChange = useCallback((value: string) => {
      setObservacion(value);
      setFormData((prevData: any) => ({
        ...prevData,
        observacion: value,
      }));
      const validationError = validarObservacion(value);
      setError(validationError);
    },[setFormData]);
    
    const handleCheckboxChange = useCallback((newSelected: string[]) => {
      setServiciosFinales(newSelected);
      setFormData((prevData: any) => ({
        ...prevData,
        servicioIds: newSelected.map((id: string) => parseInt(id)),
      }));
    }, [setFormData]);
  
    const finalizarTurno = () => {
      setObservacion("")
      setConfirmacion(false)
      if (!error) {
        if (serviciosFinales.length < 1) {
          return showToast("error", "Debe seleccionar al menos un servicio");
        }
        setFormData((prevData: any) => ({
            ...prevData,
            estado: selectedValue,
          }));
        onClose()
      } else {
        return showToast("error", error);
      }
    };
  
    useEffect(() => {
      if (confirmacion === true) {
        onOpen();
        setServiciosFinales(formData.servicioIds?.map((id: number) => id.toString()))
      }
    }, [confirmacion]);
  
    return (
      <>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          hideCloseButton={true}
          isDismissable={false}
          backdrop="blur"
          className="p-10"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col">
                  <h1 className="font-semibold text-5xl">Finalización</h1>
                </ModalHeader>
                <ModalBody>
                  <Textarea
                    name="modulo"
                    type="text"
                    label="Observación"
                    value={observacion}
                    onValueChange={handleObservacionChange}
                    isInvalid={!!error}
                    errorMessage={error || ""}
                  />
                  <h1 className="font-semibold text-large">
                    Servicios Realizados
                  </h1>
                  <CheckboxGroup
                    value={serviciosFinales}
                    onChange={handleCheckboxChange}
                  >
                    {servicios.map((servicio: any) => {
                      return (
                        <Checkbox
                          key={servicio.id}
                          value={servicio.id.toString()}
                        >
                          {servicio.nombre}
                        </Checkbox>
                      );
                    })}
                  </CheckboxGroup>
                </ModalBody>
                <ModalFooter>
                  <Button
                    className="bg-[#007832] text-white text-lg"
                    onPress={finalizarTurno}
                    endContent={<ChevronRight />}
                  >
                    Finalizar
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  };
  