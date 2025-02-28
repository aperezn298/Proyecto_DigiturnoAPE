import { Router } from "express";
import {EstadoServicio, getServicio, createServicio, getServicios, updateServicio}  from "../controllers/servicios.controller";

const router = Router();

router.get("/", getServicios);
router.get("/:id", getServicio);
router.post("/", createServicio);
router.put("/:id", updateServicio);
router.put("/estado/:id", EstadoServicio);

export default router;
