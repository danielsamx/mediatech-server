import { Request, Response } from "express";
import { UserService } from "../service/user.service";

export class UserController {
  static async getAll(req: Request, res: Response) {
    const result = await UserService.getAll();
    if (typeof result === "string") {
      return res.status(500).json({ message: result });
    }
    res.json(result);
  }

  static async create(req: Request, res: Response) {
    const { email, name, lastName, password } = req.body;

    if (!email || !name || !lastName || !password) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const result = await UserService.create({
      email,
      name,
      lastName,
      password,
    });
    if (result.startsWith("Error")) {
      return res.status(500).json({ message: result });
    }
    res.status(201).json({ message: result });
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña requeridos" });
    }

    const result = await UserService.login(email, password);
    if (
      result === "Usuario no encontrado" ||
      result === "Contraseña incorrecta"
    ) {
      return res.status(401).json({ message: result });
    } else if (result.startsWith("Error")) {
      return res.status(500).json({ message: result });
    }

    res.json({ message: result });
  }

  static async update(req: Request, res: Response) {
    const email = req.params.email;
    const updateData = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email es requerido en la ruta" });
    }

    const result = await UserService.update(email, updateData);

    if (result === "No hay campos para actualizar") {
      return res.status(400).json({ message: result });
    }

    if (result.startsWith("Error")) {
      return res.status(500).json({ message: result });
    }

    res.json({ message: result });
  }
}
