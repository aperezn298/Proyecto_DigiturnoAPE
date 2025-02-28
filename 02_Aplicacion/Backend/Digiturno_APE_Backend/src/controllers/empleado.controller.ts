import { Modelos } from "../models/modelos";
import { crearHash } from "../utils/hash";
import { createLogin, deleteLogin, updateLogin } from "./login.controller";
const Empleado = Modelos.Empleado;
const Rol = Modelos.Rol;
const Login = Modelos.Login;
const TipoEmpleado = Modelos.TipoEmpleado;
const Servicio = Modelos.Servicio;
const ServicioEmpleado = Modelos.ServicioEmpleado;
const Modulo = Modelos.Modulo;

export async function getEmpleados(req: any, res: any) {
  try {
    const empleados = await Empleado.findAll();
    res.json(empleados);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

export async function getEmpleadosDTO(req: any, res: any) {
  try {
    const empleados = await Empleado.findAll({
      include: [
        { model: TipoEmpleado, attributes: ["id", "nombre"] },
        { model: Servicio, attributes: ["id", "nombre"] },
      ],
    });
    const servicios = await Servicio.findAll({
      where: {
        estado: "Activo",
      },
      attributes: ["id", "nombre"],
    });
    const tipoEmpleado = await TipoEmpleado.findAll({
      where: {
        estado: "Activo",
      },
      attributes: ["id", "nombre"],
    });
    res.json({
      empleados,
      tipoEmpleado,
      servicios,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

export async function createEmpleado(req: any, res: any) {
  const {
    tipoDocumento,
    numeroDocumento,
    nombres,
    apellidos,
    correo,
    telefono,
    contrasena,
    tipoId,
  } = req.body;
  try {
    let nuevoEmpleado = await Empleado.create(
      {
        tipoDocumento,
        numeroDocumento,
        nombres,
        apellidos,
        correo,
        telefono,
        tipoId,
      },
      {
        fields: [
          "tipoDocumento",
          "numeroDocumento",
          "nombres",
          "apellidos",
          "correo",
          "telefono",
          "tipoId",
        ],
      }
    );
    const servicioPredeterminado = await Servicio.findOne({
      where: { nombre: "Registro en la APE" },
    });
    if (!servicioPredeterminado) {
      return res
        .status(500)
        .json({ message: "El servicio predeterminado no se ha creado" });
    }
    await ServicioEmpleado.create({
      empleadoId: nuevoEmpleado.id,
      servicioId: servicioPredeterminado?.id,
    });

    const tipoEmpleado = await TipoEmpleado.findByPk(tipoId);
    const rol = await Rol.findOne({
      where: {
        nombre: tipoEmpleado?.nombre,
      },
    });
    createLogin({
      body: {
        correo,
        contrasena,
        rolId: rol?.id as number,
      },
    });

    await Modulo.create({
      empleadoId: nuevoEmpleado.id,
    });
    const responseFinal = {
      ...nuevoEmpleado.dataValues,
      servicios: [{ id: servicioPredeterminado.id }],
    };
    return res.json(responseFinal);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

export async function getEmpleado(req: any, res: any) {
  const { id } = req.params;
  try {
    const empleado = await Empleado.findOne({
      where: {
        id,
      },
    });
    res.json(empleado);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

export const updateEmpleado = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const {
      tipoDocumento,
      numeroDocumento,
      nombres,
      apellidos,
      correo,
      telefono,
      estado,
      contrasena,
      tipoId,
    } = req.body;

    const empleado = await Empleado.findByPk(id);

    if (!empleado) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    const login = await Login.findOne({
      where: {
        correo: empleado.correo,
      },
    });

    empleado.tipoDocumento = tipoDocumento;
    empleado.numeroDocumento = numeroDocumento;
    empleado.nombres = nombres;
    empleado.apellidos = apellidos;
    empleado.correo = correo;
    empleado.telefono = telefono;
    empleado.estado = estado;
    empleado.tipoId = tipoId;
    await empleado.save();

    const tipoEmpleado = await TipoEmpleado.findByPk(tipoId);
    const rol = await Rol.findOne({
      where: {
        nombre: tipoEmpleado?.nombre,
      },
    });
    updateLogin({
      params: { id: login?.id },
      body: { correo, contrasena, estado, rolId: rol?.id },
    });

    return res.json(empleado);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export async function deleteEmpleado(req: any, res: any) {
  const { id } = req.params;
  try {
    const empleado = await Empleado.findByPk(id);
    await deleteLogin(empleado?.correo as string);
    await Empleado.destroy({
      where: {
        id: id,
      },
    });

    return res.sendStatus(200);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function asignarServicios(req: any, res: any) {
  const { id } = req.params;
  const { servicioIds } = req.body;

  try {
    const empleado = await Empleado.findByPk(id);
    if (!empleado) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    // servicios que ya tiene le empleado y solo obtener ids
    const serviciosActuales = await ServicioEmpleado.findAll({
      where: { empleadoId: id },
      attributes: ["servicioId"],
    });
    const serviciosActualesIds: number[] = serviciosActuales.map(
      (servicio) => servicio.servicioId
    );

    // parsea los ids del body en Number
    const nuevosServiciosIds: number[] = Array.isArray(servicioIds)
      ? servicioIds.map(Number)
      : [];

    // filtra los servicios para agregar (lis ids del body que no estaban en los actuales)
    const serviciosAAgregar = nuevosServiciosIds.filter(
      (id) => !serviciosActualesIds.includes(id)
    );
    //filtra los servicios a borrar (los ids que estaban antes pero en los ids del body ya no estan)
    const serviciosAEliminar = serviciosActualesIds.filter(
      (id) => !nuevosServiciosIds.includes(id)
    );

    // agrega servicios
    if (serviciosAAgregar.length > 0) {
      const promiseServiciosAgregar = serviciosAAgregar.map((servicioId) =>
        ServicioEmpleado.create({ servicioId, empleadoId: id })
      );
      await Promise.all(promiseServiciosAgregar);
    }

    // elimina los servicios
    if (serviciosAEliminar.length > 0) {
      await ServicioEmpleado.destroy({
        where: {
          empleadoId: id,
          servicioId: serviciosAEliminar,
        },
      });
    }

    return res
      .status(200)
      .json({ message: "Servicios del empleado actualizados con éxito" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error al actualizar servicios", error });
  }
}
//ENVIAR EL ESTADO ACTUAL PARA REVERTIRLO
export async function cambiarEstado(req: any, res: any) {
  const { id } = req.params;
  const { estado } = req.body;
  try {
    const empleado = await Empleado.findByPk(id);
    if (!empleado) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }else if (empleado.nombres === "Empleado Predeterminado") {
      return res.status(400).json({ message: "Este registro no puede ser deshabilitado" });
    }
    const nuevoEstado = estado == "Activo" ? "Deshabilitado" : "Activo";
    empleado.estado = nuevoEstado;
    await empleado.save();
    const login = await Login.findOne({
      where: {
        correo: empleado.correo,
      },
    });
    if (!login) {
      return res.status(404).json({ message: "Login no encontrado" });
    }
    login.estado = nuevoEstado;
    await login.save();
    res.json(empleado);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

export async function cambiarContrasena(req: any, res: any) {

  const { contrasenaNueva, correo } = req.body;
  try {
    const empleado = await Login.findOne({
      where:{
        correo
      }
    });
    if (!empleado) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    const contrasenaEncriptada = (await crearHash(contrasenaNueva)).toString();
    empleado.contrasena = contrasenaEncriptada;
    await empleado.save();

    return res
    .status(200)
    .json({ message: "Contraseña actualizada con éxito" });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
}


export const cambiarDatos = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const {
      correo, telefono
    } = req.body;

    const empleado = await Empleado.findByPk(id);

    if (!empleado) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    const login = await Login.findOne({
      where: {
        correo: empleado.correo,
      },
    });

    if (!login) {
      return res.status(404).json({ message: "Login no encontrado" });
    }

    if(correo) empleado.correo = correo;
    if(telefono) empleado.telefono = telefono;

    await empleado.save();

    if(correo) {
      login.correo = correo
      await login.save();
    };

    return res
    .status(200)
    .json({ message: "Se han cambiado los campos ingresados con éxito" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
