const express = require('express');
const router = express.Router();

const accountController = require('../app/controllers/accountController')

router.post('/regis',accountController.regis)
router.get('/changepass', accountController.passlist)
router.get('/changepass/:id', accountController.changepass)
router.post('/changepass/:id', accountController.postchangepass)
router.get('/changeadminpass', accountController.getadminchange)
router.post('/changeadminpass', accountController.postadminchange)
router.post('/:id/delete', accountController.deleteaccount)
router.get('/', accountController.index)

module.exports = router;