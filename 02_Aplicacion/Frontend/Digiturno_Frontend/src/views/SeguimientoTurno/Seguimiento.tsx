import { Footer } from "../../components/Footer"
import { HeaderUsuario } from "../../components/Header"
import { Navegacion } from "../../components/Navegacion"
import { TablaTurnos } from "./TablaTurnos"
export const SeguimientoTurno = () => {

    return <>
        <HeaderUsuario />
        <div className="flex">
            <Navegacion/>
            <TablaTurnos/>
        </div>
        <Footer />
    </>
}