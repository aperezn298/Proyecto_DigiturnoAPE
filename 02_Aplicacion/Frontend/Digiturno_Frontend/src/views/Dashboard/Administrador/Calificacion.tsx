import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { UsuarioTurnoDetalle } from "../../../states/context/Interface";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

interface Props {
  usuariosTurnos: UsuarioTurnoDetalle[];
}

export const PromedioCalificacionPorServicio: React.FC<Props> = ({ usuariosTurnos }) => {
  const servicioCalificaciones: { [key: string]: { suma: number; cantidad: number } } = {};

  usuariosTurnos.forEach((turno) => {
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

  const labels = Object.keys(servicioCalificaciones);
  const dataValues = labels.map(
    (servicio) => servicioCalificaciones[servicio].suma / servicioCalificaciones[servicio].cantidad
  );

  const total = dataValues.reduce((acc, val) => acc + val, 0);
  const percentages = dataValues.map((value) => ((value / total) * 100).toFixed(1) + "%");

  const chartData = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: labels.map(
          (_, index) =>
            index % 2 === 0
              ? `rgba(${Math.floor(35 + Math.random() * 5)}, ${Math.floor(
                  169 + Math.random() * 90
                )}, ${Math.floor(0 + Math.random() * 50)}, 1)` // Tonos verdes
              : `rgba(${Math.floor(0 + Math.random() * 50)}, ${Math.floor(
                  48 + Math.random() * 100
                )}, ${Math.floor(77 + Math.random() * 100)}, 1)` // Tonos azules
        ),  
        borderColor: "#fff",
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
     
        text: "Promedio de Calificación por Servicio",
        font: {
          size: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) =>
            `${tooltipItem.label}: ${tooltipItem.raw.toFixed(1)} promedio (${percentages[tooltipItem.dataIndex]})`,
        },
      },
      datalabels: {
        color: "black",
        font: {
         
          size: 12,
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
    <div className="w-full">
    <p className="text-2xl font-semibold text-gray-800 mb-4 p-2">
      Promedio de Calificación por Servicio
    </p>
    <div className="flex justify-center items-center">
      <Pie data={chartData} options={chartOptions} className="w-80 h-80" />
    </div>
  </div>
  );
};
