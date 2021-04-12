var Model = require('./model/ExcelReaderModel');

exports.excelData = function (path, callback) {
    Model.excelData(path, function(err, data) {
        callback(err, data)
    })
};