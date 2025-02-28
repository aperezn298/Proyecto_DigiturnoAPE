/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useContext,
} from "react";
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
import { Search, Trash2 } from "lucide-react";
import { CrearServicio } from "./CrearServicio";
import { DetallesEmpleado } from "./DetalleServicio";
import { EditarServicio } from "./EditarServicio";
import { ServicioAttributes } from "../../states/context/Interface";
import Swal from "sweetalert2";
import useFetchWithAuth from "../../utils/peticionesHttp";
import { UsuarioContext } from "../../utils/usuarioContext";
import showToast from "../../utils/toastUtil";

const RUTA_API = import.meta.env.VITE_API_URL;

export const TablaServicio = () => {
  const [filterValue, setFilterValue] = useState("");
  const [rowsPerPage] = useState(5);
  const { fetchWithAuth } = useFetchWithAuth();
  const [page, setPage] = useState(1);

  const [servicios, setServicios] = useState<ServicioAttributes[]>([]);
  const confirmarCambioEstado = (
    id: number,
    estadoActual: "Activo" | "Deshabilitado"
  ) => {
    const nuevoEstado = estadoActual === "Activo" ? "Deshabilitado" : "Activo";

    Swal.fire({
      title: "¿Estás seguro?",
      text: `El estado cambiará a ${nuevoEstado}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "Cancelar",
      customClass: {
        confirmButton: `
      bg-[#007832]
      text-white font-semibold 
      px-6 py-2 mx-2 rounded-lg 
      shadow-md hover:shadow-lg 
      hover:bg-green-700 
      transition-all duration-300 ease-in-out
    `,
        cancelButton: `
      bg-[#f31260] 
      text-white font-semibold 
      px-6 py-2 mx-2 rounded-lg 
      shadow-md hover:shadow-lg 
      transition-all duration-300 ease-in-out
    `,
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        cambiarEstado(id, estadoActual);
      }
    });
  };

  const confirmarEliminar = (id: number, nombre: string) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: `Se eliminará el empleado ${nombre}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      customClass: {
        confirmButton: `bg-[#007832] text-white font-semibold px-6 py-2 mx-2 rounded-lg shadow-md hover:shadow-lg hover:bg-green-700 transition-all duration-300 ease-in-out`,
        cancelButton: `bg-[#f31260] text-white font-semibold px-6 py-2 mx-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out`,
      },
      buttonsStyling: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await fetchWithAuth(`${RUTA_API}api/servicio/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          const responseData = await response.json();
          return showToast("error", responseData.message);
        }
        setServicios((prevServicios) =>
          prevServicios.filter((servicio) => servicio.id !== id)
        );
        return showToast("success", `El Servicio ${nombre} ha sido eliminado`);
      }
    });
  };
  // Obtener los servicios desde la API
  const cambiarEstado = async (
    id: number,
    estadoActual: "Activo" | "Deshabilitado"
  ) => {
    try {
      const nuevoEstado =
        estadoActual === "Activo" ? "Deshabilitado" : "Activo";
      const response = await fetchWithAuth(
        `${RUTA_API}api/servicio/cambiarEstado/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ estado: estadoActual }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Estado cambiado",
          text: `El estado del servicio se cambió a ${nuevoEstado}.`,
        });
        onUpdate(data); // Actualiza la lista de servicios
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "No se pudo cambiar el estado.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al cambiar el estado.",
      });

      showToast("error", `Hubo un problema al cambiar el estado. ${error}`);
    }
  };

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const response = await fetchWithAuth(`${RUTA_API}api/servicio`, {
          method: "GET",
        });
        const data = await response.json();
        setServicios(data);
      } catch (error) {
      
        showToast("error", `Error al obtener los servicios ${error}`);
        setServicios([]);
      }
    };
    fetchServicios();
  }, []);
  const handleServicioCreado = (nuevoServicio: ServicioAttributes) => {
    setServicios((prevServicios) => [...prevServicios, nuevoServicio]);
  };
  const columns = [
    { uid: "Codigo", name: "Código" },
    { uid: "Servicios", name: "Servicios" },
    { uid: "Duración", name: "Duración (HH:mm:ss)" },
    { uid: "Estado", name: "Estado" },
    { uid: "Acciones", name: "Acciones" },
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
    let filteredServicios = [...servicios];

    if (hasSearchFilter) {
      filteredServicios = filteredServicios.filter(
        (servicio) =>
          servicio.codigo.toLowerCase().includes(filterValue.toLowerCase()) ||
          servicio.duracion.toLowerCase().includes(filterValue.toLowerCase()) ||
          servicio.nombre.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredServicios;
  }, [servicios, filterValue]);

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
            <p className="text-2xl md:text-5xl font-semibold">Servicios</p>
            <p className="font-semibold bg-slate-200 h-7 w-8 rounded-md mx-2 text-center text-xl ">
              {servicios.length}
            </p>
          </div>
          <CrearServicio onServicioCreado={handleServicioCreado} />
        </div>
        <div className="flex flex-col gap-4 my-5 mx-4 sm:mx-0">
          <Input
            isClearable
            className="w-full sm:w-auto"
            placeholder="Buscar Servicio"
            startContent={<Search />}
            value={filterValue}
            onClear={onClear}
            onValueChange={onSearchChange}
          />
        </div>
      </div>
    ),
    [filterValue, onSearchChange, onClear, servicios]
  );
  const onUpdate = (updatedServicio: ServicioAttributes) => {
    setServicios((prevServicios) =>
      prevServicios.map((servicio) =>
        servicio.id === updatedServicio.id ? updatedServicio : servicio
      )
    );
  };
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
      <Table
        className="w-full text-sm md:text-base"
        aria-labelledby={"Tabla Servicos"}
      >
        <TableHeader>
          {headerColumns.map((column) => (
            <TableColumn key={column.uid}>{column.name}</TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {items.map((servicio) => (
            <TableRow key={servicio.id}>
              <TableCell>{servicio.codigo}</TableCell>
              <TableCell>{servicio.nombre}</TableCell>
              <TableCell>{servicio.duracion}</TableCell>
              <TableCell>
                <Kbd
                  onClick={() =>
                    confirmarCambioEstado(servicio.id, servicio.estado)
                  }
                  className={`${
                    servicio.estado === "Activo"
                      ? "bg-[#84BE6A]"
                      : "bg-[#FF4B2B]"
                  } w-28 rounded-xl text-center text-white justify-center items-center cursor-pointer`}
                >
                  {servicio.estado}
                </Kbd>
              </TableCell>
              <TableCell className="flex flex-wrap justify-start items-start text-start gap-2">
                <DetallesEmpleado id={servicio.id} />
                <EditarServicio
                  id={servicio.id}
                  onUpdate={onUpdate}
                  estado={servicio.estado}
                />
                <Trash2
                  strokeWidth={1}
                  size={30}
                  color="#BCBCBC"
                  className={
                    servicio.estado == "Activo"
                      ? "w-8 mr-4 cursor-pointer"
                      : "w-8 mr-4"
                  }
                  onClick={() => {
                    if (servicio.estado === "Activo") {
                      confirmarEliminar(servicio.id, servicio.nombre);
                    }
                  }}
                />
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
