import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database/database";
import { Turno } from "./Turno";

interface CalificacionAttributes {
  id: number;
  calificacion: number;
  observacion?: string;
  idTurno: number;
}

interface CalificacionCreationAttributes
  extends Optional<CalificacionAttributes, "id"> { }

export class Calificacion
  extends Model<CalificacionAttributes, CalificacionCreationAttributes>
  implements CalificacionAttributes {
  public id!: number;
  public calificacion!: number;
  public observacion?: string;
  public idTurno!: number;
}

Calificacion.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    calificacion: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    observacion: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    idTurno: {
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
    modelName: "calificacion",
    timestamps: false,
    tableName: "calificacion",
  }
);

Turno.hasOne(Calificacion, {
  foreignKey: "idTurno",
  sourceKey: "id",
});

Calificacion.belongsTo(Turno, {
  foreignKey: "idTurno",
  targetKey: "id",
});
