// O papel NÃO faz parte do DTO: é sempre definido no servidor.
export interface CadastroDto {
  nome: string;
  email: string;
  senha: string;
}
