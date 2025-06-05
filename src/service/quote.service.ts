import { connectDB } from "../config/database";
import { Quote } from "../models/quote.model";

export class QuoteService {
  static async getAll(): Promise<Quote[] | string> {
    try {
      const pool = await connectDB();
      if (typeof pool === "string") return pool;
      const result = await pool.request().query(
        `SELECT 
         id, 
         first_involved, 
         second_involved, 
         CONVERT(varchar(10), [date], 23) AS date, 
         CONVERT(varchar(5), start_hour, 108) AS start_hour, 
         CONVERT(varchar(5), end_hour, 108) AS end_hour, 
         description, 
         i1.email AS email_first_involved, 
         i2.email AS email_second_involved 
       FROM Quote 
       LEFT JOIN Involved i1 ON first_involved = i1.dni 
       LEFT JOIN Involved i2 ON second_involved = i2.dni`
      );
      return result.recordset;
    } catch (error) {
      return "Error fetching quotes";
    }
  }

  static async create(quote: Quote): Promise<string> {
    try {
      const pool = await connectDB();
      if (typeof pool === "string") return pool;

      const overlapCheck = await pool
        .request()
        .input("date", quote.date)
        .input("startHour", quote.startHour)
        .input("endHour", quote.endHour).query(`
        SELECT * FROM Quote
        WHERE [date] = @date
        AND NOT (
          @endHour <= start_hour OR
          @startHour >= end_hour
        )
      `);

      if (overlapCheck.recordset.length > 0) {
        return "Ya existe una cita en ese horario";
      }
      await pool
        .request()
        .input("first_involved", quote.firstInvolved)
        .input("second_involved", quote.secondInvolved)
        .input("first_email", quote.firstEmail)
        .input("second_email", quote.secondEmail)
        .input("date", quote.date)
        .input("start_hour", quote.startHour)
        .input("end_hour", quote.endHour)
        .input("description", quote.description).query(`
        IF NOT EXISTS (SELECT 1 FROM Involved WHERE dni = @first_involved)
        BEGIN
            INSERT INTO Involved(dni, email) VALUES (@first_involved, @first_email);
        END
        IF NOT EXISTS (SELECT 1 FROM Involved WHERE dni = @second_involved)
        BEGIN
            INSERT INTO Involved(dni, email) VALUES (@second_involved, @second_email);
        END
        INSERT INTO Quote (first_involved, second_involved, [date], start_hour, end_hour, [description])
        VALUES (@first_involved, @second_involved, @date, @start_hour, @end_hour, @description);
      `);

      return "Cita agendada correctamente";
    } catch (error) {
      return "Error creating quote" + error;
    }
  }

  static async postpone(id: number, update: Partial<Quote>): Promise<string> {
    try {
      const pool = await connectDB();
      if (typeof pool === "string") return pool;

      const overlapCheck = await pool
        .request()
        .input("id", id)
        .input("date", update.date)
        .input("startHour", update.startHour)
        .input("endHour", update.endHour).query(`
        SELECT * FROM Quote
        WHERE [date] = @date
        AND id <> @id
        AND NOT (
          @endHour <= start_hour OR
          @startHour >= end_hour
        )
      `);

      if (overlapCheck.recordset.length > 0) {
        return "Ya existe una cita en ese nuevo horario";
      }

      await pool
        .request()
        .input("id", id)
        .input("date", update.date)
        .input("startHour", update.startHour)
        .input("endHour", update.endHour).query(`
        UPDATE Quote
        SET [date] = @date, start_hour = @startHour, end_hour = @endHour
        WHERE id = @id
      `);

      return "Cita pospuesta correctamente";
    } catch (error) {
      return `Error updating quote: ${error}`;
    }
  }

  static async delete(id: number): Promise<string> {
    try {
      const pool = await connectDB();
      if (typeof pool === "string") return pool;

      await pool
        .request()
        .input("id", id)
        .query("DELETE FROM Quote WHERE id = @id");

      return "Cita eliminada correctamente";
    } catch (error) {
      return `Error deleting quote: ${error}`;
    }
  }
}
