import { Router } from "express"
import * as controller from "../controllers/notificacaoController"

const router = Router()

router.get("/", controller.retrieveAll)
router.patch("/marcar-todas-lidas", controller.marcarTodasLidas)
router.get("/:id", controller.retrieveOne)
router.post("/", controller.create)
router.put("/:id", controller.update)
router.patch("/:id/lida", controller.marcarLida)
router.delete("/:id", controller.remove)

export default router
