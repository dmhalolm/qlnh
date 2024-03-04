const express = require('express');
const router = express.Router();

const tableController = require('../app/controllers/tableController')

router.post('/delete', tableController.xoaban)
router.post('/themban', tableController.themban)
router.get('/', tableController.index)



module.exports = router;