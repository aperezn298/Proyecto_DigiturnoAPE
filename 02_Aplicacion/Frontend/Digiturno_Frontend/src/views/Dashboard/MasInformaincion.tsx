import React, { useEffect, useState } from 'react';
import { UsuarioTurnoDetalle } from '../../states/context/Interface';
import useFetchWithAuth from '../../utils/peticionesHttp';
import showToast from '../../utils/toastUtil';
const RUTA_API = import.meta.env.VITE_API_URL;

export const MasInformacion = () => {
  const [turnosDelDia, setTurnosDelDia] = useState<UsuarioTurnoDetalle[]>([]);
  const [enEspera, setEnEspera] = useState<number>(0);
  const { fetchWithAuth } = useFetchWithAuth();

  useEffect(() => {
    const obtenerTurnosDelDia = async () => {
      try {

        const response = await fetchWithAuth(
          `${RUTA_API}api/turno/turnos/dto`,
          {
            method: "GET",

          }
        )
        const data: UsuarioTurnoDetalle[] = await response.json();

        // Obtener fecha actual en formato 'YYYY-MM-DD'
        const fechaColombiana = new Date();
        fechaColombiana.setDate(fechaColombiana.getDate() - 1); // Restar un día
        const fechaFormateada = fechaColombiana.toISOString().split('T')[0];

        // Filtrar los turnos por la fecha de hoy
        const turnosHoy = data.filter(turno => turno.fecha === fechaFormateada);

        // Contar los turnos en estado "Espera"
        const cantidadEnEspera = turnosHoy.filter(turno => turno.estado === "Espera").length;

        setTurnosDelDia(turnosHoy);
        setEnEspera(cantidadEnEspera);
      } catch (error) {
        showToast("error", `Hubo un problema al obtener los turnos. Por favor, inténtalo nuevamente. ${error}`);
      }
    };

    obtenerTurnosDelDia();
  }, []);

  return (
    <>
      <div className=' w-3/4 '>
        <div className='flex flex-col bg-[#D9D9D9]  p-2 m-3 justify-center items-center text-center rounded-sm '>
          <h1>Turnos del día: {turnosDelDia.length}</h1>
        </div>
        <div className='flex flex-col bg-[#D9D9D9] p-2 m-3 justify-center items-center text-center rounded-sm '>
          <h2>Usuarios en espera: {enEspera}</h2>
        </div>
      </div>

    </>

  );
};
