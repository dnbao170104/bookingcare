require("dotenv").config();
const express = require("express");
const apiRoutes = require("./route/api");
const { resolveLanguage } = require("./middlewares/languageMiddleware");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware ngôn ngữ vi / en
app.use(resolveLanguage);

// Routes
app.use("/api/v1", apiRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Backend Nodejs is running on the port: ${port}`);
});
