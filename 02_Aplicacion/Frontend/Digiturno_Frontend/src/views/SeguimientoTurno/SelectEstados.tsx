import { Select, SelectItem } from "@nextui-org/react";
import { Circle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { ModalConfirmacion } from "./ModalConfirmacion";
import useFetchWithAuth from "../../utils/peticionesHttp";
import showToast from "../../utils/toastUtil";
const RUTA_API = import.meta.env.VITE_API_URL;
export const SelectEstados = ({
  formData,
  setFormData,
  turno,
  setTurno,
  servicios,
}: any) => {
  const [value, setValue] = useState(formData.estado ?? "");
  const [estadoModal, setEstadoModal] = useState("");
    // clave única para el componente <Select>
  const [selectKey, setSelectKey] = useState(0); 
  const { fetchWithAuth } = useFetchWithAuth();
  

  const handleSelectionChange = useCallback((e: any) => {
    const selectedValue = e.target.value;
    if (selectedValue === "Cancelado" || selectedValue === "Atendido") {
      setEstadoModal(selectedValue);
    } else {
      setValue(selectedValue);
      setFormData((prevData: any) => ({
        ...prevData,
        estado: selectedValue,
      }));
      setTurno((prevData: any) => ({
        ...prevData,
        estado: selectedValue,
      }));
    }
  }, []);

   const reestablecerDatos = () => {
       setTurno(null);
        setFormData((prevData: any) => ({
          ...prevData,
          observacion: null,
          servicioIds: [],
          estado: null,
        }));
        setValue("");
        setSelectKey((prevKey) => prevKey + 1);
        setEstadoModal("");
     };


  useEffect(() => {
      
    const ponerValor = () => {
      setValue(formData.estado ?? "");
        
    };
    const cambiarEstado = async () => {
      ponerValor();
      if (value !== "") {
        const response = await fetchWithAuth(
          `${RUTA_API}api/turno/` + turno.id,
          { method: "POST", body: JSON.stringify(formData) }
        );
        if (
          response.ok &&
          (formData.estado === "Cancelado" || formData.estado === "Atendido")
        ) {
           reestablecerDatos();
           return showToast("success", "Turno finalizado correctamente");
        }
      }
    };
    cambiarEstado();
  }, [formData.estado]);


    useEffect(() => {
        if(value == "" && (formData.estado == "Espera" || formData.estado == "Proceso")){
           setValue("Espera");
        }
   
      }, [value])


  const getAllowedStates = () => {
    if (value === "Espera") return ["Cancelado", "Proceso"];
    if (value === "Proceso") return ["Atendido"];
    return [];
  };

  const estados = [
    { estado: "Espera", color: "#FFBE30" },
    { estado: "Proceso", color: "#00CF53" },
    { estado: "Cancelado", color: "#FF4B2B" },
    { estado: "Atendido", color: "#00304D" },
  ];

  const allowedStates = getAllowedStates();

  return (
    <>
       <Select
        style={
          value === ""
            ? { backgroundColor: "#BDBBBB" }
            : { backgroundColor: "#d9d9d9" }
        }
         key={selectKey}
         label={value === "" ? "Toma un turno" : "Estado del turno"}
          renderValue={value}
          value={value}
         onChange={handleSelectionChange}
        disallowEmptySelection
        isDisabled={value === "" ? true : false}
          startContent={
            value && (
              <div className="flex items-center space-x-4 text-lg">
                  <Circle
                    size={20}
                    fill={estados.find((e) => e.estado === value)?.color}
                  strokeWidth={0}
                 />
                <span>{value}</span>
              </div>
            )
          }
          >
        {estados
          .filter((estado) => allowedStates.includes(estado.estado))
            .map((estado) => (
                <SelectItem key={estado.estado} value={estado.estado}>
              <div className="flex items-center space-x-4 text-lg">
                    <Circle size={20} fill={estado.color} strokeWidth={0} />
                <span>{estado.estado}</span>
              </div>
            </SelectItem>
            ))}
      </Select>
          

        <ModalConfirmacion
           setValue={setValue}
           formData={formData}
           setFormData={setFormData}
           setTurno={setTurno}
           selectedValue={estadoModal}
            setEstadoModal={setEstadoModal}
           servicios={servicios}
           setReiniciarSelect={setSelectKey}
        />
    </>
    );
};