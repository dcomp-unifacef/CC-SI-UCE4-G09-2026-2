import { Router } from "express"
import rateLimit from "express-rate-limit"
import * as controller from "../controllers/authController"
import { autenticar } from "../middlewares/auth"

const router = Router()

function limitar(limite: number, janelaMinutos: number, mensagem: string, soFalhas = false) {
  return rateLimit({
    windowMs: janelaMinutos * 60 * 1000,
    limit: limite,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    skipSuccessfulRequests: soFalhas,
    message: { message: mensagem },
  })
}

const limiteLogin = limitar(10, 15, "Muitas tentativas de login. Tente novamente em alguns minutos.", true)
const limiteCadastro = limitar(10, 60, "Muitos cadastros a partir deste endereço. Tente novamente mais tarde.")
const limiteEsqueci = limitar(5, 60, "Muitos pedidos de redefinição. Tente novamente mais tarde.")
const limiteRedefinir = limitar(10, 15, "Muitas tentativas. Tente novamente em alguns minutos.")

router.post("/cadastro", limiteCadastro, controller.cadastro)          // pública
router.post("/login", limiteLogin, controller.login)                    // pública
router.get("/me", autenticar, controller.me)                            // autenticada
router.post("/esqueci-senha", limiteEsqueci, controller.esqueciSenha)   // pública
router.post("/redefinir-senha", limiteRedefinir, controller.redefinirSenha) // pública

export default router
