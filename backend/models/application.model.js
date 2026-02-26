// this project have 4 schemas and models - user, company, job and application
// 1. user schema and model
// 2. company schema and model
// 3. job schema and model
// 4. application schema and model
import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    resume: {
        type: String
    },
    resumeOriginalName: {
        type: String
    }
}, { timestamps: true });
export const Application = mongoose.model("Application", applicationSchema);