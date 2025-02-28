import { useContext, useEffect, useState } from "react";
import { Image } from "@nextui-org/react";
import IconSalio from "../../assets/salida.png";
import { IconoNavegacion } from "./IconoNavegacion";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Info } from "./Data";
import { UsuarioContext } from "../../utils/usuarioContext";
import useFetchWithAuth from "../../utils/peticionesHttp";
const RUTA_API = import.meta.env.VITE_API_URL;
export const NavagacionMovil = () => {
  const location = useLocation();
  const [selectedIcon, setSelectedIcon] = useState("Dashboard");
  const navigate = useNavigate();
  const context = useContext(UsuarioContext);
  const { fetchWithAuth } = useFetchWithAuth();

  const opcionesFiltradas = Info.filter((e) => {
    if (context?.usuario.tipoEmpleado === "Orientador" && (e.Titulo === "Empleado" || e.Titulo === "Servicios")) {
      return false;
    }
    return true;
  });
  useEffect(() => {
    switch (location.pathname) {
      case "/dashboard":
        setSelectedIcon("Dashboard");
        break;
      case "/empleados":
        setSelectedIcon("Empleados");
        break;
      case "/servicio":
        setSelectedIcon("servicio");
        break;
      case "/historialturnos":
        setSelectedIcon("Historial de Turnos");
        break;
      case "/seguimiento":
        setSelectedIcon("Turnos");
        break;
      default:
        setSelectedIcon("Dashboard");
    }
  }, [location.pathname]);
  const Salida = async () => {
    const result = await Swal.fire({
      title: "¿Está seguro de cerrar sesión?",
      icon: "question",
      iconHtml: "?",
      confirmButtonText: "Cancelar",
      cancelButtonText: "Cerrar Sesión",
      showCancelButton: true,
      showCloseButton: true,
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
    });
    if (result.isDismissed && result.dismiss === Swal.DismissReason.cancel) {
      navigate("/");
      context?.cerrarSesion();
      await fetchWithAuth(
        `${RUTA_API}api/turno/modulo/` + context?.usuario.id,
        {
          method: "POST",
          body: JSON.stringify({ modulo: null }),
        }
      );
    }
  };
  return (
    <div className="h-20 w-full sm:w-3/4 my-5 bg-[#00304D] rounded-2xl flex justify-between items-center px-4 mx-auto">
      <div className="flex w-full overflow-x-auto sm:justify-around ">
        {opcionesFiltradas.map((e) => (
          <IconoNavegacion
            key={e.Url} // Usa una propiedad única como Url para evitar problemas.
            Icono={e.Icono}
            Titulo={e.Titulo}
            Url={e.Url}
            isSelected={selectedIcon === e.Titulo}
            onSelect={() => setSelectedIcon(e.Titulo)}
          />
        ))}

        <div className="my-auto cursor-pointer mx-auto" onClick={() => Salida()}>
          <Image width={45} src={IconSalio} className="" />
        </div>
      </div>
    </div>
  );

};
