import { Op, Sequelize } from "sequelize";
import { Modelos } from "../models/modelos";
import nodemailer from "nodemailer";
import {  obtenerHoraActual } from "../utils/horarioActual";
import { broadcast } from "..";
import dotenv from "dotenv";
import { HTMLCalificacion } from "./formatEmail";
import { encrypt } from "../utils/encriptarDatos";
const QRCode = require('qrcode');
const Usuario = Modelos.Usuario;
const Empleado = Modelos.Empleado;
const TipoEmpleado = Modelos.TipoEmpleado;
const TipoPoblacion = Modelos.TipoPoblacion;
const TipoUsuario = Modelos.TipoUsuario;
const Calificacion = Modelos.Calificacion;
const Turno = Modelos.Turno;
const Servicio = Modelos.Servicio;
const ServicioTurno = Modelos.ServicioTurno;
const Modulo = Modelos.Modulo;
dotenv.config();

const Rol = Modelos.Rol;
export async function getTurnosDTO(req: any, res: any) {
//   // tipo empleado quemado
//   await TipoEmpleado.bulkCreate([
//     {codigo: "A", nombre: "Administrador"},
//     {codigo: "O", nombre: "Orientador"},
//   ])

//   // rol quemado
//   await Rol.bulkCreate([
//     {nombre: "Administrador"},
//     {nombre: "Orientador"},
//   ])

// // tipo usuario quemado
//   await TipoUsuario.bulkCreate([
//     {nombre: "Natural"},
//     {nombre: "Empresa"},
//   ])
//   // tipo poblacion quemado
//   await TipoPoblacion.bulkCreate([
//     {nombre: "Población Víctimas de la violencia"},
//     {nombre: "Población con discapacidad"},
//     {nombre: "Población Indígena"},
//     {nombre: "Población afrocolombiana"},
//     {nombre: "Población Comunidades Negras"},
//     {nombre: "Población Palenquera"},
//     {nombre: "Población Raizales"},
//     {nombre: "Población Privada de la Libertad"},
//     {nombre: "Población Víctimas de trata de personas"},
//     {nombre: "Tercera Edad"},
//     {nombre: "Población Adolescentes y Jóvenes Vulnerables"},
//     {nombre: "Población  en Conflicto con ley penal"},
//     {nombre: "Población Mujer Cabeza de Hogar"},
//     {nombre: "Población en Proceso de Reincorporación"},
//     {nombre: "Población en Proceso de Reintegración"},
//     {nombre: "Pueblo Rom"},
//     {nombre: "Población Víctimas Ataque con Agente Químicos"},
//     {nombre: "Ninguna"},
//   ])

//   // servicio quemado
//   await Servicio.create(
//     {
//       codigo: "RA",
//       nombre: "Registro en la APE",
//       descripcion: "Creación del usuario en la Agencia Pública de Empleo",
//       duracion: "00:02",
//       icono: "https://linkIconoRegistroAPEInventado.com.co"
//     },
//   )
//   // empleado quemado
//   await Empleado.create(
//     {
//       tipoDocumento: "CC",
//       numeroDocumento: "0000000000",
//       nombres: "Empleado Predeterminado",
//       apellidos: "Empleado Predeterminado",
//       correo: "correo.empleado.predeterminado@gmail.com",
//       telefono: "0000000000",
//       tipoId: 2 //el id del TipoEmpleado "Orientador" o "Empleado", en mi caso es 2
//     },
//   )

  
  try {
    const turnos = await Turno.findAll({
      where: {
        estado: {
          [Op.or]: ["Atendido", "Cancelado", "Espera", "Proceso"],
        },
      },
      attributes: {
        include: [
          [
            Sequelize.literal(
              'EXTRACT(EPOCH FROM ("horaAsignacion"::time - "horaCreacion"::time)) / 60'
            ),
            "tiempoEspera",
          ],
          [
            Sequelize.literal(
              'EXTRACT(EPOCH FROM ("horaFinalizacion"::time - "horaAsignacion"::time)) / 60'
            ),
            "tiempoProceso",
          ],
        ],
        exclude: ["usuarioId", "empleadoId"],
      },
      include: [
        { model: Empleado, attributes: ["id", "nombres", "apellidos"] },
        { model: Servicio },
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
        { model: Calificacion, attributes: ["calificacion", "observacion"] },
      ],
      order: [
        ["fecha", "DESC"]
      ]
    });

    return res.status(200).json(turnos);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

export async function getTurnosPorServiciosEmpleado(req: any, res: any) {
  const { id } = req.params; //idEmpleado
  try {
    const serviciosEmpleado = await Servicio.findAll({
      where: {
        nombre: {
          [Op.not]: "Registro en la APE",
        },
      },
      attributes: ["id"],
      include: [
        {
          model: Empleado,
          where: {
            id: id,
          },
          required: true,
        },
      ],
    });

    // extraer ids de los servicios
    const servicioIds: number[] = serviciosEmpleado.map(
      (servicio) => servicio.id
    );

    const turnos = await Turno.findAll({
      where: {
        estado: "Espera",
      },
      attributes: {
        exclude: [
          "usuarioId",
          "empleadoId",
          "horaFinalizacion",
          "observacion",
          "horaAsignacion",
        ],
      },
      include: [
        {
          model: Servicio,
          attributes: {
            exclude: [
              "codigo",
              "descripcion",
              "duracion",
              "icono",
              "servicioTurno",
            ],
          },
          where: {
            id: servicioIds,
          },
          required: true,
        },
        {
          model: Empleado,
          where: {
            nombres: "Empleado Predeterminado",
          },
          attributes: ["id", "nombres"],
          required: true,
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
      order: [
        ['prioridad', 'DESC'],
      ]
    });

    const servicios = await Servicio.findAll({
      attributes: ["id", "nombre"],
    });

    return res.status(200).json({ turnos, servicios });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

export async function cambiarEstado(req: any, res: any) {
  const { id } = req.params; //id del turno
  const { estado, empleadoId, observacion, servicioIds } = req.body;

  try {
    const turno = await Turno.findByPk(id);
    if (!turno) {
      return res.status(404).json({ message: "Error al cambiar el estado" });
    }
    if (estado == "Espera" /*&& turno?.estado == "Espera"*/) {
      if (empleadoId) {
        const empleado = await Empleado.findByPk(empleadoId);
        if (!empleado) {
          return res.status(404).json({ message: "Empleado no encontrado" });
        }
        turno.empleadoId = empleadoId;
        turno.horaAsignacion = obtenerHoraActual();
      } else {
        return res
          .status(404)
          .json({
            message:
              "Se necesita el ID del empleado para sustituir al Empleado Predeterminado",
          });
      }
    } else if (estado == "Proceso" /*&& turno?.estado == "Espera"*/) {
      turno.estado = estado;
    } else if (estado == "Cancelado" /*&& turno?.estado == "Espera"*/) {
      turno.estado = estado;
      turno.horaFinalizacion = obtenerHoraActual();
      turno.observacion = observacion ? observacion : null;
      asignarServiciosATurno(turno.id, servicioIds);
    } else if (estado == "Atendido" && turno?.estado == "Proceso") {
      turno.estado = estado;
      turno.horaFinalizacion = obtenerHoraActual();
      turno.observacion = observacion ? observacion : null;
      asignarServiciosATurno(turno.id, servicioIds);
      enviarCorreoCalificacion(id)
    } else {
      return res.status(400).json({
        message: "El estado es inválido",
      });
    }
    await turno.save();

    if (estado == "Espera") {
      broadcast({
        type: "estadoTurnoEspera",
        data: "Estado del turno cambiado a estado Espera",
      });
    }

    if (estado == "Cancelado" || estado == "Atendido") {
      broadcast({
        type: "turnosRestantes",
        data: "Actualizar turnos Restantes",
      });
    }
    broadcast({
      type: "estadoTurnoCambiado",
      data: "Estado del turno cambiado",
    });

    return res.status(200).json(turno);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

export async function getTurno(req: any, res: any) {
  const { id } = req.params; //idEmpleado
  try {
    const serviciosEmpleado = await Servicio.findAll({
      where: {
        nombre: {
          [Op.not]: "Registro en la APE",
        },
      },
      attributes: ["id"],
      include: [
        {
          model: Empleado,
          where: {
            id: id,
          },
          required: true,
        },
      ],
    });


    const servicioIds: number[] = serviciosEmpleado.map(
      (servicio) => servicio.id
    );

    const turno = await Turno.findOne({
      where: {
        estado: ["Espera", "Proceso"],
        empleadoId: id,
      },
      attributes: {
        exclude: [
          "usuarioId",
          "empleadoId",
          "horaFinalizacion",
          "observacion",
          "horaAsignacion",
        ],
      },
      include: [
        {
          model: Servicio,
          attributes: {
            exclude: [
              "codigo",
              "descripcion",
              "duracion",
              "icono",
              "servicioTurno",
            ],
          },
          where: {
            id: servicioIds,
          },
          required: true,
        },
        {
          model: Empleado,
          attributes: ["id", "nombres"],
          required: true,
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

    if (turno) {
      return res.status(200).json(turno);
    }

    return res.status(404).json({ message: "Sin turnos pendientes" });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

export async function cambiarModulo(req: any, res: any) {
  const { id } = req.params;
  const { modulo } = req.body;

  const moduloEmpleado = await Modulo.findOne({
    where: {
      empleadoId: id,
    },
  });

  if (!moduloEmpleado) {
    return res
      .status(404)
      .json({ message: "El módulo dle empleado no ha sido encontrado" });
  }

  moduloEmpleado.modulo = modulo;
  moduloEmpleado.save();
  broadcast({
    type: "moduloEmpleadoCambiado",
    data: "Módulo de un empleado modificado",
  });
  return res.status(200).json({ message: "Módulo actualizado con exito" });
}

async function asignarServiciosATurno(turnoId: number, servicioIds: number[]) {
  try {
    // servicios que ya tiene le empleado y solo obtener ids
    const serviciosActuales = await ServicioTurno.findAll({
      where: { turnoId: turnoId },
      attributes: ["servicioId"],
    });
    const serviciosActualesIds: number[] = serviciosActuales.map(
      (servicio) => servicio.servicioId
    );

    // filtra los servicios para agregar (lis ids del body que no estaban en los actuales)
    const serviciosAAgregar = servicioIds.filter(
      (id) => !serviciosActualesIds.includes(id)
    );
    //filtra los servicios a borrar (los ids que estaban antes pero en los ids del body ya no estan)
    const serviciosAEliminar = serviciosActualesIds.filter(
      (id) => !servicioIds.includes(id)
    );

    // agrega servicios
    if (serviciosAAgregar.length > 0) {
      const promiseServiciosAgregar = serviciosAAgregar.map((servicioId) =>
        ServicioTurno.create({ servicioId, turnoId: turnoId })
      );
      await Promise.all(promiseServiciosAgregar);
    }

    // elimina los servicios
    if (serviciosAEliminar.length > 0) {
      await ServicioTurno.destroy({
        where: {
          turnoId: turnoId,
          servicioId: serviciosAEliminar,
        },
      });
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getTurnosPorFechas(req: any, res: any) {
  const { fechaInicio, fechaFin } = req.body; // Recibiendo las fechas de inicio y fin como parámetros de consulta
  if (!fechaInicio || !fechaFin) {
    return res
      .status(400)
      .json({ message: "Debe proporcionar ambas fechas de inicio y fin." });
  }

  try {
    const turnos = await Turno.findAll({
      where: {
        fecha: {
          [Op.between]: [new Date(fechaInicio), new Date(fechaFin)], // Filtra los turnos entre las fechas
        },
      },
      attributes: {
        exclude: [
          "usuarioId",
          "empleadoId",
          "horaFinalizacion",
          "observacion",
          "horaAsignacion",
        ],
      },
      include: [
        {
          model: Servicio,
          attributes: {
            exclude: [
              "codigo",
              "descripcion",
              "duracion",
              "icono",
              "servicioTurno",
            ],
          },
        },
        {
          model: Empleado,
          attributes: ["id", "nombres"], // Puedes incluir más campos si lo necesitas
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

    return res.status(200).json({ turnos });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
}
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
  const url = `${process.env.FRONT_URL}calificacion/${codigo}`;
  try {
    const qrBase64 = await QRCode.toDataURL(url);
    return qrBase64;
  } catch (error) {
    console.error("Error al generar el QR:", error);
    throw error;
  }
}

export async function enviarCorreoCalificacion(idTurno: number) {

  const turnoACalificar:any = await Turno.findOne({
    where:{
      id: idTurno
    },
    attributes:["usuarioId"],
    include:[{model:Usuario, attributes:["correo"]}]
  })

  const codigoEncriptado = encrypt(idTurno+"-"+turnoACalificar.usuarioId)

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.CORREO,
      pass: process.env.PSWCORREO,
    },
  });
  const qrBase64 = await generarQrBase64(codigoEncriptado);
  const contenidoCorreo = await HTMLCalificacion({ User: turnoACalificar?.usuario.correo ,codigo: codigoEncriptado  });
    // Generar el código QR

  const mailOptions = {
    
    from: process.env.CORREO,
    to: turnoACalificar?.usuario.correo,
    subject: "Turno Atendido por la APE",
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

  try {
    await transporter.sendMail(mailOptions);
    console.log("Correo enviado exitosamente");
  } catch (error) {
    console.error("Error enviando correo:", error);
  }
}