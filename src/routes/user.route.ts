import { Router, Request, Response, NextFunction } from "express";
import { UserController } from "../controllers/user.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Usuario
 *   description: Gestión de usuarios
 */

/**
 * @swagger
 * /usuario:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuario]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await UserController.getAll(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /usuario/registrar:
 *   post:
 *     summary: Registrar nuevo usuario
 *     tags: [Usuario]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               lastName:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 */
router.post(
  "/registrar",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await UserController.create(req, res);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /usuario/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Usuario]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       401:
 *         description: Usuario no encontrado o contraseña incorrecta
 */
router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await UserController.login(req, res);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /usuario/{email}:
 *   put:
 *     summary: Actualizar usuario excepto dni
 *     tags: [Usuario]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               lastName:
 *                 type: string
 *               cellphone:
 *                 type: string
 *               address:
 *                 type: string
 *               photo:
 *                 type: string
 *                 format: byte
 *               password:
 *                 type: string
 *               position:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       400:
 *         description: Error en datos enviados
 */
router.put(
  "/:email",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await UserController.update(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
