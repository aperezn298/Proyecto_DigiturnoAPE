import { Routes, Route } from "react-router-dom";
import { RutaProtegida } from "./ProtectedRoute";
import { Landing } from "../views/LandingPages";
import { InicioDeSesion } from "../views/Acesso";
import { Dashboard } from "../views/Dashboard";
import { Tv } from "../views/Tv";
import { Empleados } from "../views/Empleados";
import { Servicios, ServiciosOfrecemos } from "../views/Servicios";
import { HistorialDeTurnos } from "../views/HistorialDeTurnos";
import { SeguimientoTurno } from "../views/SeguimientoTurno/Seguimiento";
import { InformacionUsurioTiqute } from "../views/InformacionUsuarioTiquete";
import { InformacionTurno } from "../views/DetalleTurno";
import { Calificacion } from "../views/Calificacion";

export const Rutas = () => {
  return (
    <Routes>
      {/* Rutas protegidas */}
      <Route
        path="/dashboard"
        element={
          <RutaProtegida rolesPermitidos={["Administrador", "Orientador"]}>
            <Dashboard />
          </RutaProtegida>
        }
      />
      <Route
        path="/servicio"
        element={
          <RutaProtegida rolesPermitidos={["Administrador"]}>
            <Servicios />
          </RutaProtegida>
        }
      />
      <Route
        path="/empleados"
        element={
          <RutaProtegida rolesPermitidos={["Administrador"]}>
            <Empleados />
          </RutaProtegida>
        }
      />
      <Route
        path="/historialturnos"
        element={
          <RutaProtegida rolesPermitidos={["Administrador", "Orientador"]}>
            <HistorialDeTurnos />
          </RutaProtegida>
        }
      />
      <Route
        path="/seguimiento"
        element={
          <RutaProtegida rolesPermitidos={["Administrador", "Orientador"]}>
            <SeguimientoTurno />
          </RutaProtegida>
        }
      />
      {/* Rutas públicas */}
      <Route path="/" element={<Landing />} />
      <Route path="/*" element={<Landing />} />
      <Route path="/sesion" element={<InicioDeSesion />} />
      <Route path="/seguimiento" element={<SeguimientoTurno />} />
      <Route path="/tv" element={<Tv />} />
      <Route path="/servicios" element={<ServiciosOfrecemos />} />
      <Route path="/informacionusurio/:servicio" element={<InformacionUsurioTiqute />} />
      <Route path="/historialturnos" element={<HistorialDeTurnos />} />
      <Route path="/turnousuario/:turno" element={<InformacionTurno />} />
      <Route path="/calificacion/:turno" element={<Calificacion />} />
    </Routes>
  );
};
