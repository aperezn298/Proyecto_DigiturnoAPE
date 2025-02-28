import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database/database";
import { Servicio } from "./Servicio";
import { Empleado } from "./Empleado";

interface ServicioEmpleadoAttributes {
  id: number;
  servicioId: number;
  empleadoId: number;
}

interface ServicioEmpleadoCreationAttributes
  extends Optional<ServicioEmpleadoAttributes, "id"> {}

export class ServicioEmpleado
  extends Model<ServicioEmpleadoAttributes, ServicioEmpleadoCreationAttributes>
  implements ServicioEmpleadoAttributes
{
  public id!: number;
  public servicioId!: number;
  public empleadoId!: number;
}

ServicioEmpleado.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    servicioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Servicio,
        key: "id",
      },
    },
    empleadoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Empleado,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "servicioEmpleado",
    timestamps: false,
    tableName: "servicioEmpleado",
  }
);

Servicio.belongsToMany(Empleado, { through: ServicioEmpleado });
Empleado.belongsToMany(Servicio, { through: ServicioEmpleado });
