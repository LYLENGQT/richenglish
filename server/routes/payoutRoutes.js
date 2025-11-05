const express = require("express");
const router = express.Router();
const {
  getPayouts,
  getPayout,
  addPayout,
  updatePayout,
  deletePayout,
} = require("../controller/payoutController");
const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");

router.use(authenticateToken);
router
  .route("/")
  .get(requireAdmin("super-admin"), getPayouts)
  .post(requireAdmin("super-admin"), addPayout);
router
  .route("/:id")
  .patch(requireAdmin("super-admin"), updatePayout)
  .delete(requireAdmin("super-admin"), deletePayout)
  .get(getPayout);

module.exports = router;
