import { useEffect, useState } from "react";
import { UsuarioTurnoDetalle } from "../../states/context/Interface";
import { BarChart } from "../../utils/BarChart";

const dataFormatter = (number: number) =>
  Intl.NumberFormat("us").format(number).toString();

interface BarChartGroupExample {
  chartdata: UsuarioTurnoDetalle[];
}
type ServiciosPorFecha = {
  [fecha: string]: {
    [nombreServicio: string]: number;
  };
};
export const BarChartGroupExample: React.FC<BarChartGroupExample> = ({
  chartdata,
}) => {
  // Definir el tipo adecuado para groupedData

  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    // Agrupar por fecha y contar la cantidad de usuarios por servicio
    const groupedData: ServiciosPorFecha = chartdata.reduce(
      (acc: ServiciosPorFecha, item: any) => {
        const fecha = item.fecha; // Obtener la fecha
        item.servicios.forEach((servicio: any) => {
          // Si no existe una entrada para esta fecha en el acumulador, creamos una
          if (!acc[fecha]) {
            acc[fecha] = {};
          }

          // Si no existe una entrada para este servicio en la fecha, inicializamos el contador
          if (!acc[fecha][servicio.nombre]) {
            acc[fecha][servicio.nombre] = 0;
          }

          // Incrementar la cantidad de usuarios que han utilizado este servicio
          acc[fecha][servicio.nombre]++;
        });
        return acc;
      },
      {} as ServiciosPorFecha
    );

    // Convertir el objeto agrupado a un formato adecuado para el gráfico
    const chartFormattedData = Object.keys(groupedData).map((fecha) => {
      const services = groupedData[fecha];
      const formattedData = {
        name: fecha,
        ...Object.keys(services).reduce((acc, servicio) => {
          acc[servicio] = services[servicio];
          return acc;
        }, {} as { [key: string]: number }),
      };
      return formattedData;
    });

    setChartData(chartFormattedData);
  }, [chartdata]);

  return (
    <BarChart
      data={chartData}
      index="name"
      categories={Object.keys(chartData[0] || {}).filter(
        (key) => key !== "name"
      )}
      valueFormatter={dataFormatter}
      yAxisWidth={48}
    />
  );
};
