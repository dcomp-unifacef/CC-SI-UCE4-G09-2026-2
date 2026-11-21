export interface CreateFinanceiroDto {
  alunoId: number;
  valor: number;
  forma?: string;          // Pix | Dinheiro | Cartão
  status?: string;         // pago | aberto | atrasado
  referenciaMes: string;   // AAAA-MM
  dataPagamento?: string;  // AAAA-MM-DD (obrigatória se status = pago)
  tipoDePlano?: string;
  desconto?: number;
  taxaExtra?: number;
  observacao?: string;
}
