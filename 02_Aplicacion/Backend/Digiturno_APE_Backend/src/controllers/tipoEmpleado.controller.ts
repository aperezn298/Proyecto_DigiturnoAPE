import { Modelos } from "../models/modelos";
import { createRol, deleteRol, updateRol } from "./rol.controller";
const Empleado = Modelos.Empleado;
const TipoEmpleado = Modelos.TipoEmpleado;
const Rol = Modelos.Rol;
const Turno = Modelos.Turno;
const Login = Modelos.Login;

export async function getTiposEmpleado(req: any, res: any) {
  try {
    const tiposEmpleado = await TipoEmpleado.findAll();
    res.json(tiposEmpleado);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

export async function createTipoEmpleado(req: any, res: any) {
  const { codigo, nombre } = req.body;
  try {
    let nuevoTipoEmpleado = await TipoEmpleado.create(
      {
        codigo,
        nombre,
        estado: "Activo",
      },
      {
        fields: ["codigo", "nombre", "estado"],
      }
    );
    createRol(nombre);
    return res.json(nuevoTipoEmpleado);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

export async function getTipoEmpleado(req: any, res: any) {
  const { id } = req.params;
  try {
    const tipoEmpleado = await TipoEmpleado.findOne({
      where: {
        id,
      },
    });
    res.json(tipoEmpleado);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

export const updateTipoEmpleado = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { codigo, nombre, estado } = req.body;

    const tipoEmpleado = await TipoEmpleado.findByPk(id);

    if (!tipoEmpleado) {
      return res
        .status(404)
        .json({ message: "Tipo de empleado no encontrado" });
    }

    const rol = await Rol.findOne({
      where: {
        nombre: tipoEmpleado.nombre,
      },
    });


    tipoEmpleado.codigo = codigo;
    tipoEmpleado.nombre = nombre;
    tipoEmpleado.estado = estado;
    await tipoEmpleado.save();

    updateRol({ params: { id: rol?.id }, body: { nombre, estado } });

    res.json(tipoEmpleado);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export async function deleteTipoEmpleado(req: any, res: any) {
  const { id } = req.params;
  try {
    await Empleado.destroy({
      where: {
        tipoId: id,
      },
    });
    const tipoEmpleado = await TipoEmpleado.findByPk(id);
    const rol = await Rol.findOne({
      where: {
        nombre: tipoEmpleado?.nombre,
      },
    });
    await deleteRol(rol?.id as number);

    await TipoEmpleado.destroy({
      where: {
        id,
      },
    });

    return res.sendStatus(200);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function getEmpleadosPorTipo(req: any, res: any) {
  const { id } = req.params;
  try {
    const empleados = await Empleado.findAll({
      where: { tipoId: id },
    });
    res.json(empleados);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}
