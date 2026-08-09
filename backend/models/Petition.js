const mongoose = require("mongoose");

const petitionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true,
            enum: [
                "Roads",
                "Water",
                "Electricity",
                "Garbage",
                "Street Lights",
                "Education",
                "Healthcare",
                "Other"
            ],
            default: "Roads"
        },
        location: {
            type: String,
            required: true
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        targetSignatures: {
            type: Number,
            default: 100
        },
        signatureCount: {
            type: Number,
            default: 0
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected", "submitted_to_government"],
            default: "pending"
        },
        pushedToGovernment: {
            type: Boolean,
            default: false
        },
        pushedAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Petition", petitionSchema);