import { Router } from "express"
import { autenticar, exigirPapel } from "../middlewares/auth"
import * as controller from "../controllers/notificacaoController"

const router = Router()

router.get("/", autenticar, exigirPapel("ADMIN"), controller.retrieveAll)
router.patch("/marcar-todas-lidas", autenticar, exigirPapel("ADMIN"), controller.marcarTodasLidas)
router.get("/:id", autenticar, exigirPapel("ADMIN"), controller.retrieveOne)
router.post("/", autenticar, exigirPapel("ADMIN"), controller.create)
router.put("/:id", autenticar, exigirPapel("ADMIN"), controller.update)
router.patch("/:id/lida", autenticar, exigirPapel("ADMIN"), controller.marcarLida)
router.delete("/:id", autenticar, exigirPapel("ADMIN"), controller.remove)

export default router
