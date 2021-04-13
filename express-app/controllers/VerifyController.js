var mammoth = require("mammoth");
var string_helper = require('../public/js/string-helper');

var ExcelController = require('../ExcelReader/controller/ExcelReaderController');
var DocConverterController = require('../controllers/DocConverterController');
var htmlHelper = require('../../core/HtmlTableHelper')


exports.verify = function (req, res) {

    console.log(req.query.wordpath);
    console.log(req.query.excelpath);

    DocConverterController.convert(req.query.wordpath, function (err, pathToDocx) {
        if (err) {
            res.send(err);
        }

        mammoth.convertToHtml({ path: pathToDocx })
            .then(function (result) {
                var html = result.value; // generated HTML
                var messages = result.messages; // Any messages, such as warnings during conversion, like "Unrecognised paragraph style: '_2СтильЗаголовка' (Style ID: 22)"

                var str = html.toString() + "";
                let targetIdx = str.indexOf("(индикаторы) по модулю");

                let targetTableIdx = str.indexOf("<table><tr><td>", targetIdx);

                // cut str
                let closedTableTagIdx = str.indexOf("</table>", targetTableIdx)
                str = str.substr(targetTableIdx, closedTableTagIdx - targetTableIdx + "</table>".length);

                var resultDict = htmlHelper.searchDiscAndCodeInTable(str)

                ExcelController.excelData(req.query.excelpath, function (err, excelCategories) {
                    if (err | !excelCategories) {
                        console.log(err);
                        res.send('Не удалось обработать excel файл')
                    }

                    var wellDone = true
                    var verificationResult = ""

                    for (const [key, value] of Object.entries(resultDict)) {
                        for (let i = 0; i < excelCategories.length; i++) {
                            if (excelCategories[i]['__EMPTY_1'] == key) {
                                unmatchedCodes = match(excelCategories[i], value)

                                if (unmatchedCodes.length > 0) {
                                    wellDone = false
                                    console.log('В Excel не стоит отметка для:\n', key, ': ', unmatchedCodes);
                                    verificationResult += `В Excel не стоит отметка для:\n ${key} : ${unmatchedCodes}\n\n`;
                                }
                            }
                        }
                    }

                    console.log(wellDone == false ? 'ЕСТЬ ОШИБКИ в ЗАПОЛНЕНИИ EXCEL' : 'Компетенции в карте (excel) заполнены верно')
                    verificationResult += wellDone == false ? 'ЕСТЬ ОШИБКИ в ЗАПОЛНЕНИИ EXCEL' : 'Компетенции в карте (excel) заполнены верно'

                    res.send(verificationResult);
                })

            })
            .done();
    })

};


function match(excelObject, codesArray) {
    unmatched = codesArray.slice(0)

    for(let i = 0; i < unmatched.length; i++) {
        for (const [key, value] of Object.entries(excelObject)) {
            if (unmatched[i] == key) {
                unmatched.splice(i, 1);
            }
        }
    }

    return unmatched;
}