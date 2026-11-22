import { Router } from "express"
import { autenticar, exigirPapel } from "../middlewares/auth"
import * as controller from "../controllers/campeonatoController"

const router = Router()

router.get("/", autenticar, exigirPapel("ADMIN"), controller.retrieveAll)
router.get("/:id", autenticar, exigirPapel("ADMIN"), controller.retrieveOne)
router.post("/", autenticar, exigirPapel("ADMIN"), controller.create)
router.put("/:id", autenticar, exigirPapel("ADMIN"), controller.update)
router.delete("/:id", autenticar, exigirPapel("ADMIN"), controller.remove)
router.post("/:id/inscricoes", autenticar, exigirPapel("ADMIN"), controller.inscreverAluno)
router.delete("/:id/inscricoes/:alunoId", autenticar, exigirPapel("ADMIN"), controller.removerInscricao)

export default router
