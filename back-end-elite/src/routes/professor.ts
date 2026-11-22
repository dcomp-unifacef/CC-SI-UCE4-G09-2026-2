import { Router } from "express"
import { autenticar, exigirPapel } from "../middlewares/auth"
import * as controller from "../controllers/professorController"

const router = Router()

router.get("/", autenticar, exigirPapel("ADMIN"), controller.retrieveAll)
router.get("/ativos", autenticar, exigirPapel("ADMIN"), controller.retrieveAllAtivos)
router.get("/:id", autenticar, exigirPapel("ADMIN"), controller.retrieveOne)
router.post("/", autenticar, exigirPapel("ADMIN"), controller.create)
router.put("/:id", autenticar, exigirPapel("ADMIN"), controller.update)
router.delete("/:id", autenticar, exigirPapel("ADMIN"), controller.remove)
router.patch("/:id/inativar", autenticar, exigirPapel("ADMIN"), controller.inativar)
router.patch("/:id/reativar", autenticar, exigirPapel("ADMIN"), controller.reativar)

export default router
