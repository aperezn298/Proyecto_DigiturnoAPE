import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { UsuarioTurnoDetalle } from "../../../states/context/Interface";
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

const dataFormatter = (number: number) =>
  Intl.NumberFormat("us").format(number).toString();

interface AreaChartTypeExampleProps {
  chartdata: UsuarioTurnoDetalle[];
}

export const AreaChartTurnosPorDia: React.FC<AreaChartTypeExampleProps> = ({ chartdata }) => {
  const [chartLabels, setChartLabels] = useState<string[]>([]);
  const [chartDataValues, setChartDataValues] = useState<number[]>([]);

  useEffect(() => {
    if (!chartdata || !Array.isArray(chartdata) || chartdata.length === 0) {
      setChartLabels([]);
      setChartDataValues([]);
      return;
    }

    // Agrupar por fecha y contar la cantidad de turnos
    const groupedData = chartdata.reduce((acc: { [fecha: string]: number }, item: any) => {
      const fecha: string = item.fecha; // Obtener la fecha
      if (!acc[fecha]) {
        acc[fecha] = 0; // Inicializar el contador de turnos para esta fecha
      }
      acc[fecha]++; // Incrementar el contador para esta fecha
      return acc;
    }, {});

    // Extraer las fechas y los valores en formato adecuado para el gráfico
    const labels = Object.keys(groupedData);
    const dataValues = Object.values(groupedData);

    setChartLabels(labels);
    setChartDataValues(dataValues);
  }, [chartdata]);

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
    options: {
    transitions: {
      show: {
        animations: {
          x: {
            from: 0
          },
          y: {
            from: 0
          }
        }
      },
      hide: {
        animations: {
          x: {
            to: 0
          },
          y: {
            to: 0
          }
        }
      }
    }
  }
  };

  return <Line data={data} options={options} />;
};
