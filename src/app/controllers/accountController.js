const Account = require('../models/account')

class accountController {
    index(req,res){
        res.render('account/regis', {errors: null });
    } 

    regis(req,res,next){
        const username = req.body.username
        const password = req.body.password
        Account.findOne({username: username}).lean()
        .then((data) => {
            if(data){
                res.render('account/regis', {errors: 'Tên đăng nhập đã tồn tại'})
            }
            else{
                const account = new Account(req.body)
                account.save()
                .then(() => res.render('account/regis', {errors: 'Tạo tài khoản thành công'}))
                .catch((error) => {
                    next(error);
                })
            }
        })
        .catch(err => {
            next(err)
        }) 
    }

    passlist(req,res,next){
        let accounts = []
        Account.find().lean()
        .then((account) => {
            for(let i = 0; i< account.length; i++){
                if(account[i].username != 'admin'){
                    accounts.push(account[i])
                }
            }
            res.render('account/changepass', { accounts });
        })
        .catch((error) => {
            next(error);
        })
    }

    changepass(req,res,next){
        Account.findOne({_id: req.params.id}).lean()
        .then((account) => {
            res.render('account/changepassid', {account})
        })
        .catch((error) => {
            next(error);
        })
    }

    postchangepass(req,res,next){
        Account.updateOne({_id:req.params.id}, {password: req.body.password})
        .then(() => res.redirect('/account/changepass'))
        .catch((error) => {
            next(error);
        })
    }

    getadminchange(req,res,next){
        res.render('account/changepassadmin')
    }

    deleteaccount(req,res,next){
        Account.findByIdAndDelete(req.params.id)
            .then(result => {
                res.redirect('/account/changepass')
            })
            .catch(err => next(err))
    }

    postadminchange(req,res,next){
        const oldpassword = req.body.oldpassword
        const newpassword = req.body.newpassword
        Account.findOne({username: 'admin'}).lean()
        .then((account) => {
            if(oldpassword == newpassword){
                res.render('account/changepassadmin', {
                    errors: 'Mật khẩu mới không được trùng với mật khẩu cũ'
                })
            }
            else if(oldpassword != account.password){
                res.render('account/changepassadmin', {
                    errors: 'Mật khẩu cũ không chính xác'
                })
            }
            else {
                Account.updateOne({username: 'admin'}, {password: newpassword})
                .then(() => {
                    res.render('account/changepassadmin',{
                        errors: 'Đổi mật khẩu thành công'
                    })
                })
                .catch((error) => {
                    next(error);
                })
            }
        })
        .catch((error) => {
            next(error);
        })
    }
}
 
module.exports = new accountController;