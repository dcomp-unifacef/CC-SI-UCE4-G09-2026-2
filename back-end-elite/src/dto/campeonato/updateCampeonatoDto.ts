export interface UpdateCampeonatoDto {
  nome?: string;
  data?: Date | string;
  local?: string;
  locomocao?: string;
  valores?: number;
  descricao?: string;
  pesosDeLuta?: string[];
}
