const Blend = require("../models/Blend");
const createBlend = async (req, res) => {
  let duplicate = false;

  console.log(req.body);
  result = await Blend.create(req.body).catch(function (error) {
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
  console.log(req.params);
  const blend = await Blend.findOneAndDelete({ _id: req.params.id });
  if (!blend) {
    res.status(404).send("No blend with id: " + req.params.id);
  } else {
    res.status(201).json({ blend });
  }
};

const updateBlend = async (req, res) => {
  const t = req.body;

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
    res.status(404).send("Could not update the recipe code!");
  }
};
module.exports = {
  createBlend,
  getBlends,
  deleteBlend,
  updateBlend,
};
