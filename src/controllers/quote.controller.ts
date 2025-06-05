import { Request, Response } from "express";
import { QuoteService } from "../service/quote.service";
import { Quote } from "../models/quote.model";

export class QuoteController {
  static async getAll(req: Request, res: Response) {
    const result = await QuoteService.getAll();
    if (typeof result === "string")
      return res.status(500).json({ message: result });
    return res.json(result);
  }

  static async create(req: Request, res: Response) {
    const quote: Quote = req.body;
    const result = await QuoteService.create(quote);
    if (result.startsWith("Error"))
      return res.status(500).json({ message: result });
    return res.status(201).json({ message: result });
  }

  static async update(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const updateFields = req.body;
    const result = await QuoteService.postpone(id, updateFields);
    if (result.startsWith("Error"))
      return res.status(500).json({ message: result });
    return res.json({ message: result });
  }

  static async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const result = await QuoteService.delete(id);
    if (result.startsWith("Error"))
      return res.status(500).json({ message: result });
    return res.status(204).send();
  }
}
