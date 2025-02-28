import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database/database";
import { Rol } from "./Rol";

interface LoginAttributes {
  id: number;
  correo: string;
  contrasena: string;
  estado?: "Activo" | "Deshabilitado";
  rolId: number;
}

interface LoginCreationAttributes extends Optional<LoginAttributes, "id"> {}

export class Login
  extends Model<LoginAttributes, LoginCreationAttributes>
  implements LoginAttributes
{
  public id!: number;
  public correo!: string;
  public contrasena!: string;
  public estado?: "Activo" | "Deshabilitado";
  public rolId!: number;
}

Login.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    correo: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },
    contrasena: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM("Activo", "Deshabilitado"),
      defaultValue: "Activo",
      allowNull: false,
    },
    rolId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Rol,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "login",
    timestamps: false,
    tableName: "login",
  }
);

Rol.hasMany(Login, {
  foreignKey: "rolId",
  sourceKey: "id",
});

Login.belongsTo(Rol, {
  foreignKey: "rolId",
  targetKey: "id",
});
