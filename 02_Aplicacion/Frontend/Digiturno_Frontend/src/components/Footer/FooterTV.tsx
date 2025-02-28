import { Image } from "@nextui-org/react";
import { useEffect } from "react";
export const FooterTV = ({
  ultimoTurno
}:any) => {
  useEffect(()=>{

  }, [ultimoTurno])
  return (
    <footer className="w-full flew flex-row border-t-4 border-[#00304D]">
       <div className="mx-14 my-8 flex">
        <div className="place-content-center">
          <Image width={60} src={ultimoTurno.servicios[0].icono} />
        </div>
        
        <div className="text-5xl font-semibold mx-11">
          <p>{ultimoTurno.usuario.nombres+" "+ultimoTurno.usuario.apellidos}</p>
          <p>Módulo: {ultimoTurno.empleado.modulo.modulo}</p>
        </div>
        <div className="text-7xl justify-end items-end ml-auto">
            <p >
           Turno:<span className="font-bold">{ultimoTurno.codigo}</span>
            </p>
        </div>
      </div>
    </footer>
  );
};
