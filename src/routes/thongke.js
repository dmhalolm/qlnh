const express = require('express');
const router = express.Router();

const thongkeController = require('../app/controllers/thongkeController')

router.get('/thongkekho', thongkeController.thongkekho)
router.post('/thongkekho/getInfo', thongkeController.thongkengay)
router.post('/thongkethang/getInfo', thongkeController.thongkethang)
router.get('/thongketien', thongkeController.thongketien)
router.get('/', thongkeController.index)

module.exports = router;