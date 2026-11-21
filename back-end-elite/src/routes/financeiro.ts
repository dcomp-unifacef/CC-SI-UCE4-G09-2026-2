import { Router } from "express"
import * as controller from "../controllers/financeiroController"

const router = Router()

router.get("/", controller.retrieveAll)
router.get("/aluno/:alunoId", controller.retrieveByAluno)
router.get("/:id", controller.retrieveOne)
router.post("/", controller.create)
router.put("/:id", controller.update)
router.patch("/:id/pagar", controller.pagar)
router.delete("/:id", controller.remove)

export default router
