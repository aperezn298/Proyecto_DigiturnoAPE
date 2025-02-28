import { Router } from "express";
import * as validacion from "../middlewares/tipoEmpleado.middleware"
import { getTiposEmpleado, createTipoEmpleado, updateTipoEmpleado, getTipoEmpleado, deleteTipoEmpleado, getEmpleadosPorTipo } from "../controllers/tipoEmpleado.controller";

const router = Router();

router.post("/", createTipoEmpleado);
router.get("/", getTiposEmpleado);
router.put("/:id", updateTipoEmpleado);
router.delete("/:id", validacion.deleteTipoEmpleado, deleteTipoEmpleado);
router.get("/:id", getTipoEmpleado);
router.get("/:id/empleados", getEmpleadosPorTipo);

export default router;