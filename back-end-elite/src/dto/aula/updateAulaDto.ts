export interface UpdateAulaDto {
  data?: Date;
  horarioInicio?: string;
  duracaoMinutos?: number;
  presente?: boolean;
  observacao?: string;
  professorId?: number;
}