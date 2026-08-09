const mongoose = require("mongoose");

const seedHardcodedUsers = async () => {
    try {
        const User = require("../models/User");
        
        const adminExists = await User.findOne({ email: "admin@civicvoice.org" });
        if (!adminExists) {
            await User.create({
                name: "System Admin",
                email: "admin@civicvoice.org",
                password: "password123",
                role: "admin",
                isEmailVerified: true
            });
            console.log("Hardcoded Admin account created: admin@civicvoice.org");
        }

        const citizenExists = await User.findOne({ email: "citizen@civicvoice.org" });
        if (!citizenExists) {
            await User.create({
                name: "Demo Citizen",
                email: "citizen@civicvoice.org",
                password: "password123",
                role: "citizen",
                isEmailVerified: true
            });
            console.log("Hardcoded Citizen account created: citizen@civicvoice.org");
        }
    } catch (error) {
        console.error("Error seeding hardcoded users:", error.message);
    }
};

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
        await seedHardcodedUsers();
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
};

module.exports = connectDB;