import "dotenv/config"

const jwtSecret = process.env.JWT_SECRET
if (!jwtSecret || jwtSecret.trim().length < 32) {
  throw new Error("JWT_SECRET não definida (ou muito curta, mínimo 32 caracteres). Configure o .env.")
}

const producao = process.env.NODE_ENV === "production"

// Quantos proxies confiáveis existem na frente do app (0/false = nenhum).
// Em produção atrás de um proxy reverso, defina TRUST_PROXY=1.
function lerTrustProxy(): number | false {
  const bruto = process.env.TRUST_PROXY
  if (bruto === undefined || bruto === "" || bruto === "false") return producao ? 1 : false
  const n = Number(bruto)
  return Number.isInteger(n) && n > 0 ? n : false
}

export const env = {
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "8h",
  frontendUrl: (process.env.FRONTEND_URL || "").replace(/\/+$/, ""),
  allowedOrigins: (process.env.ALLOWED_ORIGINS || "")
    .split(",").map((o) => o.trim().replace(/\/+$/, "")).filter(Boolean),
  producao,
  trustProxy: lerTrustProxy(),
}
