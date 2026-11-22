import jwt from "jsonwebtoken"
import type { SignOptions } from "jsonwebtoken"
import type { Papel } from "../../generated/prisma/client"
import { env } from "../config/env"
import { UnauthorizedError } from "../errors/UnauthorizedError"

export interface TokenPayload {
  id: number
  papel: Papel
}

/** Assina o JWT com sub = id do usuário e o papel no payload. */
export function assinarToken(usuario: { id: number; papel: Papel }): string {
  return jwt.sign({ papel: usuario.papel }, env.jwtSecret, {
    algorithm: "HS256",
    subject: String(usuario.id),
    expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
  })
}

/** Valida assinatura e expiração. Qualquer falha vira 401. */
export function verificarToken(token: string): TokenPayload {
  try {
    const p = jwt.verify(token, env.jwtSecret, { algorithms: ["HS256"] })
    if (typeof p === "string") throw new Error("payload inválido")
    const id = Number(p.sub)
    const papel = p.papel
    if (!Number.isInteger(id) || id <= 0 || (papel !== "ADMIN" && papel !== "ALUNO")) {
      throw new Error("claims inválidas")
    }
    return { id, papel }
  } catch {
    throw new UnauthorizedError("Token inválido ou expirado.")
  }
}
