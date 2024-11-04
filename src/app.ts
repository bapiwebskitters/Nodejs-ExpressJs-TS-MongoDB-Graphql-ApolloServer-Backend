// src/app.ts
import express from "express";
import App from "./services/ExpressApp";
import dbConnection from "./services/Database";
import { APP_NAME, BASE_URL, PORT } from "./config";
import { setupSwagger } from "./config/swagger";
import "colors";
import { createApolloServer } from "./services/ApolloServer";

const StartServer = async () => {
  const app = express();

  try {
    // Connect to the database
    await dbConnection();

    // Setup Apollo Server
    const { middleware: apolloMiddleware } = await createApolloServer();

    // Apply Apollo middleware at the /graphql endpoint
    app.use("/graphql", apolloMiddleware);

    // Setup Express app configurations
    await App(app);

    // Setup Swagger for API documentation
    setupSwagger(app);

    // Start the server
    app.listen(PORT, () => {
      console.log(`${APP_NAME} is running on: ${BASE_URL}:${PORT}`.blue.bold);
      console.log(`API Base URL: ${BASE_URL}:${PORT}/api`.blue.bold);
      console.log(`GraphQL endpoint: ${BASE_URL}:${PORT}/graphql`.blue.bold);
      console.log(
        `Swagger docs available at: ${BASE_URL}:${PORT}/api-docs`.blue.bold
      );
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

StartServer();
