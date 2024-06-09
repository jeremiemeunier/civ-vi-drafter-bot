import express, { json } from "express";
import cors from "cors";
import axios from "axios";
import logs from "./logs";

const app = express();

export const api = () => {
  // ##### API SETUP ##### \\
  app.use(json());
  app.use(cors());

  // Setup of axios
  axios.defaults.baseURL = "http://localhost:3000";

  app.get("/", (req, res) => {
    res.status(200).json({ message: "Bienvenue sur le Backend de Pastille" });
  });
  app.all("*", (req, res) => {
    res.status(404).json({ message: "This route do not exist" });
  });
  app.listen(3000, () => {
    logs("start", "api", `Started on port 3000`);
  });
};
