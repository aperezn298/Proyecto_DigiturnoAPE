import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database/database";
import { Servicio } from "./Servicio";
import { Turno } from "./Turno";

interface ServicioTurnoAttributes {
  id: number;
  servicioId: number;
  turnoId: number;
}

interface ServicioTurnoCreationAttributes
  extends Optional<ServicioTurnoAttributes, "id"> {}

export class ServicioTurno
  extends Model<ServicioTurnoAttributes, ServicioTurnoCreationAttributes>
  implements ServicioTurnoAttributes
{
  public id!: number;
  public servicioId!: number;
  public turnoId!: number;
}

ServicioTurno.init(
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
    turnoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Turno,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "servicioTurno",
    timestamps: false,
    tableName: "servicioTurno",
  }
);

Servicio.belongsToMany(Turno, { through: ServicioTurno });
Turno.belongsToMany(Servicio, { through: ServicioTurno });
