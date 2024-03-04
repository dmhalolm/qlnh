const Order = require('../models/order');
const IngredientChange = require('../models/ingredientChange');

function getDayFromTimeStamp(str) {

    return str.slice(8, 10);
}

function getDateFromTimeStamp(str) {
    var year = str.slice(11, 15);
    var month = str.slice(4, 7);
    var day = str.slice(8, 10);
    if (month == 'Jan') month = '01';
    if (month == 'Feb') month = '02';
    if (month == 'Mar') month = '03';
    if (month == 'Apr') month = '04';
    if (month == 'May') month = '05';
    if (month == 'June') month = '06';
    if (month == 'July') month = '07';
    if (month == 'Aug') month = '08';
    if (month == 'Sept') month = '09';
    if (month == 'Oct') month = '10';
    if (month == 'Nov') month = '11';
    if (month == 'Dec') month = '12';
    return year + '-' + month + '-' + day;
}

function getMonthFromTimeStamp(str) {
    var year = str.slice(11, 15);
    var month = str.slice(4, 7);
    if (month == 'Jan') month = '01';
    if (month == 'Feb') month = '02';
    if (month == 'Mar') month = '03';
    if (month == 'Apr') month = '04';
    if (month == 'May') month = '05';
    if (month == 'June') month = '06';
    if (month == 'July') month = '07';
    if (month == 'Aug') month = '08';
    if (month == 'Sept') month = '09';
    if (month == 'Oct') month = '10';
    if (month == 'Nov') month = '11';
    if (month == 'Dec') month = '12';
    return year + '-' + month;
}

class thongkeController {
    index(req,res){
        res.render('account/regis', {errors: null });
    } 

    thongkekho(req,res,next){
        IngredientChange.find().lean()
        .then((importkho) => {
            res.render('thongke/thongkekho', {importkho});
        })
    } 

    thongketien(req,res,next){
        res.render('thongke/thongketien');
    } 

    async thongkengay(req,res,next){
        let selectedDate = req.body.selectedDay
        let listOrder = []
        let listImport = []
        let listExport = []
        let a = 0
        let totalProfit = 0
        let totalExpense = 0
        let describe
        let arr = await Order.find({status:true}).lean()
        for (let i = 0; i < arr.length; i++){
            if (selectedDate === getDateFromTimeStamp(arr[i].updatedAt.toString())){
                listOrder.push(arr[i])
                totalProfit += arr[i].totalPrice
            }

        }

        let ing = await IngredientChange.find({status:false}).lean()
        let exing = await IngredientChange.find({status:true}).lean()
        for (let i = 0; i < ing.length; i++){
            if (selectedDate === getDateFromTimeStamp(ing[i].updatedAt.toString())){
                
                totalExpense += ing[i].totalPrice
                describe = ""
                for (let k = 0; k < ing[i].Ids.length; k++){
                    if(k == ing[i].Ids.length - 1){
                        describe = describe + " nhập " + ing[i].quantityIns[k] + " " + ing[i].donviIns[k] + " " + ing[i].nameIns[k] + " giá " + ing[i].priceIns[k] + " VND/" +  ing[i].donviIns[k] 
                    }
                    else{
                        describe = describe + " nhập " + ing[i].quantityIns[k] + " " + ing[i].donviIns[k] + " " + ing[i].nameIns[k] + " giá " + ing[i].priceIns[k] + " VND/" +  ing[i].donviIns[k] + ","
                    }
                }
                ing[i].describe = describe
                listImport.push(ing[i])
            }
        }

        for (let i = 0; i < exing.length; i++){
            if (selectedDate === getDateFromTimeStamp(exing[i].updatedAt.toString())){
                
                describe = "Xuất kho " 
                for (let k = 0; k < exing[i].Ids.length; k++){
                    if(k == exing[i].Ids.length - 1){
                        describe = describe + exing[i].quantityIns[k] + " " + exing[i].donviIns[k] + " " + exing[i].nameIns[k]  
                    }
                    else{
                        describe = describe + exing[i].quantityIns[k] + " " + exing[i].donviIns[k] + " " + exing[i].nameIns[k] + "," + " "
                    }
                }
                exing[i].describe = describe
                listExport.push(exing[i])
            }
        }

        return res.render('thongke/thongkekho', {
            totalProfit: totalProfit,
            totalExpense: totalExpense,
            listOrder: listOrder,
            listImport: listImport,
            listExport: listExport,
        });

    }

