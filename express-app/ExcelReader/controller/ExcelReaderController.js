var Model = require('./model/ExcelReaderModel');

exports.excelData = async function (path) {
    return new Promise((resolve, reject) => {
        Model.excelData(path, function(err, data) {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
};