import type { Aluno, Papel } from "../../generated/prisma/client"

declare global {
  namespace Express {
    interface Request {
      /** Preenchido pelo middleware `autenticar` a partir do JWT. */
      auth?: { id: number; papel: Papel }
      /** Preenchido pelo middleware `carregarAluno`. */
      aluno?: Aluno
    }
  }
}

export {}
