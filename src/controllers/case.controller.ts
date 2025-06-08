import { Request, Response } from "express";
import { CaseService } from "../service/case.service";
import { Case } from "../models/case.model";

export class CaseController {
  static async getAll(req: Request, res: Response) {
    const result = await CaseService.getAll();
    if (typeof result === "string")
      return res.status(500).json({ message: result });
    return res.json(result);
  }

  static async getById(req: Request, res: Response) {
    const id = req.params.id;
    const result = await CaseService.getById(id);
    if (typeof result === "string") {
      return res.status(500).json({ message: result });
    }
    if (!result) {
      return res.status(404).json({ message: "Caso no encontrado" });
    }
    return res.json(result);
  }

  static async create(req: Request, res: Response) {
    const caseData: Case = req.body;
    const result = await CaseService.create(caseData);
    if (result.startsWith("Error"))
      return res.status(500).json({ message: result });
    return res.status(201).json({ message: result });
  }

  static async update(req: Request, res: Response) {
    const id = req.params.id;
    const caseData = req.body;
    const result = await CaseService.update(id, caseData);
    console.log(caseData);
    if (result.startsWith("Error")) {
      return res.status(500).json({ message: result });
    }
    return res.json({ message: result });
  }
}
