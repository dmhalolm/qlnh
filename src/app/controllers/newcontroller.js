const account = require('../models/account')
const bcrypt = require('bcrypt');
const {mutipleMongooseToObject} = require('../../util/mongoose')

class NewsController {
    index(req,res,next){
        account.find({}).lean()
        .then((accounts) => {
            res.render('news', { accounts});
          })
        .catch((error) => {
            next(error);
        })
    }

    async show(req,res){
        try {
            const accounts = await account.find({});
            res.json(accounts);
          } catch (error) {
            res.status(400).json({ err: "ERROR!!!"});
        }
    }
}

module.exports = new NewsController;