import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";


// ================= REGISTER =================
export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    const file = req.file;
    let cloudResponse = null;

    // ✅ Profile Image Upload
    if (file) {
      const fileUri = getDataUri(file);

      cloudResponse = await cloudinary.uploader.upload(
        fileUri.content,
        {
          folder: "job_portal_by_tanishq_uchariya/profiles",
          resource_type: "image",
        }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email.",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {
        profilePhoto: cloudResponse?.secure_url || "",
      },
    });

    return res.status(201).json({
      message: "Account created successfully.",
      success: true,
    });

  } catch (error) {
    console.log("REGISTER ERROR:", error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with current role.",
        success: false,
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user,
        success: true,
      });

  } catch (error) {
    console.log("LOGIN ERROR:", error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

// ================= LOGOUT =================
export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", { maxAge: 0 })
      .json({
        message: "Logged out successfully.",
        success: true,
      });
  } catch (error) {
    console.log("LOGOUT ERROR:", error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

// ================= UPDATE PROFILE =================
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;

    const file = req.file;
    let cloudResponse = null;

    if (file) {

      // 🔥 RESUME UPLOAD
      if (file.mimetype === "application/pdf") {

        cloudResponse = await cloudinary.uploader.upload(
          file.path,
          {
            folder: "job_portal_by_tanishq_uchariya/resumes",
            resource_type: "raw",
            type: "upload",          // 🔥 VERY IMPORTANT
            access_mode: "public",   // 🔥 VERY IMPORTANT
            use_filename: true,        // ✅ keep original filename
            unique_filename: false,     // ✅ prevent random name
            overwrite: true           // optional but recommended

          }
        );
      }
      // 🔥 PROFILE IMAGE
      else {
        cloudResponse = await cloudinary.uploader.upload(
          file.path,
          {
            folder: "job_portal_by_tanishq_uchariya/profiles",
            resource_type: "image",
          }
        );
      }
    }

    const user = await User.findById(req.id);

    if (!user) {
      return res.status(400).json({
        message: "User not found.",
        success: false,
      });
    }

    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;

    if (skills) {
      user.profile.skills = skills.split(",").map((s) => s.trim());
    }

    // ✅ Save Resume (NO URL modification)
    if (cloudResponse && file?.mimetype === "application/pdf") {
      user.profile.resume = cloudResponse.secure_url;
      user.profile.resumeOriginalName = file.originalname;
    }

    // ✅ Save Profile Image
    if (cloudResponse && file?.mimetype !== "application/pdf") {
      user.profile.profilePhoto = cloudResponse.secure_url;
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully.",
      user,
      success: true,
    });

  } catch (error) {
    console.log("UPDATE PROFILE ERROR:", error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};
// ================= DOWNLOAD RESUME =================
export const downloadResume = async (req, res) => {
  try {
    const user = await User.findById(req.id);

    if (!user?.profile?.resume) {
      return res.status(404).json({ message: "Resume not found", success: false });
    }

    // ✅ Use plain raw URL — NO fl_attachment (causes ERR_INVALID_RESPONSE on free plan)
    const resumeUrl = user.profile.resume;
    const fileName = user.profile.resumeOriginalName || "resume.pdf";

    console.log("FETCHING FROM:", resumeUrl);

    // Fetch on server side and stream to client
    const https = await import("https");
    const http = await import("http");

    const downloadFromUrl = (url) => {
      return new Promise((resolve, reject) => {
        const protocol = url.startsWith("https") ? https : http;
        protocol.get(url, (response) => {
          // Follow redirects
          if (response.statusCode === 301 || response.statusCode === 302) {
            return downloadFromUrl(response.headers.location).then(resolve).catch(reject);
          }
          console.log("CLOUDINARY STATUS:", response.statusCode);
          console.log("CONTENT TYPE:", response.headers["content-type"]);

          const chunks = [];
          response.on("data", (chunk) => chunks.push(chunk));
          response.on("end", () => resolve({ 
            buffer: Buffer.concat(chunks), 
            contentType: response.headers["content-type"] 
          }));
          response.on("error", reject);
        }).on("error", reject);
      });
    };

    const { buffer, contentType } = await downloadFromUrl(resumeUrl);

    console.log("BUFFER SIZE:", buffer.length);

    if (!buffer || buffer.length === 0) {
      return res.status(500).json({ message: "Empty file received from Cloudinary", success: false });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Length", buffer.length);
    return res.send(buffer);

  } catch (error) {
    console.log("DOWNLOAD RESUME ERROR:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};