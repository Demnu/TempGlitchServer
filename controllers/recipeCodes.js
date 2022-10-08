const RecipeCode = require("../models/RecipeCode");
const createRecipeCode = async (req, res) => {
  let duplicate = false;

  console.log(req.body);
  result = await RecipeCode.create(req.body).catch(function (error) {
    console.log(error);
    duplicate = true;
  });
  if (duplicate) {
    console.log("is a duplicate");
    res
      .status(400)
      .send("Error! The code and/or blend name has already been saved");
  } else {
    console.log("is not a duplicate");
    res.status(201).send(result);
  }
};

const getRecipeCodes = async (req, res) => {
  const recipeCodesMongo = await RecipeCode.find();
  const recipeCodes = [];
  recipeCodesMongo.forEach((recipeCode) => {
    recipeCodes.push({
      id: recipeCode.id,
      code: recipeCode.code,
      blendName: recipeCode.blendName,
    });
  });
  res.status(201).send(recipeCodes);
};
const deleteRecipeCode = async (req, res) => {
  console.log(req.params);
  const recipeCode = await RecipeCode.findOneAndDelete({ _id: req.params.id });
  if (!recipeCode) {
    res.status(404).send("No recipe code with id: " + req.params.id);
  } else {
    res.status(201).json({ recipeCode });
  }
};

const updateRecipeCode = async (req, res) => {
  try {
    const recipeCode = await RecipeCode.findOneAndUpdate(
      { _id: req.body.id },
      { code: req.body.code, blendName: req.body.blendName },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(201).send(recipeCode);
  } catch (e) {
    res.status(404).send("Could not update the recipe code!");
  }
};
module.exports = {
  createRecipeCode,
  getRecipeCodes,
  deleteRecipeCode,
  updateRecipeCode,
};
