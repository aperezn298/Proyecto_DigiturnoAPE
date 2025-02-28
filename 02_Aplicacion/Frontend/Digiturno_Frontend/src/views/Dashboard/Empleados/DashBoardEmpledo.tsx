import { Line } from "react-chartjs-2";
import { useContext, useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { UsuarioContext } from "../../../utils/usuarioContext";
import { UsuarioTurnoDetalle } from "../../../states/context/Interface";

// Registrar los componentes requeridos de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Formateador de números
const dataFormatter = (number: number) =>
  Intl.NumberFormat("us").format(number).toString();

interface DashBoardEmpledoExampleProps {
  chartdata: UsuarioTurnoDetalle[];
}

export const DashBoardEmpledo: React.FC<DashBoardEmpledoExampleProps> = ({ chartdata }) => {
  const context = useContext(UsuarioContext);

  const [chartLabels, setChartLabels] = useState<string[]>([]);
  const [chartDataValues, setChartDataValues] = useState<number[]>([]);

  const dataFiltrada = chartdata.filter(
    (item) => item.empleado?.id === context?.usuario?.id
  );
  
  useEffect(() => {

    // Validación inicial de datos
    if (!chartdata || !Array.isArray(chartdata) || chartdata.length === 0) {
      setChartLabels([]);
      setChartDataValues([]);
      return;

    }

    // Filtrar datos excluyendo al usuario actual

    // Agrupar por fecha y contar la cantidad de turnos
    const groupedData = dataFiltrada.reduce((acc: { [fecha: string]: number }, item) => {
      const fecha = item.fecha; // Obtener la fecha del turno
      if (!fecha) return acc; // Ignorar si la fecha no es válida
      acc[fecha] = (acc[fecha] || 0) + 1; // Incrementar el contador
      return acc;
    }, {});

    // Extraer las fechas y los valores en formato adecuado para el gráfico
    const labels = Object.keys(groupedData).sort(); // Ordenar fechas
    const dataValues = Object.values(groupedData);

    setChartLabels(labels);
    setChartDataValues(dataValues);
  }, [chartdata, context?.usuario?.id]);

  // Configuración del gráfico
  const data = {
    labels: chartLabels,
    datasets: [
      {
        label: "Turnos por día",
        data: chartDataValues,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4, // Suaviza las líneas
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `Turnos: ${dataFormatter(context.raw)}`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Fechas",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Cantidad de Turnos",
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};
