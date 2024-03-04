const newsRouter = require('./news')
const adminRouter = require('./admin')
const staffRouter = require('./staff')
const warehouseRouter = require('./warehouse')
const homeRouter = require('./home')
const menuRouter = require('./menu')
const tableRouter = require('./table')
const orderRouter = require('./order')
const accountRouter = require('./account')
const thongkeRouter = require('./thongke')

function route(app) {
    app.use('/news', newsRouter)
    app.use('/admin', adminRouter)
    app.use('/staff', staffRouter)
    app.use('/warehouse', warehouseRouter)
    app.use('/menu', menuRouter)
    app.use('/table', tableRouter)
    app.use('/order', orderRouter)
    app.use('/account', accountRouter)
    app.use('/thongke', thongkeRouter)
    app.use('/', homeRouter)
}

module.exports = route