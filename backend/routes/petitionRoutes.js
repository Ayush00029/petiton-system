const express = require("express");
const router = express.Router();
const {
    createPetition,
    getApprovedPetitions,
    getPetitionById,
    getMyPetitions,
    pushToGovernment,
    getAllPetitionsAdmin,
    updatePetitionStatusAdmin,
    deletePetitionAdmin
} = require("../controllers/petitionController");
const { signPetition, revokeSignature, checkSignatureStatus } = require("../controllers/signatureController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// Public Routes
router.get("/", getApprovedPetitions);
router.get("/:id", getPetitionById);

// Protected Citizen Routes
router.post("/", protect, createPetition);
router.get("/user/my", protect, getMyPetitions);
router.post("/:id/sign", protect, signPetition);
router.delete("/:id/sign", protect, revokeSignature);
router.post("/:id/push-to-government", protect, pushToGovernment);
router.get("/:id/signed", protect, checkSignatureStatus);

// Protected Admin Routes
router.get("/admin/all", protect, authorize("admin"), getAllPetitionsAdmin);
router.put("/admin/:id/status", protect, authorize("admin"), updatePetitionStatusAdmin);
router.delete("/admin/:id", protect, authorize("admin"), deletePetitionAdmin);

module.exports = router;