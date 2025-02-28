/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Pagination,
  Kbd,
} from "@nextui-org/react";
import { Search } from "lucide-react";

import { DetallesHistorialTurnos } from "./DetalleHistorial";
import { HistorialTurnos } from "../../states/context/Interface";
import useFetchWithAuth from "../../utils/peticionesHttp";
const RUTA_API = import.meta.env.VITE_API_URL; 

export const TablaHistorial = () => {
  const [filterValue, setFilterValue] = useState("");
  const [rowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [Historial, setHistorial] = useState<HistorialTurnos[]>([]);
  const { fetchWithAuth } = useFetchWithAuth();

  // Obtener los servicios desde la API
  useEffect(() => {
    const fetchServicios = async () => {
      try {

        const response = await fetchWithAuth(
          `${RUTA_API}api/turno/turnos/dto`,
          { method: "GET" ,
          
          }
        )
        const data:HistorialTurnos[] = await response.json();
        const cantidadEnEspera:HistorialTurnos[] = data.filter(turno => turno.estado === "Cancelado" || turno.estado === "Atendido");

        setHistorial(cantidadEnEspera);
      } catch (error) {
        console.error("Error al obtener los servicios:", error);
      }
    };
    fetchServicios();
  }, []);

  const columns = [
    { uid: "Codigo", name: "Código" },
    { uid: "Nombre", name: "Nombre" },
    { uid: "Servicio", name: "Servicio" },
    { uid: "Duracion", name: "Duración" },
    { uid: "Acciones", name: "Acciones" }
  ];

  const visibleColumns = "all";
  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredHistorial = [...Historial];

    if (hasSearchFilter) {
      filteredHistorial = filteredHistorial.filter(
        (historial) =>
          historial.codigo.toLowerCase().includes(filterValue.toLowerCase()) ||
          historial.servicios[0].nombre.toLowerCase().includes(filterValue.toLowerCase()) ||
          historial.usuario.nombres.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredHistorial;
  }, [Historial, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const onSearchChange = useCallback((value: React.SetStateAction<string>) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(
    () => (
      <div>
        <div className="flex  sm:flex-row justify-between items-center">
          <div className="flex mx-2 sm:mx-0">
            <p className="text-2xl md:text-5xl font-semibold">Historial Turno</p>
            <p className="font-semibold bg-slate-200 h-7 w-8 rounded-md mx-2 text-center text-xl ">
              {Historial.length}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4 my-5 mx-4 sm:mx-0">
          <Input
            isClearable
            className="w-full sm:w-auto"
            placeholder="Buscar Turno"
            startContent={<Search />}
            value={filterValue}
            onClear={onClear}
            onValueChange={onSearchChange}
          />
        </div>
      </div>
    ),
    [filterValue, onSearchChange, onClear, Historial]
  );

  const bottomContent = useMemo(
    () => (
      <div className="py-2 px-2 flex items-center justify-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
      </div>
    ),
    [page, pages]
  );

  return (
    <div className="w-full md:w-full mx-auto items-center justify-center my-10 sm:mx-10">
      <div className="w-full">{topContent}</div>
      <Table className="w-full text-sm md:text-base"  aria-labelledby={"Tabla historial de turno"}>
        <TableHeader>
          {headerColumns.map((column) => (
            <TableColumn key={column.uid}>{column.name}</TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {items.map((historial) => (
            <TableRow key={historial.id}>
              <TableCell>{historial.codigo}</TableCell>
              <TableCell>{historial.usuario.nombres}</TableCell>
              <TableCell>{historial.servicios[0].nombre}</TableCell>
              <TableCell>{historial.servicios[0].duracion}</TableCell>
              <TableCell className="flex flex-wrap justify-start items-start text-start gap-2">
                <DetallesHistorialTurnos item={historial} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-center items-center w-full">
        {bottomContent}
      </div>
    </div>
  );
};
