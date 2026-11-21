// ============================================================
//  Elite Fight Club — Dados mock (client-side, reload reseta)
// ============================================================
import type {
  Aluno, Aula, Pagamento, Campeonato, Frequencia,
  Medicao, Notificacao, ReceitaMensal, Modalidade, Faixa,
} from '../types'

// ----------- ALUNOS -----------
export const alunosMock: Aluno[] = [
  { id: 'a1',  nome: 'Carlos Mendes',   idade: 28, peso: 82, altura: 1.78, modalidades: ['Muay Thai','Boxe'],      faixa: 'Intermediário', mensalidade: 180, status: 'Ativo',        email: 'carlos@efc.com',   telefone: '(16) 99999-1001', dataMatricula: '2023-03-12', streak: 7  },
  { id: 'a2',  nome: 'Fernanda Lima',   idade: 24, peso: 58, altura: 1.65, modalidades: ['Jiu-Jitsu'],             faixa: 'Azul',          mensalidade: 160, status: 'Ativo',        email: 'fernanda@efc.com', telefone: '(16) 99999-1002', dataMatricula: '2022-08-03', streak: 12 },
  { id: 'a3',  nome: 'Rafael Torres',   idade: 32, peso: 95, altura: 1.85, modalidades: ['Funcional'],             faixa: 'N/A',           mensalidade: 150, status: 'Ativo',        email: 'rafael@efc.com',   telefone: '(16) 99999-1003', dataMatricula: '2024-01-22', streak: 3  },
  { id: 'a4',  nome: 'Juliana Costa',   idade: 21, peso: 54, altura: 1.62, modalidades: ['Muay Thai'],             faixa: 'Iniciante',     mensalidade: 160, status: 'Inadimplente', email: 'juliana@efc.com',  telefone: '(16) 99999-1004', dataMatricula: '2024-05-10', streak: 0  },
  { id: 'a5',  nome: 'Bruno Alves',     idade: 27, peso: 78, altura: 1.80, modalidades: ['Jiu-Jitsu'],             faixa: 'Roxa',          mensalidade: 200, status: 'Ativo',        email: 'bruno@efc.com',    telefone: '(16) 99999-1005', dataMatricula: '2021-11-30', streak: 6  },
  { id: 'a6',  nome: 'Mariana Souza',   idade: 30, peso: 62, altura: 1.68, modalidades: ['Boxe'],                  faixa: 'Intermediário', mensalidade: 170, status: 'Ativo',        email: 'mariana@efc.com',  telefone: '(16) 99999-1006', dataMatricula: '2023-06-15', streak: 4  },
  { id: 'a7',  nome: 'Diego Ferreira',  idade: 35, peso: 90, altura: 1.82, modalidades: ['Muay Thai','Jiu-Jitsu'], faixa: 'Marrom',        mensalidade: 220, status: 'Ativo',        email: 'diego@efc.com',    telefone: '(16) 99999-1007', dataMatricula: '2019-02-01', streak: 9  },
  { id: 'a8',  nome: 'Camila Rocha',    idade: 19, peso: 50, altura: 1.60, modalidades: ['Funcional','Boxe'],      faixa: 'Iniciante',     mensalidade: 150, status: 'Ativo',        email: 'camila@efc.com',   telefone: '(16) 99999-1008', dataMatricula: '2024-09-01', streak: 2  },
  { id: 'a9',  nome: 'Paulo Henrique',  idade: 40, peso: 88, altura: 1.79, modalidades: ['Jiu-Jitsu'],             faixa: 'Preta',         mensalidade: 250, status: 'Ativo',        email: 'paulo@efc.com',    telefone: '(16) 99999-1009', dataMatricula: '2015-04-18', streak: 14 },
  { id: 'a10', nome: 'Larissa Nunes',   idade: 26, peso: 60, altura: 1.66, modalidades: ['Muay Thai'],             faixa: 'Intermediário', mensalidade: 160, status: 'Inadimplente', email: 'larissa@efc.com',  telefone: '(16) 99999-1010', dataMatricula: '2023-01-09', streak: 0  },
  { id: 'a11', nome: 'Thiago Moreira',  idade: 22, peso: 72, altura: 1.75, modalidades: ['Boxe'],                  faixa: 'Iniciante',     mensalidade: 150, status: 'Ativo',        email: 'thiago@efc.com',   telefone: '(16) 99999-1011', dataMatricula: '2024-07-21', streak: 5  },
  { id: 'a12', nome: 'Aline Batista',   idade: 29, peso: 56, altura: 1.63, modalidades: ['Jiu-Jitsu','Funcional'], faixa: 'Azul',          mensalidade: 180, status: 'Ativo',        email: 'aline@efc.com',    telefone: '(16) 99999-1012', dataMatricula: '2022-10-05', streak: 8  },
]

