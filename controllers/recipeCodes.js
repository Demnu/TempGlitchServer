const RecipeCode = require("../models/RecipeCode")
const createRecipeCode = async (req, res)=>{
  let duplicate = false;

    console.log(req.body);
    result = await RecipeCode.create(req.body).catch(function (error){
      console.log(error)
      duplicate = true;
    })
    if (duplicate){
      console.log("is a duplicate")
      res.status(400).send("Error! The code and/or blend name has already been saved");
    }
    else{
      console.log("is not a duplicate")
      res.status(201).send(result);

    }
}

const getRecipeCodes = async(req,res) =>{
  const recipeCodesMongo = await RecipeCode.find();
  const recipeCodes = [];
  recipeCodesMongo.forEach((recipeCode)=>{
    recipeCodes.push({id: recipeCode.id,code:recipeCode.code, blendName: recipeCode.blendName})
  })
  res.status(201).send(recipeCodes);

}
module.exports = {createRecipeCode, getRecipeCodes}