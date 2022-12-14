const express = require("express");
const router = express.Router();

const {
  getAllRecipes,
  createRecipe,
  deleteRecipe,
  getRecipe,
  updateRecipe,
  getRoastingList,
  createRoastingList,
  getRecipesNotAssignedToBlend,
} = require("../controllers/recipes");

router.route("/").get(getAllRecipes).post(createRecipe);
router.route("/unassignedRecipes").get(getRecipesNotAssignedToBlend);
router.route("/getRoastingList").get(getRoastingList).post(createRoastingList);
router.route("/:id").delete(deleteRecipe).get(getRecipe).patch(updateRecipe);
module.exports = router;
