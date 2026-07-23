import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";
import fs from "fs";
import path from "path";
const isProd = process.env.NODE_ENV === "production";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Matrimony API",
      version: "1.0.0",
      description:
        "REST API documentation for the Matrimony Application.",
      contact: {
        name: "Muskan Mujavar",
        email: "atisnodejsdeveloper@example.com",
      },
      license: {
        name: "MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:8080",
        description: "Development Server",
      },
      {
        url: "http://31.97.207.6:4444",
        description: "Staging Server",
      },
       {
        url: "https://matrimony-app-qma8.onrender.com",
        description: "Production Server",
      },
    ],
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: "Onboarding",
        description: "Endpoints for managing app onboarding screens/steps shown to users on first launch.",
      },
      {
        name: "Authentication",
        description: "Authentication related endpoints",
      },
      {
        name: "Profile Details",
        description: "Matrimony profile details management endpoints for creating, retrieving, updating, and managing member profile details and photos.",
      },
      {
        name: "Home",
        description: "Endpoints for discovering matrimony profiles, browsing recommended matches, and applying search and filter criteria.",
      },
      {
        name: "Admin Authentication",
        description:
          "Administrative endpoints for secure admin authentication and management of master data, including locations, qualifications, religions, heights, and other configuration data used throughout the matrimony platform.",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      // schemas: {
      //   User: {
      //     type: "object",
      //     properties: {
      //       _id: {
      //         type: "string",
      //         description: "User ID",
      //       },
      //       name: {
      //         type: "string",
      //         description: "User full name",
      //       },
      //       email: {
      //         type: "string",
      //         format: "email",
      //         description: "User email address",
      //       },
      //       phone: {
      //         type: "string",
      //         description: "User phone number",
      //       },
      //       status: {
      //         type: "string",
      //         enum: ["active", "inactive", "pending"],
      //         description: "User account status",
      //       },
      //       createdAt: {
      //         type: "string",
      //         format: "date-time",
      //       },
      //       updatedAt: {
      //         type: "string",
      //         format: "date-time",
      //       },
      //     },
      //   },
      //   Contact: {
      //     type: "object",
      //     properties: {
      //       _id: { type: "string", description: "Contact ID" },
      //       name: { type: "string" },
      //       email: { type: "string", format: "email" },
      //       phone: { type: "string" },
      //       subject: { type: "string" },
      //       message: { type: "string" },
      //       status: {
      //         type: "string",
      //         enum: ["pending", "approved", "rejected"],
      //       },
      //       isDeleted: { type: "boolean" },
      //       createdAt: { type: "string", format: "date-time" },
      //       updatedAt: { type: "string", format: "date-time" },
      //     },
      //   },
      //   ContactCreate: {
      //     type: "object",
      //     required: ["name", "email", "phone", "subject", "message"],
      //     properties: {
      //       name: { type: "string", example: "John Doe" },
      //       email: {
      //         type: "string",
      //         format: "email",
      //         example: "john@example.com",
      //       },
      //       phone: { type: "string", example: "+1 555-0123" },
      //       subject: { type: "string", example: "Order inquiry" },
      //       message: {
      //         type: "string",
      //         example: "I have a question about my order.",
      //       },
      //     },
      //   },
      //   ContactUpdate: {
      //     type: "object",
      //     properties: {
      //       name: { type: "string" },
      //       email: { type: "string", format: "email" },
      //       phone: { type: "string" },
      //       subject: { type: "string" },
      //       message: { type: "string" },
      //       status: {
      //         type: "string",
      //         enum: ["pending", "approved", "rejected"],
      //       },
      //     },
      //   },
      //   HelpSupport: {
      //     type: "object",
      //     properties: {
      //       _id: { type: "string" },
      //       content: { type: "string" },
      //       createdAt: { type: "string", format: "date-time" },
      //       updatedAt: { type: "string", format: "date-time" },
      //     },
      //   },
      //   HelpSupportUpdate: {
      //     type: "object",
      //     required: ["content"],
      //     properties: {
      //       content: {
      //         type: "string",
      //         example: "<p>Help and Support content goes here.</p>",
      //       },
      //     },
      //   },
      //   Category: {
      //     type: "object",
      //     properties: {
      //       _id: {
      //         type: "string",
      //         description: "Category ID",
      //       },
      //       name: {
      //         type: "string",
      //         description: "Category name",
      //       },
      //       description: {
      //         type: "string",
      //         description: "Category description",
      //       },
      //       image: {
      //         type: "string",
      //         description: "Category image URL",
      //       },
      //       status: {
      //         type: "string",
      //         enum: ["active", "inactive"],
      //         description: "Category status",
      //       },
      //     },
      //   },
      //   Banner: {
      //     type: "object",
      //     properties: {
      //       _id: {
      //         type: "string",
      //         description: "Banner ID",
      //       },
      //       title: {
      //         type: "string",
      //         description: "Banner title",
      //       },
      //       image: {
      //         type: "string",
      //         description: "Banner image URL",
      //       },
      //       link: {
      //         type: "string",
      //         description: "Banner link URL",
      //       },
      //       status: {
      //         type: "string",
      //         enum: ["active", "inactive"],
      //         description: "Banner status",
      //       },
      //     },
      //   },
      //   Error: {
      //     type: "object",
      //     properties: {
      //       success: {
      //         type: "boolean",
      //         example: false,
      //       },
      //       statusCode: {
      //         type: "integer",
      //         example: 400,
      //       },
      //       message: {
      //         type: "string",
      //         example: "Error message",
      //       },
      //       errorSources: {
      //         type: "array",
      //         items: {
      //           type: "object",
      //           properties: {
      //             path: {
      //               type: "string",
      //             },
      //             message: {
      //               type: "string",
      //             },
      //           },
      //         },
      //       },
      //     },
      //   },
      //   Success: {
      //     type: "object",
      //     properties: {
      //       success: {
      //         type: "boolean",
      //         example: true,
      //       },
      //       statusCode: {
      //         type: "integer",
      //         example: 200,
      //       },
      //       message: {
      //         type: "string",
      //         example: "Operation successful",
      //       },
      //       data: {
      //         type: "object",
      //         description: "Response data",
      //       },
      //     },
      //   },
      // },
    },
    // security: [
    //   {
    //     bearerAuth: [],
    //   },
    // ],
  },
  // apis: [
  //   "./src/app/modules/*/*.routes.ts",
  //   "./src/app/modules/*/*.controller.ts",
  //   "./src/app/modules/*/*.schemas.ts",
  //   "./src/app/routes/index.ts",
  // ],
  apis: [
    "./src/app/modules/**/*.controller.ts",
    "./src/app/modules/**/*.routes.ts",
    "./src/app/modules/**/*.model.ts",
    "./src/app/routes/index.ts",
  ],
};

const CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css";
const JS_BUNDLE_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.min.js";
const JS_PRESET_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.min.js";

export const setupSwagger = (app: Application): void => {
  const specs = swaggerJSDoc(options);

  // console.log("NODE_ENV:", process.env.NODE_ENV);
  // console.log("APIS:", options.apis);
  // console.log("Swagger paths:", Object.keys(specs.paths || {}));

  app.use(
    "/api-docs",
    swaggerUi.serveFiles(specs, {}),
    swaggerUi.setup(specs, {
      explorer: true,
      customCssUrl: CSS_URL,
      customJs: [JS_BUNDLE_URL, JS_PRESET_URL],
    })
  );

  console.log(
    "📚 Swagger documentation available at: http://localhost:8080/api-docs"
  );
};

export { };
