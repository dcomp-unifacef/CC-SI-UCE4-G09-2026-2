import { Router } from "express";
import * as controller from "../controllers/aulaParticularController";

const router = Router();

// CRUD
router.get("/", controller.retrieveAll);
router.get("/:id", controller.retrieveOne);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

// Agendamento individual
router.post("/agendar", controller.agendar);

// Agendamento recorrente
router.post(
    "/agendar-recorrente",
    controller.agendarRecorrente
);

// Consultar recorrência
router.get(
    "/recorrencias/:id",
    controller.retrieveRecorrencia
);

// Cancelar recorrência
router.patch(
    "/recorrencias/:id/cancelar",
    controller.cancelarRecorrencia
);

// Cancelar aula individual
router.patch("/:id/cancelar", controller.cancelar);

// Registrar presença
router.patch("/:id/registrar", controller.registrar);

export default router;