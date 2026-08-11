const Vote = require("../models/Vote");
const Petition = require("../models/Petition");

// Citizen: Upvote a petition (1-click voting)
const votePetition = async (req, res) => {
    try {
        const petitionId = req.params.id;
        const userId = req.user._id;

        const petition = await Petition.findById(petitionId);
        if (!petition) {
            return res.status(404).json({ success: false, message: "Petition not found" });
        }

        if (petition.status !== "approved" && petition.status !== "submitted_to_government") {
            return res.status(400).json({ success: false, message: "Only approved petitions can be voted on" });
        }

        // Check if user already voted
        const existingVote = await Vote.findOne({ petitionId, userId });
        if (existingVote) {
            return res.status(400).json({ success: false, message: "You have already voted on this petition" });
        }

        // Save vote record
        await Vote.create({
            petitionId,
            userId
        });

        // Increment vote count & signature count for compatibility
        const newCount = (petition.voteCount || petition.signatureCount || 0) + 1;
        petition.voteCount = newCount;
        petition.signatureCount = newCount;
        await petition.save();

        res.status(201).json({
            success: true,
            message: "Vote recorded successfully!",
            voteCount: petition.voteCount,
            signatureCount: petition.signatureCount,
            hasVoted: true
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: "You have already voted on this petition" });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

// Citizen: Revoke/Withdraw vote
const unvotePetition = async (req, res) => {
    try {
        const petitionId = req.params.id;
        const userId = req.user._id;

        const petition = await Petition.findById(petitionId);
        if (!petition) {
            return res.status(404).json({ success: false, message: "Petition not found" });
        }

        const vote = await Vote.findOne({ petitionId, userId });
        if (!vote) {
            return res.status(400).json({ success: false, message: "You have not voted on this petition" });
        }

        // Delete vote record
        await vote.deleteOne();

        // Decrement vote count & signature count
        const currentCount = petition.voteCount || petition.signatureCount || 1;
        const newCount = Math.max(0, currentCount - 1);
        petition.voteCount = newCount;
        petition.signatureCount = newCount;
        await petition.save();

        res.json({
            success: true,
            message: "Vote withdrawn successfully",
            voteCount: petition.voteCount,
            signatureCount: petition.signatureCount,
            hasVoted: false
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Citizen: Check vote status for a petition
const checkVoteStatus = async (req, res) => {
    try {
        const petitionId = req.params.id;
        const userId = req.user._id;

        const vote = await Vote.findOne({ petitionId, userId });

        res.json({
            success: true,
            hasVoted: !!vote,
            hasSigned: !!vote
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    votePetition,
    unvotePetition,
    checkVoteStatus
};
