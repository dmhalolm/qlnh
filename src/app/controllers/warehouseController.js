const Warehouse = require('../models/warehouse');
const IngredientChange = require('../models/ingredientChange');

class warehouseController {
    index(req,res,next){
        Warehouse.find({}).lean()
        .then((warehouses) => {
            res.render('warehouse/warehouse', { warehouses });
          })
        .catch((error) => {
            next(error);
        })
    } 

    themnguyenlieu(req,res,next){
        Warehouse.find({}).lean()
        .then((warehouses) => {
            res.render('warehouse/them-nguyen-lieu', { warehouses });
          })
        .catch((error) => {
            next(error);
        })
    }

    postthemnguyenlieu(req,res,next){
        const ingredient = new Warehouse({
            name: req.body.name,
            number: 0,
            tbgia: 0,
            warningnum: req.body.number,
            donvi: req.body.donvi,
            totalimport: 0,
        })
        ingredient.save()
        .then(() => res.redirect('/warehouse'))
        .catch((error) => {
            next(error);
        })
        // res.json(req.body)
    }

    editIngredient(req,res,next){
        Warehouse.findOne({_id: req.params.id}).lean()
        .then((ingredient) => {
            res.render('warehouse/ingredientDetail', {ingredient})
        })
        .catch((error) => {
            next(error);
        })
    }   
    updateIngredient(req,res,next){
        Warehouse.updateOne({_id:req.params.id}, req.body)
        .then(() => res.redirect('/warehouse'))
        .catch((error) => {
            next(error);
        })
    }    

    getImport(req,res,next){
        Warehouse.find({}).lean()
        .then((warehouses) => {
            res.render('warehouse/importIngredient', { warehouses });
          })
        .catch((error) => {
            next(error);
        })
    }

    getExport(req,res,next){
        Warehouse.find({}).lean()
        .then((warehouses) => {
            res.render('warehouse/exportIngredient', { warehouses });
          })
        .catch((error) => {
            next(error);
        })
    }

    deleteIngredient(req,res,next){
        Warehouse.findByIdAndDelete(req.params.id)
            .then(result => {
                res.redirect('/warehouse')
            })
            .catch(err => next(err))
    }

    importIngredient(req,res,next){
        const ids = []
        const nameIns = []
        const donviIns = []
        const priceIns = []
        const quantityIns =  []
        const priceTo=  []
        const totalPrice = req.body.totalPrice
        let num = 0
        let totalnum
        let tbgia

        for (var key in req.body){
            if (key !== 'totalPrice') {
                if(key.startsWith('donvi')){
                    donviIns.push(req.body[key])
                }
                else if(key.startsWith('price')){
                    priceIns.push(req.body[key])
                }
                else if(key.startsWith('quantity')){
                    quantityIns.push(req.body[key])
                }
                else if(key.startsWith('total')){
                    priceTo.push(req.body[key])
                }
                else {
                    ids.push((key))
                    nameIns.push(req.body[key])
                }
            }
        }

        const importInfor = new IngredientChange({
            Ids: ids,
            nameIns: nameIns,
            donviIns: donviIns,
            priceIns: priceIns,
            quantityIns: quantityIns,
            priceTo: priceTo,
            totalPrice: totalPrice
        })
        
        importInfor.save()
        .then(() => {
            Warehouse.find({"_id": { "$in": ids}}).lean()
            .then((warehouses) => {
                function round(num) {
                    var m = Number((Math.abs(num) * 100).toPrecision(15));
                    return Math.round(m) / 100 * Math.sign(num);
                }
                for(let k = 0 ; k < warehouses.length ; k++){
                    num = Number(warehouses[k].number)
                    totalnum = Number(warehouses[k].totalimport)
                    tbgia = Number(warehouses[k].tbgia) * Number(totalnum) + Number(totalPrice)
                    num += Number(quantityIns[k])
                    totalnum += Number(quantityIns[k])
                    tbgia = parseInt(Number(tbgia) / Number(totalnum)) 

                    Warehouse.updateOne({_id: ids[k]}, {
                        number: num, 
                        totalimport: totalnum, 
                        tbgia: tbgia,
                    })
                    .then()  
                    .catch((error) => {
                        next(error);
                }) 
                }
                res.redirect('/warehouse')                         
            })
            .catch((error) => {
                next(error);
            })
        })
        .catch((error) => {
            next(error);
        })

    }

    exportIngredient(req,res,next){
        // res.json(req.body)
        const ids = []
        const nameIns = []
        const donviIns = []
        const quantityIns =  []
        const totalPrice = req.body.totalPrice

        for (var key in req.body){
            if (key !== 'totalPrice') {
                if(key.startsWith('donvi')){
                    donviIns.push(req.body[key])
                }
                else if(key.startsWith('quantity')){
                    quantityIns.push(req.body[key])
                }
                else {
                    ids.push((key))
                    nameIns.push(req.body[key])
                }
            }
        }
        const exportInfor = new IngredientChange({
            Ids: ids,
            nameIns: nameIns,
            donviIns: donviIns,
            quantityIns: quantityIns,
            totalPrice: totalPrice,
            status: true,
        })
        exportInfor.save()
        .then(() => {
            Warehouse.find({"_id": { "$in": ids}}).lean()
            .then((warehouses) => {
                function round(num) {
                    var m = Number((Math.abs(num) * 100).toPrecision(15));
                    return Math.round(m) / 100 * Math.sign(num);
                }
                for(let k = 0 ; k < warehouses.length ; k++){
                    let num = Number(warehouses[k].number)
                    num -= Number(quantityIns[k])
                    num = round(num)
                    Warehouse.updateOne({_id: ids[k]}, {number: num})
                    .then()  
                    .catch((error) => {
                        next(error);
                }) 
                }
                res.redirect('/warehouse')                         
            })
            .catch((error) => {
                next(error);
            })
        })
        .catch((error) => {
            next(error);
        })
    }
}
 
module.exports = new warehouseController;