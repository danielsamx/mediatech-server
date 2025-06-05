import { Router, Request, Response, NextFunction } from "express";
import { CaseController } from "../controllers/case.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Caso
 *   description: Gestión de casos
 */

/**
 * @swagger
 * /caso:
 *   get:
 *     summary: Obtener todos los casos
 *     tags: [Caso]
 *     responses:
 *       200:
 *         description: Lista de casos
 */
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await CaseController.getAll(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /caso:
 *   post:
 *     summary: Crear un nuevo caso
 *     tags: [Caso]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Caso'
 *     responses:
 *       201:
 *         description: Caso creado exitosamente
 */
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await CaseController.create(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /caso/{id}:
 *   put:
 *     summary: Actualizar un caso existente
 *     tags: [Caso]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Caso'
 *     responses:
 *       200:
 *         description: Caso actualizado exitosamente
 */
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await CaseController.update(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
