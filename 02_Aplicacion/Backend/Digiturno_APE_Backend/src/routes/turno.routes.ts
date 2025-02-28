import { Router } from "express";
import { getTurno, getTurnosDTO, getTurnosPorServiciosEmpleado, cambiarEstado, cambiarModulo, getTurnosPorFechas,  } from "../controllers/turno.controller";
import * as validacion from "../middlewares/turno.middleware"

const router = Router();

router.get("/:id", getTurno);
router.get("/turnos/dto", getTurnosDTO);
router.get("/empleado/:id", getTurnosPorServiciosEmpleado);
router.post("/:id", validacion.cambiarEstado, cambiarEstado);
router.post("/modulo/:id", validacion.cambiarModulo, cambiarModulo);
router.post("/turnosFechas/:query", getTurnosPorFechas);

export default router;