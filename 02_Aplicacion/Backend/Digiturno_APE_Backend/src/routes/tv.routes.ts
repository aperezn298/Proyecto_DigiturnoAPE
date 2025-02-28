import { Router } from "express";
import { createCalificacion, createTurno, turnoConCodigo, turnosTv } from "../controllers/tv.controller";
import * as validacion from "../middlewares/turno.middleware"
import { getServiciosDisponibles } from "../controllers/servicio.controller";
const router = Router();

router.get("/", turnosTv);
router.post("/", validacion.createTurno, createTurno);
router.post("/calificacion", validacion.createCalificacion, createCalificacion);
router.get("/usuario/:codigo", validacion.turnoConCodigo, turnoConCodigo);
router.get("/disponible", getServiciosDisponibles);
export default router;