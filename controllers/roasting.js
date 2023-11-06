const connectDB = require("../db/connect");
const Calculation = require("../models/Calculation");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Recipe = require("../models/Recipe");
const Blend = require("../models/Blend");
const makeCalculation = async (req, res) => {
  //retrieve all orders chosen
  var ordersReq = req.body.orderIDs;
  if (!req.body.orderIDs) {
    return res.status(400).send("Bad request");
  }
  start = Date.now();
  var orders = [];
  ordersMongo = await Order.find();
  ordersMongo.forEach((order) => {
    for (var i = 0; i < ordersReq.length; i++) {
      if (ordersReq[i] === order.orderID) {
        orders.push({
          id: order.orderID,
          customerName: order.customerName,
          date: order.date,
          products: order.products,
        });
      }
    }
  });
  //retrive products list
  var productsMongo = [];
  productsMongo = await Product.find();

  var productTally = [];
  productsMongo.forEach((product) => {
    productTally.push({ id: product.id, amount: 0 });
  });
  //go through each product in tally and find if it matches in all of the orders
  productTally.forEach((product) => {
    orders.forEach((order) => {
      var products = [];
      products = order.products;
      products.forEach((orderProduct) => {
        if (product.id === orderProduct.id) {
          product.amount = Number(product.amount) + Number(orderProduct.amount);
        }
      });
    });
  });

  //remove products in tally with 0 amounts
  productTally = productTally.filter((product) => product.amount !== 0);

  //Product Tally FINISHED

  //Begin making Roasting LIst

  //Get all recipes
  var recipesMongo = await Recipe.find();
  var recipes = [];

  //find products with recipes in product tally and add amount to the recipe
  recipesMongo.forEach((recipe) => {
    productTally.forEach((product) => {
      if (recipe.product === product.id) {
        product.id = product.id;
        product.hasRecipe = true;
        recipes.push({
          product: product.id,
          tally: product.amount,
          beans: [
            {
              name: recipe.bean1Name,
              amount: recipe.bean1Amount,
              amountNeededToBeRoasted: 0,
            },
            {
              name: recipe.bean2Name,
              amount: recipe.bean2Amount,
              amountNeededToBeRoasted: 0,
            },
            {
              name: recipe.bean3Name,
              amount: recipe.bean3Amount,
              amountNeededToBeRoasted: 0,
            },
            {
              name: recipe.bean4Name,
              amount: recipe.bean4Amount,
              amountNeededToBeRoasted: 0,
            },
            {
              name: recipe.bean5Name,
              amount: recipe.bean5Amount,
              amountNeededToBeRoasted: 0,
            },
            {
              name: recipe.bean6Name,
              amount: recipe.bean6Amount,
              amountNeededToBeRoasted: 0,
            },
            {
              name: recipe.bean7Name,
              amount: recipe.bean7Amount,
              amountNeededToBeRoasted: 0,
            },
            {
              name: recipe.bean8Name,
              amount: recipe.bean8Amount,
              amountNeededToBeRoasted: 0,
            },
          ],
        });
      }
    });
  });

  recipes.forEach((recipe) => {
    //remove empty beans
    var beans = recipe.beans;
    recipe.beans = beans.filter((bean) => bean.amount !== "");
    //calculate amount needed to be roasted for each bean in the recipe
    recipe.beans.forEach((bean) => {
      bean.amountNeededToBeRoasted = Number(recipe.tally) * Number(bean.amount);
    });
  });

  var beans = [];
  recipes.forEach((recipe) => {
    recipe.beans.forEach((recipeBean) => {
      //check if bean has been saved in beans list
      var duplicate = false;
      beans.every((bean) => {
        if (bean.name === recipeBean.name) {
          bean.amount =
            Number(bean.amount) +
            Number(recipeBean.amountNeededToBeRoasted) / 1000;
          duplicate = true;
          return false;
        }
        return true;
      });
      if (!duplicate) {
        if (String(recipeBean.name).length > 0) {
          beans.push({
            name: recipeBean.name,
            amount: Number(recipeBean.amountNeededToBeRoasted) / 1000,
          });
        }
      }
    });
  });

  var data = [];
  data.push(beans);
  data.push(productTally);
  return res.status(200).send(data);
};

const saveCalculation = async (req, res) => {
  var date = new Date();
  console.log(req.body.orderIDs);

  var calculation = {
    title: req.body.title,
    date: req.body.date,
    orderIDs: req.body.orderIDs,
    products: req.body.products,
    beans: req.body.beans,
  };
  const mongoResponse = await Calculation.create(calculation);
  res.status(200).json(mongoResponse);
};

