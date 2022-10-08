const express = require("express");
const router = express.Router();

const {
  createRecipeCode,
  getRecipeCodes,
  deleteRecipeCode,
  updateRecipeCode,
} = require("../controllers/recipeCodes");
router.route("/:id").delete(deleteRecipeCode);
router
  .route("/")
  .post(createRecipeCode)
  .get(getRecipeCodes)
  .patch(updateRecipeCode);

module.exports = router;
