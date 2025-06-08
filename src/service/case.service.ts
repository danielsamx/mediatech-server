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
          description,
          register_date,
          register_time,
          i1.name + ' ' + i1.lastname AS name_first_involved, 
          i2.name + ' ' + i2.lastname AS name_second_involved
        FROM [Case]
        LEFT JOIN Involved i1 ON first_involved = i1.dni 
        LEFT JOIN Involved i2 ON second_involved = i2.dni;
      `);

      return result.recordset;
    } catch (error) {
      return "Error fetching cases";
    }
  }

  static async getById(id: string): Promise<Case | string> {
    try {
      const pool = await connectDB();
      if (typeof pool === "string") return pool;

      const result = await pool.request().input("id", id).query(`
        SELECT 
          c.id, 
          c.first_involved, 
          c.second_involved, 
          i1.name AS first_name,
          i1.lastname AS first_lastname,
          i1.cellphone AS first_cellphone,
          i1.email AS first_email,
          i2.name AS second_name,
          i2.lastname AS second_lastname,
          i2.cellphone AS second_cellphone,
          i2.email AS second_email,
          c.status,
          c.subject,
          c.description
        FROM [Case] c
        LEFT JOIN Involved i1 ON c.first_involved = i1.dni 
        LEFT JOIN Involved i2 ON c.second_involved = i2.dni
        WHERE c.id = @id;
      `);

      return result.recordset[0];
    } catch (error) {
      return "Error fetching case";
    }
  }

  static async create(caseData: Case): Promise<string> {
    try {
      const pool = await connectDB();
      if (typeof pool === "string") return pool;

      await pool
        .request()
        .input("id", caseData.id)
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
          INSERT INTO [Case](first_involved, second_involved, status, subject, description)
          VALUES (@first_involved, @second_involved, @status, @subject, @description);
          UPDATE Quote SET [status] = 'inactivo' WHERE id = @id;
        `);

      return "Caso guardado con éxito";
    } catch (error) {
      return "Error creating case: " + error;
    }
  }

  static async update(id: string, data: any): Promise<string> {
    try {
      const {
        first_involved,
        second_involved,
        first_cellphone,
        first_email,
        second_cellphone,
        second_email,
        status,
        subject,
        description,
      } = data;

      const pool = await connectDB();
      if (typeof pool === "string") return pool;

      await pool
        .request()
        .input("id", id)
        .input("first_involved", first_involved)
        .input("second_involved", second_involved)
        .input("first_cellphone", first_cellphone)
        .input("first_email", first_email)
        .input("second_cellphone", second_cellphone)
        .input("second_email", second_email)
        .input("status", status)
        .input("subject", subject)
        .input("description", description).query(`
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
          [description] = @description
        WHERE id = @id;
      `);

      return "Caso actualizado con éxito";
    } catch (error) {
      return "Error al actualizar el caso: " + error;
    }
  }
}
