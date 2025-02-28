import { Modelos } from "../models/modelos";
import { crearHash } from "../utils/hash";
const Login = Modelos.Login;

export async function getLogins(req: any, res: any) {
  try {
    const logins = await Login.findAll();
    res.json(logins);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

export async function createLogin(req: any) {
  const { correo, contrasena, rolId } = req.body;
  try {
    const contrasenaEncriptada = (await crearHash(contrasena)).toString();
    await Login.create(
      {
        correo,
        contrasena: contrasenaEncriptada,
        rolId,
      },
      {
        fields: ["correo", "contrasena", "rolId"],
      }
    );

  } catch (error: any) {
    throw error;
  }
}

export async function getLogin(req: any, res: any) {
  const { id } = req.params;
  try {
    const login = await Login.findOne({
      where: {
        id,
      },
    });
    res.json(login);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

export const updateLogin = async (req: any) => {
  try {
    const { id } = req.params;
    const { correo, contrasena, estado, rolId } = req.body;

    const login = await Login.findByPk(id);
 
    if (!login) {
      throw { status: 404, message: "Login no encontrado" };
    }

    if (contrasena) {
      const contrasenaEncriptada = (await crearHash(contrasena)).toString();
      login.contrasena = contrasenaEncriptada;
    }
    login.correo = correo;
    login.estado = estado;
    login.rolId = rolId;
    await login.save();

  } catch (error: any) {
    throw error;
  }
};

export async function deleteLogin(correo: string) {
  try {
    await Login.destroy({
      where: {
        correo,
      },
    });
  } catch (error: any) {
    throw error;
  }
}
