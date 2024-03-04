const account = require('../models/account')
const bcrypt = require('bcrypt');

class homeController {
    index(req,res,next){
        const username = req.body.username;
        const password = req.body.password;
        account.findOne({username: username})
        .then(data => {
            if(data){
                if(username === 'admin'){
                    account.findOne({username: 'admin'}).lean()
                    .then((admin) => {
                        if(password === admin.password){
                            return res.redirect('/warehouse')
                        }
                        else{
                            return res.render('home',{
                                errors: 'Mật khẩu không đúng'
                            })
                        }
                    })
                }
                else if (password === data.password){
                    return res.redirect('/staff/stafftable')
                }
                else {
                    return res.render('home',{
                        errors: 'Mật khẩu không đúng'
                    })
                }
            }
            else {
                return res.render('home',{
                    errors: 'Tên đăng nhập không tồn tại'
                })
            }
        }
        )
        .catch(err => {
            next(err)
        })    
    }

}

module.exports = new homeController;