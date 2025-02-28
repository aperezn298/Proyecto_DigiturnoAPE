import { Op } from "sequelize";
import { Modelos } from "../models/modelos";
const Servicio = Modelos.Servicio;
const Empleado = Modelos.Empleado;
const ServicioEmpleado = Modelos.ServicioEmpleado;
const ServicioTurno = Modelos.ServicioTurno;

export async function getServicios(req: any, res: any) {
  try {
    const servicios = await Servicio.findAll();
    if (servicios.length === 0) {
      return res.status(204).json({
        message: "No hay servicios registrados",
      });
    }
    return res.json(servicios);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al obtener los servicios",
    });
  }
}

export async function getServiciosDisponibles(req: any, res: any) {

    try {
      const servicios = await Servicio.findAll({
        where:{
          estado: "Activo",
          nombre:{
            [Op.not]: "Registro en la APE"
          }
        },
        include:[
          {model:Empleado, required:true, where:{estado: "Activo"}}
        ]
      });
      if (servicios.length === 0) {
        return res.status(204).json({
          message: "No hay servicios registrados",
        });
      }
      return res.json(servicios);
    } catch (error: any) {
      return res.status(500).json({
        message: "Error al obtener los servicios",
      });
    }
  }

export async function getServiciosActivos(req: any, res: any) {
  try {
    const servicios = await Servicio.findAll({
      where:{
        estado: "Activo",
      }
    });
    if (servicios.length === 0) {
      return res.status(204).json({
        message: "No hay servicios activos",
      });
    }
    return res.json(servicios);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error al obtener los servicios",
    });
  }
}

export async function createServicio(req: any, res: any) {
  const { codigo, nombre, descripcion, duracion, icono } = req.body;
  try {
    let nuevoServicio = await Servicio.create(
      {
        codigo,
        nombre,
        descripcion,
        duracion,
        icono,
      },
      {
        fields: ["codigo", "nombre", "descripcion", "duracion", "icono"],
      }
    );

    return res.json(nuevoServicio);
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

export const updateServicio = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { codigo, nombre, descripcion, duracion, icono, estado } = req.body;

    const servicio = await Servicio.findByPk(id);

    if (!servicio) {
      return res.status(404).json({ message: "Servicio no encontrado" });
    }

    servicio.codigo = codigo;
    servicio.nombre = nombre;
    servicio.descripcion = descripcion;
    servicio.duracion = duracion;
    servicio.icono = icono;
    servicio.estado = estado;
    await servicio.save();

    return res.json(servicio);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export async function deleteServicio(req: any, res: any) {
  const { id } = req.params;
  try {
    
    await ServicioEmpleado.destroy({
      where: {
        servicioId: id,
      },
    });
    await ServicioTurno.destroy({
      where: {
        servicioId: id,
      },
    });
    await Servicio.destroy({
      where: {
        id: id,
      },
    });

    return res.sendStatus(200);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

//ENVIAR EL ESTADO ACTUAL PARA REVERTIRLO
export async function cambiarEstado(req: any, res: any) {
  const {id} = req.params;
  const {estado} = req.body;
  try {
    const servicio = await Servicio.findByPk(id);
    if (!servicio) {
      return res.status(404).json({ message: "Servicio no encontrado" });
    } else if(servicio.nombre == "Registro en la APE"){
      return res.status(400).json({ message: "Este registro no puede ser deshabilitado" });
    }
    const  nuevoEstado = estado == "Activo" ? "Deshabilitado" : "Activo";
    servicio.estado = nuevoEstado;
    await servicio.save()
    res.json(servicio);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
}
