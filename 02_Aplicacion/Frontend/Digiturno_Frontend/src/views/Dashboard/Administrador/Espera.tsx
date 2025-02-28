import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { UsuarioTurnoDetalle } from "../../../states/context/Interface";

// Registrar los componentes requeridos de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartOnValueChangeExampleProps {
  chartdata: UsuarioTurnoDetalle[];
}

interface PromedioEmpleado {
  [empleadoId: number]: {
    nombre: string;
    totaltiempoEspera: number;
    cantidad: number;
  };
}

export const Espera: React.FC<BarChartOnValueChangeExampleProps> = ({ chartdata }) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  // Calcular el promedio de tiempo de espera para cada empleado
  const promedioPorEmpleado = chartdata.reduce<PromedioEmpleado>((acc, item) => {
    const empleadoId = item.empleado.id;
    const tiempoEspera = parseFloat(item.tiempoEspera) || 0; // Convertir a número o usar 0 si es null

    if (!acc[empleadoId]) {
      acc[empleadoId] = {
        nombre: `${item.empleado.nombres} `,
        totaltiempoEspera: 0,
        cantidad: 0,
      };
    }

    acc[empleadoId].totaltiempoEspera += tiempoEspera;
    acc[empleadoId].cantidad += 1;

    return acc;
  }, {} as PromedioEmpleado);

  // Transformar los datos agrupados para adaptarlos al gráfico
  const labels = Object.values(promedioPorEmpleado).map((empleado) => empleado.nombre);
  const data = Object.values(promedioPorEmpleado).map((empleado) =>
    parseFloat((empleado.totaltiempoEspera / empleado.cantidad).toFixed(2))
  );

  // Generar colores únicos para cada barra
  const colors = [
    "#00FF7F", "#1E90FF", "#32CD32", "#4682B4", "#3CB371",
    "#ADFF2F", "#5F9EA0", "#66CDAA", "#48D1CC", "#00CED1",
  ].slice(0, data.length); // Asegurarse de que haya suficientes colores

  const chartData = {
    labels: labels.slice(0, 7),
    datasets: [
      {
        type: "bar" as const,
        label: "Tiempo de Espera Promedio",
        data,
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
        borderColor: labels.map(() => `rgba(255, 255, 255, 1)`),
        borderWidth: 0,
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
          label: (context: any) => `${context.dataset.label}: ${context.raw}`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Empleados",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Tiempo de Espera Promedio (minutos)",
        },
      },
    },
    onClick: (event: any, elements: any) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        setSelectedValue(labels[index]);
      }
    },
  };
  return (
    <div className="w-full m-1">
    <Bar data={chartData} options={options} />
  </div>
  
  );
};
