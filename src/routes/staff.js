const express = require('express');
const router = express.Router();

const staffController = require('../app/controllers/staffcontroller')

router.get('/stafforder/:id',staffController.getOrder)
router.post('/create/:id', staffController.create)
router.post('/stafforder/:id/checkWarehouse', staffController.checkWarehouse)
router.get('/stafforder', staffController.stafforder)
router.get('/staffwarehouse', staffController.staffwarehouse)
router.post('/stafforder/:id/confirmPay', staffController.confirmPay)
router.get('/stafftable', staffController.stafftable)
router.use('/', staffController.index)


module.exports = router;