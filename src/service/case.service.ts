import { connectDB } from "../config/database";
import { Case } from "../models/case.model";

export class CaseService {
  static async getAll(): Promise<Case[] | string> {
    try {
      const pool = await connectDB();
      if (typeof pool === "string") return pool;

      const result = await pool.request().query(`
        SELECT 
          id, 
          first_involved, 
          second_involved, 
          status,
          subject,
          subsubject,
          description, 
          i1.name + ' ' + i1.lastname AS name_first_involved, 
          i2.name + ' ' + i2.lastname AS name_second_involved
        FROM [Case]
        LEFT JOIN Involved i1 ON first_involved = i1.dni 
        LEFT JOIN Involved i2 ON second_involved = i2.dni;
      `);

      return result.recordset;
    } catch (error) {
      return "Error fetching quotes";
    }
  }

  static async create(caseData: Case): Promise<string> {
    try {
      const pool = await connectDB();
      if (typeof pool === "string") return pool;

      await pool
        .request()
        // Inputs de primer involucrado
        .input("first_involved", caseData.firstInvolved)
        .input("first_name", caseData.firstName)
        .input("first_lastname", caseData.firstLastName)
        .input("first_cellphone", caseData.firstCellphone)
        .input("first_email", caseData.firstEmail)
        // Inputs de segundo involucrado
        .input("second_involved", caseData.secondInvolved)
        .input("second_name", caseData.secondName)
        .input("second_lastname", caseData.secondLastName)
        .input("second_cellphone", caseData.secondCellphone)
        .input("second_email", caseData.secondEmail)
        // Inputs del caso
        .input("status", caseData.status)
        .input("subject", caseData.subject)
        .input("subsubject", caseData.subSubject)
        .input("description", caseData.description).query(`
          -- Primer involucrado
          IF NOT EXISTS (SELECT 1 FROM Involved WHERE dni = @first_involved)
          BEGIN
              INSERT INTO Involved(dni, name, lastname, cellphone, email)
              VALUES (@first_involved, @first_name, @first_lastname, @first_cellphone, @first_email);
          END
          ELSE
          BEGIN
              UPDATE Involved
              SET name = @first_name, lastname = @first_lastname, cellphone = @first_cellphone, email = @first_email
              WHERE dni = @first_involved;
          END

          -- Segundo involucrado
          IF NOT EXISTS (SELECT 1 FROM Involved WHERE dni = @second_involved)
          BEGIN
              INSERT INTO Involved(dni, name, lastname, cellphone, email)
              VALUES (@second_involved, @second_name, @second_lastname, @second_cellphone, @second_email);
          END
          ELSE
          BEGIN
              UPDATE Involved
              SET name = @second_name, lastname = @second_lastname, cellphone = @second_cellphone, email = @second_email
              WHERE dni = @second_involved;
          END

          -- Inserta el caso
          INSERT INTO [Case](first_involved, second_involved, status, subject, subsubject, description)
          VALUES (@first_involved, @second_involved, @status, @subject, @subsubject, @description);
        `);

      return "Caso guardado con éxito";
    } catch (error) {
      return "Error creating case: " + error;
    }
  }

  static async update(
    id: string,
    caseData: Partial<Omit<Case, "email" | "dni">>
  ): Promise<string> {
    try {
      const pool = await connectDB();
      if (typeof pool === "string") return pool;

      await pool
        .request()
        .input("id", id)
        .input("first_involved", caseData.firstInvolved)
        .input("second_involved", caseData.secondInvolved)
        .input("first_cellphone", caseData.firstCellphone)
        .input("first_email", caseData.firstEmail)
        .input("second_cellphone", caseData.secondCellphone)
        .input("second_email", caseData.secondEmail)
        .input("status", caseData.status)
        .input("subject", caseData.subject)
        .input("subsubject", caseData.subSubject)
        .input("description", caseData.description).query(`
        UPDATE Involved 
        SET cellphone = @first_cellphone, email = @first_email 
        WHERE dni = @first_involved;

        UPDATE Involved 
        SET cellphone = @second_cellphone, email = @second_email 
        WHERE dni = @second_involved;

        UPDATE [Case]
        SET 
          [status] = @status,
          subject = @subject,
          subsubject = @subsubject,
          [description] = @description
        WHERE id = @id;
      `);

      return "Caso actualizado con éxito";
    } catch (error) {
      return "Error al actualizar el caso: " + error;
    }
  }
}