// ----------- AULAS DA SEMANA -----------
export const aulasMock: Aula[] = [
  { id: 'au1', diaSemana: 1, hora: '07:00', nome: 'Muay Thai Iniciante',     modalidade: 'Muay Thai', professor: 'Diego Ferreira',  capacidade: 15, inscritos: 12, status: 'agendada' },
  { id: 'au2', diaSemana: 1, hora: '19:00', nome: 'Jiu-Jitsu Todos',         modalidade: 'Jiu-Jitsu', professor: 'Paulo Henrique',  capacidade: 12, inscritos: 8,  status: 'agendada' },
  { id: 'au3', diaSemana: 2, hora: '07:00', nome: 'Boxe Intermediário',      modalidade: 'Boxe',      professor: 'Carlos Mendes',   capacidade: 10, inscritos: 6,  status: 'agendada' },
  { id: 'au4', diaSemana: 2, hora: '19:00', nome: 'Funcional',               modalidade: 'Funcional', professor: 'Rafael Torres',   capacidade: 14, inscritos: 10, status: 'agendada' },
  { id: 'au5', diaSemana: 3, hora: '07:00', nome: 'Muay Thai Avançado',      modalidade: 'Muay Thai', professor: 'Diego Ferreira',  capacidade: 10, inscritos: 7,  status: 'agendada' },
  { id: 'au6', diaSemana: 3, hora: '19:00', nome: 'Jiu-Jitsu Iniciante',     modalidade: 'Jiu-Jitsu', professor: 'Paulo Henrique',  capacidade: 12, inscritos: 9,  status: 'agendada' },
  { id: 'au7', diaSemana: 4, hora: '19:00', nome: 'Boxe Todos os Níveis',    modalidade: 'Boxe',      professor: 'Carlos Mendes',   capacidade: 14, inscritos: 11, status: 'agendada' },
  { id: 'au8', diaSemana: 5, hora: '07:00', nome: 'Funcional + Boxe',        modalidade: 'Funcional', professor: 'Rafael Torres',   capacidade: 12, inscritos: 8,  status: 'agendada' },
  { id: 'au9', diaSemana: 6, hora: '09:00', nome: 'Treino Livre / Sparring', modalidade: 'Muay Thai', professor: 'Diego Ferreira',  capacidade: 18, inscritos: 14, status: 'agendada' },
]

// ----------- FINANCEIRO -----------
const hoje = new Date()
const isoOffset = (offset = 0) =>
  new Date(hoje.getFullYear(), hoje.getMonth(), 1 + offset).toISOString().slice(0, 10)
const mesAtual = isoOffset(0).slice(0, 7)

