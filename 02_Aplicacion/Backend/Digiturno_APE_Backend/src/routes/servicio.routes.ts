import { Router } from "express";
import * as validacion from "../middlewares/servicio.middleware"
import { cambiarEstado, createServicio, deleteServicio, getServicio, getServicios, getServiciosActivos, updateServicio } from "../controllers//servicio.controller";

const router = Router();

router.post("/", validacion.createServicio, createServicio);
router.get("/", getServicios);
router.get("/activos", getServiciosActivos);
router.put("/:id", validacion.updateServicio, updateServicio);
router.delete("/:id", validacion.deleteServicio, deleteServicio);
router.get("/:id", getServicio);
router.post("/cambiarEstado/:id", cambiarEstado);

export default router;