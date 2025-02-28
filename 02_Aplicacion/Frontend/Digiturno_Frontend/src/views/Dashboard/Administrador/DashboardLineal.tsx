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
import showToast from "../../../utils/toastUtil";

import { Pie } from "react-chartjs-2";
// Registrar los componentes requeridos de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,

);

const dataFormatter = (number: number) =>
  Intl.NumberFormat("us").format(number).toString();

interface AreaChartTypeExampleProps {
  chartdata: UsuarioTurnoDetalle[];
}

// Define el tipo de los datos agrupados
type ServiciosPorFecha = {
  [fecha: string]: {
    [nombreServicio: string]: number;
  };
};

export const AreaChartTypeExample: React.FC<AreaChartTypeExampleProps> = ({ chartdata }) => {
  const [chartLabels, setChartLabels] = useState<string[]>([]);
  const [chartDatasets, setChartDatasets] = useState<any[]>([]);

  useEffect(() => {
    if (!chartdata || !Array.isArray(chartdata) || chartdata.length === 0) {
      setChartLabels([]);
      setChartDatasets([]);
      return;
    }

    try {
      const groupedData = chartdata.reduce((acc: ServiciosPorFecha, item: any) => {
        const fecha: string = item.fecha; // Obtener la fecha
        item.servicios.forEach((servicio: any) => {
          if (!acc[fecha]) acc[fecha] = {};
          if (!acc[fecha][servicio.nombre]) acc[fecha][servicio.nombre] = 0;
          acc[fecha][servicio.nombre]++;
        });
        return acc;
      }, {} as ServiciosPorFecha);

      const labels = Object.keys(groupedData);
      const allServices = Array.from(
        new Set(
          labels.flatMap((fecha) => Object.keys(groupedData[fecha]))
        )
      );

      const datasets = allServices.map((servicio) => ({
        label: servicio,
        data: labels.map((fecha) => groupedData[fecha]?.[servicio] || 0),
        backgroundColor: labels.map(
          (_, index) =>
            index % 2 === 0
              ? `rgba(${Math.floor(35 + Math.random() * 5)}, ${Math.floor(
                  169 + Math.random() * 90
                )}, ${Math.floor(0 + Math.random() * 50)}, 1)` // Tonos verdes
              : `rgba(${Math.floor(0 + Math.random() * 50)}, ${Math.floor(
                  48 + Math.random() * 100
                )}, ${Math.floor(77 + Math.random() * 100)}, 1)` // Tonos azules
        ), // Suaviza las líneas

      }));

      setChartLabels(labels);
      setChartDatasets(datasets);
    } catch (error) {
    
      showToast("error", `Error al procesar los datos del gráfico. ${error}`);
      setChartLabels([]);
      setChartDatasets([]);
    }
  }, [chartdata]);

  const data = {
    labels: chartLabels,
    datasets: chartDatasets,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) =>
            `${context.dataset.label}: ${dataFormatter(context.raw)}`,
        },
      },
      datalabels: {
        align: "top" as const,
        anchor: "end" as const,
        
        font: {
          weight: "bold" as const,
        },
        formatter: (value: number) => value.toFixed(1),
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
          text: "Cantidad de Usuarios",
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};
