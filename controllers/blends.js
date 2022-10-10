const Blend = require("../models/Blend");
const Recipe = require("../models/Recipe");
const createBlend = async (req, res) => {
  let recipesMongo = await Recipe.find({});
  let recipesReq = req.body.recipes;
  let blendName = req.body.name;
  for (let recipeReq of recipesReq) {
    for (let recipeMongo of recipesMongo) {
      if (recipeReq._id == recipeMongo._id) {
        let recipe = await Recipe.findByIdAndUpdate(
          { _id: recipeMongo._id },
          { blendName: blendName },
          {
            new: true,
            runValidators: true,
          }
        );
        break;
      }
    }
  }

  let duplicate = false;
  result = await Blend.create(req.body).catch(function (error) {
    console.log(error);
    duplicate = true;
  });
  if (duplicate) {
    console.log("is a duplicate");
    res.status(400).send("Error! Blend already exists");
  } else {
    console.log("is not a duplicate");
    res.status(201).send(result);
  }
};

const getBlends = async (req, res) => {
  const blendsMongo = await Blend.find();
  const blends = [];
  blendsMongo.forEach((blend) => {
    blends.push({
      id: blend.id,
      name: blend.name,
      recipes: blend.recipes,
    });
  });
  res.status(201).send(blends);
};
const deleteBlend = async (req, res) => {
  let blend;
  try {
    blend = await Blend.findById({ _id: req.params.id });
  } catch (e) {
    console.log(e);
  }
  let recipes = blend.recipes;

  for (let recipeRemoved of recipes) {
    let recipe = await Recipe.findByIdAndUpdate(
      { _id: recipeRemoved._id },
      { blendName: "" },
      {
        new: true,
        runValidators: true,
      }
    );
  }
  blend = await Blend.findOneAndDelete({ _id: req.params.id });
  if (!blend) {
    res.status(404).send("No blend with id: " + req.params.id);
  } else {
    res.status(201).json({ blend });
  }
};

const updateBlend = async (req, res) => {
  console.log(req.body.name);
  let recipesMongo = await Recipe.find({});
  let recipesRemoved = req.body.recipesRemoved;

  for (let recipeRemoved of recipesRemoved) {
    for (let recipeMongo of recipesMongo) {
      if (recipeRemoved._id == recipeMongo._id) {
        let recipe = await Recipe.findByIdAndUpdate(
          { _id: recipeMongo._id },
          { blendName: "" },
          {
            new: true,
            runValidators: true,
          }
        );
        break;
      }
    }
  }
  let recipesReq = req.body.recipes;
  for (let recipeReq of recipesReq) {
    for (let recipeMongo of recipesMongo) {
      if (recipeReq._id == recipeMongo._id) {
        let recipe = await Recipe.findByIdAndUpdate(
          { _id: recipeMongo._id },
          { blendName: req.body.name },
          {
            new: true,
            runValidators: true,
          }
        );
        break;
      }
    }
  }

  try {
    const blend = await Blend.findOneAndUpdate(
      { _id: req.body.id },
      { name: req.body.name, recipes: req.body.recipes },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(201).send(blend);
  } catch (e) {
    res.status(404).send("Could not update the blend!");
  }
};
module.exports = {
  createBlend,
  getBlends,
  deleteBlend,
  updateBlend,
};
