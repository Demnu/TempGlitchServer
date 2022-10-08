const mongoose = require('mongoose')

const RecipeCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: true
  },
  blendName:{
    type:String, unique:true,required:true
  }
  

})

module.exports = mongoose.model('RecipeCode', RecipeCodeSchema)
