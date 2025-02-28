import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database/database";

interface TipoEmpleadoAttributes {
  id: number;
  codigo: string;
  nombre: string;
  estado?: "Activo" | "Deshabilitado";
}

interface TipoEmpleadoCreationAttributes
  extends Optional<TipoEmpleadoAttributes, "id"> {}

export class TipoEmpleado
  extends Model<TipoEmpleadoAttributes, TipoEmpleadoCreationAttributes>
  implements TipoEmpleadoAttributes
{
  public id!: number;
  public codigo!: string;
  public nombre!: string;
  public estado?: "Activo" | "Deshabilitado";
}

TipoEmpleado.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    codigo: {
      type: DataTypes.STRING(2),
      unique: true,
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM("Activo", "Deshabilitado"),
      defaultValue: "Activo",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "tipoEmpleado",
    timestamps: false,
    tableName: "tipoEmpleado",
  }
);
