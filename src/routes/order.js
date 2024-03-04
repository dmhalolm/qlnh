const express = require('express');
const router = express.Router();

const orderController = require('../app/controllers/orderController')

router.get('/:id',orderController.getOrder)
router.get('/:id/thongke',orderController.getOrderThongke)
router.post('/create/:id', orderController.create)
router.post('/:id/checkWarehouse', orderController.checkWarehouse)
router.post('/:id/confirmPay', orderController.confirmPay)
router.get('/', orderController.index)


module.exports = router;