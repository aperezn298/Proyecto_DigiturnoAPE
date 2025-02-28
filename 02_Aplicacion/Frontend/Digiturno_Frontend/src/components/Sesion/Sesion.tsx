import { Button, Image } from "@nextui-org/react";
import Avatar from "../../assets/avatar.png";
import Triangulo from "../../assets/triangulo.png";
import { Link } from "react-router-dom";

export const Sesion = () => {
  return (
    <>
      <div
        className="border-3 border-[#39A900] w-5/6 sm:w-3/4 md:w-4/5 lg:w-2/6 h-auto md:h-80 rounded-xl flex flex-col items-center justify-center space-y-4 p-4 m-auto my-10"
        style={{
          borderLeftWidth: "20px",
        }}
      >
        <p className="text-xl sm:text-2xl text-[#39A900] font-bold">Inicio de Sesión</p>
        <Image className="w-24 h-24 sm:w-32 sm:h-32" width={128} height={128} src={Avatar} />
        <Link to={"/sesion"}>
        <Button className="bg-[#39A900] text-white w-40 sm:w-52 text-lg sm:text-xl flex items-center justify-center">
          Ingresar
          <Image
            className="ml-6 sm:ml-10 w-4 h-4 sm:w-5 sm:h-5"
            height={20}
            width={20}
            src={Triangulo}
          />
        </Button>
        </Link>
      </div>
    </>
  );
};
