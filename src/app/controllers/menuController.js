const Warehouse = require('../models/warehouse');
const Menu = require('../models/menu');

const mongoose = require('mongoose');
const warehouse = require('../models/warehouse');

class menuController {
    index(req,res,next){
        Menu.find({}).lean()
        .then((menus) => {
            res.render('menu/menu', { menus });
        })
        .catch((error) => {
            next(error);
        })
    } 
    themmon(req,res,next){
        Warehouse.find({}).lean()
        .then((warehouses) => {
            res.render('menu/them-mon', { warehouses });
          })
        .catch((error) => {
            next(error);
        })
    }
    luumon(req,res,next){
        const ingredientList = []
        const ingredientQuantity = []
        const nameList = []
        const donviList = []
        const name = req.body.name
        const price = req.body.price
        for (var key in req.body){
            if (key !== 'name' && key !== 'price') {
                if(key.startsWith('donvi')){
                    donviList.push(req.body[key])
                }
                else if(key.startsWith('name')){
                    nameList.push(req.body[key])
                }
                else {
                    ingredientList.push((key))
                    ingredientQuantity.push(req.body[key])
                }
            }
        }
        const ingredients = []
        
        for (let i = 0; i < ingredientList.length; i++) {
            if(ingredientQuantity[i] > 0){
                ingredients.push({
                    ingredientsId: ingredientList[i],
                    quantity: ingredientQuantity[i],
                    nameIn: nameList[i],
                    donviIn: donviList[i]
                }) 
            }
        }
        const menu = new Menu({
            name: name,
            price: price,
            ingredients: ingredients,
        })
        menu.save()
        .then(() => res.redirect('/menu'))
        .catch((error) => {
            next(error);
        })
    }

    getDishDetail(req,res,next){
        Menu.findOne({_id: req.params.id}).lean()  
        .then((dish) => {
            res.render('menu/dishDetail', {dish})
        })
        .catch((error) => {
            next(error);
        })
    }

    editDish(req,res,next){
        Warehouse.find({}).lean()
        .then((warehouses) => {
            Menu.findOne({_id: req.params.id}).lean()  
            .then((dish) => {
                res.render('menu/editDish', {
                    dish,
                    warehouses: warehouses,
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

    updateDish(req,res,next){
        const ingredientList = []
        const ingredientQuantity = []
        const nameList = []
        const donviList = []
        const name = req.body.name
        const price = req.body.price
        for (var key in req.body){
            if (key !== 'name' && key !== 'price') {
                if(key.startsWith('donvi')){
                    donviList.push(req.body[key])
                }
                else if(key.startsWith('name')){
                    nameList.push(req.body[key])
                }
                else {
                    ingredientList.push((key))
                    ingredientQuantity.push(req.body[key])
                }
            }
        }
        const ingredients = []
        
        for (let i = 0; i < ingredientList.length; i++) {
            if(ingredientQuantity[i] > 0){
                ingredients.push({
                    ingredientsId: ingredientList[i],
                    quantity: ingredientQuantity[i],
                    nameIn: nameList[i],
                    donviIn: donviList[i]
                }) 
            }
        }
        const menu = ({
            name: name,
            price: price,
            ingredients: ingredients,
        })
        Menu.updateOne({_id:req.params.id}, menu)
        .then(() => res.redirect('/menu'))
        .catch((error) => {
            next(error);
        })
    }

    deleteDish(req,res,next){
        Menu.findByIdAndDelete(req.params.id)
            .then(result => {
                res.redirect('/menu')
            })
            .catch(err => next(err))
    }
 }
 
 module.exports = new menuController;
