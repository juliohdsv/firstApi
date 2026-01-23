import express from "express";
import cors from "cors";
import { mainRoute } from "./infra/routes/main-route.js";
import { errorHandler } from "./infra/middlewares/error-handler.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/", mainRoute);

app.use(errorHandler);

app.listen(3333, () => console.log("Server running in dev mode."));
