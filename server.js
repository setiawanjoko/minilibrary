import express from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
const apiSpecsAuth = YAML.load("./docs/openapi-auth-only.yaml");
const apiSpecsMiniLibrary = YAML.load("./docs/openapi-minilibrary.yaml");
const apiSpecsEventOrganizers = YAML.load(
  "./docs/openapi-eventorganizers.yaml")
const apiSpecsBudgeting = YAML.load("./docs/openapi-budgeting.yaml");
import miniLibraryRoutes from "./routes/minilibrary/index.js";
import eventOrganizerRoutes from "./routes/event-organizers/index.js";
import authRoutes from "./routes/auth.js";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/', authRoutes)
app.use("/", swaggerUi.serveFiles(apiSpecsAuth), swaggerUi.setup(apiSpecsAuth, {
  customSiteTitle: "Auth API Documentation",
  customCss: ".swagger-ui .topbar { display: none }",
}));

app.use("/api", miniLibraryRoutes);
app.use("/api/docs", swaggerUi.serveFiles(apiSpecsMiniLibrary), swaggerUi.setup(apiSpecsMiniLibrary, {
  customSiteTitle: "Mini Library API Documentation",
  customCss: ".swagger-ui .topbar { display: none }",
}));

app.use("/api/v2", eventOrganizerRoutes);
app.use("/api/v2/docs", swaggerUi.serveFiles(apiSpecsEventOrganizers), swaggerUi.setup(apiSpecsEventOrganizers, {
    customSiteTitle: "Event Organizers API Documentation",
}));

app.use("/api/budgeting", swaggerUi.serveFiles(apiSpecsBudgeting), swaggerUi.setup(apiSpecsBudgeting));

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
const HOST = process.env.HOST || "localhost"
const server = app.listen(PORT, HOST, () => {
  const host = server.address().address;
  const port = server.address().port;

  const serverUrl =
    host === "::" ? `http://localhost:${port}` : `http://${host}:${port}`;
  console.log(`📚 Mini Library API running at ${serverUrl}`);
});
