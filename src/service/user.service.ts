import { connectDB } from "../config/database";
import { User } from "../models/user.model";
import bcrypt from "bcrypt";

export class UserService {
  static async getAll(): Promise<User[] | string> {
    try {
      const pool = await connectDB();
      if (typeof pool === "string") return pool;

      const result = await pool.request().query("SELECT * FROM [User]");
      return result.recordset;
    } catch (error) {
      return "Error fetching users " + error;
    }
  }

  static async create(
    user: Pick<User, "email" | "name" | "lastName" | "password">
  ): Promise<string> {
    try {
      const pool = await connectDB();
      if (typeof pool === "string") return pool;

      const existingUser = await pool
        .request()
        .input("email", user.email)
        .query(`SELECT 1 FROM [User] WHERE email = @email`);

      if (existingUser.recordset.length > 0) {
        return "El usuario ya existe";
      }

      const hashedPassword = await bcrypt.hash(user.password, 10);

      await pool
        .request()
        .input("email", user.email)
        .input("name", user.name)
        .input("lastname", user.lastName)
        .input("password", hashedPassword).query(`
        INSERT INTO [User] (email, [name], lastname, [password])
        VALUES (@email, @name, @lastname, @password)
      `);

      return "Usuario creado exitosamente";
    } catch (error) {
      return "Error creating user " + error;
    }
  }

  static async login(email: string, password: string): Promise<string> {
    try {
      const pool = await connectDB();
      if (typeof pool === "string") return pool;

      const result = await pool
        .request()
        .input("email", email)
        .query("SELECT [password] FROM [User] WHERE email = @email");

      if (result.recordset.length === 0) {
        return "Usuario no encontrado";
      }

      const hashedPassword = result.recordset[0].password;
      const passwordMatch = await bcrypt.compare(password, hashedPassword);

      if (!passwordMatch) {
        return "Contraseña incorrecta";
      }

      return "Inicio de sesión exitoso";
    } catch (error) {
      return "Error al iniciar sesión " + error;
    }
  }

  static async update(
    email: string,
    updateData: Partial<Omit<User, "email" | "dni">>
  ): Promise<string> {
    try {
      const pool = await connectDB();
      if (typeof pool === "string") return pool;

      let hashedPassword: string | undefined;
      if (updateData.password) {
        hashedPassword = await bcrypt.hash(updateData.password, 10);
      }

      const fieldsToUpdate: string[] = [];
      const request = pool.request().input("email", email);

      if (updateData.name !== undefined) {
        fieldsToUpdate.push("[name] = @name");
        request.input("name", updateData.name);
      }
      if (updateData.lastName !== undefined) {
        fieldsToUpdate.push("lastname = @lastname");
        request.input("lastname", updateData.lastName);
      }
      if (updateData.phone !== undefined) {
        fieldsToUpdate.push("cellphone = @cellphone");
        request.input("cellphone", updateData.phone);
      }
      if (updateData.address !== undefined) {
        fieldsToUpdate.push("[address] = @address");
        request.input("address", updateData.address);
      }
      if (updateData.photo !== undefined) {
        fieldsToUpdate.push("photo = @photo");
        request.input("photo", updateData.photo);
      }
      if (updateData.role !== undefined) {
        fieldsToUpdate.push("position = @position");
        request.input("position", updateData.role);
      }
      if (hashedPassword !== undefined) {
        fieldsToUpdate.push("[password] = @password");
        request.input("password", hashedPassword);
      }

      if (fieldsToUpdate.length === 0) {
        return "No hay campos para actualizar";
      }

      const query = `
        UPDATE [User]
        SET ${fieldsToUpdate.join(", ")}
        WHERE email = @email
      `;

      await request.query(query);

      return "Usuario actualizado correctamente";
    } catch (error) {
      return "Error actualizando el usuario";
    }
  }
}
