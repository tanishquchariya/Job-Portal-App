import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import path from "path"; // for serving static files

dotenv.config({});
const app = express();
const PORT = process.env.PORT || 3000;

const __dirname = path.resolve(); // get the current directory path

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
}
app.use(cors(corsOptions));

// api's
app.use("/api/v1/user", userRoute);

app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

// serve static files from the frontend build directory
app.use(express.static(path.join(__dirname, "/frontend/dist")));
// * for any route that doesn't match the above API routes, serve the index.html file from the frontend build directory
app.get("*", (_, res) => { 
    res.sendFile(path.resolve(__dirname, "frontend", "dist","index.html"));

});
app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server running at port ${PORT}`);
});