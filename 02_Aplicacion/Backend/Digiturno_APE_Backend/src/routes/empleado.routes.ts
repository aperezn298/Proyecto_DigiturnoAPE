import { Router } from "express";
import * as validacion from "../middlewares/empleado.middleware"
import { getEmpleados, createEmpleado, getEmpleado, updateEmpleado, deleteEmpleado, asignarServicios, getEmpleadosDTO, cambiarEstado, cambiarContrasena, cambiarDatos } from "../controllers/empleado.controller";

const router = Router();

router.post("/",validacion.createEmpleado, createEmpleado);
router.post("/cambiarEstado/:id", cambiarEstado);
router.get("/", getEmpleados);
router.get("/dto", getEmpleadosDTO);
router.put("/:id", updateEmpleado);
router.delete("/:id", validacion.deleteEmpleado, deleteEmpleado);
router.post("/servicios/:id", validacion.asignarServicios, asignarServicios);
router.get("/:id", getEmpleado);
router.post("/cambiarContrasena", validacion.cambiarContrasena, cambiarContrasena)
router.post("/cambiarDatos/:id", validacion.cambiarDatos, cambiarDatos)

export default router;