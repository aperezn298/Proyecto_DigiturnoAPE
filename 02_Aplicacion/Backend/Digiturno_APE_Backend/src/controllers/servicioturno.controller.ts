import { Request, Response } from "express";
import { ServicioTurno } from "../models/ServicioTurno";
import { Servicio } from "../models/Servicio";
import { Turno } from "../models/Turno";

export async function createServicioTurno(req: Request, res: Response) {
  const { servicioId, turnoId } = req.body;

  try {
    // Verificamos que tanto el servicio como el turno existan en la base de datos
    const servicio = await Servicio.findByPk(servicioId);
    const turno = await Turno.findByPk(turnoId);

    if (!servicio) {
      return res.status(404).json({
        message: `El servicio con ID ${servicioId} no existe.`,
      });
    }

    if (!turno) {
      return res.status(404).json({
        message: `El turno con ID ${turnoId} no existe.`,
      });
    }

    // Creamos la relación en la tabla ServicioTurno
    const nuevoServicioTurno = await ServicioTurno.create(
      {
        servicioId,
        turnoId,
      },
      {
        fields: ["servicioId", "turnoId"],
      }
    );

    return res.json(nuevoServicioTurno);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

export async function updateServicioTurno(req: Request, res: Response) {
    const { id } = req.params; // ID del registro ServicioTurno a actualizar
    const { servicioId, turnoId } = req.body;
  
    try {
      // Buscamos el registro en la tabla ServicioTurno
      const servicioTurno = await ServicioTurno.findByPk(id);
  
      if (!servicioTurno) {
        return res.status(404).json({
          message: `El registro con ID ${id} no existe en la tabla servicioTurno.`,
        });
      }
  
      // Verificamos que tanto el servicio como el turno existan
      const servicio = await Servicio.findByPk(servicioId);
      const turno = await Turno.findByPk(turnoId);
  
      if (!servicio) {
        return res.status(404).json({
          message: `El servicio con ID ${servicioId} no existe.`,
        });
      }
  
      if (!turno) {
        return res.status(404).json({
          message: `El turno con ID ${turnoId} no existe.`,
        });
      }
  
      // Actualizamos el registro en la tabla ServicioTurno
      servicioTurno.servicioId = servicioId;
      servicioTurno.turnoId = turnoId;
      await servicioTurno.save();
  
      return res.json(servicioTurno);
    } catch (error: any) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }