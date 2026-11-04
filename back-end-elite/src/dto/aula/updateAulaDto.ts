export interface UpdateAulaDto {
  data?: Date;
  horarioInicio?: string;
  duracaoMinutos?: number;
  presente?: boolean;
  observacao?: string | null;
  professorId?: number;
}