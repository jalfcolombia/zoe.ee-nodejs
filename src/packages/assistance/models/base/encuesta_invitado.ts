import Sequelize, { DataTypes, Model, Optional } from 'sequelize';

export interface EncuestaInvitadoAttributes {
  id?: string;
  pregunta: string;
  orden: number;
  activated?: boolean;
  created_at?: Date;
}

export type EncuestaInvitadoPk = 'id';
export type EncuestaInvitadoId = EncuestaInvitado[EncuestaInvitadoPk];
export type EncuestaInvitadoCreationAttributes = Optional<EncuestaInvitadoAttributes, EncuestaInvitadoPk>;

export class EncuestaInvitado
  extends Model<EncuestaInvitadoAttributes, EncuestaInvitadoCreationAttributes>
  implements EncuestaInvitadoAttributes {
  id?: string;
  pregunta!: string;
  orden!: number;
  activated?: boolean;
  created_at?: Date;

  static initModel(sequelize: Sequelize.Sequelize): typeof EncuestaInvitado {
    EncuestaInvitado.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
        },
        pregunta: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        orden: {
          type: DataTypes.INTEGER,
          allowNull: false,
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
      },
      {
        sequelize,
        tableName: 'encuesta_invitado',
        schema: 'asistencia',
        timestamps: false,
        indexes: [
          {
            name: 'pkencuesta_invitado',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      },
    );
    return EncuestaInvitado;
  }
}
