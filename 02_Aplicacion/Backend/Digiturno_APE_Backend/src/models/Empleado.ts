import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database/database";
import { TipoEmpleado } from "./TipoEmpleado";

interface EmpleadoAttributes {
  id: number;
  tipoDocumento: "CE" | "CC";
  numeroDocumento: string;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
  estado?: "Activo" | "Deshabilitado";
  tipoId: number;
}

interface EmpleadoCreationAttributes
  extends Optional<EmpleadoAttributes, "id"> {}

export class Empleado
  extends Model<EmpleadoAttributes, EmpleadoCreationAttributes>
  implements EmpleadoAttributes
{
  public id!: number;
  public tipoDocumento!: "CE" | "CC";
  public numeroDocumento!: string;
  public nombres!: string;
  public apellidos!: string;
  public correo!: string;
  public telefono!: string;
  public estado?: "Activo" | "Deshabilitado";
  public tipoId!: number;
}

Empleado.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tipoDocumento: {
      type: DataTypes.ENUM("CE", "CC"),
      allowNull: false,
    },
    numeroDocumento: {
      type: DataTypes.STRING(13),
      unique: true,
      allowNull: false,
    },
    nombres: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    apellidos: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    correo: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },
    telefono: {
      type: DataTypes.STRING(10),
      unique: true,
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM("Activo", "Deshabilitado"),
      defaultValue: "Activo",
      allowNull: false,
    },
    tipoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: TipoEmpleado,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "empleado",
    timestamps: false,
    tableName: "empleado",
  }
);

TipoEmpleado.hasMany(Empleado, {
  foreignKey: "tipoId",
  sourceKey: "id",
});

Empleado.belongsTo(TipoEmpleado, {
  foreignKey: "tipoId",
  targetKey: "id",
});
