const express = require('express');
const router = express.Router();

const menuController = require('../app/controllers/menuController')

router.post('/luumon', menuController.luumon)
router.get('/themmon', menuController.themmon)
router.get('/:id/edit',menuController.editDish)
router.get('/:id/delete',menuController.deleteDish)
router.get('/:id',menuController.getDishDetail)
router.post('/:id',menuController.updateDish)
router.get('/', menuController.index)

module.exports = router;