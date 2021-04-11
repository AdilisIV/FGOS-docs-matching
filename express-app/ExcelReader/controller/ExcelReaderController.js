var Model = require('./model/ExcelReaderModel');

exports.excelData = function (path, callback) {
    // Events.all(function (err, docs) {
    //     if (err) {
    //         console.log(err);
    //         return res.sendStatus(500);
    //     }
    //     res.send(docs);
    // })

    Model.excelData(path, function(err, data) {
        callback(err, data)
    })
};