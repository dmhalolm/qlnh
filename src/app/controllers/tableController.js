const Table = require('../models/table');

class tableController {
    index(req,res,next){
        Table.find({}).lean()
        .then((tables) => {
            Table.find({status:true}).lean()
            .then((tablesno) => {
                res.render('table/table', {
                    tables,
                    tablesno,
                });
            })
        })
        .catch((error) => {
            next(error);
        })

    } 
    themban(req,res,next){
        const table = new Table(req.body)
        table.save()
        .then(() => res.redirect('/table'))
        .catch((error) => {
            next(error);
        })
    }

    xoaban(req,res,next){
        let tableIds = []
        for (var key in req.body){
            tableIds.push(req.body[key])
        }
        Table.deleteMany({"_id": { "$in": tableIds}})
            .then(result => {
                res.redirect('/table')
            })
            .catch(err => next(err))
    }
}
 
module.exports = new tableController;