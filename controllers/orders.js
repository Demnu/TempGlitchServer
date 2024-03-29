const Order = require("../models/Order");

function compareDateInOrder( a, b ) {
  var d1 = new Date(a.date);
  var d2 = new Date(b.date);
  if ( d1 < d2){
    return -1;
  }
  if ( d1 > d2 ){
    return 1;
  }
  return 0;
}


const getAllOrders = async (req, res) => {
  try {

    let orders = await Order.find({})
    .sort({ date: -1, supplierName: 1, orderID: 1 })
    .limit(300);
    // Map the orders to the desired structure
    let ordersMap = orders.map(order => ({
      id: order.orderID,
      customerName: order.customerName,
      date: order.date,
      products: order.products,
      supplierName: order.supplierName
    }));

    res.setHeader("Content-Range", `orders ${orders.length}`);
    res.send(ordersMap)
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).send("Internal Server Error");
  }
};
const getOrder = async (req, res, next) => {
  const { id: id } = req.params;
  const order = await Order.findOne({ orderID: id });
  if (order) {
    const orderStr = {
      id: order.orderID,
      customerName: order.customerName,
      date: order.date,
      products: order.products,
    };
    res.status(200).send({ orderStr });
  }
};

const updateOrder = async (req, res) => {
  const orderID = req.body;
  console.log(req.body)
  const order = await Order.findOneAndUpdate({ orderID: req.body.id }, { lastOrder: req.body.lastOrder }, {
    new: true,
    runValidators: true,
  })
  console.log(order);
  res.status(200).send(order);

}

module.exports = {
  getAllOrders,
  getOrder,
  updateOrder
};
