import Sequelize, { DataTypes, Model, Optional } from 'sequelize';
import type { Charla, CharlaId } from './charla';
import type { EncuestaInvitado, EncuestaInvitadoId } from './encuesta_invitado';

export interface InvitadoAttributes {
  id?: string;
  charla_id: string;
  encuesta_id?: string;
  tipo_documento?: string;
  documento: string;
  correo?: string;
  encuesta_respuesta?: string;
  aprobado?: boolean;
  created_at?: Date;
  deleted_at?: Date;
}

export type InvitadoPk = 'id';
export type InvitadoId = Invitado[InvitadoPk];
export type InvitadoCreationAttributes = Optional<InvitadoAttributes, InvitadoPk>;

export class Invitado extends Model<InvitadoAttributes, InvitadoCreationAttributes> implements InvitadoAttributes {
  id?: string;
  charla_id!: string;
  encuesta_id?: string;
  tipo_documento?: string;
  documento!: string;
  correo?: string;
  encuesta_respuesta?: string;
  aprobado?: boolean;
  created_at?: Date;
  deleted_at?: Date;

  // Invitado belongsTo Charla via charla_id
  charla!: Charla;
  getCharla!: Sequelize.BelongsToGetAssociationMixin<Charla>;
  setCharla!: Sequelize.BelongsToSetAssociationMixin<Charla, CharlaId>;
  createCharla!: Sequelize.BelongsToCreateAssociationMixin<Charla>;
  // Invitado belongsTo EncuestaInvitado via encuesta_id
  encuestum!: EncuestaInvitado;
  getEncuestum!: Sequelize.BelongsToGetAssociationMixin<EncuestaInvitado>;
  setEncuestum!: Sequelize.BelongsToSetAssociationMixin<EncuestaInvitado, EncuestaInvitadoId>;
  createEncuestum!: Sequelize.BelongsToCreateAssociationMixin<EncuestaInvitado>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Invitado {
    Invitado.init(
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
        encuesta_id: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'encuesta_invitado',
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
        encuesta_respuesta: {
          type: DataTypes.STRING(140),
          allowNull: true,
        },
        aprobado: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          comment: 'Esto es el aprobado por parte ',
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
        tableName: 'invitado',
        schema: 'asistencia',
        timestamps: false,
        indexes: [
          {
            name: 'invitado_charla_id_Idx',
            fields: [{ name: 'charla_id' }],
          },
          {
            name: 'invitado_encuesta_invitado_id_Idx',
            fields: [{ name: 'encuesta_id' }],
          },
          {
            name: 'pkinvitado',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      },
    );
    return Invitado;
  }
}
