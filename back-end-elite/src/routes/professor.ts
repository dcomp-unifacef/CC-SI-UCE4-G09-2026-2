import { Router } from "express"
import * as controller from "../controllers/professorController"

const router = Router()

router.get("/",           controller.retrieveAll)         // Listar todos
router.get("/ativos",     controller.retrieveAllAtivos)   // Listar só ativos (para selects)
router.get("/:id",        controller.retrieveOne)         // Buscar por id
router.post("/",          controller.create)              // Criar
router.put("/:id",        controller.update)              // Editar
router.delete("/:id",     controller.remove)              // Excluir (bloqueado se tiver aulas)
router.patch("/:id/inativar",  controller.inativar)       // Inativar (mantém no banco)
router.patch("/:id/reativar",  controller.reativar)       // Reativar

export default router
