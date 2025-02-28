import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database/database";
import { TipoUsuario } from "./TipoUsuario";
import { TipoPoblacion } from "./TipoPoblacion";

interface UsuarioAttributes {
  id: number;
  tipoUsuarioId: number;
  tipoDocumento: "RC" | "CC" | "TE";
  numeroDocumento: string;
  nombres: string;
  apellidos: string;
  correo?: string;
  tipoPoblacionId: number;
  estado?: "Activo" | "Deshabilitado";
}

interface UsuarioCreationAttributes extends Optional<UsuarioAttributes, "id"> {}

export class Usuario
  extends Model<UsuarioAttributes, UsuarioCreationAttributes>
  implements UsuarioAttributes
{
  public id!: number;
  public tipoUsuarioId!: number;
  public tipoDocumento!: "RC" | "CC" | "TE";
  public numeroDocumento!: string;
  public nombres!: string;
  public apellidos!: string;
  public correo?: string;
  public tipoPoblacionId!: number;
  public estado?: "Activo" | "Deshabilitado";
}

Usuario.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tipoUsuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: TipoUsuario,
        key: "id",
      },
    },
    tipoDocumento: {
      type: DataTypes.ENUM("RC", "CC", "TE"),
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
      allowNull: true,
    },
    tipoPoblacionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: TipoPoblacion,
        key: "id",
      },
    },
    estado: {
      type: DataTypes.ENUM("Activo", "Deshabilitado"),
      defaultValue: "Activo",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "usuario",
    timestamps: false,
    tableName: "usuario",
  }
);

TipoUsuario.hasMany(Usuario, {
  foreignKey: "tipoUsuarioId",
  sourceKey: "id",
});

Usuario.belongsTo(TipoUsuario, {
  foreignKey: "tipoUsuarioId",
  targetKey: "id",
});

TipoPoblacion.hasMany(Usuario, {
  foreignKey: "tipoPoblacionId",
  sourceKey: "id",
});

Usuario.belongsTo(TipoPoblacion, {
  foreignKey: "tipoPoblacionId",
  targetKey: "id",
});