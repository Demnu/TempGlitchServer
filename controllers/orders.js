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
  Order.find({}, function (err, orders) {
    var ordersMap = [];

    orders.forEach(function (order) {
      date = new Date(order.date)
      ordersMap.push({
        id: order.orderID,
        customerName: order.customerName,
        date: date.toLocaleDateString(),
        products: order.products,
        supplierName: order.supplierName,
        lastOrder: order.lastOrder
      });
    });
    ordersMap.sort(compareDateInOrder)
    res.setHeader("Content-Range", orders.length);

    res.send(ordersMap);
  });
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
