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
  Spinner,
} from "@nextui-org/react";
import { Search, Trash2 } from "lucide-react";
import { CrearEmpleado } from "./CrearEmpleado";
import { DetallesEmpleado } from "./DetallesEmpleado";
import { EditarEmpleado } from "./EditarEmpleado";
import { Servicios } from "./Servicios";
import { User } from "../../states/context/Interface";
import Swal from "sweetalert2";
import useFetchWithAuth from "../../utils/peticionesHttp";
import showToast from "../../utils/toastUtil";
import { UsuarioContext } from "../../utils/usuarioContext";

const RUTA_API = import.meta.env.VITE_API_URL;

export const TablaEmpleados = () => {
  const [filterValue, setFilterValue] = useState("");
  const [rowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [Empleados, setEmpleados] = useState<User[]>([]);
  const [servicios, setServicios] = useState<any[]>([]);
  const [Loading, setLoading] = useState(false);
  const { fetchWithAuth } = useFetchWithAuth();
  const context = useContext(UsuarioContext);

  const columns = useMemo(
    () => [
      { uid: "Documento", name: "Documento" },
      { uid: "Nombre", name: "Nombre" },
      { uid: "Apellido", name: "Apellido" },
      { uid: "Estado", name: "Estado" },
      { uid: "Acciones", name: "Acciones" },
    ],
    []
  );
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
        const response = await fetchWithAuth(`${RUTA_API}api/empleado/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          const responseData = await response.json();
          return showToast("error", responseData.message);
        }
        setEmpleados((prevEmpleados) =>
          prevEmpleados.filter((empleado) => empleado.id !== id)
        );
        return showToast("success", `El empleado ${nombre} ha sido eliminado`);
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
        `${RUTA_API}api/empleado/cambiarEstado/${id}`,
        {
          method: "POST",
          body: JSON.stringify({
            estado: estadoActual,
          }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Estado cambiado",
          text: `El estado del empleado se cambió a ${nuevoEstado}.`,
        });
        const empleadoActual = Empleados.find((e) => e.id == id);
        if (empleadoActual) {
          empleadoActual.estado = nuevoEstado;
          setEmpleados((prevEmpleados) => [
            ...prevEmpleados.filter((empleado) => empleado.id !== id),
            empleadoActual,
          ]);
        }
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
      
      showToast("error", `Hubo un problema al cambiar el estado del empleado. ${error}`);
    }
  };

  const headerColumns = useMemo(() => columns, [columns]);
  const handleServicioCreado = (nuevoServicio: User) => {
    setEmpleados((prevServicios) => [...prevServicios, nuevoServicio]);
  };
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await fetchWithAuth(`${RUTA_API}api/empleado/dto`, {
          method: "GET",
        });
        const data = await response.json();
        setEmpleados(data.empleados);
        setServicios(data.servicios);
        setLoading(false);
      } catch (error) {
        
        showToast("error", `Hubo un problema al obtener los empleados. ${error}}`);
      }
    };
    fetchData();
  }, []);

  const filteredItems = useMemo(() => {
    if (!filterValue) return Empleados;
    return Empleados.filter((user) =>
      [user.nombres, user.apellidos, user.numeroDocumento].some((field) =>
        field.toLowerCase().includes(filterValue.toLowerCase())
      )
    );
  }, [Empleados, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredItems.slice(start, start + rowsPerPage);
  }, [page, filteredItems, rowsPerPage]);

  const handleSearchChange = useCallback((value: string) => {
    setFilterValue(value);
    setPage(1);
  }, []);

  const handleClearSearch = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);
  const onUpdate = (updatedEmpleado: User) => {
    setEmpleados((prevServicios) =>
      prevServicios.map((empleado) =>
        empleado.id === updatedEmpleado.id ? updatedEmpleado : empleado
      )
    );
  };
  const TopContent = useMemo(
    () => (
      <div>
        <div className="flex  sm:flex-row justify-between items-center">
          <div className="flex mx-2 sm:mx-0">
            <p className="text-2xl md:text-5xl font-semibold">Empleados</p>
            <p className="font-semibold bg-slate-200 h-7 w-8 rounded-md mx-2 text-center text-xl ">
              {Empleados.length}
            </p>
          </div>
          <CrearEmpleado onServicioCreado={handleServicioCreado} />
        </div>
        <div className="flex flex-col gap-4 my-5 mx-4 sm:mx-0">
          <Input
            isClearable
            className="w-full sm:w-auto"
            placeholder="Buscar Empleado"
            startContent={<Search />}
            value={filterValue}
            onClear={handleClearSearch}
            onValueChange={handleSearchChange}
          />
        </div>
      </div>
    ),
    [filterValue, handleSearchChange, handleClearSearch, Empleados]
  );

  const BottomContent = useMemo(
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
      <div className="w-full">{TopContent}</div>
      <Table
        className="w-full text-sm md:text-base"
        aria-labelledby={"Tabla Empledos"}
      >
        <TableHeader>
          {headerColumns.map((column) => (
            <TableColumn key={column.uid}>{column.name}</TableColumn>
          ))}
        </TableHeader>
        <TableBody emptyContent="No se encontraron Empleados">
          {items.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.numeroDocumento}</TableCell>
              <TableCell>{user.nombres}</TableCell>
              <TableCell>{user.apellidos}</TableCell>
              <TableCell>
                <Kbd
                  onClick={() => confirmarCambioEstado(user.id, user.estado)}
                  className={`${
                    user.estado === "Activo" ? "bg-[#84BE6A]" : "bg-[#FF4B2B]"
                  } w-28 rounded-xl text-center text-white justify-center items-center cursor-pointer`}
                >
                  {user.estado}
                </Kbd>
              </TableCell>
              <TableCell className="flex flex-wrap items-center gap-2">
                <DetallesEmpleado id={user.id} empleados={Empleados} />
                <EditarEmpleado
                  id={user.id}
                  onUpdate={onUpdate}
                  empleados={Empleados}
                  estado={user.estado}
                />
                <Servicios
                  id={user.id}
                  serviciosFetch={servicios}
                  empleados={Empleados}
                  estado={user.estado}
                />
                <Trash2
                  strokeWidth={1}
                  size={30}
                  color="#BCBCBC"
                  className={user.estado == "Activo" ? "cursor-pointer" : ""}
                  onClick={() => {
                    if (user.estado == "Activo") {
                      confirmarEliminar(
                        user.id,
                        user.nombres + " " + user.apellidos
                      );
                    }
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-center items-center w-full">
        {BottomContent}
      </div>
    </div>
  );
};
