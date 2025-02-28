import React from "react";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UsuarioContext } from "../utils/usuarioContext";

interface RutaProtegidaProps {
  children: React.ReactNode;
  rolesPermitidos: string[];
}
export const RutaProtegida: React.FC<RutaProtegidaProps> = ({ children, rolesPermitidos }) => {
  const context = useContext(UsuarioContext);

  if (!context || !context.usuario.token) {
    return <Navigate to="/sesion" replace />;
  }

  // Verificar si la sesión ha expirado
  const tiempoActual = new Date().getTime();
  const tiempoExpiracion = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 horas

if (tiempoExpiracion && tiempoExpiracion < tiempoActual) {
  context.cerrarSesion();
  return <Navigate to="/sesion" replace />;
}


  // Verificar roles permitidos
  if (!rolesPermitidos.includes(context.usuario.tipoEmpleado)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
