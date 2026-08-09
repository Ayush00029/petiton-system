const Signature = require("../models/Signature");
const Petition = require("../models/Petition");

// Citizen: Sign a petition with digital signature
const signPetition = async (req, res) => {
    try {
        const petitionId = req.params.id;
        const userId = req.user._id;
        const { signatureData, signerName } = req.body;

        const petition = await Petition.findById(petitionId);
        if (!petition) {
            return res.status(404).json({ success: false, message: "Petition not found" });
        }

        if (petition.status !== "approved" && petition.status !== "submitted_to_government") {
            return res.status(400).json({ success: false, message: "Only approved or published petitions can be signed" });
        }

        // Check if user already signed
        const existingSignature = await Signature.findOne({ petitionId, userId });
        if (existingSignature) {
            return res.status(400).json({ success: false, message: "You have already signed this petition" });
        }

        // Save digital signature
        const signature = await Signature.create({
            petitionId,
            userId,
            signerName: signerName || req.user.name,
            signatureData: signatureData || ""
        });

        // Increment signature count
        petition.signatureCount = (petition.signatureCount || 0) + 1;
        await petition.save();

        res.status(201).json({
            success: true,
            message: "Petition signed successfully with verified Digital Signature",
            signatureCount: petition.signatureCount,
            hasSigned: true,
            signature
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: "You have already signed this petition" });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

// Citizen: Revoke/Withdraw digital signature
const revokeSignature = async (req, res) => {
    try {
        const petitionId = req.params.id;
        const userId = req.user._id;

        const petition = await Petition.findById(petitionId);
        if (!petition) {
            return res.status(404).json({ success: false, message: "Petition not found" });
        }

        const signature = await Signature.findOne({ petitionId, userId });
        if (!signature) {
            return res.status(400).json({ success: false, message: "You have not signed this petition" });
        }

        // Delete signature record
        await signature.deleteOne();

        // Decrement signature count
        petition.signatureCount = Math.max(0, (petition.signatureCount || 1) - 1);
        await petition.save();

        res.json({
            success: true,
            message: "Digital signature revoked successfully",
            signatureCount: petition.signatureCount,
            hasSigned: false
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Citizen: Check signature status for a petition
const checkSignatureStatus = async (req, res) => {
    try {
        const petitionId = req.params.id;
        const userId = req.user._id;

        const signature = await Signature.findOne({ petitionId, userId });

        res.json({
            success: true,
            hasSigned: !!signature,
            signature: signature || null
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    signPetition,
    revokeSignature,
    checkSignatureStatus
};
