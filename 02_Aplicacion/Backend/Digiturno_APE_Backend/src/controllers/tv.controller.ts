import { Op, Sequelize } from "sequelize";
import { Modelos } from "../models/modelos";
import nodemailer from "nodemailer";
import { obtenerFechaActual, obtenerHoraActual } from "../utils/horarioActual";
//import { verificarUsuario } from "./WebScraping";
import { broadcast } from "..";
import { decrypt } from "../utils/encriptarDatos";
import { HTMLSeguimiento } from "./formatEmail";
const QRCode = require('qrcode');
const Usuario = Modelos.Usuario;
const Empleado = Modelos.Empleado;
const Turno = Modelos.Turno;
const Servicio = Modelos.Servicio;
const ServicioTurno = Modelos.ServicioTurno;
const Modulo = Modelos.Modulo;
const TipoEmpleado = Modelos.TipoEmpleado;
const TipoPoblacion = Modelos.TipoPoblacion;
const TipoUsuario = Modelos.TipoUsuario;
const Calificacion = Modelos.Calificacion;

export async function turnosTv(req: any, res: any) {
  try {
    const turnos = await Turno.findAll({
      where: {
        estado: {
          [Op.or]: ["Espera", "Proceso", "Cancelado"],
        },
        fecha: obtenerFechaActual().toISOString().slice(0, 10),
      },
      attributes: ["id", "codigo", "fecha", "estado", "horaAsignacion"],
      order: [["horaAsignacion", "DESC"]],

      include: [
        { model: Usuario, attributes: ["id", "nombres", "apellidos"] },
        {
          model: Empleado,
          attributes: ["id"],
          where: {
            nombres: {
              [Op.not]: "Empleado Predeterminado",
            },
          },
          include: [
            { model: Modulo, attributes: ["modulo"] },
          ],
          required: true,
        },
        {
          model: Servicio,
          attributes: ["icono"],
          where: {
            nombre: {
              [Op.ne]: "Registro en la APE",
            },
          },
          required: false,
        },

      ],
    });

    return res.status(200).json(turnos);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

export async function createTurno(req: any, res: any) {
  const {
    tipoUsuarioId,
    tipoDocumento,
    numeroDocumento,
    nombres,
    apellidos,
    correo,
    prioridad,
    tipoPoblacionId,
    servicioId,
  } = req.body;
  try {
    //Crea usuario, si ya existe actualiza alguno datos
    const [usuario, esCreado] = await Usuario.findOrCreate({
      where: { numeroDocumento },
      defaults: {
        tipoUsuarioId,
        tipoDocumento,
        numeroDocumento,
        nombres,
        apellidos,
        correo,
        tipoPoblacionId,
      },
    });
    if (!esCreado) {
      usuario.tipoUsuarioId = tipoUsuarioId;
      usuario.nombres = nombres;
      usuario.apellidos = apellidos;
      usuario.correo = correo;
      usuario.tipoPoblacionId = tipoPoblacionId;
      await usuario.save();
    }
    //buscar empleado predeterminado para crear turno
    const empleado = await Empleado.findOne({
      where: {
        nombres: "Empleado Predeterminado",
      },
    });
    if (!empleado) {
      return res.status(404).json({
        message: "Empleado no encontrado, actualizar los registros por defecto",
      });
    }

    //Crear codigo con codigo del servicio y el codigo de tipoEmpleado
    const fecha = obtenerFechaActual();
    const servicio = await Servicio.findByPk(servicioId);
    const tipoEmpleado = await TipoEmpleado.findByPk(empleado.tipoId);
    let codigo =
      servicio && tipoEmpleado ? servicio?.codigo + tipoEmpleado?.codigo : "";

    const turno = await Turno.findOne({
      where: {
        codigo: {
          [Op.like]: codigo + "%",
        },
        fecha,
      },
      order: [["codigo", "DESC"]],
    });
    if (turno) {
      const nuevoNumero = parseInt(turno.codigo.substring(3, 6)) + 1;
      if (nuevoNumero > 99) {
        codigo = codigo + nuevoNumero.toString();
      } else if (nuevoNumero > 9) {
        codigo = codigo + "0" + nuevoNumero.toString();
      } else {
        codigo = codigo + "00" + nuevoNumero.toString();
      }
    } else {
      codigo = codigo + "001";
    }

    // Crear el turno
    let nuevoTurno = await Turno.create(
      {
        codigo,
        fecha,
        prioridad,
        horaCreacion: obtenerHoraActual(),
        usuarioId: usuario.id,
        empleadoId: empleado.id,
      },
      {
        fields: ["codigo", "fecha", "prioridad", "horaCreacion", "usuarioId", "empleadoId"],
      }
    );

    //Definir la lista de servicios totales
    const serviciosTurno: number[] = []; // Lista de servicios

    // Verificar usuario
    const respuesta = true //ANGEL, AQUI SE HACE LA PETICION A LA API DE PYTHON
    // await verificarUsuario(
    //   numeroDocumento,
    //   correo,
    //   servicioId
    // );

    // Modificar el array de servicios basado en la respuesta
    if (respuesta) {
      serviciosTurno.push(servicioId); // Si la respuesta es verdadera, agregar el ID del servicio
    } else {
      const servicioAPE = await Servicio.findOne({
        where: {
          nombre: "Registro en la APE"
        }
      })
      if (!servicioAPE) {
        return res.status(404).json({
          message: "Servicio de Registro en la APE no encontrado",
        });
      }
      serviciosTurno.push(servicioAPE.id);
      serviciosTurno.push(servicioId); // Si la respuesta es verdadera, agregar el ID del servicio
    }

    //Asociar servicios al turno
    const serviciosPorTurno = serviciosTurno.map((servicioId) =>
      ServicioTurno.create({ servicioId, turnoId: nuevoTurno?.id })
    );
    await Promise.all(serviciosPorTurno);

    const turnoCreado = await Turno.findOne({
      where: {
        id: nuevoTurno.id
      },
      include: [{ model: Servicio }]
    })

    broadcast({ type: "turnoCreado", data: "Turno creado" });
    if(usuario){
      correoTurnoCreado(usuario.correo, codigo)
    }
    
    res.json(turnoCreado);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
}


export async function turnoConCodigo(req: any, res: any) { 
  const { codigo } = req.params;
  try {
    const turno = await Turno.findOne({
      where: {
        codigo,
        fecha: obtenerFechaActual(),
      },
      order: [["codigo", "DESC"]],
      include: [
        {
          model: Servicio,
          attributes: {
            exclude: ["codigo", "descripcion", "duracion"],
          },
        },
        {
          model: Usuario,
          attributes: {
            exclude: ["tipoPoblacionId", "tipoUsuarioId"],
          },
          include: [
            { model: TipoPoblacion, attributes: ["nombre"] },
            { model: TipoUsuario, attributes: ["nombre"] },
          ],
        },
      ],
    });
    if (!turno) {
      return res.status(404).json({ message: "El turno no fue encontrado" });
    } else if (turno.estado != "Espera" && turno.estado != "Proceso") {
      return res.status(204).json({ message: "El turno ha sido terminado" });
    }

    const numeroTurnosRestantes = await Turno.count({
      where: {
        fecha: obtenerFechaActual(),
        estado: {
          [Op.or]: ["Espera", "Proceso"]
        },
        horaCreacion: {
          [Op.lt]: turno.horaCreacion
        }
      }
    });

    const empleadoTurno = await Empleado.findOne({
      where: {
        id: turno.empleadoId
      },
      include: [
        { model: Modulo }
      ],
    });

    const empleadoBool = empleadoTurno?.nombres != "Empleado Predeterminado" ? true : false;
    
    const responseFinal = { ...turno.toJSON(), nRestantes: numeroTurnosRestantes, empleado: empleadoBool ? empleadoTurno : empleadoBool };

    return res.status(200).json(responseFinal);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

export async function createCalificacion(req: any, res: any) {
  const { codigo, calificacion, observacion } = req.body;

  const codigoDesencriptado = decrypt(codigo)
  if (codigoDesencriptado == null) {
    return res.status(404).json({ message: "El turno no fue encontrado" });
  }
  const [idTurno, idUsuario] = codigoDesencriptado.split("-")
  try {
    const turno = await Turno.findOne({
      where: {
        id: idTurno
      }
    });

    const usuario = await Usuario.findOne({
      where: {
        id: idUsuario
      }
    });

    if (!turno || !usuario) {
      return res.status(404).json({ message: "El turno no fue encontrado" });
    }

    const calificacionCreada = await Calificacion.findOne({
      where: {
        idTurno
      }
    })

    if (calificacionCreada) {
      return res.status(204).json({ message: "El servicio ya ha sido calificado" });
    }

    await Calificacion.create({
      calificacion,
      observacion,
      idTurno: Number(idTurno)
    }, {
      fields: ["calificacion", "observacion", "idTurno"]
    })

    return res.status(200).json({ message: "Calificación enviada, ¡Gracias por su colaboración!" });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

// Función para crear el transporte del correo
function crearTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.CORREO,
      pass: process.env.PSWCORREO,
    },
  });
}

// Función para generar el QR en formato Base64
async function generarQrBase64(codigo: string): Promise<string> {
  const url = `${process.env.FRONT_URL}turnousuario/${codigo}`;
  try {
    const qrBase64 = await QRCode.toDataURL(url);
    return qrBase64;
  } catch (error) {
    console.error("Error al generar el QR:", error);
    throw error;
  }
}

// Función principal para enviar el correo
export async function correoTurnoCreado(email: string | undefined, codigo: string) {
  if (!email) {
    console.error("El correo es requerido.");
    return;
  }

  const transporter = crearTransporter();

  try {
    // Generar el código QR
    const qrBase64 = await generarQrBase64(codigo);

    // Generar el contenido HTML
    const contenidoCorreo = await HTMLSeguimiento({ User: email, codigo });

    const mailOptions = {
      from: process.env.CORREO,
      to: email,
      subject: "Seguimiento de su turno en la APE",
      html: contenidoCorreo,
      attachments: [
        {
          filename: "codigo-qr.png",
          content: qrBase64.split(",")[1],
          encoding: "base64",
          cid: "qrImage",
        },
      ],
    };

    // Enviar el correo
    await transporter.sendMail(mailOptions);
    console.log("Correo enviado exitosamente.");
  } catch (error) {
    console.error("Error enviando correo:", error);
  }
}
