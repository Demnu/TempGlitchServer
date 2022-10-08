const RecipeCode = require("../models/RecipeCode")
const createRecipeCode = async (req, res)=>{
    console.log(req.body);
    result = await RecipeCode.create(req.body).catch(function (error){
      console.log(error)
      duplicate = true;
    })
    res.status(200).send(result);
}

const getRecipeCodes = async(req,res) =>{
  const recipeCodesMongo = await RecipeCode.find();
  const recipeCodes = [];
  recipeCodesMongo.forEach((recipeCode)=>{
    recipeCodes.push({id: recipeCode.id,code:recipeCode.code, blendName: recipeCode.blendName})
  })
  res.status(200).send(recipeCodes);

}
module.exports = {createRecipeCode, getRecipeCodes}