import { Op } from "sequelize";
import { Modelos } from "../models/modelos";
import { isContrasenaValida } from "../utils/hash";
const Turno = Modelos.Turno;
const Empleado = Modelos.Empleado;
const TipoEmpleado = Modelos.TipoEmpleado;
const Servicio = Modelos.Servicio;
const Login = Modelos.Login;

//RegEx
const tiposValidos = ["CC", "CE"];
const estadosEmpleado = ["Activo", "Deshabilitado"];
const numDocRegex = /^\d{8,13}$/;
const nombresRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+( [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/;
const apellidosRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ]+)+$/;
const correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const contrasenaRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
const telefonoRegex = /^\d{10}$/;

export async function createEmpleado(req: any, res: any, next: any) {
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

  //Usa metodo para validar formato del formulario
  const mensajeError = await validarForm(
    tipoDocumento,
    numeroDocumento,
    nombres,
    apellidos,
    correo,
    telefono,
    tipoId
  );
  if (mensajeError) {
    return res.status(400).json({ message: mensajeError });
  }

  //Valida formato contraseña
  if (!contrasenaRegex.test(contrasena)) {
    return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres, una mayúscula, un número y un carácter especial" });
  }

  //Busca si hay un empleado con correo o numero de documento
  const empleado = await Empleado.findOne({
    where: {
      [Op.or]: [{numeroDocumento},{correo}]
    }
  })
  if(empleado){
    if(correo === empleado.correo){
      return res.status(400).json({ message: "El correo ya esta registrado" });
    }
    return res.status(400).json({ message: "El número de documento ya esta registrado" });
  }

  next();
}

export async function updateEmpleado(req: any, res: any, next: any) {
 const {id} = req.params;
 const {
  tipoDocumento,
  numeroDocumento,
  nombres,
  apellidos,
  correo,
  telefono,
  estado,
  tipoId,
} = req.body;

//Usa metodo para validar formato del formulario
const mensajeError = await validarForm(
  tipoDocumento,
  numeroDocumento,
  nombres,
  apellidos,
  correo,
  telefono,
  tipoId
);
if (mensajeError) {
  return res.status(400).json({ message: mensajeError });
}

//Valida estado
if (!estadosEmpleado.includes(estado)) {
  return res.status(400).json({ message: "El estado no es válido" });
}

const empleadoActual = await Empleado.findByPk(id)
if(empleadoActual && empleadoActual.nombres === "Empleado Predeterminado"){
  return res.status(400).json({ message: "No puedes editar este empleado" });
}

const empleado = await Empleado.findOne({
  where: {
    [Op.or]: [{numeroDocumento},{correo}],
    id:{
      [Op.not]: id,
    } 
  }
});
if(empleado){
  if(correo === empleado.correo){
    return res.status(400).json({ message: "El correo ya esta registrado" });
  }
  return res.status(400).json({ message: "El número de documento ya esta registrado" });
}

next()
}

export async function deleteEmpleado(req: any, res: any, next: any) {
  const { id } = req.params;

  const empleadoActual = await Empleado.findByPk(id)
  if(empleadoActual && empleadoActual.nombres === "Empleado Predeterminado"){
    return res.status(400).json({ message: "No puedes eliminar este empleado" });
  }

  const empleado = await Empleado.findOne({
    where: {
      id,
    },
  });
  const tipoEmpleado = await TipoEmpleado.findOne({
    where: {
      id: empleado?.tipoId,
    },
  });

  //Valida para no eliminar admin
  if (tipoEmpleado?.nombre === "Administrador") {
    return res
      .status(403)
      .json({ message: "No se puede eliminar a un administrador" });
  }

  //No elimina el empleado si tiene un turno
  const turno = await Turno.findOne({
    where: {
      empleadoId: id,
    },
  });
  if (turno) {
    return res.status(403).json({
      message:
        "No se puede eliminar el empleado ya que hay un turno asociado a el",
    });
  }

  next();
}

