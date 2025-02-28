import { useContext, useEffect, useState } from "react";
import { CantidaddeturnosporUsuario } from "./Administrador/CantidadeturnosporUsuario";
import { UsuarioTurnoDetalle } from "../../states/context/Interface";
import { AreaChartTypeExample } from "./Administrador/DashboardLineal";
import { Eficiencia } from "./Administrador/Eficiencia";
import { AreaChartTurnosPorDia } from "./Administrador/CantidadDeTrunoporDia";
import { Espera } from "./Administrador/Espera";
import { Tooltip } from "@nextui-org/react";
import useFetchWithAuth from "../../utils/peticionesHttp";
import { UsuarioContext } from "../../utils/usuarioContext";
import { DashBoardEmpledo } from "./Empleados/DashBoardEmpledo"
import showToast from "../../utils/toastUtil";
import { PromedioCalificacionPorServicio } from "./Administrador/Calificacion";
import { PromedioCalificacionPorServicioEnEmpleados } from "./Empleados/Calificacion";
const RUTA_API = import.meta.env.VITE_API_URL;
interface Fechas {
  fechaInicio: string;
  fechaFin: string;
}
interface UsuarioServicio {
  nombre: string;
  numero: number;
}
export const DashboardMasInformacion: React.FC<Fechas> = ({ fechaInicio, fechaFin }) => {
  const context = useContext(UsuarioContext);
  const [usuariosServicios, setUsuariosServicios] = useState<UsuarioServicio[]>([]);
  const [chartdata, setChartdata] = useState<UsuarioTurnoDetalle[]>([]);
  const { fetchWithAuth } = useFetchWithAuth();
  const formatFecha = (fecha: any) => {
    const year = fecha.year;
    const month = String(fecha.month).padStart(2, "0");
    const day = String(fecha.day).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  useEffect(() => {
    const obtenerTurnosDelDia = async () => {
      try {
        const response = await fetchWithAuth(
          `${RUTA_API}api/turno/turnos/dto`,
          {
            method: "GET",
          }
        )
        const data = await response.json();
        const fechaInicioFormateada = fechaInicio ? formatFecha(fechaInicio) : null;
        const fechaFinFormateada = fechaFin ? formatFecha(fechaFin) : null;
        const fechaHoy = new Date();
        fechaHoy.setDate(fechaHoy.getDate() - 1);
        const fechaHoyFormateada = fechaHoy.toISOString().split("T")[0];
        const turnosFiltrados = data.filter((turno: any) => {
          if (turno.fecha) {
            if (fechaInicioFormateada && fechaFinFormateada) {
              return turno.fecha >= fechaInicioFormateada && turno.fecha <= fechaFinFormateada;
            }
            return turno.fecha === fechaHoyFormateada;
          }
          return false;
        });
        if (JSON.stringify(turnosFiltrados) !== JSON.stringify(chartdata)) {
          setChartdata(turnosFiltrados);
        }
        const serviciosPorPoblacion: { [key: string]: UsuarioServicio } = {};
        turnosFiltrados.forEach((turno: any) => {
          if (turno.usuario && turno.usuario.tipoPoblacion) {
            const tipoPoblacion = turno.usuario.tipoPoblacion.nombre;

            if (serviciosPorPoblacion[tipoPoblacion]) {
              serviciosPorPoblacion[tipoPoblacion].numero += 1; // Incrementa la cantidad de turnos
            } else {
              serviciosPorPoblacion[tipoPoblacion] = {
                nombre: tipoPoblacion,
                numero: 1,
              };
            }
          }
        });
        setUsuariosServicios(Object.values(serviciosPorPoblacion));
      } catch (error) {
        showToast("error", `Ocurrió un error al obtener los turnos ${error}`);
      }
    };
    obtenerTurnosDelDia();
    console.log(chartdata)
  }, [fechaInicio, fechaFin]);
  return (
    <>
      {context?.usuario.tipoEmpleado === "Orientador" ? <>
        <div className=" m-10">
          <Tooltip color="primary"

            content={
              <div className="px-1 py-2 text-center ">
                <div className="text-sm font-bold">Información Importante</div>
                <div className="text-xs">
                  Para más precisión con el gráfico, seleccione solo un día de diferencia entre la fecha de inicio y la fecha final.
                </div>
              </div>

            }
            placement="top" >
            <p className="m-auto text-3xl justify-center text-center font-semibold my-5">Historial de mis turnos </p>
          </Tooltip>
          <DashBoardEmpledo
            chartdata={chartdata}
          ></DashBoardEmpledo>
        </div>
        <div className="flex m-auto my-10">
          <PromedioCalificacionPorServicioEnEmpleados usuariosTurnos={chartdata}
          />
        </div>
      </> :
        <>
          <div className="m-10 h-2/6 shadow-xl border-1 border-[#d1d1d1] rounded-lg p-3  ">

            <Tooltip color="primary"
              content={
                <div className="px-1 py-2 text-center ">
                  <div className="text-sm font-bold">Información Importante</div>
                  <div className="text-xs">
                    Para más precisión con el gráfico, seleccione solo un día de diferencia entre la fecha de inicio y la fecha final.
                  </div>
                </div>

              }
              placement="top" >
              <p className="m-auto text-3xl justify-start text-start font-semibold my-5  text-gray-800">Historial de turnos </p>
            </Tooltip>
            <AreaChartTurnosPorDia
              chartdata={chartdata}
            ></AreaChartTurnosPorDia>
          </div>
          <div className=" m-10 shadow-xl border-1 border-[#d1d1d1] rounded-lg p-3 ">
            <Tooltip color="primary"
              content={
                <div className="px-1 py-2 text-center ">
                  <div className="text-sm font-bold ">Información Importante</div>
                  <div className="text-xs">
                    Para más precisión con el gráfico, seleccione solo un día de diferencia entre la fecha de inicio y la fecha final.
                  </div>
                </div>

              }
              placement="top" >
              <p className="m-auto text-3xl justify-start text-start font-semibold my-5   text-gray-800" >Historial de servicios</p>
            </Tooltip>
            <AreaChartTypeExample chartdata={chartdata} />
          </div>
          <div className="grid sm:grid-cols-2 gap-6 p-1">
            {/* Promedio de Calificación */}
            <div className=" shadow-xl border-1 border-[#d1d1d1] rounded-lg p-1 transition-transform transform ">
              <PromedioCalificacionPorServicio usuariosTurnos={chartdata} />
            </div>

            {/* Cantidad de turnos */}
            <div className=" rounded-lg shadow-xl border-1 border-[#d1d1d1] transition-transform transform">
              <CantidaddeturnosporUsuario usuariosServicios={usuariosServicios} />
            </div>
          </div>

          <div className="sm:flex  ">
            {/* Tarjeta de Tasa de Espera */}
            <div className=" h-[350px] rounded-lg m-2 sm:w-1/2 shadow-xl border-1 border-[#d1d1d1] transition-transform duration-300">
              <Tooltip
                color="primary"
                content={
                  <div className="px-2 py-2 text-center">
                    <div className="text-sm font-bold">Información Importante</div>
                    <div className="text-xs">
                      Para más precisión con el gráfico, seleccione solo un día de diferencia entre la fecha de inicio y la fecha final.
                    </div>
                  </div>
                }
                placement="top"
              >
                <p className="text-3xl font-semibold  text-gray-800 m-2">Tasa de Espera</p>
              </Tooltip>
              <Espera chartdata={chartdata} />
            </div>
            {/* Tarjeta de Tasa de Eficiencia */}
            <div className=" h-[350px] rounded-lg m-2 sm:w-1/2  shadow-xl border-1 border-[#d1d1d1] transition-transform duration-300">
              <Tooltip
                color="primary"
                content={
                  <div className="px-2 py-2 text-center">
                    <div className="text-sm font-bold">Información Importante</div>
                    <div className="text-xs">
                      Para más precisión con el gráfico, seleccione solo un día de diferencia entre la fecha de inicio y la fecha final.
                    </div>
                  </div>
                }
                placement="top"
              >
                <p className="text-3xl font-semibold text-gray-800 m-2">Tasa de Eficiencia</p>
              </Tooltip>
              <Eficiencia chartdata={chartdata} />
            </div>
          </div>
        </>
      }
    </>
  );
};
