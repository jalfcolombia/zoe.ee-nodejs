export interface IAsistenciaReport {
  charla: string;
  expositor: string;
  fecha: string;
  tipo_documento?: string;
  documento: string;
  correo?: string;
  invitado: number;
  ficha?: number;
  programa_formacion?: string;
  codigo_centro?: number;
  centro_formacion?: string;
  regional?: string;
  modalidad_formacion?: string;
  tipo_programa?: string;
  mes: string;
  usuarios_zoom?: number;
  tipo_transferencia?: string;
  publico?: string;
  encuesta_respuesta: string;
  encuesta_respuesta_otro: string;
}
