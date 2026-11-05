import { Router } from "express";
import * as controller from "../controllers/campeonatoController";

const router = Router();
router.get("/", controller.retrieveAll);
router.get("/:id", controller.retrieveOne);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);
router.post("/:id/inscricoes", controller.inscreverAluno);
router.delete("/:id/inscricoes/:alunoId", controller.removerInscricao);

export default router;
