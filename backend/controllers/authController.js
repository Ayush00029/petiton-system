const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { sendOtpEmail } = require("../services/emailService");

// Helper: Generate 6-digit OTP
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate JWT token helper
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Register User (Sends Real Gmail OTP)
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Please fill all required fields" });
        }

        const userExists = await User.findOne({ email: email.toLowerCase() });
        if (userExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // All public registrations are strictly registered as citizen
        const userRole = "citizen";
        const otp = generateOtp();
        const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password,
            role: userRole,
            isEmailVerified: false,
            emailOtp: otp,
            otpExpire
        });

        // Send real OTP email via pooled Gmail SMTP in background (non-blocking for instant response)
        sendOtpEmail(user.email, otp).then((emailRes) => {
            if (!emailRes.success) {
                console.error(`⚠️ Gmail delivery attempt to ${user.email} failed:`, emailRes.error);
            }
        }).catch((err) => {
            console.error("Background Gmail OTP send error:", err);
        });

        res.status(201).json({
            success: true,
            requiresVerification: true,
            email: user.email,
            message: "Registration successful. Please verify the 6-digit code sent to your Gmail."
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Login User with Real Gmail OTP Trigger
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please provide email and password" });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (user && (await user.matchPassword(password))) {
            // Demo account instant login
            if (["citizen@civicvoice.org", "admin@civicvoice.org"].includes(user.email)) {
                const token = generateToken(user._id);
                return res.json({
                    success: true,
                    requiresVerification: false,
                    data: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        token
                    }
                });
            }

            // Generate OTP for login
            const otp = generateOtp();
            user.emailOtp = otp;
            user.otpExpire = new Date(Date.now() + 10 * 60 * 1000);
            await user.save();

            // Send real Gmail OTP in background (non-blocking for instant response)
            sendOtpEmail(user.email, otp).then((emailRes) => {
                if (!emailRes.success) {
                    console.error(`⚠️ Gmail delivery attempt to ${user.email} failed:`, emailRes.error);
                }
            }).catch((err) => {
                console.error("Background Gmail OTP login send error:", err);
            });

            res.json({
                success: true,
                requiresVerification: true,
                email: user.email,
                message: "Verification code sent to your Gmail inbox."
            });
        } else {
            res.status(401).json({ success: false, message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Verify 6-digit Email OTP
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ success: false, message: "Email and OTP are required" });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.emailOtp !== otp.toString().trim()) {
            return res.status(400).json({ success: false, message: "Invalid 6-digit verification code" });
        }

        if (user.otpExpire && new Date() > user.otpExpire) {
            return res.status(400).json({ success: false, message: "Verification code has expired. Please resend code." });
        }

        // Mark email verified
        user.isEmailVerified = true;
        user.emailOtp = undefined;
        user.otpExpire = undefined;
        await user.save();

        const token = generateToken(user._id);

        res.json({
            success: true,
            message: "Email verified successfully!",
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Resend OTP
const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ success: false, message: "Email is required" });

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const otp = generateOtp();
        user.emailOtp = otp;
        user.otpExpire = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        // Send real Gmail OTP in background (non-blocking for instant response)
        sendOtpEmail(user.email, otp).then((emailRes) => {
            if (!emailRes.success) {
                console.error(`⚠️ Gmail delivery attempt to ${user.email} failed:`, emailRes.error);
            }
        }).catch((err) => {
            console.error("Background Gmail OTP resend error:", err);
        });

        res.json({
            success: true,
            message: "A new verification code has been sent to your Gmail inbox."
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get current user profile
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    verifyOtp,
    resendOtp,
    getMe
};
