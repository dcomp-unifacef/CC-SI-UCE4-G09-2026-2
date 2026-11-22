import { Router } from "express"
import { autenticar, exigirPapel } from "../middlewares/auth"
import * as controller from "../controllers/aulaParticularController"

const router = Router()

// CRUD
router.get("/", autenticar, exigirPapel("ADMIN"), controller.retrieveAll)
router.get("/:id", autenticar, exigirPapel("ADMIN"), controller.retrieveOne)
router.post("/", autenticar, exigirPapel("ADMIN"), controller.create)
router.put("/:id", autenticar, exigirPapel("ADMIN"), controller.update)
router.delete("/:id", autenticar, exigirPapel("ADMIN"), controller.remove)

// Agendamento individual
router.post("/agendar", autenticar, exigirPapel("ADMIN"), controller.agendar)

// Agendamento recorrente
router.post("/agendar-recorrente", autenticar, exigirPapel("ADMIN"), controller.agendarRecorrente)

// Consultar recorrência
router.get("/recorrencias/:id", autenticar, exigirPapel("ADMIN"), controller.retrieveRecorrencia)

// Cancelar recorrência
router.patch("/recorrencias/:id/cancelar", autenticar, exigirPapel("ADMIN"), controller.cancelarRecorrencia)

// Cancelar aula individual
router.patch("/:id/cancelar", autenticar, exigirPapel("ADMIN"), controller.cancelar)

// Registrar presença
router.patch("/:id/registrar", autenticar, exigirPapel("ADMIN"), controller.registrar)

export default router
