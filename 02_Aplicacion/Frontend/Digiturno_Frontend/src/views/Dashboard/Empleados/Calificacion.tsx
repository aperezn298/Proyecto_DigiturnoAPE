import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { UsuarioTurnoDetalle } from "../../../states/context/Interface";
import { useContext } from "react";
import { UsuarioContext } from "../../../utils/usuarioContext";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

interface Props {
  usuariosTurnos: UsuarioTurnoDetalle[];
}

export const PromedioCalificacionPorServicioEnEmpleados: React.FC<Props> = ({ usuariosTurnos }) => {
  const context = useContext(UsuarioContext);

  // Filtrar los turnos por el usuario actual
  const dataFiltrada = usuariosTurnos.filter(
    (item) => item.empleado?.id === context?.usuario?.id
  );

  // Calcular el promedio de calificación por cada servicio
  const servicioCalificaciones: { [key: string]: { suma: number; cantidad: number } } = {};

  dataFiltrada.forEach((turno) => {
    turno.servicios.forEach((servicio) => {
      const nombreServicio = servicio.nombre;
      if (!servicioCalificaciones[nombreServicio]) {
        servicioCalificaciones[nombreServicio] = { suma: 0, cantidad: 0 };
      }
      if (turno.calificacion) {
        servicioCalificaciones[nombreServicio].suma += turno.calificacion.calificacion;
        servicioCalificaciones[nombreServicio].cantidad += 1;
      }
    });
  });

  // Obtener las etiquetas y los valores promedio de calificación
  const labels = Object.keys(servicioCalificaciones);
  const dataValues = labels.map(
    (servicio) => servicioCalificaciones[servicio].suma / servicioCalificaciones[servicio].cantidad
  );

  // Calcular el total para obtener porcentajes
  const total = dataValues.reduce((acc, val) => acc + val, 0);
  const percentages = dataValues.map((value) => ((value / total) * 100).toFixed(1) + "%");

  const chartData = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: labels.map(
          () =>
            `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
              Math.random() * 255
            )}, ${Math.floor(Math.random() * 255)}, 1)`
        ),
        borderColor: labels.map(() => `rgba(255, 255, 255, 1)`),
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) =>
            `${tooltipItem.label}: ${tooltipItem.raw.toFixed(1)} promedio (${percentages[tooltipItem.dataIndex]})`,
        },
      },
      datalabels: {
        color: "white",
        font: {
          weight: "bold" as const,
          size: 14,
        },
        formatter: (value: number, context: any) => {
          const label = context.chart.data.labels[context.dataIndex];
          return `${label}\n${value.toFixed(1)} (${percentages[context.dataIndex]})`;
        },
        anchor: "center" as const,
        align: "center" as const,
      },
    },
  };

  return (
    <div className="w-11/12 mx-auto">
      <p className="m-auto text-3xl justify-center text-center font-semibold">
        Promedio de Calificación por Servicio
      </p>
      <div className="flex justify-center items-center">
        <Doughnut data={chartData} options={chartOptions} className="sm:m-32" />
      </div>
    </div>
  );
};
