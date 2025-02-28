import { Op } from "sequelize";
import { Modelos } from "../models/modelos";
const Servicio = Modelos.Servicio;
const ServicioEmpleado = Modelos.ServicioEmpleado;
const ServicioTurno = Modelos.ServicioTurno;

//RegEx
const estadosServicio = ["Activo", "Deshabilitado"];
const codigoRegex = /^[A-Z]{1,2}$/;
const nombreRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,-]{1,150}$/;
const descripcionRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,-]{1,255}$/;
const duracionRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/; //Formato HH:MM

export async function createServicio(req: any, res: any, next: any) {
  const { codigo, nombre, descripcion, duracion, icono } = req.body;

  //Usa metodo para validar formato del formulario
  const mensajeError = await validarForm(
    codigo,
    nombre,
    descripcion,
    duracion,
    icono
  );
  if (mensajeError) {
    return res.status(400).json({ message: mensajeError });
  }

  //Busca si hay un servicio con ese nombre o código
  const servicio = await Servicio.findOne({
    where: {
      [Op.or]: [{ nombre }, { codigo }],
    },
  });
  if (servicio) {
    if (nombre === servicio.nombre) {
      return res
        .status(400)
        .json({ message: "El nombre del servicio ya esta registrado" });
    }
    return res
      .status(400)
      .json({ message: "El código del servicio ya esta registrado" });
  }

  next();
}

export async function updateServicio(req: any, res: any, next: any) {
  const { id } = req.params;
  const { codigo, nombre, descripcion, duracion, icono, estado } = req.body;

  //Usa metodo para validar formato del formulario
  const mensajeError = await validarForm(
    codigo,
    nombre,
    descripcion,
    duracion,
    icono
  );
  if (mensajeError) {
    return res.status(400).json({ message: mensajeError });
  }

  //Valida estado
  if (!estadosServicio.includes(estado)) {
    return res.status(400).json({ message: "El estado no es válido" });
  }

  const servicioActual = await Servicio.findByPk(id)
if(servicioActual && servicioActual.nombre === "Registro en la APE"){
  return res.status(400).json({ message: "No puedes editar este servicio" });
}

  const servicio = await Servicio.findOne({
    where: {
      [Op.or]: [{ nombre }, { codigo }],
      id:{
        [Op.not]: id,
      } 
    },
  });
  if (servicio) {
    if (nombre === servicio.nombre) {
      return res
        .status(400)
        .json({ message: "El nombre del servicio ya esta registrado" });
    }
    return res
      .status(400)
      .json({ message: "El código del servicio ya esta registrado" });
  }

  next();
}

export async function deleteServicio(req: any, res: any, next: any) {
  const { id } = req.params;

  const servicioActual = await Servicio.findByPk(id)
  if(servicioActual && servicioActual.nombre === "Registro en la APE"){
    return res.status(400).json({ message: "No puedes eliminar este servicio" });
  }

  const servicioEmpleado = await ServicioEmpleado.findOne({
    where: {
      servicioId: id,
    },
  });
  if (servicioEmpleado) {
    return res
      .status(400)
      .json({ message: "El servicio esta asignado a un empleado" });
  }

  const servicioTurno = await ServicioTurno.findOne({
    where: {
      servicioId: id,
    },
  });
  if (servicioTurno) {
    return res
      .status(400)
      .json({ message: "El servicio ya esta asignado a un turno" });
  }

  next();
}

async function validarForm(
  codigo: string,
  nombre: string,
  descripcion: string,
  duracion: string,
  icono: string
): Promise<string | null> {
  if (!codigoRegex.test(codigo)) {
    return "El código no es válido, debe ser de máximo 2 letras";
  }
  if (!nombreRegex.test(nombre)) {
    return "El nombre debe ser alfanumérico; máximo 150 caracteres";
  }
  if (!descripcionRegex.test(descripcion)) {
    return "La descripción debe ser alfanumérica; máximo 250 caracteres";
  }
  if (!duracionRegex.test(duracion)) {
    return "La duración debe tener el formato HH:MM";
  }
  if (typeof icono != "string") {
    return "El icono no es válido";
  }

  return null;
}
