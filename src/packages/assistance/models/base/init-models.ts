// Librerías
import type { Sequelize } from 'sequelize';

// Modelos base
import { Asistencia } from './asistencia';
import { Charla } from './charla';
import { EncuestaInvitado } from './encuesta_invitado';
import { Invitado } from './invitado';

// Tipos
import type { AsistenciaAttributes, AsistenciaCreationAttributes } from './asistencia';
import type { CharlaAttributes, CharlaCreationAttributes } from './charla';
import type { EncuestaInvitadoAttributes, EncuestaInvitadoCreationAttributes } from './encuesta_invitado';
import type { InvitadoAttributes, InvitadoCreationAttributes } from './invitado';

export { Asistencia, Charla, EncuestaInvitado, Invitado };

export type {
  AsistenciaAttributes,
  AsistenciaCreationAttributes,
  CharlaAttributes,
  CharlaCreationAttributes,
  EncuestaInvitadoAttributes,
  EncuestaInvitadoCreationAttributes,
  InvitadoAttributes,
  InvitadoCreationAttributes,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function initModels(sequelize: Sequelize): any {
  Asistencia.initModel(sequelize);
  Charla.initModel(sequelize);
  EncuestaInvitado.initModel(sequelize);
  Invitado.initModel(sequelize);

  Asistencia.belongsTo(Charla, { as: 'charla', foreignKey: 'charla_id' });
  Charla.hasMany(Asistencia, { as: 'asistencia', foreignKey: 'charla_id' });
  Invitado.belongsTo(Charla, { as: 'charla', foreignKey: 'charla_id' });
  Charla.hasMany(Invitado, { as: 'invitados', foreignKey: 'charla_id' });
  Invitado.belongsTo(EncuestaInvitado, { as: 'encuestum', foreignKey: 'encuesta_id' });
  EncuestaInvitado.hasMany(Invitado, { as: 'invitados', foreignKey: 'encuesta_id' });

  return {
    Asistencia: Asistencia,
    Charla: Charla,
    EncuestaInvitado: EncuestaInvitado,
    Invitado: Invitado,
  };
}
