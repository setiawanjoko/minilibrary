import express from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
const apiSpecsAuth = YAML.load("./docs/openapi-auth-only.yaml");
const apiSpecsMiniLibrary = YAML.load("./docs/openapi-minilibrary.yaml");
const apiSpecsEventOrganizers = YAML.load(
  "./docs/openapi-eventorganizers.yaml")
const apiSpecsBudgeting = YAML.load("./docs/openapi-budgeting.yaml");
const apiSpecsRplB = YAML.load("./docs/openapi-rplb.yaml");
import miniLibraryRoutes from "./routes/minilibrary/index.js";
import eventOrganizerRoutes from "./routes/event-organizers/index.js";
import authRoutes from "./routes/auth.js";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/', authRoutes, miniLibraryRoutes)
app.use('/docs/day1', swaggerUi.serveFiles(apiSpecsAuth), swaggerUi.setup(apiSpecsAuth, {
  customSiteTitle: "Auth API Documentation",
  customCss: ".swagger-ui .topbar { display: none }",
}));

app.use('/docs/day2', swaggerUi.serveFiles(apiSpecsRplB), swaggerUi.setup(apiSpecsRplB, {
  customSiteTitle: "RPLB API Documentation",
  customCss: ".swagger-ui .topbar { display: none }",
}));

app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err.message);
  console.error(err.stack); // Menampilkan lokasi error

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Start server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  const host = server.address().address;
  const port = server.address().port;

  const serverUrl =
    host === "::" ? `http://localhost:${port}` : `http://${host}:${port}`;
  console.log(`📚 Mini Library API running at ${serverUrl}`);
});
