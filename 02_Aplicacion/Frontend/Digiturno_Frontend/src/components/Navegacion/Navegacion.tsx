import { useEffect, useState } from "react";
import { Image, Tooltip } from "@nextui-org/react";

import { IconoNavegacion } from "./IconoNavegacion";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useMediaQuery } from "react-responsive";
import { NavagacionMovil } from "./index";
import IconSalio from "../../assets/salida.png";
import { Info } from "./Data"
import { useContext } from "react";
import { UsuarioContext } from "../../utils/usuarioContext";
import useFetchWithAuth from "../../utils/peticionesHttp";
const RUTA_API = import.meta.env.VITE_API_URL;

export const Navegacion = () => {
  const { fetchWithAuth } = useFetchWithAuth();
  const location = useLocation();
  const [selectedIcon, setSelectedIcon] = useState("Dashboard");
  const navigate = useNavigate();
  const context = useContext(UsuarioContext);

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
        setSelectedIcon("Servicios");
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


  const isDesktopOrLaptop = useMediaQuery({ query: '(min-width: 765px)' });

  return (
    <>
      {isDesktopOrLaptop && (
        <div className="h-full w-20 bg-[#00304D] rounded-2xl flex flex-col justify-center items-center ml-6 my-5">
          <div className="mx-3 w-full py-9 flex flex-col items-center">
            {opcionesFiltradas.map((e, index) => (
              <IconoNavegacion
                key={index} // Usa una propiedad única como `Url`, o un índice como último recurso.
                Icono={e.Icono}
                Titulo={e.Titulo}
                Url={e.Url}
                isSelected={selectedIcon === e.Titulo}
                onSelect={() => setSelectedIcon(e.Titulo)}
              />
            ))}

            <Tooltip
              className=""
              offset={18}
              content={"Cerrar Sesión"} color="primary" placement="right">
              <div className="my-auto mt-14  cursor-pointer" onClick={Salida}>
                <Image width={45} src={IconSalio} className="" />
              </div>
            </Tooltip>

          </div>
        </div>
      )}
      {!isDesktopOrLaptop && <NavagacionMovil />}
    </>
  );
};
