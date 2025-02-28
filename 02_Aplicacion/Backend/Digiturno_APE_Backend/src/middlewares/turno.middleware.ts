import { Op } from "sequelize";
import { Modelos } from "../models/modelos";
import { decrypt } from "../utils/encriptarDatos";
const Turno = Modelos.Turno;
const Usuario = Modelos.Usuario;
const Empleado = Modelos.Empleado;
const TipoPoblacion = Modelos.TipoPoblacion;
const TipoUsuario = Modelos.TipoUsuario;
const Servicio = Modelos.Servicio;
const Modulo = Modelos.Modulo;
const Calificacion = Modelos.Calificacion;

//RegEx
const codigoRegex = /^[A-Z]{2,3}[0-9]{3}$/;
const moduloRegex = /^(?:[0-9]{1,3}|null)$/;
const tiposValidos = ["CC", "RC", "TE"];
const estadosTurno = ["Espera", "Proceso", "Atendido", "Cancelado"];
const numDocRegex = /^\d{8,13}$/;
const nombresRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+( [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/;
const apellidosRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ]+)+$/;
const correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const observacionRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,-]{1,255}$/;
const observacionCalificacionRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,-]{1,100}$/;
const calificacionRegex = /^(?:[1-4](?:\.\d+)?|5(\.0+)?)$/;

export async function createTurno(req: any, res: any, next: any) {
  const {
    tipoDocumento,
    numeroDocumento,
    nombres,
    apellidos,
    correo,
    tipoUsuarioId,
    tipoPoblacionId,
    servicioId,
  } = req.body;

  //Usa metodo para validar formato del formulario
  const mensajeError = await validarForm(
    tipoDocumento,
    numeroDocumento,
    nombres,
    apellidos,
    correo,
    tipoUsuarioId,
    tipoPoblacionId,
    servicioId
  );
  if (mensajeError) {
    return res.status(400).json({ message: mensajeError });
  }

  const turno = await Turno.findOne({
    where: {
      estado: {
        [Op.or]: ["Espera", "Proceso"],
      },
    },
    include: { model: Usuario, where: { numeroDocumento }, required: true },
  });
  if (turno) {
    return res
      .status(400)
      .json({ message: "Este usuario ya tiene un turno pendiente" });
  }

  const correoUsado = await Usuario.findOne({
    where: {
      correo,
      numeroDocumento: {
        [Op.not]: numeroDocumento
      }
    }
  })
  if (correoUsado) {
    return res
      .status(400)
      .json({
        message: "El correo ya esta registrado con otro número de documento"
      });
  }

  next();
}

export async function cambiarEstado(req: any, res: any, next: any) {
  const { id } = req.params;
  const { estado, empleadoId, observacion, servicioIds } = req.body;

  if (!estadosTurno.includes(estado)) {
    return res.status(400).json({ message: "El estado no existe" });
  }

  const turno = await Turno.findByPk(id);
  if (!turno) {
    return res.status(404).json({ message: "Error al cambiar el estado" });
  }
  if (estado == "Espera" /*&& turno?.estado == "Espera"*/) {
    if (empleadoId) {
      const empleado = await Empleado.findByPk(empleadoId);
      if (!empleado) {
        return res.status(404).json({ message: "Empleado no encontrado" });
      }
    } else {
      return res.status(404).json({
        message:
          "Se necesita el ID del empleado para sustituir al Empleado Predeterminado",
      });
    };
    const turnoActual = await Turno.findOne({
      where: {
        id
      },
      include: [
        { model: Empleado, where: { nombres: "Empleado Predeterminado" }, required: true }
      ]
    });
    if (!turnoActual) {
      return res.status(400).json({ message: "El turno ya ha sido asignado a otro empleado" });
    }
  }
  if (estado == "Cancelado" /*&& turno?.estado == "Espera"*/) {
    if (!servicioIds || servicioIds.length < 1) {
      return res
        .status(400)
        .json({ message: "Debe seleccionar al menos un servicio" });
    };
    if (observacion && !observacionRegex.test(observacion)) {
      return res
        .status(400)
        .json({ message: "La observación debe ser alfanumérica; máximo 250 caracteres" });
    };
  }
  if (estado == "Atendido" && turno?.estado == "Proceso") {
    if (!servicioIds || servicioIds.length < 1) {
      return res
        .status(400)
        .json({ message: "Debe seleccionar al menos un servicio" });
    };
    if (observacion && !observacionRegex.test(observacion)) {
      return res
        .status(400)
        .json({ message: "La observación debe ser alfanumérica; máximo 250 caracteres" });
    };
  }

  next();
}

