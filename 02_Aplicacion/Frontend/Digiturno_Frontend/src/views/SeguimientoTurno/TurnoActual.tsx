import { Card, CardBody, useDisclosure } from "@nextui-org/react";
import { Ticket } from "lucide-react";

export const TurnoActual = ({ turno }: any) => {
  return (
    <>
      <Card className="border-1 border-black">
        <CardBody className="border-l-30 border-l-[#00304d] overflow-hidden">
          <div className="grid grid-cols-6">
            <div className="content-center place-items-center">
              <Ticket
                size={100}
                className="rotate-[225deg]"
                strokeWidth={1}
                color="#00304d"
              />
            </div>
            <div className="col-span-5">
              {turno == null ? (
                <>
                  <div className="grid grid-cols-1">
                    <div className="px-9 content-center text-justify font-bold text-3xl">
                      Turno Actual
                    </div>
                    <div className="px-9 content-center  font-medium text-4xl">
                      Toma un turno para empezar
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2">
                    <div className="px-9 content-center text-justify font-bold text-3xl">
                      Turno Actual
                    </div>
                    <div className="text-lg">
                      <b>Nombre:</b>{" "}
                      {turno.usuario.nombres + " " + turno.usuario.apellidos}
                    </div>
                    <div className="px-9 content-center text-justify font-bold text-5xl">
                      {turno.codigo}
                    </div>
                    <div className="text-lg">
                      <b>Servicios:</b>
                      <ul className="list-disc pl-8 space-x-3">
                        {turno.servicios.map((servicio: any, index: any) => (
                          <li key={index}>{servicio.nombre}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
};
