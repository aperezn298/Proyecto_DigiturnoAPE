import { Modelos } from "../models/modelos";
import { crearToken } from "../utils/jwt";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { updateLogin } from "./login.controller";
import { HTML } from "./formatEmail";

const Login = Modelos.Login;
const Empleado = Modelos.Empleado;
const TipoEmpleado = Modelos.TipoEmpleado;
const Modulo = Modelos.Modulo;
dotenv.config();

const codigosVerificacion = new Map<string, string>(); // Almacenamiento Temporal

export async function iniciarSesion(req: any, res: any) {
  const { correo, contrasena } = req.body;

  const datosUsuario = await Empleado.findOne({
    where: {
      correo,
    },
  });
  const tipoEmpleado = await TipoEmpleado.findByPk(datosUsuario?.tipoId);

  let data = {
    id: datosUsuario?.id,
    nombre: datosUsuario?.nombres + " " + datosUsuario?.apellidos,
    correo: datosUsuario?.correo,
    telefono: datosUsuario?.telefono,
    tipoEmpleado: tipoEmpleado?.nombre,
  };

  const modulo = await Modulo.findOne({
    where:{
      empleadoId: datosUsuario?.id
    }
  });
  if(modulo){
    modulo.modulo = null
    modulo.save();
  }

  const token = crearToken(data);
  return res.header("authorization", token).json({
    ...data,
    token: token,
  });
}

function generateCode() {
  //código de 6 digitos
  const code = Math.floor(100000 + Math.random() * 900000);
  return code.toString();
}

export async function enviarCodigoCorreo(req: any, res: any) {
  const { correo } = req.body;
  const codigo = generateCode();
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.CORREO,
      pass: process.env.PSWCORREO,
    },
  });
  const contenidoCorreo = await HTML({ User: correo,codigo: codigo  });

  const mailOptions = {
    from: process.env.CORREO,
    to: correo,
    subject: "Código de verificación de Digiturno",
    html: contenidoCorreo, // Cambiado de text a html
  };
  

  try {
    await transporter.sendMail(mailOptions);
    codigosVerificacion.delete(correo);
    guardarCodigoTemporalmente(correo, codigo);
    console.log("Correo enviado exitosamente");
    return res.status(200).json({ message: "Correo enviado exitosamente" });
  } catch (error) {
    console.error("Error enviando correo:", error);
    return res.status(500).json({ message: "Error al enviar el correo" });
  }
}

function guardarCodigoTemporalmente(correo: string, codigo: string) {
  codigosVerificacion.set(correo, codigo); //Guarda el código con el correo asociado
  setTimeout(() => {
    codigosVerificacion.delete(correo);
    console.log(`Código de ${correo} eliminado por expiración`);
  }, 10 * 60 * 1000); //Invalida el codigo despues de 10 minutos
}

export function validarCodigo(req: any, res: any) {
  const { correo, codigo } = req.body;
  const codigoGuardado = codigosVerificacion.get(correo);
  if (codigoGuardado != codigo) {
    return res.status(400).json({ message: "Código incorrecto o expirado" });
  }
  codigosVerificacion.delete(correo);
  return res.status(200).json({ message: "Codigo válido" });
}

export async function cambiarContrasena(req: any, res: any) {
  try {
    const { correo, contrasena } = req.body;
    const usuario = await Login.findOne({
      where: {
        correo: correo,
      },
    });
    const nuevoReq = {
      params: { id: usuario?.id },
      body: {
        estado: usuario?.estado,
        correo: usuario?.correo,
        contrasena,
        rolId: usuario?.rolId,
      },
    };
    await updateLogin(nuevoReq);
    return res.status(200).json({ message: "Contraseña cambiada con exito" });
  } catch (err: any) {
    return res
      .status(500)
      .json({
        message: "Error al cambiar la contraseña, intentelo más tarde",
        error: err.message,
      });
  }
}
