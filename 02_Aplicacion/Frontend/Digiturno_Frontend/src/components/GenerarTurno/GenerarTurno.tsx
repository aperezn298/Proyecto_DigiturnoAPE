import { Button, Image } from "@nextui-org/react";
import Ticket from "../../assets/Ticket.png";
import Triangulo from "../../assets/triangulo.png";
import Qr from "../../assets/image 4.png";
import { Link } from "react-router-dom";
export const GenerarTurno = () => {
    return (
        <>
            <div
                className="border-3 border-[#00304D]   w-5/6 sm:w-3/4 md:w-4/5 lg:w-2/6 h-auto md:h-80 rounded-xl flex flex-col items-center justify-center space-y-4 p-4 m-auto my-10"
                style={{
                    borderLeftWidth: "20px",
                }}
            >
                <div className=" flex">

                    <Image className="w-34 h-34 sm:w-42 sm:h-42 mr-5" width={148}
                        height={148}
                        src={Ticket} />

                    <Image className="w-42 h-42 mr-5" width={128} height={128} src={Qr} />
                </div>
                <Link to={"/servicios"}>
                    <button className="bg-[#00304D] p-1.5 rounded-xl text-white w-52 text-xl flex items-center justify-center">
                        Generar un turno
                        <Image
                            className="ml-2 w-5 h-5"
                            height={20}
                            width={20}
                            src={Triangulo}
                        />
                    </button>
                </Link>

            </div>
        </>
    );
};
