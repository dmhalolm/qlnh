const Order = require('../models/order');
const Table = require('../models/table');
const Menu = require('../models/menu');
const Warehouse = require('../models/warehouse');

const mongoose = require('mongoose');

class orderController {
    index(req,res,next){
        Table.find({status:true}).lean()
        .then((tables) => {
            Order.find({status:false}).lean() 
            .then((orders) => {
                res.render('order/order', {
                    orders,
                    tables,
                })
            })
            .catch((error) => {
                next(error);
            })
        })
        .catch((error) => {
            next(error);
        })
    }

    create(req,res,next){
        const tableNames = req.body.name
        const tableIds = req.params.id
        let name = "Hóa đơn " + req.body.name
        
        const order = new Order({
            name: name,
            tables: tableIds,
            tableNames: tableNames,
        })
        order.save()
        .then(() => {
            Table.updateOne({_id:req.params.id}, {
                status: false,
                orderId: order._id,
            })
            .then(() => res.redirect('/table'))
            .catch((error) => {
                next(error);
            })
        })
        .catch((error) => {
            next(error);
        })
    }

    getOrder(req,res,next){
        Warehouse.find({}).lean()
        .then((warehouses) => {
            Menu.find({}).lean()  
            .then((dish) => {
                Order.findOne({_id: req.params.id}).lean()
                .then((orders) => {
                    res.render('order/orderDetail',{
                      warehouses,
                      orders,
                      dish  
                    })
                })
            })
            .catch((error) => {
                next(error);
            })
        })
        .catch((error) => {
            next(error);
        })
    }

