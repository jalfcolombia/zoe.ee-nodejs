import Sequelize, { DataTypes, Model, Optional } from 'sequelize';

export interface CharlaAttributes {
  id?: string;
  nombre: string;
  expositor: string;
  fecha_inicio: Date;
  fecha_fin: Date;
  tiempo_margen?: number;
  usuarios_zoom?: number;
  tipo_transferencia?: string;
  publico?: string;
  activated?: boolean;
  created_at?: Date;
  deleted_at?: Date;
}

export type CharlaPk = 'id';
export type CharlaId = Charla[CharlaPk];
export type CharlaCreationAttributes = Optional<CharlaAttributes, CharlaPk>;

export class Charla extends Model<CharlaAttributes, CharlaCreationAttributes> implements CharlaAttributes {
  id?: string;
  nombre!: string;
  expositor!: string;
  fecha_inicio!: Date;
  fecha_fin!: Date;
  tiempo_margen?: number;
  usuarios_zoom?: number;
  tipo_transferencia?: string;
  publico?: string;
  activated?: boolean;
  created_at?: Date;
  deleted_at?: Date;

  static initModel(sequelize: Sequelize.Sequelize): typeof Charla {
    Charla.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
        },
        nombre: {
          type: DataTypes.STRING(500),
          allowNull: false,
          comment: 'Nombre de la charla',
        },
        expositor: {
          type: DataTypes.STRING(500),
          allowNull: false,
          comment: 'Nombre de la persona que dicta',
        },
        fecha_inicio: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        fecha_fin: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        tiempo_margen: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          comment: 'Tiempo en minutos de margen pa',
        },
        usuarios_zoom: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        tipo_transferencia: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        publico: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        activated: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn('getdate'),
        },
        deleted_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'charla',
        schema: 'asistencia',
        timestamps: false,
        indexes: [
          {
            name: 'pkcharla',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      },
    );
    return Charla;
  }
}
