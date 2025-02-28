
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";

import ChartDataLabels from "chartjs-plugin-datalabels";
import { Pie } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend, Title, ChartDataLabels);

interface Props {
  usuariosServicios: Array<{ nombre: string; numero: number }>;
}

export const CantidaddeturnosporUsuario: React.FC<Props> = ({ usuariosServicios }) => {
  // Preparar los datos para el gráfico Doughnut
  const chartData = {
    labels: usuariosServicios.map((usuario) => usuario.nombre),
    datasets: [
      {
        data: usuariosServicios.map((usuario) => usuario.numero),
        backgroundColor: usuariosServicios.map(
          (_, index) =>
            index % 2 === 0
              ? `rgba(${Math.floor(35 + Math.random() * 5)}, ${Math.floor(
                  169 + Math.random() * 90
                )}, ${Math.floor(0 + Math.random() * 50)}, 1)` // Tonos verdes
              : `rgba(${Math.floor(0 + Math.random() * 50)}, ${Math.floor(
                  48 + Math.random() * 100
                )}, ${Math.floor(77 + Math.random() * 100)}, 1)` // Tonos azules
        ),  
        borderColor: usuariosServicios.map(() => `rgba(255, 255, 255, 1)`),
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
            `${tooltipItem.label}: ${tooltipItem.raw} turnos`,
        },
      },
      datalabels: {
        color: "black",
        font: {
         
          size: 12,
        },
        anchor: "end" as const,
        align: "start" as const,
  
        formatter: (value: any, context: any) => {
          const total = context.dataset.data.reduce((a: any, b: any) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(2) + "%";
          return `${value} turnos (${percentage})`;
        },
       
      },
    },
  };

  return (
    <div className="w-full">
    <p className="text-2xl font-semibold text-gray-800 mb-4 p-2">
      Total de Turnos Atendidos por Población
    </p>
    <div className="flex justify-center items-center">
      <Pie data={chartData} options={chartOptions} className="w-80 h-80" />
    </div>
  </div>
  );
};
