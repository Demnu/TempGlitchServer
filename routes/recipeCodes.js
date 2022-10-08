const express = require('express')
const router = express.Router()

const {
createRecipeCode,
getRecipeCodes

} = require('../controllers/recipeCodes')

router.route('/').post(createRecipeCode).get(getRecipeCodes)

module.exports = router
