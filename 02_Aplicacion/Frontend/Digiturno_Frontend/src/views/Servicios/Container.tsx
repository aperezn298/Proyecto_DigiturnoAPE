import { Image } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ServicioAttributes } from "../../states/context/Interface";
import useFetchWithAuth from "../../utils/peticionesHttp";
import showToast from "../../utils/toastUtil";
const RUTA_API = import.meta.env.VITE_API_URL;

export const ContainerServicios = () => {
  const [Servicios, setServicios] = useState<ServicioAttributes[]>([]);
  const { fetchWithAuth } = useFetchWithAuth();

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const response = await fetchWithAuth(
          `${RUTA_API}api/tv/disponible`,
          { method: "GET" }
        );
        const data = await response.json();

        setServicios(data);
      } catch (error) {

        showToast("error", `Error al obtener los servicios ${error}`);
      }
    };
    fetchServicios();
  }, []);
  return (
    <>
      {Servicios.map((info) => (
        <div
          key={info.id}
          className="hover:shadow-lg place-self-center place-content-center transform hover:scale-105 transition-transform w-full min-h-60 p-3 bg-[#ffffff] rounded-xl shadow-[#adadad] shadow-md flex flex-col items-center"
        >
          <Link
            to={`/informacionusurio/${info.id}`}
            className="flex flex-col items-center justify-center h-full "
          >
            <Image src={info.icono} width={90} className=" mx-auto w-full " />
            <p className="font-medium text-2xl my-2 text-center">
              {info.nombre}
            </p>
            <p className="font-light text-center text-sm mx-3">
              {info.descripcion}
            </p>
          </Link>
        </div>
      ))}
    </>
  );
};
