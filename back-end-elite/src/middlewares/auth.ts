import type { Request, Response, NextFunction } from "express"
import type { Papel } from "../../generated/prisma/client"
import { verificarToken } from "../services/tokenService"
import * as alunoRepository from "../repositories/alunoRepository"
import { UnauthorizedError } from "../errors/UnauthorizedError"
import { ForbiddenError } from "../errors/ForbiddenError"
import { NotFoundError } from "../errors/NotFoundError"

/** Exige "Authorization: Bearer <jwt>" válido. 401 se ausente, inválido ou expirado. */
export function autenticar(req: Request, _res: Response, next: NextFunction): void {
  try {
    const m = /^Bearer\s+(\S+)$/i.exec(req.headers.authorization ?? "")
    if (!m) throw new UnauthorizedError("Token não informado.")
    req.auth = verificarToken(m[1])
    next()
  } catch (error) {
    next(error)
  }
}

/** Exige um dos papéis informados. Deve vir DEPOIS de `autenticar`. 403 caso contrário. */
export function exigirPapel(...papeis: Papel[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.auth) return next(new UnauthorizedError())
    if (!papeis.includes(req.auth.papel)) return next(new ForbiddenError())
    next()
  }
}

/** Carrega o Aluno do usuário logado em `req.aluno`. 404 se o usuário não tiver cadastro de aluno. */
export async function carregarAluno(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.auth) throw new UnauthorizedError()
    const aluno = await alunoRepository.findByUsuarioId(req.auth.id)
    if (!aluno) throw new NotFoundError("Cadastro de aluno não encontrado para este usuário.")
    req.aluno = aluno
    next()
  } catch (error) {
    next(error)
  }
}
