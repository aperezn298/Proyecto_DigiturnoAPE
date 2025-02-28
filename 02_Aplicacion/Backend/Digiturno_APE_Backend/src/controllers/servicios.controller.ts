import { Empleado } from "../models/Empleado";
import {
    Modelos
} from "../models/modelos"
import { Rol } from "../models/Rol";
import { TipoEmpleado, } from "../models/TipoEmpleado";
const Servicio : any = Modelos.Servicio;
export async function getServicios(req: any, res: any) {
    try {
        const servicio = await Servicio.findAll();
      res.json(servicio);
    } catch (error: any) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }
export async function getServicio(req: any, res: any) {
    const { id } = req.params;
  try {
    const servicio = await Servicio.findOne({
      where: {
        id,
      },
    });
    res.json(servicio);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
  }
  export async function createServicio(req: any, res: any) {
    try {
      const { codigo, nombre, descripcion, duracion, icono  } = req.body;
  
      if (!codigo || !nombre || !descripcion || !duracion || !icono) {
        return res.status(400).json({ message: "Faltan campos requeridos" });
      }
      const nuevoServicio = await Servicio.create({
        codigo,
        nombre,
        descripcion,
        duracion,
        icono,
        estado: "Activo", 
      });
      res.status(201).json(nuevoServicio); 
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  export async function updateServicio(req: any, res: any) {
    try {
      const { id } = req.params; // Obtenemos el id del servicio de los parámetros de la URL
      const { codigo, nombre, descripcion, duracion, icono } = req.body;
      // Encontrar el servicio por ID
      const servicio = await Servicio.findByPk(id);
      if (!servicio) {
        return res.status(404).json({ message: "Servicio no encontrado" });
      }
  
      // Actualizar el servicio con los datos proporcionados
      await servicio.update({
        codigo,
        nombre,
        descripcion,
        duracion,
        icono,
      });
  
      res.status(200).json(servicio); // Responder con el servicio actualizado
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }



  export async function EstadoServicio(req: any, res: any) {
    try {
      const { id } = req.params;
      const servicio = await Servicio.findByPk(id);
      if (!servicio) {
        return res.status(404).json({ message: "Servicio no encontrado" });
      }
      const nuevoEstado = servicio.estado === "Activo" ? "Deshabilitado" : "Activo";
      await servicio.update({ estado: nuevoEstado });
      res.status(200).json({ message: `Estado actualizado a ${nuevoEstado}`, servicio });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }