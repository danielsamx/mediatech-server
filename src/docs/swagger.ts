import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mediatech API",
      version: "1.0.0",
      description: "Mediatech management API with TypeScript and Express",
    },
    components: {
      schemas: {
        Usuario: {
          type: "object",
          required: ["dni", "firstName", "lastName", "email", "password"],
          properties: {
            dni: { type: "string" },
            name: { type: "string" },
            lastName: { type: "string" },
            email: { type: "string" },
            phone: { type: "string" },
            address: { type: "string" },
            role: { type: "string" },
            photo: { type: "string" },
            password: { type: "string" },
          },
        },
        Cita: {
          type: "object",
          required: [
            "firstInvolved",
            "seconInvolved",
            "firstEmail",
            "secondEmail",
            "date",
            "startHour",
            "endHour",
            "description",
          ],
          properties: {
            firstInvolved: { type: "string" },
            secondInvolved: { type: "string" },
            firstEmail: { type: "string" },
            secondEmail: { type: "string" },
            date: { type: "string", format: "date" },
            startHour: { type: "string", format: "time" },
            endHour: { type: "string", format: "time" },
            description: { type: "string" },
          },
        },
        Caso: {
          type: "object",
          required: [
            "firstInvolved",
            "secondInvolved",
            "firstName",
            "firstLastName",
            "firstCellphone",
            "firstEmail",
            "secondName",
            "secondLastName",
            "secondCellphone",
            "secondEmail",
            "status",
            "subject",
            "subSubject",
            "description",
          ],
          properties: {
            firstInvolved: { type: "string" },
            secondInvolved: { type: "string" },
            firstName: { type: "string" },
            firstLastName: { type: "string" },
            firstCellphone: { type: "string" },
            firstEmail: { type: "string" },
            secondName: { type: "string" },
            secondLastName: { type: "string" },
            secondCellphone: { type: "string" },
            secondEmail: { type: "string" },
            status: { type: "string" },
            subject: { type: "string" },
            subSubject: { type: "string" },
            description: { type: "string" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};
