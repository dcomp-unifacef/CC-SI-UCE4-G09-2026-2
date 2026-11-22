import bcrypt from "bcryptjs"
import { createHash, randomBytes } from "node:crypto"
import * as usuarioRepository from "../repositories/usuarioRepository"
import { assinarToken } from "./tokenService"
import { env } from "../config/env"
import type { CadastroDto } from "../dto/auth/cadastroDto"
import type { LoginDto } from "../dto/auth/loginDto"
import type { EsqueciSenhaDto } from "../dto/auth/esqueciSenhaDto"
import type { RedefinirSenhaDto } from "../dto/auth/redefinirSenhaDto"
import { BadRequestError } from "../errors/BadRequestError"
import { ConflictError } from "../errors/ConflictError"
import { UnauthorizedError } from "../errors/UnauthorizedError"

const CUSTO_BCRYPT = 12
const SENHA_MIN = 8
const SENHA_MAX_BYTES = 72 // limite do bcrypt: o que passa disso seria ignorado
const RESET_VALIDADE_MS = 30 * 60 * 1000
const MSG_RESET_INVALIDO = "Token inválido ou expirado."
export const MSG_ESQUECI_SENHA =
  "Se o e-mail estiver cadastrado, enviaremos as instruções para redefinir a senha."

// Hash descartável: faz o login gastar o mesmo tempo com e-mail inexistente.
const HASH_FALSO = bcrypt.hashSync(randomBytes(16).toString("hex"), CUSTO_BCRYPT)

type UsuarioBase = { id: number; nome: string; email: string; papel: "ADMIN" | "ALUNO" }

/** Dados públicos: nunca expõe senhaHash. */
function publico(u: UsuarioBase) {
  return { id: u.id, nome: u.nome, email: u.email, papel: u.papel }
}

function normalizarEmail(valor: unknown): string {
  if (typeof valor !== "string" || !valor.trim()) throw new BadRequestError("Informe o e-mail.")
  const email = valor.trim().toLowerCase()
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new BadRequestError("E-mail inválido.")
  }
  return email
}

function validarSenha(valor: unknown, campo = "A senha"): string {
  if (typeof valor !== "string" || valor.length < SENHA_MIN) {
    throw new BadRequestError(`${campo} deve ter no mínimo ${SENHA_MIN} caracteres.`)
  }
  if (Buffer.byteLength(valor, "utf8") > SENHA_MAX_BYTES) {
    throw new BadRequestError(`${campo} é longa demais (máximo ${SENHA_MAX_BYTES} bytes).`)
  }
  return valor
}

function validarNome(valor: unknown): string {
  const nome = typeof valor === "string" ? valor.trim().replace(/\s+/g, " ") : ""
  if (nome.length < 2 || nome.length > 120) {
    throw new BadRequestError("Informe o nome (entre 2 e 120 caracteres).")
  }
  return nome
}

const sha256 = (v: string) => createHash("sha256").update(v).digest("hex")

export async function cadastro(dto: CadastroDto) {
  // Atenção: qualquer "papel" enviado no corpo é ignorado — só nome, email e senha são lidos.
  const nome = validarNome(dto?.nome)
  const email = normalizarEmail(dto?.email)
  const senha = validarSenha(dto?.senha)

  if (await usuarioRepository.findByEmail(email)) {
    throw new ConflictError("E-mail já cadastrado.")
  }

  const senhaHash = await bcrypt.hash(senha, CUSTO_BCRYPT)
  try {
    const usuario = await usuarioRepository.createAlunoComUsuario({ nome, email, senhaHash })
    return { token: assinarToken(usuario), usuario: publico(usuario) }
  } catch (e) {
    // Corrida entre duas requisições com o mesmo e-mail (violação de unicidade).
    if ((e as { code?: string })?.code === "P2002") throw new ConflictError("E-mail já cadastrado.")
    throw e
  }
}

export async function login(dto: LoginDto) {
  if (typeof dto?.email !== "string" || typeof dto?.senha !== "string" || !dto.email.trim() || !dto.senha) {
    throw new BadRequestError("Informe e-mail e senha.")
  }
  const email = dto.email.trim().toLowerCase()
  const usuario = await usuarioRepository.findByEmail(email)

  const senhaOk = await bcrypt.compare(dto.senha, usuario?.senhaHash ?? HASH_FALSO)
  if (!usuario || !usuario.ativo || !senhaOk) {
    throw new UnauthorizedError("E-mail ou senha inválidos.")
  }
  return { token: assinarToken(usuario), usuario: publico(usuario) }
}

export async function me(id: number) {
  const usuario = await usuarioRepository.findById(id)
  if (!usuario || !usuario.ativo) throw new UnauthorizedError("Sessão inválida.")
  return publico(usuario)
}

export async function esqueciSenha(dto: EsqueciSenhaDto): Promise<string> {
  const email = normalizarEmail(dto?.email)
  const usuario = await usuarioRepository.findByEmail(email)

  if (usuario && usuario.ativo) {
    const token = randomBytes(32).toString("hex")
    const expiraEm = new Date(Date.now() + RESET_VALIDADE_MS)
    await usuarioRepository.criarResetToken(usuario.id, sha256(token), expiraEm)

    const link = `${env.frontendUrl}/redefinir-senha?token=${token}`
    // Sem serviço de e-mail configurado: o link só aparece no console, fora de produção.
    if (!env.producao) {
      console.log(`[DEV] Link de redefinição de senha (${usuario.email}): ${link}`)
    }
  }
  // Resposta idêntica exista o e-mail ou não.
  return MSG_ESQUECI_SENHA
}

export async function redefinirSenha(dto: RedefinirSenhaDto) {
  const token = typeof dto?.token === "string" ? dto.token.trim() : ""
  if (!/^[a-f0-9]{64}$/.test(token)) throw new BadRequestError(MSG_RESET_INVALIDO)
  const novaSenha = validarSenha(dto?.novaSenha, "A nova senha")

  const registro = await usuarioRepository.findResetTokenByHash(sha256(token))
  if (!registro || registro.usadoEm || registro.expiraEm <= new Date()) {
    throw new BadRequestError(MSG_RESET_INVALIDO)
  }
  const usuario = await usuarioRepository.findById(registro.usuarioId)
  if (!usuario || !usuario.ativo) throw new BadRequestError(MSG_RESET_INVALIDO)

  const novaSenhaHash = await bcrypt.hash(novaSenha, CUSTO_BCRYPT)
  const ok = await usuarioRepository.consumirResetToken(registro.id, usuario.id, novaSenhaHash)
  if (!ok) throw new BadRequestError(MSG_RESET_INVALIDO)

  return { message: "Senha redefinida com sucesso." }
}
