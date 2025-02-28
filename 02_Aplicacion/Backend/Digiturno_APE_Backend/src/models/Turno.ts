import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database/database";
import { Usuario } from "./Usuario";
import { Empleado } from "./Empleado";

interface TurnoAttributes {
  id: number;
  codigo: string;
  fecha: Date;
  horaCreacion: string;
  horaAsignacion?: string;
  horaFinalizacion?: string;
  observacion?: string;
  prioridad?: boolean;
  estado?: "Espera" | "Proceso" | "Cancelado" | "Atendido";
  usuarioId: number;
  empleadoId: number;
}

interface TurnoCreationAttributes extends Optional<TurnoAttributes, "id"> {}

export class Turno
  extends Model<TurnoAttributes, TurnoCreationAttributes>
  implements TurnoAttributes
{
  public id!: number;
  public codigo!: string;
  public fecha!: Date;
  public horaCreacion!: string;
  public horaAsignacion?: string;
  public horaFinalizacion?: string;
  public observacion?: string;
  public prioridad?: boolean;
  public estado?: "Espera" | "Proceso" | "Cancelado" | "Atendido";
  public usuarioId!: number;
  public empleadoId!: number;
}

Turno.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    codigo: {
      type: DataTypes.STRING(6),
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATEONLY,
    },
    horaCreacion: {
      type: DataTypes.TIME,
    },
    horaAsignacion: {
      type: DataTypes.TIME,
    },
    horaFinalizacion: {
      type: DataTypes.TIME,
    },
    observacion: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    prioridad: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    estado: {
      type: DataTypes.ENUM("Espera", "Proceso", "Cancelado", "Atendido"),
      allowNull: false,
      defaultValue: "Espera",
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Usuario,
        key: "id",
      },
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
    modelName: "turno",
    timestamps: false,
    tableName: "turno",
  }
);

Usuario.hasMany(Turno, {
  foreignKey: "usuarioId",
  sourceKey: "id",
});

Turno.belongsTo(Usuario, {
  foreignKey: "usuarioId",
  targetKey: "id",
});

Empleado.hasMany(Turno, {
  foreignKey: "empleadoId",
  sourceKey: "id",
});

Turno.belongsTo(Empleado, {
  foreignKey: "empleadoId",
  targetKey: "id",
});
