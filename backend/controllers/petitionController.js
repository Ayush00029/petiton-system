const Petition = require("../models/Petition");
const Signature = require("../models/Signature");

// Citizen: Create a new petition (Default status: pending, Minimum Target: 5)
const createPetition = async (req, res) => {
    try {
        const { title, description, category, location, targetSignatures } = req.body;

        if (!title || !description || !category || !location) {
            return res.status(400).json({ success: false, message: "Please fill all required fields" });
        }

        const parsedTarget = Number(targetSignatures);
        if (isNaN(parsedTarget) || parsedTarget < 5) {
            return res.status(400).json({
                success: false,
                message: "Target signatures must be at least 5 for a civic petition"
            });
        }

        const petition = await Petition.create({
            title,
            description,
            category,
            location,
            targetSignatures: parsedTarget,
            createdBy: req.user._id,
            status: "pending"
        });

        res.status(201).json({ success: true, data: petition });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Public/Citizen: View all approved & submitted petitions
const getApprovedPetitions = async (req, res) => {
    try {
        const { category } = req.query;
        let query = { status: { $in: ["approved", "submitted_to_government"] } };

        if (category && category !== "All") {
            query.category = category;
        }

        const petitions = await Petition.find(query)
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });

        res.json({ success: true, count: petitions.length, data: petitions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Public/Citizen: Get petition details by ID
const getPetitionById = async (req, res) => {
    try {
        const petition = await Petition.findById(req.params.id)
            .populate("createdBy", "name email");

        if (!petition) {
            return res.status(404).json({ success: false, message: "Petition not found" });
        }

        res.json({ success: true, data: petition });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Citizen: View my created petitions
const getMyPetitions = async (req, res) => {
    try {
        const petitions = await Petition.find({ createdBy: req.user._id })
            .sort({ createdAt: -1 });

        res.json({ success: true, count: petitions.length, data: petitions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Protected: Push Petition to Government Department (Citizen when goal met, or Admin anytime)
const pushToGovernment = async (req, res) => {
    try {
        const petition = await Petition.findById(req.params.id);
        if (!petition) {
            return res.status(404).json({ success: false, message: "Petition not found" });
        }

        const isAdmin = req.user.role === "admin";

        if (!isAdmin && petition.signatureCount < petition.targetSignatures) {
            return res.status(400).json({
                success: false,
                message: `Signature goal not reached. Requires ${petition.targetSignatures} signatures (currently ${petition.signatureCount}).`
            });
        }

        petition.pushedToGovernment = true;
        petition.pushedAt = new Date();
        petition.status = "submitted_to_government";
        await petition.save();

        res.json({
            success: true,
            message: "Petition successfully pushed to Government Department",
            data: petition
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin: View all petitions (pending, approved, rejected, submitted_to_government)
const getAllPetitionsAdmin = async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};
        if (status) query.status = status;

        const petitions = await Petition.find(query)
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });

        res.json({ success: true, count: petitions.length, data: petitions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin: Approve, Reject, or Push to Government
const updatePetitionStatusAdmin = async (req, res) => {
    try {
        const { status } = req.body;

        if (!["approved", "rejected", "submitted_to_government"].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status value" });
        }

        const petition = await Petition.findById(req.params.id);
        if (!petition) {
            return res.status(404).json({ success: false, message: "Petition not found" });
        }

        petition.status = status;
        if (status === "submitted_to_government") {
            petition.pushedToGovernment = true;
            petition.pushedAt = new Date();
        }
        await petition.save();

        res.json({ success: true, data: petition });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin: Delete a petition
const deletePetitionAdmin = async (req, res) => {
    try {
        const petition = await Petition.findById(req.params.id);
        if (!petition) {
            return res.status(404).json({ success: false, message: "Petition not found" });
        }

        await petition.deleteOne();
        await Signature.deleteMany({ petitionId: req.params.id });

        res.json({ success: true, message: "Petition deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createPetition,
    getApprovedPetitions,
    getPetitionById,
    getMyPetitions,
    pushToGovernment,
    getAllPetitionsAdmin,
    updatePetitionStatusAdmin,
    deletePetitionAdmin
};