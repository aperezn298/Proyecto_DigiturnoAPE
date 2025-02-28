import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database/database";

interface ServicioAttributes {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  duracion: string;
  icono: string;
  estado?: "Activo" | "Deshabilitado";
}

interface ServicioCreationAttributes
  extends Optional<ServicioAttributes, "id"> {}

export class Servicio
  extends Model<ServicioAttributes, ServicioCreationAttributes>
  implements ServicioAttributes
{
  public id!: number;
  public codigo!: string;
  public nombre!: string;
  public descripcion!: string;
  public duracion!: string;
  public icono!: string;
  public estado?: "Activo" | "Deshabilitado";
}

Servicio.init(
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
      type: DataTypes.STRING(150),
      unique: true,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    duracion: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    icono: {
      type: DataTypes.STRING,
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
    modelName: "servicio",
    timestamps: false,
    tableName: "servicio",
  }
);
