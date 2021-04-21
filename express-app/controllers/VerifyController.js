var mammoth = require("mammoth");
var string_helper = require('../public/js/string-helper');

var ExcelController = require('../ExcelReader/controller/ExcelReaderController');
var DocConverterController = require('../controllers/DocConverterController');
var htmlHelper = require('../../core/HtmlTableHelper')


exports.verify = async function (req, res) {

    console.log(req.query.wordpath);
    console.log(req.query.excelpath);

    await Promise.all([
        DocConverterController.convert(req.query.wordpath),
        ExcelController.excelData(req.query.excelpath)
    ])
    .then(([pathToDocx, excelCategories]) => {
        mammoth.convertToHtml({ path: pathToDocx })
            .then(function (result) {
                var htmlStr = result.value.toString(); // generated HTML
                var tableStr = htmlHelper.extractTableStrFrom(htmlStr)
                var docDictCodesAndDescs = htmlHelper.searchDiscAndCodeInTable(tableStr)

                let verificationResultStr = makeVerification(docDictCodesAndDescs, excelCategories)
                res.send(verificationResultStr);
            })
            .done();
    })
    .catch((err) => {
        res.send(err)
        return
    })

};

function makeVerification(docData, excelCategories) {
    var wellDone = true
    var verificationResult = ""

    for (const [key, value] of Object.entries(docData)) {
        for (let i = 0; i < excelCategories.length; i++) {
            if (excelCategories[i]['__EMPTY_1'] == key) {
                unmatchedCodes = match(excelCategories[i], value)

                if (unmatchedCodes.length > 0) {
                    wellDone = false
                    console.log('В Word не стоит отметка для:\n', key, ': ', unmatchedCodes);
                    verificationResult += `В Word не стоит отметка для:\n ${key} : ${unmatchedCodes}\n\n`;
                }
            }
        }
    }

    console.log(wellDone == false ? 'ЕСТЬ ОШИБКИ в ЗАПОЛНЕНИИ WORD' : 'Программа дисциплин (word) заполнена верно')
    verificationResult += wellDone == false ? 'ЕСТЬ ОШИБКИ в ЗАПОЛНЕНИИ WORD' : 'Программа дисциплин (word) заполнена верно'

    return verificationResult;
}

function match(excelObject, codesInWord) {

    unmatched = extractKeysFrom(excelObject)

    for(let i = 0; i < unmatched.length; i++) {
        for(let j = 0; j < codesInWord.length; j++) {

            if (unmatched[i] == codesInWord[j]) {
                unmatched.splice(i, 1);
            }
        }
    }

    return unmatched;
}

function extractKeysFrom(excelObject) {
    var ans = []
  
    for (const [key, value] of Object.entries(excelObject)) {
      if (key != "__EMPTY" & key != "__EMPTY_1") {
        ans.push(key);
      }
    }
  
    return ans;
  }