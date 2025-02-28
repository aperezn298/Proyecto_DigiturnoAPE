import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database/database";
import { Empleado } from "./Empleado";

interface ModuloAttributes {
  id: number;
  modulo?: number | null;
  empleadoId: number;
}

interface ModuloCreationAttributes
  extends Optional<ModuloAttributes, "id"> {}

export class Modulo
  extends Model<ModuloAttributes, ModuloCreationAttributes>
  implements ModuloAttributes
{
  public id!: number;
  public modulo?: number | null;
  public empleadoId!: number;
}

Modulo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    modulo: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: true,
      defaultValue: null,
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
    modelName: "modulo",
    timestamps: false,
    tableName: "modulo",
  }
);

Empleado.hasOne(Modulo, {
    foreignKey: {
      name: 'empleadoId',
      allowNull: false,
    },
  });
Modulo.belongsTo(Empleado);