    async thongkethang(req,res,next){
        let totalProfit = 0
        let totalExpense = 0
        let totalExport = 0
        let dayArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11, 12, 13, 14, 15, 16, 17, 18, 19, 20,21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
        let profitOfDayMap = {}
        let profitOfDayArray = []
        let describe
        let interest = 0
        let listImport = []
        let listExport = []
        let selectedMonth = req.body.selectedMonth
        for (const str of dayArray) {
            profitOfDayMap[str] = 0;
        }

        let arr = await Order.find({status:true}).lean()
        for (let i = 0; i < arr.length; i++){
            if (selectedMonth === getMonthFromTimeStamp(arr[i].updatedAt.toString())){
                interest += arr[i].profit
                totalProfit += arr[i].totalPrice
                let day = getDayFromTimeStamp(arr[i].updatedAt.toString());
                profitOfDayMap[Number(day)] += arr[i].totalPrice;
            }
        }
        profitOfDayArray.push(['0', 'Page Views']);
        for (let i = 1; i <= 31; i++) {
            profitOfDayArray.push([i, profitOfDayMap[i]]);
        }

        let ing = await IngredientChange.find({status:false}).lean()
        let exing = await IngredientChange.find({status:true}).lean()

        for (let i = 0; i < ing.length; i++){
            if (selectedMonth === getMonthFromTimeStamp(ing[i].updatedAt.toString())){
                
                totalExpense += ing[i].totalPrice
                describe = ""
                for (let k = 0; k < ing[i].Ids.length; k++){
                    if(k == ing[i].Ids.length - 1){
                        describe = describe + " nhập " + ing[i].quantityIns[k] + " " + ing[i].donviIns[k] + " " + ing[i].nameIns[k] + " giá " + ing[i].priceIns[k] + " VND/" +  ing[i].donviIns[k] 
                    }
                    else{
                        describe = describe + " nhập " + ing[i].quantityIns[k] + " " + ing[i].donviIns[k] + " " + ing[i].nameIns[k] + " giá " + ing[i].priceIns[k] + " VND/" +  ing[i].donviIns[k] + ","
                    }
                }
                ing[i].describe = describe
                ing[i].date = getDateFromTimeStamp(ing[i].updatedAt.toString())
                listImport.push(ing[i])
            }
        }

        for (let i = 0; i < exing.length; i++){
            if (selectedMonth === getMonthFromTimeStamp(exing[i].updatedAt.toString())){
                totalExport += exing[i].totalPrice
                describe = ""
                for (let k = 0; k < exing[i].Ids.length; k++){
                    if(k == ing[i].Ids.length - 1){
                        describe = describe + " xuất kho " + exing[i].quantityIns[k] + " " + exing[i].donviIns[k] + " " + exing[i].nameIns[k]  
                    }
                    else{
                        describe = describe + " xuất kho " + exing[i].quantityIns[k] + " " + exing[i].donviIns[k] + " " + exing[i].nameIns[k] + ","
                    }
                }
                exing[i].describe = describe
                exing[i].date = getDateFromTimeStamp(exing[i].updatedAt.toString())
                listExport.push(exing[i])
            }
        }

        interest = interest - totalExport
        
        return res.render('thongke/thongketien', {
            one: profitOfDayMap[1],
            two: profitOfDayMap[2],
            three: profitOfDayMap[3],
            four: profitOfDayMap[4],
            five: profitOfDayMap[5],
            six: profitOfDayMap[6],
            seven: profitOfDayMap[7],
            eight: profitOfDayMap[8],
            nine: profitOfDayMap[9],
            ten: profitOfDayMap[10],
            one1: profitOfDayMap[11],
            two1: profitOfDayMap[12],
            three1: profitOfDayMap[13],
            four1: profitOfDayMap[14],
            five1: profitOfDayMap[15],
            six1: profitOfDayMap[16],
            seven1: profitOfDayMap[17],
            eight1: profitOfDayMap[18],
            nine1: profitOfDayMap[19],
            ten1: profitOfDayMap[20],
            one2: profitOfDayMap[21],
            two2: profitOfDayMap[22],
            three2: profitOfDayMap[23],
            four2: profitOfDayMap[24],
            five2: profitOfDayMap[25],
            six2: profitOfDayMap[26],
            seven2: profitOfDayMap[27],
            eight2: profitOfDayMap[28],
            nine2: profitOfDayMap[29],
            ten2: profitOfDayMap[30],
            one3: profitOfDayMap[31],
            totalProfit: totalProfit,
            totalExpense: totalExpense,
            listImport: listImport,
            listExport: listExport,
            interest: interest,
            totalExport: totalExport,
        })
    }
}
 
module.exports = new thongkeController;