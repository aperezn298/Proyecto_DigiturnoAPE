import { Router } from "express";
import {createUsuario, deleteUsuario ,getUsuario ,getUsuarios, updateUsuario, EstadoUsuario}  from "../controllers/usuario.controller";

const router = Router();

router.get("/", getUsuarios);
router.get("/:id", getUsuario);
router.post("/", createUsuario);
router.put("/:id", updateUsuario);
router.put("/estado/:id", EstadoUsuario);
router.delete("/:id", deleteUsuario);
export default router;
