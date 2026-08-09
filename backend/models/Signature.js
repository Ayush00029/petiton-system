const mongoose = require("mongoose");

const signatureSchema = new mongoose.Schema(
    {
        petitionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Petition",
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        signerName: {
            type: String,
            default: ""
        },
        signatureData: {
            type: String,
            default: "" // Base64 Canvas Drawing data URL or typed cursive signature
        }
    },
    {
        timestamps: true
    }
);

// Compound Unique Index: user can only sign a petition once
signatureSchema.index({ petitionId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Signature", signatureSchema);
