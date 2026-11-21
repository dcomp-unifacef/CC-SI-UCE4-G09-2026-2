import * as repository from "../repositories/aulaRepository"
import type { CreateAulaDto } from "../dto/aula/createAulaDto"
import type { UpdateAulaDto } from "../dto/aula/updateAulaDto"
import { NotFoundError } from "../errors/NotFoundError"
import { AppError } from "../errors/AppError"

export async function findAll() {
  return repository.findAll()
}

export async function findById(id: number) {
  const aula = await repository.findById(id)
  if (!aula) throw new NotFoundError("Aula não encontrada.")
  return aula
}

export async function create(data: CreateAulaDto) {
  if (!data.capacidade || data.capacidade <= 0) {
    throw new AppError("Capacidade é obrigatória e deve ser maior que zero.", 400)
  }
  return repository.create(data)
}

export async function update(id: number, data: UpdateAulaDto) {
  await findById(id)
  return repository.update(id, data)
}

export async function remove(id: number) {
  await findById(id)
  return repository.remove(id)
}
