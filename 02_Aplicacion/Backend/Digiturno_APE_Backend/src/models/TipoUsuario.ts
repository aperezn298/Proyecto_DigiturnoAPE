import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database/database";

interface TipoUsuarioAttributes {
  id: number;
  nombre: string;
}

interface TipoUsuarioCreationAttributes
  extends Optional<TipoUsuarioAttributes, "id"> {}

export class TipoUsuario
  extends Model<TipoUsuarioAttributes, TipoUsuarioCreationAttributes>
  implements TipoUsuarioAttributes
{
  public id!: number;
  public nombre!: string;
}

TipoUsuario.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "tipoUsuario",
    timestamps: false,
    tableName: "tipoUsuario",
  }
);
