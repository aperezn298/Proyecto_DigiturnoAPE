import { Request, Response } from "express";
import { ServicioEmpleado } from "../models/ServicioEmpleado";
import { Empleado } from "../models/Empleado";
import { Servicio } from "../models/Servicio";

export async function createServicioEmpleado(req: Request, res: Response) {
  const { servicioId, empleadoId } = req.body;

  try {
    // Verificamos que tanto el servicio como el empleado existan en la base de datos
    const servicio = await Servicio.findByPk(servicioId);
    const empleado = await Empleado.findByPk(empleadoId);

    if (!servicio) {
      return res.status(404).json({
        message: `El servicio con ID ${servicioId} no existe.`,
      });
    }

    if (!empleado) {
      return res.status(404).json({
        message: `El empleado con ID ${empleadoId} no existe.`,
      });
    }

    // Creamos la relación en la tabla ServicioEmpleado
    const nuevoServicioEmpleado = await ServicioEmpleado.create(
      {
        servicioId,
        empleadoId,
      },
      {
        fields: ["servicioId", "empleadoId"],
      }
    );

    return res.json(nuevoServicioEmpleado);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
}



export async function updateServicioEmpleado(req: Request, res: Response) {
  const { id } = req.params; // ID del registro ServicioEmpleado a actualizar
  const { servicioId, empleadoId } = req.body;

  try {
    // Buscamos el registro en la tabla ServicioEmpleado
    const servicioEmpleado = await ServicioEmpleado.findByPk(id);

    if (!servicioEmpleado) {
      return res.status(404).json({
        message: `El registro con ID ${id} no existe en la tabla servicioEmpleado.`,
      });
    }

    // Verificamos que tanto el servicio como el empleado existan
    const servicio = await Servicio.findByPk(servicioId);
    const empleado = await Empleado.findByPk(empleadoId);

    if (!servicio) {
      return res.status(404).json({
        message: `El servicio con ID ${servicioId} no existe.`,
      });
    }

    if (!empleado) {
      return res.status(404).json({
        message: `El empleado con ID ${empleadoId} no existe.`,
      });
    }

    // Actualizamos el registro en la tabla ServicioEmpleado
    servicioEmpleado.servicioId = servicioId;
    servicioEmpleado.empleadoId = empleadoId;
    await servicioEmpleado.save();

    return res.json(servicioEmpleado);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
}
