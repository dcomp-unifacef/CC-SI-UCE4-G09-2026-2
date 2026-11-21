export interface CreateAlunoDto {
  cpf: string;
  nome: string;
  idade: number;
  peso: number;
  altura: number;
  valorMensalidade: number;
  graduacao: string;
  email?: string;
  telefone?: string;
  dataMatricula?: string;
  streak?: number;
  status?: 'ATIVO' | 'INADIMPLENTE' | 'INATIVO';
  modalidades?: string[];
}
