import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web"; // Đã sửa tên import cho khớp với tên gọi ở dưới
import connectDB from "./config/connectDB";
require("dotenv").config();

let app = express();

connectDB();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

viewEngine(app);
initWebRoutes(app);

let port = process.env.PORT || 6969;
app.listen(port, () => {
  console.log("backend is running now on port " + port);
});
