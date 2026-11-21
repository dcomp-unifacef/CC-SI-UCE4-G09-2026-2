import * as repository from "../repositories/turmaRepository"
import type { CreateTurmaDto } from "../dto/turma/createTurmaDto"
import type { UpdateTurmaDto } from "../dto/turma/updateTurmaDto"
import { NotFoundError } from "../errors/NotFoundError"
import { ConflictError } from "../errors/ConflictError"

export async function findAll() {
  return repository.findAll()
}

export async function findById(id: number) {
  const turma = await repository.findById(id)
  if (!turma) throw new NotFoundError("Turma não encontrada.")
  return turma
}

export async function create(data: CreateTurmaDto) {
  return repository.create(data)
}

export async function update(id: number, data: UpdateTurmaDto) {
  await findById(id)
  return repository.update(id, data)
}

export async function remove(id: number) {
  const turma = await findById(id)
  if (turma.aulas && turma.aulas.length > 0) {
    throw new ConflictError(
      `Esta turma possui ${turma.aulas.length} aula(s) vinculada(s). Remova-as antes de excluir a turma.`
    )
  }
  return repository.remove(id)
}
