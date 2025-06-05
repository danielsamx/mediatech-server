import { Router, Request, Response, NextFunction } from "express";
import { QuoteController } from "../controllers/quote.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Cita
 *   description: Gestión de citas
 */

/**
 * @swagger
 * /cita:
 *   get:
 *     summary: Obtener todas las citas
 *     tags: [Cita]
 *     responses:
 *       200:
 *         description: Lista de citas
 */
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await QuoteController.getAll(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /cita:
 *   post:
 *     summary: Agendar una nueva cita
 *     tags: [Cita]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cita'
 *     responses:
 *       201:
 *         description: Cita agendada exitosamente
 */
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await QuoteController.create(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /cita/{id}:
 *   put:
 *     summary: Posponer una cita
 *     tags: [Cita]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               startHour:
 *                 type: string
 *                 format: time
 *               endHour:
 *                 type: string
 *                 format: time
 *     responses:
 *       200:
 *         description: Cita pospuesta exitosamente
 */
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await QuoteController.update(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /cita/{id}:
 *   delete:
 *     summary: Eliminar una cita
 *     tags: [Cita]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Quote deleted
 */
router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await QuoteController.delete(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
