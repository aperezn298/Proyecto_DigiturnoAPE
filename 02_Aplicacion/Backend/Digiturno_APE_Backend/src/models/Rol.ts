import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database/database";

interface RolAttributes {
  id: number;
  nombre: string;
  estado?: "Activo" | "Deshabilitado";
}

interface RolCreationAttributes extends Optional<RolAttributes, "id"> {}

export class Rol
  extends Model<RolAttributes, RolCreationAttributes>
  implements RolAttributes
{
  public id!: number;
  public nombre!: string;
  public estado?: "Activo" | "Deshabilitado";
}

Rol.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
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
    modelName: "rol",
    timestamps: false,
    tableName: "rol",
  }
);
