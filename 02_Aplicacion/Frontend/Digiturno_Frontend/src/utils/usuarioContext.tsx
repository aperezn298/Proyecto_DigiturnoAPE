import React, { createContext, useContext, useState } from "react";

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  telefono: string;
  tipoEmpleado: string;
  token: string;
}

interface ContextoUsuario {
  usuario: Usuario;
  editarCorreoTelefono: (correo: string, telefono: string) => void;
  actualizarUsuario: (nuevoUsuario: Usuario) => void;
  cerrarSesion: () => void; // Asegúrate de incluir esta propiedad
}

export const UsuarioContext = createContext<ContextoUsuario | undefined>(
  undefined
);

export const UsuarioProvider = ({ children }: any) => {
  const usuarioStorage = localStorage.getItem("usuario");
  let usuarioJson = null;
  if (usuarioStorage) {
    usuarioJson = JSON.parse(usuarioStorage);
  }
  const [usuario, setUsuario] = useState<Usuario>(
    usuarioJson
      ? {
          id: usuarioJson.id,
          nombre: usuarioJson.nombre,
          correo: usuarioJson.correo,
          telefono: usuarioJson.telefono,
          tipoEmpleado: usuarioJson.tipoEmpleado,
          token: usuarioJson.token,
        }
      : {
          id: 0,
          nombre: "",
          correo: "",
          telefono: "",
          tipoEmpleado: "",
          token: "",
        }
  );

  const actualizarUsuario = (nuevoUsuario: Usuario) => {
    const tiempoExpiracion = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 horas
    const datosConExpiracion = { ...nuevoUsuario, tiempoExpiracion };
    setUsuario(datosConExpiracion);
    localStorage.setItem("usuario", JSON.stringify(datosConExpiracion));
  };
  const editarCorreoTelefono = (correo: string, telefono: string) => {
    const usuarioActualizado = { ...usuario, correo, telefono };
    setUsuario(usuarioActualizado); // Actualizar en tiempo real el contexto
    actualizarUsuario(usuarioActualizado);
  };
  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("modulo");
    setUsuario({
      id: 0,
      nombre: "",
      correo: "",
      telefono: "",
      tipoEmpleado: "",
      token: "",
    });
  };

  return (
    <UsuarioContext.Provider value={{ usuario, actualizarUsuario, cerrarSesion, editarCorreoTelefono }}>
      {children}
    </UsuarioContext.Provider>
  );
};
