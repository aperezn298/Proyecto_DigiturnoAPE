import { Footer } from "../../components/Footer"
import { HeaderUsuario } from "../../components/Header/HeaderUsuario"
import { Navegacion } from "../../components/Navegacion"
import { GeneradorDeDocumentos } from "./GeneradorDeDocumento"
// Historial de turnos (Tipo de grafica – Valores - Que).
// Historial de servicios (Tipo de grafica – Valores - Que).
// El total de turnos atendidos por población.
// Promedio del tiempo en espera del usuario (Indicadores).
// Promedio del tiempo de atención del usuario (Indicadores).

export const Dashboard =()=>{
    return <>
    <HeaderUsuario/>
    <div className="flex flex-col md:flex-row">
        {/* La barra de navegación estará arriba en pantallas pequeñas */}
        <div className="sm:mr-24 h-1/5">

        <Navegacion />
        </div>
        <div className="w-full md:w-[80%]">
        <GeneradorDeDocumentos></GeneradorDeDocumentos>
        </div>
      </div>
    <Footer/>
    </>
}