const getCalculations = async (req, res) => {
  Calculation.find({}, function (err, calculations) {
    var calculationsMap = [];
    calculations.forEach(function (calculation) {
      date = new Date(calculation.date);
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      let dateStr = day + "/" + month + "/" + year;
      calculationsMap.push({
        id: calculation._id,
        title: calculation.title,
        date: dateStr + " " + date.toLocaleTimeString(),
        products: calculation.products,
        beans: calculation.beans,
        orderIDs: calculation.orderIDs,
        roastingCalculation: calculation.roastingCalculation,
        calculatedRoastingList: calculation.roastingCalculation.length > 0,
      });
    });
    res.send(calculationsMap.reverse());
  });
};

const deleteCalculation = async (req, res, next) => {
  const { id: id } = req.params;
  const recipe = await Calculation.findOneAndDelete({ _id: id });
  if (!recipe) {
    res.status(404).send("No recipe with id: " + id);
  } else {
    res.status(200).json({ recipe });
  }
};
const calculateRoastingList = async (req, res) => {
  // const products = req.body.products;
  let recipesMongo = await Recipe.find({});
  let products = req.body.products;
  let recipes = [];
  //calculate total of beans roasted in each recipe
  const getNumber = (value) => {
    if (isNaN(value)) {
      return 0;
    }
    return Number(value);
  };
  for (let recipe of recipesMongo) {
    if (recipe.blendName?.length > 0) {
      let tempRecipe = {};
      tempRecipe.name = recipe.product;
      tempRecipe.blendName = recipe.blendName;
      tempRecipe.totalBeans = 0;
      tempRecipe.totalBeans += getNumber(recipe.bean1Amount);
      tempRecipe.totalBeans += getNumber(recipe.bean2Amount);
      tempRecipe.totalBeans += getNumber(recipe.bean3Amount);
      tempRecipe.totalBeans += getNumber(recipe.bean4Amount);
      tempRecipe.totalBeans += getNumber(recipe.bean5Amount);
      tempRecipe.totalBeans += getNumber(recipe.bean6Amount);
      tempRecipe.totalBeans += getNumber(recipe.bean7Amount);
      tempRecipe.totalBeans += getNumber(recipe.bean8Amount);
      recipes.push(tempRecipe);
    } else {
      let tempRecipe = {};
      tempRecipe.name = recipe.product;
      tempRecipe.blendName = "";
      tempRecipe.totalBeans = 0;
      tempRecipe.totalBeans += getNumber(recipe.bean1Amount);
      tempRecipe.totalBeans += getNumber(recipe.bean2Amount);
      tempRecipe.totalBeans += getNumber(recipe.bean3Amount);
      tempRecipe.totalBeans += getNumber(recipe.bean4Amount);
      tempRecipe.totalBeans += getNumber(recipe.bean5Amount);
      tempRecipe.totalBeans += getNumber(recipe.bean6Amount);
      tempRecipe.totalBeans += getNumber(recipe.bean7Amount);
      tempRecipe.totalBeans += getNumber(recipe.bean8Amount);
      recipes.push(tempRecipe);
    }
  }
  let blendsMap = new Map();
for (let product of products) {
  // if (product.hasRecipe) {
  if (true) {
    for (let recipe of recipes) {
      if (product.id === recipe.name || product.id === recipe.name + "*") {
        if (recipe.blendName.length > 0) {
          blendsMap.set(
            recipe.blendName,
            blendsMap.get(recipe.blendName) +
              (recipe.totalBeans * product.amount) / 1000 ||
              (recipe.totalBeans * product.amount) / 1000
          );
        } else {
          blendsMap.set(
            product.id,
            blendsMap.get(product.id) +
              (recipe.totalBeans * product.amount) / 1000 ||
              (recipe.totalBeans * product.amount) / 1000
          );
        }
        break;
      }
    }
  }
}
let blends = [];
blendsMap.forEach((value, key) => {
  let tempBlend = {};
  tempBlend.id = Math.random();
  tempBlend.blendName = key;
  tempBlend.overflow = 0;
  tempBlend.coffeeOrdered = value;
  tempBlend.production = 0;
  tempBlend.green = 0;
  tempBlend.batchSize = 0;
  tempBlend.numberOfRoasts = 0;
  blends.push(tempBlend);
});
res.status(200).send(blends);
};

const saveRoastingCalculation = async (req, res) => {
let calculationID = req.body._id;
let roastingCalculation = req.body.roastingCalculation;
let calculation = await Calculation.findByIdAndUpdate(
  { _id: calculationID },
  { roastingCalculation: roastingCalculation },
  {
    new: true,
    runValidators: true,
  }
);
res.status(201).send(calculation);
};

module.exports = {
saveCalculation,
getCalculations,
deleteCalculation,
makeCalculation,
calculateRoastingList,
saveRoastingCalculation,
};
