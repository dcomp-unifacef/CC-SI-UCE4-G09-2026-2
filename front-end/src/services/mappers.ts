// ============================================================
//  Converte entre o formato da API (back-end) e o formato
//  usado pelos componentes do front-end.
// ============================================================
import type { AlunoAPI, CampeonatoAPI } from './api'
import type { Aluno, Campeonato, Faixa, StatusAluno, Modalidade } from '../types'

// API status → front status
function mapStatus(s: AlunoAPI['status']): StatusAluno {
  if (s === 'INADIMPLENTE') return 'Inadimplente'
  if (s === 'INATIVO')      return 'Inativo'
  return 'Ativo'
}

// front status → API status
export function statusToAPI(s: StatusAluno): AlunoAPI['status'] {
  if (s === 'Inadimplente') return 'INADIMPLENTE'
  if (s === 'Inativo')      return 'INATIVO'
  return 'ATIVO'
}

export function alunoFromAPI(a: AlunoAPI): Aluno {
  return {
    id:           String(a.id),
    nome:         a.nome,
    idade:        a.idade,
    peso:         a.peso,
    altura:       a.altura,
    modalidades:  (a.modalidades ?? []) as Modalidade[],
    faixa:        (a.graduacao as Faixa) ?? 'Iniciante',
    mensalidade:  a.valorMensalidade,
    status:       mapStatus(a.status),
    email:        a.email ?? '',
    telefone:     a.telefone ?? '',
    dataMatricula: a.dataMatricula ?? new Date().toISOString().slice(0, 10),
    streak:       a.streak ?? 0,
  }
}

export function alunoToAPI(a: Partial<Aluno> & { cpf: string }): Partial<Omit<AlunoAPI, 'id'>> & { cpf: string } {
  return {
    cpf:              a.cpf,
    nome:             a.nome ?? '',
    idade:            a.idade ?? 0,
    peso:             a.peso ?? 0,
    altura:           a.altura ?? 0,
    valorMensalidade: a.mensalidade ?? 0,
    graduacao:        a.faixa ?? 'Iniciante',
    email:            a.email ?? '',
    telefone:         a.telefone ?? '',
    dataMatricula:    a.dataMatricula ?? new Date().toISOString().slice(0, 10),
    streak:           a.streak ?? 0,
    status:           a.status ? statusToAPI(a.status) : 'ATIVO',
    modalidades:      a.modalidades ?? [],
  }
}

export function campeonatoFromAPI(c: CampeonatoAPI): Campeonato {
  return {
    id:           String(c.id),
    nome:         c.nome,
    data:         c.data,
    local:        c.local,
    locomocao:    c.locomocao,
    taxaInscricao: c.valores,
    modalidades:  [],           // back-end não persiste modalidades no Campeonato
    categorias:   c.pesosDeLuta.map((p, i) => ({
      id:    String(i),
      nome:  p,
    })),
    inscricoes:   c.inscricoes.map((ins) => ({
      alunoId:    String(ins.alunoId),
      categoriaId: undefined,
      status:     'inscrito' as const,
    })),
    status:       'Confirmado',
    descricao:    c.descricao,
  }
}
