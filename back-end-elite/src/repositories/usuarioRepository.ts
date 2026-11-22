import { prisma } from "../database/client"

export function findByEmail(email: string) {
  return prisma.usuario.findUnique({ where: { email } })
}

export function findById(id: number) {
  return prisma.usuario.findUnique({ where: { id } })
}

/**
 * Cria o Usuario (sempre papel ALUNO) e o Aluno vinculado em UMA transação.
 * Os campos obrigatórios de Aluno recebem valores neutros; o CPF é um
 * marcador único (PENDENTE-<id>) para o administrador completar depois.
 */
export function createAlunoComUsuario(dados: { nome: string; email: string; senhaHash: string }) {
  return prisma.$transaction(async (tx) => {
    const usuario = await tx.usuario.create({
      data: { nome: dados.nome, email: dados.email, senhaHash: dados.senhaHash, papel: "ALUNO" },
    })

    await tx.aluno.create({
      data: {
        cpf: `PENDENTE-${usuario.id}`,
        nome: dados.nome,
        email: dados.email,
        idade: 0,
        peso: 0,
        altura: 0,
        valorMensalidade: 0,
        graduacao: "Iniciante",
        status: "INATIVO",
        modalidades: [],
        dataMatricula: new Date().toISOString().slice(0, 10),
        usuarioId: usuario.id,
      },
    })

    return usuario
  })
}

/** Invalida os pedidos abertos do usuário e cria o novo token (só o hash é guardado). */
export function criarResetToken(usuarioId: number, tokenHash: string, expiraEm: Date) {
  return prisma.$transaction(async (tx) => {
    const agora = new Date()
    await tx.resetSenhaToken.updateMany({
      where: { usuarioId, usadoEm: null, expiraEm: { gt: agora } },
      data: { expiraEm: agora },
    })
    return tx.resetSenhaToken.create({ data: { usuarioId, tokenHash, expiraEm } })
  })
}

export function findResetTokenByHash(tokenHash: string) {
  return prisma.resetSenhaToken.findUnique({ where: { tokenHash } })
}

/**
 * Consome o token e troca a senha de forma atômica.
 * Retorna false se o token já foi usado/expirou (inclusive em uso concorrente).
 */
export function consumirResetToken(tokenId: number, usuarioId: number, novaSenhaHash: string) {
  return prisma.$transaction(async (tx) => {
    const agora = new Date()
    const reivindicado = await tx.resetSenhaToken.updateMany({
      where: { id: tokenId, usadoEm: null, expiraEm: { gt: agora } },
      data: { usadoEm: agora },
    })
    if (reivindicado.count === 0) return false

    await tx.usuario.update({ where: { id: usuarioId }, data: { senhaHash: novaSenhaHash } })
    // Qualquer outro pedido ainda aberto deixa de valer.
    await tx.resetSenhaToken.updateMany({
      where: { usuarioId, usadoEm: null, expiraEm: { gt: agora } },
      data: { expiraEm: agora },
    })
    return true
  })
}

/** Usado pelo seed: cria o admin se não existir e NUNCA altera um usuário existente. */
export function upsertAdmin(dados: { nome: string; email: string; senhaHash: string }) {
  return prisma.usuario.upsert({
    where: { email: dados.email },
    update: {},
    create: { nome: dados.nome, email: dados.email, senhaHash: dados.senhaHash, papel: "ADMIN" },
  })
}

/**
 * Cria acesso (Usuario) para um Aluno já cadastrado pelo admin.
 * Gera senha aleatória e cria token de redefinição com validade de 72h.
 * Tudo em transação.
 */
export function criarAcessoParaAluno(
  alunoId: number,
  email: string,
  nome: string,
  senhaHash: string,
  tokenHash: string,
  expiraEm: Date
) {
  return prisma.$transaction(async (tx) => {
    // Criar o Usuario
    const usuario = await tx.usuario.create({
      data: { nome, email, senhaHash, papel: "ALUNO" },
    })

    // Vincular ao Aluno
    await tx.aluno.update({
      where: { id: alunoId },
      data: { usuarioId: usuario.id },
    })

    // Criar o token de redefinição
    await tx.resetSenhaToken.create({
      data: { usuarioId: usuario.id, tokenHash, expiraEm },
    })

    return usuario
  })
}
