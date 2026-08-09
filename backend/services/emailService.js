const nodemailer = require("nodemailer");

// Create Nodemailer Transporter for Gmail (Port 465 SSL)
const createTransporter = () => {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        return nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    }
    return null;
};

// Send OTP Verification Email Handler
const sendOtpEmail = async (email, otp) => {
    const transporter = createTransporter();

    if (!transporter) {
        console.log("==================================================");
        console.log(`[DEV MODE GMAIL OTP LOG] Destination: ${email}`);
        console.log(`[DEV MODE GMAIL OTP LOG] Verification Code: ${otp}`);
        console.log("==================================================");
        return { success: true, mode: "dev_log", otp };
    }

    const mailOptions = {
        from: `"iPetitions Platform" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "iPetitions - Your 6-Digit Email Verification Code",
        html: `
            <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: #f97316; margin: 0; font-size: 24px; font-weight: 800;">iPetitions</h1>
                    <p style="color: #64748b; font-size: 12px; margin-top: 4px;">YOUR VOICE COUNTS</p>
                </div>
                <h2 style="color: #0f172a; font-size: 18px; margin-top: 0; text-align: center;">Verify Your Email Address</h2>
                <p style="color: #64748b; font-size: 14px; line-height: 1.5; text-align: center;">
                    Thank you for registering on <strong>iPetitions</strong>. Please enter the 6-digit verification code below to complete your registration:
                </p>
                <div style="text-align: center; margin: 28px 0;">
                    <span style="font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #f97316; background-color: #fff7ed; padding: 14px 28px; border-radius: 12px; border: 2px solid #fed7aa; display: inline-block;">${otp}</span>
                </div>
                <p style="color: #94a3b8; font-size: 12px; text-align: center; line-height: 1.4;">
                    This code is valid for 10 minutes.<br/>If you didn't receive it in your main inbox, please check your <strong>Spam / Junk / Promotions</strong> folder.
                </p>
            </div>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`✉️ REAL GMAIL OTP SENT SUCCESSFULLY to ${email} (MessageID: ${info.messageId}) | Code: ${otp}`);
        return { success: true, mode: "gmail_smtp", messageId: info.messageId, otp };
    } catch (error) {
        console.error(`❌ Gmail Transporter Error sending to ${email}:`, error.message);
        return { success: false, error: error.message, otp };
    }
};

module.exports = {
    sendOtpEmail
};
