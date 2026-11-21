export interface UpdateAulaDto {
  data?: Date | string;
  horarioInicio?: string;
  duracaoMinutos?: number;
  capacidade?: number;
  diaSemana?: number;
  presente?: boolean;
  observacao?: string;
  professorId?: number;
  modalidadeId?: number;
  turmaId?: number;
}
