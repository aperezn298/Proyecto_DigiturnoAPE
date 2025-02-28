import { useContext, useEffect, useMemo, useState } from "react";
import { UsuarioContext } from "../../utils/usuarioContext";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import { ArrowBigDown, ArrowBigUp, CircleAlert, PlusCircle } from "lucide-react";
import { ModalModulo } from "./ModalModulo";
import useFetchWithAuth from "../../utils/peticionesHttp";
import { DetallesTurno } from "./DetallesTurno";
import { TurnoActual } from "./TurnoActual";
import showToast from "../../utils/toastUtil";
import { SelectEstados } from "./SelectEstados";
import { useWebSocketContext } from "../../utils/webSocketContext";
import { EstadoData, ServicioInIdNombre, TurnoDto } from "../../states/context/Interface";
const RUTA_API = import.meta.env.VITE_API_URL; 

export const TablaTurnos = () => {
  const { fetchWithAuth } = useFetchWithAuth();
  const { eventoActual } = useWebSocketContext();
  const [hacerFetch, setHacerFetch] = useState<boolean>(true);
  const context = useContext(UsuarioContext);
  const [turnos, setTurnos] = useState<TurnoDto[] | []>([]);
  const [servicios, setServicios] = useState<ServicioInIdNombre[] | []>([]);
  const [turno, setTurno] = useState<TurnoDto | null>(null);
  const [turnoCargado, setTurnoCargado] = useState(false); 
const [turnoToastMostrado, setTurnoToastMostrado] = useState(false); // Control del toast

  const [formData, setFormData] = useState<EstadoData>({
    modulo: localStorage.getItem("modulo"),
    observacion: null,
    servicioIds: [],
    empleadoId: context?.usuario.id,
    estado: null,
  });

  const moverArriba = (index: any) => {
    if (index > 0) {
      const turnosActualizados = [...turnos];
      const turnoActual = turnosActualizados[index];
      const turnoSuperior = turnosActualizados[index - 1];
      if(turnoActual.prioridad == false && turnoSuperior.prioridad == true){
        return showToast("error", "No puede mover un turno sin prioridad sobre uno con prioridad")
      }
      [turnosActualizados[index], turnosActualizados[index - 1]] = [
        turnosActualizados[index - 1],
        turnosActualizados[index],
      ];
      setTurnos(turnosActualizados);
    } else {
      return showToast("error", "No puedes subir más el turno");
    }
  };

  const moverAbajo = (index: any) => {
    if (index < turnos.length - 1) {
      const turnosActualizados = [...turnos];
      const turnoActual = turnosActualizados[index];
      const turnoAnterior = turnosActualizados[index + 1];
      if(turnoActual.prioridad == true && turnoAnterior.prioridad == false){
        return showToast("error", "No puede mover un turno con prioridad bajo uno sin prioridad")
      }
      [turnosActualizados[index], turnosActualizados[index + 1]] = [
        turnosActualizados[index + 1],
        turnosActualizados[index],
      ];
      setTurnos(turnosActualizados);
    } else {
      return showToast("error", "No puedes bajar más el turno");
    }
  };

  const tomarTurno = async (id: any) => {
    if (turno == null) {
      const turnoActual = turnos.find((t) => t.id == id);
      if (turnoActual) {
        setTurno(turnoActual);
        setFormData((prevData: any) => ({
          ...prevData,
          estado: turnoActual?.estado ? turnoActual.estado : "Espera",
        }));
        cambiarEstadoEspera(turnoActual);
      } else {
        return showToast("error", "No se encontró el turno");
      }
    } else {
      return showToast("error", "Debe terminar el turno actual");
    }
  };

  const cambiarEstadoEspera = async (
    turnoActual: TurnoDto | null | undefined
  ) => {
    if (turnoActual) {
      const response = await fetchWithAuth(
        `${RUTA_API}api/turno/` + turnoActual.id,
        {
          method: "POST",
          body: JSON.stringify({ ...formData, estado: "Espera" }),
        }
      );
      const responseData = await response.json();
      if (response.ok) {
        setTurnos(turnos.filter((t) => t.id != turnoActual.id));
        configurarTurno(turnoActual);
        return showToast("success", "Turno tomado exitosamente");
      }
      setTurno(null);
      setFormData((prevData: any) => ({
        ...prevData,
        estado: null,
      }));
      return showToast(
        "error",
        "Error al tomar el turno: " + responseData.message
      );
    } else {
      return showToast("error", "Debe seleccionar un turno");
    }
  };

  const configurarTurno = (turnoActual: TurnoDto | null | undefined) => {
    let listaServiciosID: number[] = [];
    turnoActual?.servicios?.forEach((servicio) => {
      if (servicio?.id !== null && servicio?.id !== undefined) {
        listaServiciosID.push(servicio.id);
      }
    });
    setFormData((prevData: any) => ({
      ...prevData,
      estado: turnoActual?.estado ? turnoActual.estado : "Espera",
      servicioIds: listaServiciosID,
    }));
    setTurno((prevData: any) => ({
      ...prevData,
      estado: turnoActual?.estado ? turnoActual.estado : "Espera",
    }));
  };

  useEffect(() => {
    const obtenerTurnosYServicios = async () => {
      const response = await fetchWithAuth(
        `${RUTA_API}api/turno/empleado/` + context?.usuario.id,
        { method: "GET" }
      );
      const data = await response.json();
      setServicios(data.servicios);
      if (turnos.length > 0) {
        const nuevosTurnosIds = new Set(data.turnos.map((turno: any) => turno.id));
        const turnosActualizados = turnos.filter((turno) =>
          nuevosTurnosIds.has(turno.id)
        );
        const turnosParaAgregar = data.turnos.filter(
          (nuevoTurno: any) => !turnos.some((turno) => turno.id === nuevoTurno.id)
        );
        const turnosPrioridad = turnosParaAgregar.filter((nuevoTurno:any) => nuevoTurno.prioridad == true);
        const turnosNormales = turnosParaAgregar.filter((nuevoTurno:any) => nuevoTurno.prioridad == false);
        setTurnos([...turnosPrioridad, ...turnosActualizados, ...turnosNormales]);
      } else {
        setTurnos(data.turnos);
      }
    };
  
    const obtenerTurnoActual = async () => {
      try {
        const responseTurno = await fetchWithAuth(
          `${RUTA_API}api/turno/` + formData.empleadoId,
          { method: "GET" }
        );
        const responseData = await responseTurno.json();
  
        if (responseTurno.ok && responseData) {
          setTurno(responseData);
          configurarTurno(responseData);
  
          // Muestra el toast solo si no se ha mostrado antes
          if (!turnoToastMostrado) {
            setTurnoToastMostrado(true);
            showToast("success", "Turno recuperado exitosamente");
          }
        } else {
       
          showToast("info", "No hay turnos pendientes");
        }
      } catch (error) {
  
        showToast("error", "Error al obtener el turno actual: " + (error as any).message);
      }
    };
  
    if (hacerFetch) {
      obtenerTurnosYServicios();
      setHacerFetch(false);
    }
  
    // Solo consulta el turno actual si no ha sido cargado aún
    if (!turnoCargado && turno == null) {
      obtenerTurnoActual();
      setTurnoCargado(true); // Marca el turno como cargado para evitar consultas repetidas
    }
  }, [hacerFetch]);

  useEffect(() => {
    if (
      eventoActual &&
      (eventoActual.type === "estadoTurnoEspera" ||
        eventoActual.type === "turnoCreado")
    ) {
      setHacerFetch(true);
    }
  }, [eventoActual]);

  const columns = [
    { uid: "numeroTurno", name: "#" },
    { uid: "codigo", name: "Código" },
    { uid: "nombres", name: "Nombre" },
    { uid: "servicio", name: "Servicio" },
    { uid: "mover", name: "Mover" },
    { uid: "Acciones", name: "Acciones" },
  ];

  const topContent = useMemo(
    () => (
      <div>
        <div className="flex justify-between items-center">
          <div className="flex items-center mb-4">
            <p className="text-5xl font-semibold">Seguimiento de Turnos</p>
            <p className="font-semibold bg-slate-200 h-7 w-5 rounded-md mx-2 text-center text-xl">
              {turnos.length}
            </p>
          </div>
          <ModalModulo formData={formData} setFormData={setFormData} />
        </div>
      </div>
    ),
    []
  );
  return (
    <div className="w-screen mx-11 my-10 relative flex flex-col ">
      <div className="px-auto w-full">{topContent}</div>

      <Table
      aria-labelledby={"Seguimineto de turno"}
        isCompact
        isHeaderSticky
        style={{ backgroundColor: "#D9D9D9", borderRadius: 10}}
        className="max-h-[300px] w-full overflow-y-auto mb-10"
      >
        <TableHeader className="text-center place-content-center place-items-center">
          {columns.map((column) => (
            <TableColumn
              className="text-center bg-[#00304d] text-stone-100 lg:text-lg"
              key={column.uid}
            >
              {column.name}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {turnos.map((turno, index) => (
            <TableRow key={index} className="hover:bg-[#bcbbbb]">
              <TableCell className="text-center place-items-center"><div className="flex">
                {turno.prioridad == true ? (<>
                <Tooltip content={"Turno Preferencial"}>
                  <CircleAlert/>
                </Tooltip>
                </>) : (<>
                  {index + 1}</>)}
                </div></TableCell>
              <TableCell className="text-center">{turno.codigo}</TableCell>
              <TableCell className="text-center">
                {turno.usuario?.nombres + " " + turno.usuario?.apellidos}
              </TableCell>
              <TableCell className="text-center">
                {turno.servicios?.findLast((s) => s.nombre)?.nombre}
              </TableCell>
              <TableCell>
                <div className="flex justify-center">
                  <ArrowBigUp
                    size={45}
                    strokeWidth={1}
                    onClick={() => moverArriba(index)}
                    className="cursor-pointer hover:scale-90"
                  />
                  <ArrowBigDown
                    size={45}
                    strokeWidth={1}
                    onClick={() => moverAbajo(index)}
                    className="cursor-pointer hover:scale-90"
                  />
                </div>
              </TableCell>

              <TableCell>
                <div className="flex justify-center">
                  <PlusCircle
                    className="cursor-pointer hover:scale-90"
                    size={40}
                    strokeWidth={1}
                    onClick={() => tomarTurno(turno.id)}
                  />
                  <DetallesTurno turnos={turnos} turnoId={turno.id} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className=" w-full">
        <div className="grid grid-cols-4 space-x-5">
          <div className="col-span-3">
            <TurnoActual turno={turno} />
          </div>
          <div className="place-content-center">
            <SelectEstados
              formData={formData}
              setFormData={setFormData}
              turno={turno}
              setTurno={setTurno}
              servicios={servicios}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