export async function turnoConCodigo(req: any, res: any, next: any) {
  const { codigo } = req.params;

  if (!codigoRegex.test(codigo)) {
    return res.status(400).json({ message: "El código es inválido" });
  }

  next();
}

export async function cambiarModulo(req: any, res: any, next: any) {
  const { id } = req.params;
  const { modulo } = req.body;

  if (!moduloRegex.test(modulo)) {
    return res.status(400).json({ message: "El módulo es inválido, debe ser un número de 1 a 3 dígitos" });
  }
  if (modulo != null) {
    const moduloEmpleado = await Modulo.findOne({
      where: {
        modulo,
        empleadoId: {
          [Op.not]: id
        }
      }
    });
    if (moduloEmpleado) {
      return res.status(400).json({ message: "El módulo ya ha sido asignado" });
    }
  }

  next();
}

export async function createCalificacion(req: any, res: any, next: any) {
  const { codigo, calificacion, observacion } = req.body;

  if (!calificacionRegex.test(calificacion)) {
    return res.status(400).json({ message: "La calificación no es válida" });
  }
  if (observacion && !observacionCalificacionRegex.test(observacion)) {
    return res.status(400).json({ message: "La observación debe ser alfanumérica; máximo 100 caracteres" });
  }

  const codigoDesencriptado = decrypt(codigo)
  const [idTurno, idUsuario] = codigoDesencriptado.split("-")

  const calificacionHecha = await Calificacion.findOne({
    where: {
      idTurno
    }
  })

  if (calificacionHecha) {
    return res.status(400).json({ message: "Este servicio ya ha sido calificado, ¡Gracias!" });
  }

  next();
}

async function validarForm(
  tipoDocumento: string,
  numeroDocumento: string,
  nombres: string,
  apellidos: string,
  correo: string,
  tipoUsuarioId: number,
  tipoPoblacionId: number,
  servicioId: number
): Promise<string | null> {
  if (!tiposValidos.includes(tipoDocumento)) {
    return "El tipo de documento no es válido";
  }
  if (!numDocRegex.test(numeroDocumento)) {
    return "El número de documento no es válido, debe ser un número de 8 a 13 caracteres";
  }
  if (!nombresRegex.test(nombres) || nombres.length > 50) {
    return "El nombre debe contener solo letras máximo 50 caracteres";
  }
  if (!apellidosRegex.test(apellidos) || apellidos.length > 50) {
    return "Debe ingresar los 2 apellidos; debe contener solo letras y máximo 50 caracteres";
  }
  if (!correoRegex.test(correo)) {
    return "El correo es inválido";
  }

  if (!isNaN(tipoUsuarioId)) {
    const tipoUsuario = await TipoUsuario.findByPk(tipoUsuarioId);
    if (!tipoUsuario) {
      return "El tipo de usuario ingresado no existe";
    }
  } else {
    return "Debe seleccionar el tipo de usuario";
  };

  if (!isNaN(tipoPoblacionId)) {
    const tipoPoblacion = await TipoPoblacion.findByPk(tipoPoblacionId);
    if (!tipoPoblacion) {
      return "El tipo de población ingresado no existe";
    }
  } else {
    return "Debe seleccionar el tipo de población";
  };

  if (!isNaN(servicioId)) {
    const servicio = await Servicio.findByPk(servicioId);
    if (!servicio) {
      return "El servicio ingresado no existe";
    }
  } else {
    return "Debe seleccionar el servicio";
  };

  return null;
}
