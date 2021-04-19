import Sequelize, { DataTypes, Model, Optional } from 'sequelize';
import type { Charla, CharlaId } from './charla';

export interface AsistenciaAttributes {
  id?: string;
  charla_id: string;
  tipo_documento?: string;
  documento: string;
  correo?: string;
  ficha?: number;
  programa_formacion?: string;
  codigo_centro?: number;
  centro_formacion?: string;
  regional?: string;
  modalidad_formacion?: string;
  tipo_programa?: string;
  created_at?: Date;
  deleted_at?: Date;
}

export type AsistenciaPk = 'id';
export type AsistenciaId = Asistencia[AsistenciaPk];
export type AsistenciaCreationAttributes = Optional<AsistenciaAttributes, AsistenciaPk>;

export class Asistencia
  extends Model<AsistenciaAttributes, AsistenciaCreationAttributes>
  implements AsistenciaAttributes {
  id?: string;
  charla_id!: string;
  tipo_documento?: string;
  documento!: string;
  correo?: string;
  ficha?: number;
  programa_formacion?: string;
  codigo_centro?: number;
  centro_formacion?: string;
  regional?: string;
  modalidad_formacion?: string;
  tipo_programa?: string;
  created_at?: Date;
  deleted_at?: Date;

  // Asistencia belongsTo Charla via charla_id
  charla!: Charla;
  getCharla!: Sequelize.BelongsToGetAssociationMixin<Charla>;
  setCharla!: Sequelize.BelongsToSetAssociationMixin<Charla, CharlaId>;
  createCharla!: Sequelize.BelongsToCreateAssociationMixin<Charla>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Asistencia {
    Asistencia.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
        },
        charla_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'charla',
            key: 'id',
          },
        },
        tipo_documento: {
          type: DataTypes.STRING(40),
          allowNull: true,
        },
        documento: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        correo: {
          type: DataTypes.STRING(500),
          allowNull: true,
        },
        ficha: {
          type: DataTypes.INTEGER,
          allowNull: true,
          comment: 'Ficha a la que pertence el apr',
        },
        programa_formacion: {
          type: DataTypes.STRING(500),
          allowNull: true,
          comment: 'Nombre del programa de formaci',
        },
        codigo_centro: {
          type: DataTypes.INTEGER,
          allowNull: true,
          comment: 'Código del centro de formación',
        },
        centro_formacion: {
          type: DataTypes.STRING(500),
          allowNull: true,
          comment: 'Nombre del centro de formación',
        },
        regional: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        modalidad_formacion: {
          type: DataTypes.STRING(5),
          allowNull: true,
          comment: 'V - Virtual ; P - Presencial ;',
        },
        tipo_programa: {
          type: DataTypes.STRING(1),
          allowNull: true,
          comment: 'T - Titulada ; C - Complementa',
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
        tableName: 'asistencia',
        schema: 'asistencia',
        timestamps: false,
        indexes: [
          {
            name: 'asistencia_charla_id_Idx',
            fields: [{ name: 'charla_id' }],
          },
          {
            name: 'asistencia_tipo_documento_documento_Idx',
            fields: [{ name: 'tipo_documento' }, { name: 'documento' }],
          },
          {
            name: 'pkasistencia',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      },
    );
    return Asistencia;
  }
}
