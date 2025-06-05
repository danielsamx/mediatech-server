import { config } from "dotenv";
import { ConnectionPool, config as SQLConfig } from "mssql";
config();
const dbConfig: SQLConfig = {
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  server: process.env.DB_SERVER!,
  database: process.env.DB_DATABASE!,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

export async function connectDB(): Promise<ConnectionPool | string> {
  try {
    const pool = await new ConnectionPool(dbConfig).connect();
    return pool;
  } catch (error) {
    return "Error: Connection DBS Failed" + error;
  }
}
