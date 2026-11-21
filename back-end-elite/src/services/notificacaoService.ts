import * as repository from "../repositories/notificacaoRepository"
import * as alunoRepository from "../repositories/alunoRepository"
import type { CreateNotificacaoDto } from "../dto/notificacao/createNotificacaoDto"
import type { UpdateNotificacaoDto } from "../dto/notificacao/updateNotificacaoDto"
import { NotFoundError } from "../errors/NotFoundError"
import { AppError } from "../errors/AppError"

export async function findAll() {
  return repository.findAll()
}

export async function findByAluno(alunoId: number) {
  return repository.findByAluno(alunoId)
}

export async function findById(id: number) {
  const n = await repository.findById(id)
  if (!n) throw new NotFoundError("Notificação não encontrada.")
  return n
}

export async function create(data: CreateNotificacaoDto) {
  if (!data.mensagem?.trim()) throw new AppError("A mensagem é obrigatória.", 400)
  if (!data.tipoNotificacao?.trim()) throw new AppError("O tipo é obrigatório.", 400)
  if (!Number.isInteger(data.alunoId) || data.alunoId <= 0) throw new AppError("Aluno inválido.", 400)
  if (!(await alunoRepository.findById(data.alunoId))) throw new NotFoundError("Aluno não encontrado.")
  return repository.create({ ...data, mensagem: data.mensagem.trim() })
}

export async function update(id: number, data: UpdateNotificacaoDto) {
  await findById(id)
  return repository.update(id, data)
}

export async function marcarLida(id: number) {
  await findById(id)
  return repository.update(id, { lida: true })
}

export async function marcarTodasLidas() {
  const r = await repository.marcarTodasLidas()
  return { atualizadas: r.count }
}

export async function remove(id: number) {
  await findById(id)
  return repository.remove(id)
}
