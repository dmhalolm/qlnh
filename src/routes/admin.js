const express = require('express');
const router = express.Router();

const siteController = require('../app/controllers/sitecontroller')


router.use('/', siteController.index)
// router.use('/', newsController.index)

module.exports = router;