import { Image } from "@nextui-org/react";

export const HeaderTv = () => {
  const now = new Date();
  const options = {
    weekday: "long" as const,
    year: "numeric" as const,
    month: "long" as const,
    day: "numeric" as const,
  };
  const formattedDate = now.toLocaleDateString("es-ES", options);
  const formattedTime = now.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <header className="text-white border-b-4 border-[#00304D] w-full">
        <div className="flex justify-between items-center w-full">
          {/* Imagen a la izquierda */}
          <div className="py-3 flex justify-start ml-3">
            <Image
              src="https://res.cloudinary.com/doza0twgj/image/upload/v1734039010/LOGO_APE_color_gjlabc.png"
              alt="Agencia Pública de Empleo"
              className="max-w-[200px] md:max-w-full"
              width={280}
            />
          </div>

          {/* Contenido al lado derecho */}
          <div className="bg-[#00304D] flex flex-col items-center h-24 w-auto px-4 text-center">
            <p className="text-4xl mt-2">{formattedTime}</p>
            <p className="mt-2">{formattedDate}</p>
          </div>
        </div>
      </header>
    </>
  );
};
