import { Modelos } from "../models/modelos";
const Login = Modelos.Login;
const Rol = Modelos.Rol;

export async function getRoles(req: any, res: any) {
  try {
    const roles = await Rol.findAll();
    res.json(roles);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

export async function createRol(nombre: string) {
  try {
    let nuevoRol = await Rol.create(
      {
        nombre,
      },
      {
        fields: ["nombre"],
      }
    );
  } catch (error: any) {
    throw error;
  }
}

export async function getRol(req: any, res: any) {
  const { id } = req.params;
  try {
    const rol = await Rol.findOne({
      where: {
        id,
      },
    });
    res.json(rol);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

export const updateRol = async (req: any) => {
  try {
    const { id } = req.params;
    const { nombre, estado } = req.body;

    const rol = await Rol.findByPk(id);

    if (!rol) {
      throw { status: 404, message: "Rol no encontrado" };
    }
    rol.nombre = nombre;
    rol.estado = estado;

    await rol.save();

  } catch (error: any) {
    throw error;
  }
};

export async function deleteRol(id: number) {
  try {
    await Login.destroy({
      where: {
        rolId: id,
      },
    });
    await Rol.destroy({
      where: {
        id,
      },
    });
  } catch (error: any) {
    throw error;
  }
}

export async function getLoginPorRol(req: any, res: any) {
  const { id } = req.params;
  try {
    const logins = await Login.findAll({
      where: { rolId: id },
    });
    res.json(logins);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}
