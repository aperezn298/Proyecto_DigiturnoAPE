import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database/database";

interface TipoPoblacionAttributes {
  id: number;
  nombre: string;
}

interface TipoPoblacionCreationAttributes
  extends Optional<TipoPoblacionAttributes, "id"> {}

export class TipoPoblacion
  extends Model<TipoPoblacionAttributes, TipoPoblacionCreationAttributes>
  implements TipoPoblacionAttributes
{
  public id!: number;
  public nombre!: string;
}

TipoPoblacion.init(
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
    modelName: "tipoPoblacion",
    timestamps: false,
    tableName: "tipoPoblacion",
  }
);
