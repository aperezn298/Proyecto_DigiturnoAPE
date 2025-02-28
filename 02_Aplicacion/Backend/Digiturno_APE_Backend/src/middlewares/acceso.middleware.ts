import { Modelos } from "../models/modelos";
import { isContrasenaValida } from "../utils/hash";

const Login = Modelos.Login;
const Rol = Modelos.Rol;
const correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const contrasenaRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
const codigoRegex = /^\d{6}$/;

export async function iniciarSesion(req: any, res: any, next: any) {
  const { correo, contrasena } = req.body;

  if (!correoRegex.test(correo)) {
    return res.status(400).json({ message: "El correo es inválido" });
  }

  if (!contrasenaRegex.test(contrasena)) {
    return res.status(400).json({
      message:
        "La contraseña debe tener al menos 6 caracteres, una mayúscula, un número y un carácter especial",
    });
  }

  const usuario = await Login.findOne({
    where: {
      correo: correo,
    },
  });

  if (!usuario) {
    return res.status(400).json({ message: "El usuario no esta registrado" });
  }

  if (usuario?.estado != "Activo") {
    return res.status(400).json({ message: "El usuario esta deshabilitado" });
  }

  const rol = await Rol.findOne({
    where: {
      id: usuario?.rolId,
    },
  });

  if (rol?.estado != "Activo") {
    return res.status(400).json({ message: "El rol del usuario esta deshabilitado" });
  }

  if (!(await isContrasenaValida(contrasena, usuario?.contrasena as string))) {
    return res.status(400).json({ message: "La contraseña es incorrecta" });
  }
  next();
}

export async function enviarCodigoCorreo(req: any, res: any, next: any) {
  const { correo } = req.body;

  if (!correoRegex.test(correo)) {
    return res.status(400).json({ message: "El correo es inválido" });
  }

  const usuario = await Login.findOne({
    where: {
      correo: correo,
    },
  });
  if (!usuario) {
    return res
      .status(404)
      .json({ message: "El usuario no esta registrado en el aplicativo" });
  }
  next();
}

export async function validarCodigo(req: any, res: any, next: any) {
  const { correo, codigo } = req.body;

  if (!correoRegex.test(correo)) {
    return res.status(400).json({ message: "El correo es inválido" });
  }

  if (!codigoRegex.test(codigo)) {
    return res.status(400).json({ message: "El código debe ser de 6 caracteres numéricos" });
  }

  next();
}

export async function cambiarContrasena(req: any, res: any, next: any) {
  const { correo, contrasena } = req.body;

  if (!correoRegex.test(correo)) {
    return res.status(400).json({ message: "El correo es inválido" });
  }

  if (!contrasenaRegex.test(contrasena)) {
    return res.status(400).json({
      message:
        "La contraseña debe tener al menos 6 caracteres, una mayúscula, un número y un carácter especial",
    });
  }

  next();
}
