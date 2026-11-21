import * as repository from "../repositories/financeiroRepository"
import * as alunoRepository from "../repositories/alunoRepository"
import type { CreateFinanceiroDto } from "../dto/financeiro/createFinanceiroDto"
import type { UpdateFinanceiroDto } from "../dto/financeiro/updateFinanceiroDto"
import { NotFoundError } from "../errors/NotFoundError"
import { AppError } from "../errors/AppError"

const FORMAS = ["Pix", "Dinheiro", "Cartão"]
const STATUS = ["pago", "aberto", "atrasado"]

function validarMes(mes: string) {
  if (typeof mes !== "string" || !/^\d{4}-(0[1-9]|1[0-2])$/.test(mes)) {
    throw new AppError("Mês de referência inválido. Use AAAA-MM.", 400)
  }
}

function validarCampos(d: CreateFinanceiroDto | UpdateFinanceiroDto) {
  if (d.valor !== undefined && (typeof d.valor !== "number" || !Number.isFinite(d.valor) || d.valor <= 0)) {
    throw new AppError("O valor deve ser maior que zero.", 400)
  }
  if (d.forma !== undefined && !FORMAS.includes(d.forma)) {
    throw new AppError("Forma de pagamento inválida (Pix, Dinheiro ou Cartão).", 400)
  }
  if (d.status !== undefined && !STATUS.includes(d.status)) {
    throw new AppError("Status inválido (pago, aberto ou atrasado).", 400)
  }
  if (d.referenciaMes !== undefined) validarMes(d.referenciaMes)
  if (d.dataPagamento && !/^\d{4}-\d{2}-\d{2}$/.test(d.dataPagamento)) {
    throw new AppError("Data de pagamento inválida. Use AAAA-MM-DD.", 400)
  }
}

export async function findAll() {
  return repository.findAll()
}

export async function findByAluno(alunoId: number) {
  return repository.findByAluno(alunoId)
}

export async function findById(id: number) {
  const f = await repository.findById(id)
  if (!f) throw new NotFoundError("Lançamento financeiro não encontrado.")
  return f
}

export async function create(data: CreateFinanceiroDto) {
  if (!Number.isInteger(data.alunoId) || data.alunoId <= 0) throw new AppError("Aluno inválido.", 400)
  if (data.valor === undefined) throw new AppError("O valor é obrigatório.", 400)
  if (data.referenciaMes === undefined) throw new AppError("O mês de referência é obrigatório.", 400)
  validarCampos(data)

  if (!(await alunoRepository.findById(data.alunoId))) throw new NotFoundError("Aluno não encontrado.")
  if (await repository.findByAlunoAndMes(data.alunoId, data.referenciaMes)) {
    throw new AppError("Já existe um lançamento deste aluno para este mês.", 409)
  }

  const status = data.status ?? "aberto"
  const dataPagamento = status === "pago"
    ? (data.dataPagamento || new Date().toISOString().slice(0, 10))
    : (data.dataPagamento ?? "")

  return repository.create({ ...data, status, dataPagamento })
}

export async function update(id: number, data: UpdateFinanceiroDto) {
  await findById(id)
  validarCampos(data)
  return repository.update(id, data)
}

/** Registra o pagamento de um lançamento em aberto/atrasado. */
export async function pagar(id: number, forma?: string) {
  const f = await findById(id)
  if (f.status === "pago") throw new AppError("Este lançamento já está pago.", 409)
  if (forma !== undefined && !FORMAS.includes(forma)) {
    throw new AppError("Forma de pagamento inválida (Pix, Dinheiro ou Cartão).", 400)
  }
  return repository.update(id, {
    status: "pago",
    forma: forma ?? f.forma,
    dataPagamento: new Date().toISOString().slice(0, 10),
  })
}

export async function remove(id: number) {
  await findById(id)
  return repository.remove(id)
}
