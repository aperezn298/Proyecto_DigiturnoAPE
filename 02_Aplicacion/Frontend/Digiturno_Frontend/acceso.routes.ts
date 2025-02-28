import { Router } from "express";
import * as metodos from "../controllers/acceso.controller";
import * as validacion from "../middlewares/acceso.middleware"

const router = Router();

router.post("/iniciarSesion", validacion.iniciarSesion, metodos.iniciarSesion);
router.post("/enviarCodigo", validacion.enviarCodigoCorreo, metodos.enviarCodigoCorreo);
router.post("/validarCodigo", validacion.validarCodigo, metodos.validarCodigo);
router.post("/cambiarContrasena", validacion.cambiarContrasena, metodos.cambiarContrasena);

export default router;