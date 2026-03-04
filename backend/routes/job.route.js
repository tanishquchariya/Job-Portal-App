import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  getAdminJobs,
  getAllJobs,
  getJobById,
  postJob,
} from "../controllers/job.controller.js";

const router = express.Router();

// 🔒 Recruiter only — create job
router.route("/post").post(isAuthenticated, postJob);

// 🔓 PUBLIC — show all jobs (homepage, browse)
router.route("/get").get(getAllJobs);

// 🔒 Recruiter dashboard jobs
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);

// 🔓 PUBLIC — job details page
router.route("/get/:id").get(getJobById);

export default router;