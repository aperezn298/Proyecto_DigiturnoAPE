export interface ServicioAttributes {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  duracion: string | any;
  icono: string;
  estado: "Activo" | "Deshabilitado";
}

export interface User {
  id: number;
  tipoDocumento: string;
  numeroDocumento: string;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
  estado: "Activo" | "Deshabilitado";
  tipoId: number;
  servicios: {
    id: number;
    nombre: string;
  }[];
}

export type ServicioSinIDYEstado = Omit<ServicioAttributes, "id" | "estado">;

export interface UsuarioFormato {
  id: number;
  tipoUsuarioId: number;
  tipoDocumento: "RC" | "CC" | "TE";
  numeroDocumento: string;
  nombres: string;
  apellidos: string;
  correo: string;
  prioridad: boolean;
  tipoPoblacionId: number;
  estado: "Activo" | "Deshabilitado";
}

export interface Turno {
  id: number;
  codigo: string;
  fecha: Date;
  horaCreacion: string;
  horaAsignacion: string;
  horaFinalizacion: string;
  observacion: string;
  estado: "Espera" | "Proceso" | "Cancelado" | "Atendido";
  usuarioId: number;
  empleadoId: number;
}

export interface UsuarioFormato {
  id: number;
  tipoUsuarioId: number;
  tipoDocumento: "RC" | "CC" | "TE";
  numeroDocumento: string;
  nombres: string;
  apellidos: string;
  correo: string;
  tipoPoblacionId: number;
  estado: "Activo" | "Deshabilitado";
}

export interface ServicioTurno {
  id: number;
  servicioId: number;
  turnoId: number;
}

export interface Servicio {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  duracion: string;
  icono: string;
  estado: "Activo" | "Deshabilitado";
  servicioTurno: ServicioTurno;
}

  export interface UsuarioFormato {
    id: number;
    tipoUsuarioId: number;
    tipoDocumento:  "RC" | "CC" | "TE";
    numeroDocumento: string;
    nombres: string;
    apellidos: string;
    correo: string;
    tipoPoblacion: {
      nombre: string;
    };
    tipoUsuario:{
      nombre: string;
    };
    tipoPoblacionId: number;
    estado: "Activo" | "Deshabilitado";
  }
  
  export interface ServicioTurno {
    id: number;
    servicioId: number;
    turnoId: number;
  }
  
  export interface Servicio {
    id: number;
    codigo: string;
    nombre: string;
    descripcion: string;
    duracion: string;
    icono: string;
    estado: "Activo" | "Deshabilitado";
    servicioTurno: ServicioTurno;
  }
  
  export interface Empleado {
    id: number;
    nombres: string;
    apellidos: string;
  }
  
  export interface HistorialTurnos {
    id: number;
    codigo: string;
    fecha: string;
    horaCreacion: string;
    horaAsignacion: string;
    horaFinalizacion: string;
    observacion: string;
    prioridad: boolean;
    estado: "Espera" | "Proceso" | "Cancelado" | "Atendido";
    tiempoEspera: string;
    tiempoProceso: string;
    usuario: UsuarioFormato;
    empleado: Empleado;
    servicios: Servicio[];
    calificacion: {
      calificacion: number,
      observacion: string,
    },
  }
  export interface UsuarioTurnoDetalle {
    nRestantes: number,
    id: number,
    codigo: string,
    fecha: string,
    horaCreacion:string,
    horaAsignacion: string,
    horaFinalizacion: string,
    observacion: string,
    estado: "Espera" | "Proceso" | "Cancelado" | "Atendido",
    tiempoEspera: string,
    tiempoProceso: string,
    usuarioId: number,
    empleado: {
      id: number,
      nombres: string,
      apellidos: string,
      modulo: {
        modulo: number
      }
    },
    servicios: [
      {
        id: number,
        nombre: string,
        icono: string,
        estado:  "Activo" | "Deshabilitado",
        servicioTurno: {
          id: number,
          servicioId: number,
          turnoId: number
        }
      }
    ],
    usuario: {
      id: number,
      tipoDocumento: string,
      numeroDocumento: string,
      nombres: string,
    apellidos: string,
      correo: string,
      estado: "Activo" | "Deshabilitado",
      tipoPoblacion: {
        nombre: string
      },
      tipoUsuario: {
        nombre: string
      }
    },
    calificacion: {
      calificacion: number,
      observacion: string
    }
  }




  
export interface TurnoDto {
  id: number | undefined;
  codigo: string | null;
  fecha: string | null;
  horaCreacion: string | null;
  estado: string | null;
  prioridad: boolean;
  servicios:
    | {
        id: number | null;
        nombre: string | null;
        estado: string | null;
      }[]
    | null;
  empleado: {
    id: number | null;
    nombres: string | null;
  } | null;
  usuario: {
    id: number | null;
    tipoDocumento: string | null;
    numeroDocumento: string | null;
    nombres: string | null;
    apellidos: string | null;
    correo: string | null;
    estado: string | null;
    tipoPoblacion: {
      nombre: string | null;
    } | null;
    tipoUsuario: {
      nombre: string | null;
    } | null;
  } | null;
}
export type ServicioInIdNombre = {
  id: number;
  nombre: string;
};
export type EstadoData = {
  modulo: string | null;
  observacion: string | null;
  servicioIds: number[];
  empleadoId: number | undefined;
  estado: string | null;
};
