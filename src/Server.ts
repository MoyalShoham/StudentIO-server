import appInit from "./App";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

appInit().then((app) => {
  if (process.env.NODE_ENV === "development") {
    const options = {
      definition: {
        openapi: "3.0.0",
        info: {
          title: "SCE Web Application Backend API",
          version: "1.0.1",
          description: "List all the routes of the backend REST API...",
        },
        servers: [
          {
            url: "http://localhost:" + process.env.PORT,
          },
        ],
      },
      apis: ["./src/routes/*.ts"],
    };
    const specs = swaggerJsDoc(options);
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
  }

  app.listen(process.env.PORT, () => {
    console.log(
      `Example app listening at http://localhost:${process.env.PORT}`
    );
  });
});
