import * as repository from "../repositories/alunoRepository"

import type {Aluno} from "../../generated/prisma/client"
import type { CreateAlunoDto } from "../dto/aluno/createAlunoDto"
import type { UpdateAlunoDto } from "../dto/aluno/updateAlunoDto"

import bcrypt from "bcryptjs"
import { createHash, randomBytes } from "node:crypto"
import * as usuarioRepository from "../repositories/usuarioRepository"
import { env } from "../config/env"
import { BadRequestError } from "../errors/BadRequestError"
import { ConflictError } from "../errors/ConflictError"
import { NotFoundError } from "../errors/NotFoundError";

export async function findAll(): Promise<Aluno[]> {
    return repository.findAll();
}

export async function findById(
    id: number
): Promise<Aluno>{
    const aluno = await repository.findById(id);
    if (!aluno){
        throw new NotFoundError("Aluno não encontrado.");
    }
    return aluno;
}

export async function create(
    data: CreateAlunoDto
): Promise<Aluno> {
    return repository.create(data);
}

export async function update(
    id: number,
    data: UpdateAlunoDto
): Promise<Aluno> {
    await findById(id);

    return repository.update(id, data);
}

export async function remove(
 id: number
): Promise<Aluno> {
    await findById(id);

    return repository.remove(id);
}

const VALIDADE_ACESSO_MS = 72 * 60 * 60 * 1000 // 72 horas

/**
 * Cria acesso web para um aluno já cadastrado pelo admin.
 * Retorna o link de redefinição de senha (exibido no console em dev).
 */
export async function criarAcessoParaAluno(alunoId: number): Promise<{ message: string; link?: string }> {
  const aluno = await repository.findById(alunoId)
  if (!aluno) throw new NotFoundError("Aluno não encontrado.")

  if (aluno.usuarioId) throw new ConflictError("Este aluno já possui acesso.")

  if (!aluno.email || aluno.email.trim() === "") {
    throw new BadRequestError("O aluno não possui e-mail cadastrado. Cadastre um e-mail antes de criar o acesso.")
  }

  const email = aluno.email.trim().toLowerCase()

  // Verificar se o e-mail já está em uso
  const usuarioExistente = await usuarioRepository.findByEmail(email)
  if (usuarioExistente) {
    throw new ConflictError("Este e-mail já está vinculado a outro usuário.")
  }

  // Gerar senha aleatória (que o aluno não conhecerá)
  const senhaAleatoria = randomBytes(32).toString("hex")
  const senhaHash = await bcrypt.hash(senhaAleatoria, 12)

  // Gerar token de redefinição
  const token = randomBytes(32).toString("hex")
  const tokenHash = createHash("sha256").update(token).digest("hex")
  const expiraEm = new Date(Date.now() + VALIDADE_ACESSO_MS)

  await usuarioRepository.criarAcessoParaAluno(alunoId, email, aluno.nome, senhaHash, tokenHash, expiraEm)

  const link = `${env.frontendUrl}/redefinir-senha?token=${token}`

  // Em dev, mostrar o link no console
  if (!env.producao) {
    console.log(`[DEV] Link de criação de acesso para ${aluno.nome} (${email}): ${link}`)
    console.log(`     Válido por 72 horas.`)
  }

  return {
    message: "Acesso criado com sucesso. O aluno receberá um link para definir a senha.",
    link: !env.producao ? link : undefined,
  }
}
