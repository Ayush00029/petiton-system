const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema(
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
        }
    },
    {
        timestamps: true
    }
);

// Compound Unique Index: user can only vote on a petition once
voteSchema.index({ petitionId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Vote", voteSchema);