export const pagamentosMock: Pagamento[] = [
  { id: 'p1',  alunoId: 'a1',  valor: 180, data: isoOffset(0), forma: 'Pix',      status: 'pago',     referenciaMes: mesAtual },
  { id: 'p2',  alunoId: 'a5',  valor: 200, data: isoOffset(1), forma: 'Dinheiro', status: 'pago',     referenciaMes: mesAtual },
  { id: 'p3',  alunoId: 'a9',  valor: 250, data: isoOffset(2), forma: 'Cartão',   status: 'pago',     referenciaMes: mesAtual },
  { id: 'p4',  alunoId: 'a3',  valor: 150, data: isoOffset(3), forma: 'Pix',      status: 'pago',     referenciaMes: mesAtual },
  { id: 'p5',  alunoId: 'a6',  valor: 170, data: isoOffset(4), forma: 'Dinheiro', status: 'pago',     referenciaMes: mesAtual },
  { id: 'p6',  alunoId: 'a2',  valor: 160, data: isoOffset(0), forma: 'Pix',      status: 'pago',     referenciaMes: mesAtual },
  { id: 'p7',  alunoId: 'a7',  valor: 220, data: isoOffset(1), forma: 'Pix',      status: 'pago',     referenciaMes: mesAtual },
  { id: 'p8',  alunoId: 'a8',  valor: 150, data: isoOffset(2), forma: 'Pix',      status: 'pago',     referenciaMes: mesAtual },
  { id: 'p9',  alunoId: 'a11', valor: 150, data: isoOffset(3), forma: 'Cartão',   status: 'pago',     referenciaMes: mesAtual },
  { id: 'p10', alunoId: 'a12', valor: 180, data: isoOffset(4), forma: 'Pix',      status: 'pago',     referenciaMes: mesAtual },
  { id: 'p11', alunoId: 'a4',  valor: 160, data: '',           forma: 'Pix',      status: 'atrasado', referenciaMes: mesAtual },
  { id: 'p12', alunoId: 'a10', valor: 160, data: '',           forma: 'Pix',      status: 'atrasado', referenciaMes: mesAtual },
]

export const receitaMensalMock: ReceitaMensal[] = [
  { mes: 'Fev', valor: 1850 },
  { mes: 'Mar', valor: 1920 },
  { mes: 'Abr', valor: 2050 },
  { mes: 'Mai', valor: 2100 },
  { mes: 'Jun', valor: 1980 },
  { mes: 'Jul', valor: 1870 },
]

// ----------- CAMPEONATOS -----------
export const campeonatosMock: Campeonato[] = [
  {
    id: 'c1',
    nome: 'Copa São Paulo de Jiu-Jitsu 2025',
    data: '2025-08-15',
    local: 'Ginásio Pedrocão, Franca-SP',
    locomocao: 'Van fretada — R$40 por aluno',
    taxaInscricao: 80,
    modalidades: ['Jiu-Jitsu'],
    status: 'Confirmado',
    descricao: 'Etapa estadual com presença de academias de todo o estado.',
    categorias: [
      { id: 'cat1', nome: 'Galo',        pesoMax: 57 },
      { id: 'cat2', nome: 'Pena',        pesoMax: 64 },
      { id: 'cat3', nome: 'Leve',        pesoMax: 70 },
      { id: 'cat4', nome: 'Médio',       pesoMax: 76 },
      { id: 'cat5', nome: 'Meio-Pesado', pesoMax: 82 },
    ],
    inscricoes: [
      { alunoId: 'a2',  categoriaId: 'cat2', status: 'confirmado' },
      { alunoId: 'a5',  categoriaId: 'cat4', status: 'confirmado' },
      { alunoId: 'a9',  categoriaId: 'cat5', status: 'inscrito'   },
      { alunoId: 'a12', categoriaId: 'cat1', status: 'inscrito'   },
    ],
  },
  {
    id: 'c2',
    nome: 'Campeonato Interno Elite Fight Cup',
    data: '2025-07-20',
    local: 'Elite Fight Club — Franca-SP',
    locomocao: 'N/A (evento interno)',
    taxaInscricao: 0,
    modalidades: ['Boxe', 'Muay Thai'],
    status: 'Em organização',
    descricao: 'Torneio interno entre alunos com lutas amistosas.',
    categorias: [
      { id: 'cat6', nome: 'Boxe Aberto' },
      { id: 'cat7', nome: 'Muay Thai Aberto' },
    ],
    inscricoes: [
      { alunoId: 'a1',  categoriaId: 'cat7', status: 'inscrito'   },
      { alunoId: 'a6',  categoriaId: 'cat6', status: 'inscrito'   },
      { alunoId: 'a4',  categoriaId: 'cat7', status: 'inscrito'   },
      { alunoId: 'a11', categoriaId: 'cat6', status: 'inscrito'   },
      { alunoId: 'a7',  categoriaId: 'cat7', status: 'confirmado' },
    ],
  },
  {
    id: 'c3',
    nome: 'Open de Muay Thai Ribeirão Preto',
    data: '2025-09-10',
    local: 'Arena Ribeirão, Ribeirão Preto-SP',
    locomocao: 'Ônibus fretado — R$60 por aluno',
    taxaInscricao: 100,
    modalidades: ['Muay Thai'],
    status: 'Inscrições abertas',
    descricao: 'Open com lutadores da região e categorias por peso.',
    categorias: [
      { id: 'cat8',  nome: 'Mosca', pesoMax: 51 },
      { id: 'cat9',  nome: 'Galo',  pesoMax: 54 },
      { id: 'cat10', nome: 'Pena',  pesoMax: 57 },
      { id: 'cat11', nome: 'Leve',  pesoMax: 63 },
    ],
    inscricoes: [
      { alunoId: 'a1',  categoriaId: 'cat10', status: 'inscrito' },
      { alunoId: 'a7',  categoriaId: 'cat11', status: 'inscrito' },
      { alunoId: 'a10', categoriaId: 'cat8',  status: 'inscrito' },
    ],
  },
]

