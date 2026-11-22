// Cria o usuário ADMIN a partir de ADMIN_NOME, ADMIN_EMAIL e ADMIN_SENHA (.env).
// Idempotente: se o e-mail já existir, NADA é alterado (a senha não é sobrescrita).
// Uso: npm run seed:admin
import "dotenv/config"
import bcrypt from "bcryptjs"
import { prisma } from "../src/database/client"
import * as usuarioRepository from "../src/repositories/usuarioRepository"

async function main() {
  const nome = (process.env.ADMIN_NOME ?? "").trim()
  const email = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase()
  const senha = process.env.ADMIN_SENHA ?? ""

  if (nome.length < 2) throw new Error("ADMIN_NOME não definido no .env.")
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("ADMIN_EMAIL ausente ou inválido no .env.")
  if (senha.length < 8 || Buffer.byteLength(senha, "utf8") > 72) {
    throw new Error("ADMIN_SENHA deve ter de 8 caracteres até 72 bytes.")
  }

  const existente = await usuarioRepository.findByEmail(email)
  if (existente) {
    const aviso = existente.papel === "ADMIN" ? "" : ` ATENÇÃO: o papel dele é ${existente.papel}, não ADMIN (não foi alterado).`
    console.log(`Admin já existe (id ${existente.id}). Nada foi alterado.${aviso}`)
    return
  }

  const senhaHash = await bcrypt.hash(senha, 12)
  const admin = await usuarioRepository.upsertAdmin({ nome, email, senhaHash })
  console.log(`Admin criado (id ${admin.id}, papel ${admin.papel}).`)
}

main()
  .catch((e) => {
    console.error("Falha no seed:", e instanceof Error ? e.message : e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
