const express = require('express');
const router = express.Router();

const newsController = require('../app/controllers/newcontroller')


router.use('/a', newsController.show)
router.get('/', newsController.index)

module.exports = router;