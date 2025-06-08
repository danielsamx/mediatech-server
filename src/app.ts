import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors, { CorsOptions } from "cors";
import userRoutes from "./routes/user.route";
import quoteRoutes from "./routes/quote.route";
import caseRoutes from "./routes/case.route";
import { setupSwagger } from "./docs/swagger";

dotenv.config();
const app = express();

const corsOptions: CorsOptions = {
  origin: "*", // o puedes restringir a un dominio específico
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsOptions));
app.use(express.json());

setupSwagger(app);
app.use("/usuario", userRoutes);
app.use("/cita", quoteRoutes);
app.use("/caso", caseRoutes);

const PORT = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello World");
});

app
  .listen(PORT, () => {
    console.log("Server running at PORT:", PORT);
  })
  .on("error", (error: Error) => {
    throw new Error(error.message);
  });
