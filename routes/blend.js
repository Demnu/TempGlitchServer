const express = require("express");
const router = express.Router();

const {
  createBlend,
  getBlends,
  deleteBlend,
  updateBlend,
} = require("../controllers/blends");
router.route("/:id").delete(deleteBlend);
router.route("/").post(createBlend).get(getBlends).patch(updateBlend);

module.exports = router;