// ----------- FREQUÊNCIA (últimos 30 dias) -----------
function gerarFrequencias(): Frequencia[] {
  const out: Frequencia[] = []
  let id = 1
  for (let d = 0; d < 30; d++) {
    const date = new Date()
    date.setDate(date.getDate() - d)
    const iso = date.toISOString().slice(0, 10)
    if (date.getDay() === 0) continue
    const n = 4 + (d % 6)
    const slice = [...alunosMock].slice(d % 3, (d % 3) + n)
    slice.forEach((al) => {
      out.push({
        id: `f${id++}`,
        alunoId: al.id,
        data: iso,
        hora: `${(6 + (id % 14)).toString().padStart(2, '0')}:${id % 2 === 0 ? '00' : '30'}`,
        modalidade: al.modalidades[0],
      })
    })
  }
  return out
}
export const frequenciasMock: Frequencia[] = gerarFrequencias()

// ----------- EVOLUÇÃO FÍSICA -----------
export const medicoesMock: Record<string, Medicao[]> = {
  a1: [{ data: '2025-01-15', peso: 86 }, { data: '2025-03-15', peso: 84 }, { data: '2025-05-15', peso: 82 }, { data: '2025-07-15', peso: 82 }],
  a2: [{ data: '2025-01-10', peso: 62 }, { data: '2025-03-10', peso: 60 }, { data: '2025-05-10', peso: 59 }, { data: '2025-07-10', peso: 58 }],
  a5: [{ data: '2025-01-20', peso: 80 }, { data: '2025-03-20', peso: 78 }, { data: '2025-05-20', peso: 79 }, { data: '2025-07-20', peso: 78 }],
}

// ----------- NOTIFICAÇÕES -----------
export const notificacoesMock: Notificacao[] = [
  { id: 'n1', titulo: 'Mensalidade em atraso',  mensagem: 'Juliana Costa está com pagamento em atraso há 15 dias.',     tipo: 'danger',  data: isoOffset(0),  lida: false },
  { id: 'n2', titulo: 'Mensalidade em atraso',  mensagem: 'Larissa Nunes está com pagamento em atraso há 15 dias.',     tipo: 'danger',  data: isoOffset(0),  lida: false },
  { id: 'n3', titulo: 'Campeonato confirmado',  mensagem: 'Copa São Paulo de Jiu-Jitsu — 4 alunos inscritos.',          tipo: 'success', data: isoOffset(-2), lida: false },
  { id: 'n4', titulo: 'Aula com alta presença', mensagem: 'Treino Livre/Sparring teve 14 alunos no último sábado.',     tipo: 'info',    data: isoOffset(-3), lida: true  },
]

// ----------- HELPERS -----------
export const corModalidade = (m: Modalidade): string => {
  const map: Record<Modalidade, string> = {
    'Boxe':      '#4a5568',
    'Muay Thai': '#4a6274',
    'Jiu-Jitsu': '#3d5a4a',
    'Funcional': '#555555',
  }
  return map[m]
}

export const corFaixa = (f: Faixa): string => {
  const map: Record<Faixa, string> = {
    'N/A':           '#606060',
    'Iniciante':     '#a0a0a0',
    'Intermediário': '#6c7f8e',
    'Branca':        '#e8eef2',
    'Azul':          '#2d6a9f',
    'Roxa':          '#6b3fa0',
    'Marrom':        '#7a4a1e',
    'Preta':         '#141414',
  }
  return map[f]
}
