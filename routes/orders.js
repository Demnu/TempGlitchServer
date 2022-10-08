const express = require('express')
const router = express.Router()

const {
  getAllOrders,
  getOrder,
  updateOrder
} = require('../controllers/orders')
router.route('/:id').get(getOrder)

router.route('/').get(getAllOrders).post(updateOrder)

module.exports = router
