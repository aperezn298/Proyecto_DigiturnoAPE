import { Modelos } from "../models/modelos";
const Empleado = Modelos.Empleado;
const Turno = Modelos.Turno;

export async function deleteTipoEmpleado(req: any, res: any, next: any) {
  const { id } = req.params;
  const empleados = await Empleado.findAll({
    where: {
      tipoId: id,
    },
    attributes: ["id"],
  });

  const empleadoIds = empleados.map((empleado) => empleado.id);

  const turnos = await Turno.findAll({
    where: {
      empleadoId: empleadoIds,
    },
  });
  if (turnos.length > 0) {
    return res.status(403).json({message:"No se puede eliminar el tipo de empleado ya que hay un turno relacionado a el",});
  }

  //no se pueda borrar al admin

  next()
}
