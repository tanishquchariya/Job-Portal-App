import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// logic for user registration
export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        const file = req.file;
        const fileUri = getDataUri(file);
        // const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        // i replace above one line with below code
        let cloudResponse = null;

        if (file) {
            const fileUri = getDataUri(file);
            cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                folder: "Job Portal by Tanishq Uchariya/profiles"
            });
        }
        // till here we replace code

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exist with this email.',
                success: false,
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                // profilePhoto: cloudResponse.secure_url,
                // i replace with above line with below line
                profilePhoto: cloudResponse?.secure_url || "",
            }
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}

// logic for user login
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        // check if user exist or not
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }
        // check password is correct or not - bcrypt compare password matches karega ya nahi
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };
        // check role is correct or not
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            })
        };

        // generate token for authentication
        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }
        // token ko cookie me store karna hai, taki client side pe use kar sake authentication ke liye, aur response me user data bhejna hai
        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;

        // const file = req.file;
        // // cloudinary ayega idhar
        // const fileUri = getDataUri(file);
        // const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        // i replace above four line code with below code

        const file = req.file;
        let cloudResponse = null;

        if (file) {
            const fileUri = getDataUri(file);

            // 👇 detect PDF vs image
            if (file.mimetype === "application/pdf") {
                cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                    folder: "Job Portal by Tanishq Uchariya/resumes",
                    resource_type: "raw"
                });
            } else {
                cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                    folder: "Job Portal by Tanishq Uchariya/profiles"
                });
            }
        }
        // till here we replace code

        // skills ko array me convert karna hai, kyuki user comma separated string bhej sakta hai, aur hume usko array me store karna hai
        let skillsArray;
        if (skills) {
            skillsArray = skills.split(",");
        }
        const userId = req.id; // middleware authentication
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            })
        }
        // updating data
        if (fullname) user.fullname = fullname
        if (email) user.email = email
        if (phoneNumber) user.phoneNumber = phoneNumber
        if (bio) user.profile.bio = bio
        if (skills) user.profile.skills = skillsArray

        // resume comes later here...
        // if (cloudResponse) {
        //     user.profile.resume = cloudResponse.secure_url // save the cloudinary url
        //     user.profile.resumeOriginalName = file.originalname // Save the original file name
        // }
        // i replace above 4 line code with below code

        if (cloudResponse && file) {
            if (file.mimetype === "application/pdf") {
                // ✅ resume upload
                user.profile.resume = cloudResponse.secure_url;
                user.profile.resumeOriginalName = file.originalname;
            } else {
                // ✅ profile image upload
                user.profile.profilePhoto = cloudResponse.secure_url;
            }
        }
        // till here we replace code


        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).json({
            message: "Profile updated successfully.",
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}