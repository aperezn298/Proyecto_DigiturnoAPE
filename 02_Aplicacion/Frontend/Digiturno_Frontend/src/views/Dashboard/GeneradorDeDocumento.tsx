import React, { useContext, useState } from "react";
import { Button, DatePicker } from "@nextui-org/react";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import imagen from "../../assets/agenciapublica.png"
declare module "jspdf" {
  interface jsPDF {
    autoTable: any;
  }
}
import showToast from "../../utils/toastUtil";
import { MasInformacion } from "./MasInformaincion";
import { DashboardMasInformacion } from "./DashBoardInformacion";
import useFetchWithAuth from "../../utils/peticionesHttp";
import { UsuarioContext } from "../../utils/usuarioContext";


const RUTA_API = import.meta.env.VITE_API_URL;

export const GeneradorDeDocumentos = () => {
  const { fetchWithAuth } = useFetchWithAuth();
  const context = useContext(UsuarioContext);
  const [fechaFin, setFechaFin] = useState<any | null>(null);
  const [fechaInicio, setFechaInicio] = useState<any | null>(null);
  const handleDateChange = (value: any) => { setFechaInicio(value); };
  const handleDateChange2 = (value: any) => { setFechaFin(value); };
  const formatFecha = (fecha: any) => {
    const year = fecha.year;
    const month = String(fecha.month).padStart(2, "0");
    const day = String(fecha.day).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const obtenerDatos = async () => {
    if (!fechaInicio || !fechaFin) {
      showToast("error", "Por favor, selecciona ambas fechas.");
      return null;
    }

    const fechaInicioFormatted = formatFecha(fechaInicio);
    const fechaFinFormatted = formatFecha(fechaFin);

    try {
      const response = await fetchWithAuth(
        `${RUTA_API}api/turno/turnosFechas/t`,
        {
          method: "POST",
          body: JSON.stringify({ fechaInicio: fechaInicioFormatted, fechaFin: fechaFinFormatted }),


        }
      );


      if (!response.ok) {
        const errorMessage = await response.text();
        showToast("error", `Error ${response.status}: ${errorMessage}`);
        return null;
      }

      return await response.json();
    } catch (error) {
  
      showToast("error", `Hubo un problema al obtener los datos. Por favor, inténtalo nuevamente. ${error}`);
      return null;
    }
  };

  const generarExcel = (data: { turnos: any[] }) => {
    const dataFiltrada = 
    context?.usuario.tipoEmpleado === "Orientador"
      ? data.turnos.filter((turno) => turno.empleado?.id === context?.usuario?.id)
      : data.turnos;
    const rows = dataFiltrada.map(turno => ({
      ID_Turno: turno.id,
      Codigo: turno.codigo,
      Fecha: turno.fecha,
      HoraCreacion: turno.horaCreacion,
      Estado: turno.estado,
      Servicios: turno.servicios.map((s: { nombre: string }) => s.nombre).join(", "),
      Empleado: turno.empleado?.nombres || "Empleado no asignado",
      Usuario: turno.usuario
        ? `${turno.usuario.nombres} ${turno.usuario.apellidos} (Doc: ${turno.usuario.tipoDocumento} ${turno.usuario.numeroDocumento})`
        : "No disponible",
      TipoPoblacion: turno.usuario?.tipoPoblacion?.nombre || "No disponible",
      TipoUsuario: turno.usuario?.tipoUsuario?.nombre || "No disponible",
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Turnos");
    XLSX.writeFile(workbook, "turnos.xlsx");
  };

  const generarPDF = (data: { turnos: any[] }) => {
    const doc = new jsPDF();
  
    // Filtrar los datos según el tipo de empleado
    const dataFiltrada = 
      context?.usuario.tipoEmpleado === "Orientador"
        ? data.turnos.filter((turno) => turno.empleado?.id === context?.usuario?.id)
        : data.turnos;
  
    // Cargar la imagen y colocarla en el centro arriba
    const imgWidth = 80; // Ajustar el tamaño de la imagen
    const imgHeight = 20;
    const pageWidth = doc.internal.pageSize.width;
    const xPos = (pageWidth - imgWidth) / 2;
    doc.addImage(imagen, "PNG", xPos, 10, imgWidth, imgHeight);
  
    // Título del documento
    doc.setFontSize(16);
    doc.text(
      `Reporte de Turnos Generado entre: ${fechaInicio} - ${fechaFin}`,
      pageWidth / 2,
      40,
      { align: "center" }
    );
  
    // Configuración de los datos para la tabla
    const tableData = dataFiltrada.map((turno) => [
      turno.id,
      turno.codigo,
      `${turno.fecha} ${turno.horaCreacion}`,
      turno.estado,
      turno.servicios.map((s: { nombre: string }) => s.nombre).join(", "),
      turno.empleado?.nombres || "Empleado no asignado",
      turno.usuario
        ? `${turno.usuario.nombres} ${turno.usuario.apellidos} (Doc: ${turno.usuario.tipoDocumento} ${turno.usuario.numeroDocumento})`
        : "No disponible",
      turno.usuario?.tipoPoblacion?.nombre || "No disponible",
    ]);
  
    // Generar la tabla
    doc.autoTable({
      head: [
        [
          "ID",
          "Código",
          "Fecha",
          "Estado",
          "Servicios",
          "Empleado",
          "Usuario",
          "Tipo Población",
        ],
      ],
      body: tableData,
      startY: 50,
      styles: {
        headStyles: { fillColor: "#39A900" }, // Color del encabezado
      },
    });
  
    // Guardar el PDF
    doc.save("turnos.pdf");
  };
  
  const handleGenerarExcel = async () => {
    const data = await obtenerDatos();
    if (data) generarExcel(data);
  };

  const handleGenerarPDF = async () => {
    const data = await obtenerDatos();
    if (data) generarPDF(data);
  };

  return (
    <div>
      <div className="flex sm:gap-7 sm:mx-14 w-full my-3 justify-end items-center">
        <MasInformacion />
        <div className="flex flex-col gap-y-3 justify-end w-full sm:mx-10">
          <DatePicker
            label="Fecha inicio"
            value={fechaInicio}
            onChange={handleDateChange}
            labelPlacement="outside"
          />
        </div>
        <div className="flex flex-col gap-y-4 justify-end w-full  sm:mx-10">
          <DatePicker
            label="Fecha Final"
            value={fechaFin}
            onChange={handleDateChange2}
            labelPlacement="outside"
          />
        </div>
      </div>
      <div className="w-full flex justify-end">
        <Button className="bg-[#00CF53] mx-2 text-white" onPress={handleGenerarExcel}>
          Generar Excel
        </Button>
        <Button className="bg-[#EF0000] mx-2 text-white" onPress={handleGenerarPDF}>
          Generar PDF
        </Button>
      </div>
      <DashboardMasInformacion
        fechaFin={fechaFin}
        fechaInicio={fechaInicio}
      ></DashboardMasInformacion>
    </div>

  );
};
