const express = require('express');
const router = express.Router();

const warehouseController = require('../app/controllers/warehouseController')

router.get('/import', warehouseController.getImport)
router.get('/export', warehouseController.getExport)
router.get('/themnguyenlieu', warehouseController.themnguyenlieu)
router.post('/postthemnguyenlieu', warehouseController.postthemnguyenlieu)
router.get('/:id',warehouseController.editIngredient)
router.post('/importIngredient',warehouseController.importIngredient)
router.post('/exportIngredient',warehouseController.exportIngredient)
router.post('/:id/delete',warehouseController.deleteIngredient)
router.post('/:id',warehouseController.updateIngredient)
router.get('/', warehouseController.index)

module.exports = router;