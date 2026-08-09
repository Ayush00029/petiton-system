const express = require("express");
const router = express.Router({ mergeParams: true });
const {
    signPetition,
    removeSignature,
    getSignatures
} = require("../controllers/signatureController");
const { protect } = require("../middleware/authMiddleware");

// Mount under /api/petitions/:id/sign and /api/petitions/:id/signatures
router.post("/sign", protect, signPetition);
router.delete("/sign", protect, removeSignature);
router.get("/signatures", getSignatures);

module.exports = router;
