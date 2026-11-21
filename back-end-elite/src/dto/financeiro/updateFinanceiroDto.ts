export interface UpdateFinanceiroDto {
  valor?: number;
  forma?: string;
  status?: string;
  referenciaMes?: string;
  dataPagamento?: string;
  tipoDePlano?: string;
  desconto?: number;
  taxaExtra?: number;
  observacao?: string;
}