    checkWarehouse(req,res,next){
        const ingredientList = []
        const ingredientQuantity = []
        const ingredientQuantitys = []
        const menuIds = []
        const menuQuantity = []
        const ingredientsNew = []
        let vitri
        let a
        let giatri
        let soluong
        let sosanh = 0
        const dishList = []
        let b
        let c
        let profit = 0
        let idOrder = req.params.id

        for (var key in req.body){
            if (key !== 'totalPrice'){
                menuIds.push((key))
                menuQuantity.push(parseInt(req.body[key]))
            }
        }
        Menu.find({"_id": { "$in": menuIds}}).lean()
            .then((menus) => {
                function round(num) {
                    var m = Number((Math.abs(num) * 100).toPrecision(15));
                    return Math.round(m) / 100 * Math.sign(num);
                }
                for(let k = 0 ; k < menus.length ; k++){
                    for(let i = 0 ; i < menus[k].ingredients.length ; i++){
                        giatri = menus[k].ingredients[i].ingredientsId
                        soluong = round(menus[k].ingredients[i].quantity) * menuQuantity[k]
                        // soluong = round(soluong)
                        a = 0
                        for(let j = 0 ; j < ingredientList.length ; j++){
                            if(giatri.equals(ingredientList[j])) {
                                a += 1,
                                vitri = j
                            }
                        }

                        if(a === 0) {
                            ingredientList.push(giatri)
                            ingredientQuantity.push(soluong)
                        }
                        else {
                            ingredientQuantity[vitri] += soluong
                        }
                    }
                }
                for(let k = 0 ; k < ingredientQuantity.length ; k++){
                    ingredientQuantity[k] = round(ingredientQuantity[k])
                }

                Warehouse.find({"_id": { "$in": ingredientList}}).lean()
                .then((ingredients) => {
                    if(ingredients.length < ingredientList.length) {
                        Warehouse.find({}).lean()
                        .then((warehouses) => {
                            Menu.find({}).lean()  
                            .then((dish) => {
                                Order.findOne({_id: req.params.id}).lean()
                                .then((orders) => {
                                    res.render('order/orderDetail',{
                                    warehouses,
                                    orders,
                                    dish,
                                    vipErrorMessage: 'Thêm món thất bại do không đủ nguyên liệu'  
                                    })
                                })
                            })
                            .catch((error) => {
                                next(error);
                            })
                        })
                        .catch((error) => {
                            next(error);
                        })
                    }
                    else{
                        for(let k = 0 ; k < ingredients.length ; k++){
                            for(let i = 0 ; i < ingredientList.length ; i++){
                                if(String(ingredients[k]._id) === String(ingredientList[i])){
                                    ingredientQuantitys.push(ingredientQuantity[i])
                                }
                            }
                        }
                        for(let k = 0 ; k < ingredients.length ; k++){
                            if(ingredients[k].number < ingredientQuantitys[k]){
                                sosanh +=1
                            }
                        }
                        if(sosanh == 0) {
                            Warehouse.find({}).lean()
                            .then((warehouses) => {
                                Menu.find({}).lean()  
                                .then((dish) => {
                                    Order.findOne({_id: req.params.id}).lean()
                                    .then((orders) => {
                                        
                                        for(let k = 0 ; k < menuIds.length ; k++){
                                            // orders.dishes.push({
                                            //     dishId: menus[k]._id,
                                            //     nameDish: menus[k].name,
                                            //     priceDish: menus[k].price,
                                            //     quantityDish: menuQuantity[k]
                                            // })


                                            if(orders.dishes.length === 0){
                                                orders.dishes.push({
                                                    dishId: menus[k]._id,
                                                    nameDish: menus[k].name,
                                                    priceDish: menus[k].price,
                                                    quantityDish: menuQuantity[k]
                                                })
                                            }
                                            else if(orders.dishes.length !== 0){
                                                b = 0
                                                for(let i = 0 ; i < orders.dishes.length ; i++){
                                                    if(orders.dishes[i].dishId.equals(menuIds[k])){
                                                        orders.dishes[i].quantityDish += menuQuantity[k];
                                                        b += 1
                                                    }    
                                                }
                                                if(b == 0) {
                                                    orders.dishes.push({
                                                        dishId: menus[k]._id,
                                                        nameDish: menus[k].name,
                                                        priceDish: menus[k].price,
                                                        quantityDish: menuQuantity[k]
                                                    }) 
                                                }
                                            }
                                        }
                                        orders.totalPrice = Number(req.body.totalPrice) + Number(orders.totalPrice)
                                        for(let k = 0 ; k < ingredients.length ; k++){
                                            c = Number(ingredients[k].tbgia) * Number(ingredientQuantitys[k])
                                            profit += c
                                        }
                                        orders.profit = Number(orders.profit) + Number(req.body.totalPrice) - Number(profit)
                                        for(let k = 0 ; k < ingredients.length ; k++){
                                            ingredients[k].number -= ingredientQuantitys[k]
                                            ingredients[k].number = round(ingredients[k].number)
                                        }
                                        for(let k = 0 ; k < ingredients.length ; k++){
                                            ingredientsNew.push({
                                                name: ingredients[k].name,
                                                number:ingredients[k].number,
                                                donvi: ingredients[k].donvi
                                            })
                                        }
                                        Order.updateOne({_id:req.params.id}, orders)
                                        .then(() => {
                                            for(let k = 0 ; k < ingredients.length ; k++){
                                                Warehouse.updateOne({_id: ingredients[k]._id}, ingredients[k])
                                                .then()
                                                .catch((error) => {
                                                    next(error);
                                                })
                                            }
                                            // Warehouse.updateMany({"_id": { "$in": ingredientList}}, {
                                            //     name: ingredients.name,
                                            //     number:ingredients.number,
                                            //     donvi: ingredients.donvi
                                            // })
                                            // .then(() => res.redirect('/order'))
                                            // .catch((error) => {
                                            //     next(error);
                                            // })
                                            Warehouse.find({}).lean()
                                            .then((warehouses) => {
                                                Menu.find({}).lean()  
                                                .then((dish) => {
                                                    Order.findOne({_id: req.params.id}).lean()
                                                    .then((orders) => {
                                                        res.render('order/orderDetail',{
                                                        warehouses,
                                                        orders,
                                                        dish  
                                                        })
                                                    })
                                                })
                                                .catch((error) => {
                                                    next(error);
                                                })
                                            })
                                            .catch((error) => {
                                                next(error);
                                            })
                                        })
                                        .catch((error) => {
                                            next(error);
                                        })
                                    })
                                    .catch((error) => {
                                        next(error);
                                    })
                                })
                                .catch((error) => {
                                    next(error);
                                })
                            })
                            .catch((error) => {
                                next(error);
                            })
                        }
                        else{
                            Warehouse.find({}).lean()
                            .then((warehouses) => {
                                Menu.find({}).lean()  
                                .then((dish) => {
                                    Order.findOne({_id: req.params.id}).lean()
                                    .then((orders) => {
                                        res.render('order/orderDetail',{
                                        warehouses,
                                        orders,
                                        dish,
                                        vipErrorMessage: 'Thêm món thất bại do không đủ nguyên liệu'  
                                        })
                                    })
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
                })
                .catch((error) => {
                    next(error);
                })
            })
            .catch((error) => {
                next(error);
             })
    }

    confirmPay(req,res,next){
        let tableIds = []
        Order.updateOne({_id: req.params.id}, {
            status: true,
            totalPrice: req.body.totalPrice
        })
        .then(() => {
            Order.findOne({_id: req.params.id}).lean()
            .then((order) => {
                tableIds = order.tables
                Table.updateMany({"_id": { "$in": tableIds}}, { status: true })
                .then(() => res.redirect('/table'))
                .catch((error) => {
                    next(error);
                })
            })
            .catch((error) => {
                next(error);
            })
        })  
        .catch((error) => {
            next(error);
        })
        
    }

    getOrderThongke(req,res,next){
        Warehouse.find({}).lean()
        .then((warehouses) => {
            Menu.find({}).lean()  
            .then((dish) => {
                Order.findOne({_id: req.params.id}).lean()
                .then((orders) => {
                    res.render('order/orderthongke',{
                      warehouses,
                      orders,
                      dish  
                    })
                })
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


module.exports = new orderController;