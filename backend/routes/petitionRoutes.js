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
const { votePetition, unvotePetition, checkVoteStatus } = require("../controllers/voteController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// Public Routes
router.get("/", getApprovedPetitions);
router.get("/:id", getPetitionById);

// Protected Citizen Routes
router.post("/", protect, createPetition);
router.get("/user/my", protect, getMyPetitions);
router.post("/:id/vote", protect, votePetition);
router.delete("/:id/vote", protect, unvotePetition);
router.get("/:id/vote-status", protect, checkVoteStatus);

// Backward Compatibility Aliases for Frontend/Tests
router.post("/:id/sign", protect, votePetition);
router.delete("/:id/sign", protect, unvotePetition);
router.get("/:id/signed", protect, checkVoteStatus);

router.post("/:id/push-to-government", protect, pushToGovernment);

// Protected Admin Routes
router.get("/admin/all", protect, authorize("admin"), getAllPetitionsAdmin);
router.put("/admin/:id/status", protect, authorize("admin"), updatePetitionStatusAdmin);
router.delete("/admin/:id", protect, authorize("admin"), deletePetitionAdmin);

module.exports = router;