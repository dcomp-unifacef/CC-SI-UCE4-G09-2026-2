import * as repository from "../repositories/professorRepository"
import type { CreateProfessorDto } from "../dto/professor/createProfessorDto"
import type { UpdateProfessorDto } from "../dto/professor/updateProfessorDto"
import { NotFoundError } from "../errors/NotFoundError"
import { ConflictError } from "../errors/ConflictError"

export async function findAll() {
  return repository.findAll()
}

export async function findAllAtivos() {
  return repository.findAllAtivos()
}

export async function findById(id: number) {
  const professor = await repository.findById(id)
  if (!professor) throw new NotFoundError("Professor não encontrado.")
  return professor
}

export async function create(data: CreateProfessorDto) {
  return repository.create(data)
}

export async function update(id: number, data: UpdateProfessorDto) {
  await findById(id)
  return repository.update(id, data)
}

/**
 * Se o professor tiver aulas vinculadas, inativa em vez de apagar.
 * Se não tiver aulas, apaga do banco.
 */
export async function remove(id: number) {
  const professor = await findById(id)
  const aulasVinculadas = (professor as any).aulas ?? []

  if (aulasVinculadas.length > 0) {
    throw new ConflictError(
      `Este professor possui ${aulasVinculadas.length} aula(s) vinculada(s). ` +
      `Reatribua-as antes de excluir, ou inative o professor.`
    )
  }

  return repository.remove(id)
}

/** Inativa sem remover do banco */
export async function inativar(id: number) {
  await findById(id)
  return repository.update(id, { ativo: false })
}

/** Reativa */
export async function reativar(id: number) {
  await findById(id)
  return repository.update(id, { ativo: true })
}
