import { Router } from "express"
import { autenticar, exigirPapel } from "../middlewares/auth"
import * as controller from "../controllers/alunoController"

const router = Router()

router.get("/", autenticar, exigirPapel("ADMIN"), controller.retrieveAll)
router.get("/:id", autenticar, exigirPapel("ADMIN"), controller.retrieveOne)
router.post("/", autenticar, exigirPapel("ADMIN"), controller.create)
router.put("/:id", autenticar, exigirPapel("ADMIN"), controller.update)
router.delete("/:id", autenticar, exigirPapel("ADMIN"), controller.remove)
router.post("/:id/criar-acesso", autenticar, exigirPapel("ADMIN"), controller.criarAcesso)

export default router