export async function asignarServicios(req: any, res: any, next: any) {
  const {id} = req.params;
  const {servicioIds} = req.body;
 
  const registros = await Servicio.findAll({
    where: {
      id: servicioIds,
    },
  });

  // Obtener solo los IDs de los registros encontrados
  const registrosIds : number[] = registros.map(registro => registro.id);

  //Parcear los ids a numero
  const serviciosIdsNumber: number[] = Array.isArray(servicioIds)
  ? servicioIds.map(Number)
  : [];

  // Verificar si todos los IDs están registrados
  const todosRegistrados = serviciosIdsNumber.every(id => registrosIds.includes(id));

  if(!todosRegistrados){
    return res.status(400).json({ message: "Hubo un error, hay un servicio no registrado" });
  }
 
 next()
 }

async function validarForm(
  tipoDocumento: string,
  numeroDocumento: string,
  nombres: string,
  apellidos: string,
  correo: string,
  telefono: string,
  tipoId: number
): Promise<string | null> {
  if (!tiposValidos.includes(tipoDocumento)) {
    return "El tipo de documento no es válido";
  }else if(tipoDocumento == null || tipoDocumento == ""){
    return "Seleccione el tipo de documento";
  }
  if (!numDocRegex.test(numeroDocumento)) {
    return "El número de documento no es válido, debe ser un número de 8 a 13 caracteres";
  }
  if (!nombresRegex.test(nombres) || nombres.length > 50) {
    return "El nombre debe contener solo letras máximo 50 caracteres";
  }
  if (!apellidosRegex.test(apellidos) || apellidos.length > 50) {
    return "Debe ingresar los 2 apellidos; debe contener solo letras y máximo 50 caracteres";
  }
  if (!correoRegex.test(correo)) {
    return "El correo es inválido";
  }
  if (!telefonoRegex.test(telefono)) {
    return "El teléfono deben ser 10 dígitos";
  }
  if (!isNaN(tipoId)) {
    const tipoEmpleado = await TipoEmpleado.findOne({
      where: {
        id: tipoId,
      },
    });
    if (!tipoEmpleado) {
      return "El tipo de empleado ingresado no existe";
    }
  }

  return null;
}

export async function cambiarContrasena(req: any, res: any, next: any) {
  const { correo, contrasenaNueva, contrasenaActual } = req.body;

  if (!correoRegex.test(correo)) {
    return res.status(400).json({ message: "El correo es inválido" });
  }

  if (!contrasenaRegex.test(contrasenaNueva)) {
    return res.status(400).json({
      message:
        "La nueva contraseña debe tener al menos 6 caracteres, una mayúscula, un número y un carácter especial",
    });
  }

  if (!contrasenaRegex.test(contrasenaActual)) {
    return res.status(400).json({
      message:
        "La contraseña actual debe tener al menos 6 caracteres, una mayúscula, un número y un carácter especial",
    });
  }

  const usuario = await Login.findOne({
    where: {
      correo: correo,
    },
  });

  if (!usuario) {
    return res.status(400).json({ message: "El empleado no esta registrado" });
  }

  if (!(await isContrasenaValida(contrasenaActual, usuario?.contrasena as string))) {
    return res.status(400).json({ message: "La contraseña actual es incorrecta" });
  }
  next();
}


export async function cambiarDatos(req: any, res: any, next: any) {
  const { id } = req.params;
  const { correo, telefono } = req.body;

  if(correo){
    if (!correoRegex.test(correo)) {
        return res.status(400).json({ message: "El correo es inválido" });
      }
  }
  if(telefono){
    if (!telefonoRegex.test(telefono)) {
        return res.status(400).json({ message: "El teléfono deben ser 10 dígitos" });
      }
  }
  if(!correo && !telefono){
    return res.status(400).json({ message: "Los campos estan vacios" });
  }
  
  const empleado = await Empleado.findOne({
    where: {
      [Op.or]: [{telefono},{correo}],
      id:{
        [Op.not]: id,
      } 
    }
  });
  if(empleado){
    if(correo === empleado.correo){
      return res.status(400).json({ message: "El correo ya esta registrado" });
    }
    return res.status(400).json({ message: "El teléfono ya esta registrado" });
  }

  next();
}
