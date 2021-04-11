var mammoth = require("mammoth");
const { spawn, spawnSync } = require('child_process');
var string_helper = require('../public/js/string-helper');

var ExcelController = require('../ExcelReader/controller/ExcelReaderController');


exports.verify = function (req, res) {

    console.log(req.query.wordpath);
    console.log(req.query.excelpath);

    mammoth.convertToHtml({path: req.query.wordpath})
    .then(function(result){
        var html = result.value; // generated HTML
        var messages = result.messages; // Any messages, such as warnings during conversion

        var str = html.toString() + "";
        let targetIdx = str.indexOf("(индикаторы) по модулю");

        let targetTableIdx = str.indexOf("<table><tr><td>", targetIdx);

        // cut str
        let closedTableTagIdx = str.indexOf("</table>", targetTableIdx)
        str = str.substr(targetTableIdx, closedTableTagIdx - targetTableIdx + "</table>".length);


        const pyProg = spawnSync('python3', ['./core/table2dataframe.py', str]);
        // let resultStr = pyProg.stdout.toString().replaceAll("'", '"');
        var resultStr = pyProg.stdout.toString()
        resultStr = string_helper.replaceAll(resultStr, "'", '"')

        var resultDict = JSON.parse(resultStr);
        // let excelCategories = readExcel()

        ExcelController.excelData(req.query.excelpath, function(err, excelCategories) {
            if (err | !excelCategories) {
                console.log(err);
                res.sendStatus(500)
            }

            var wellDone = true
            var verificationResult = ""

            for (const [key, value] of Object.entries(resultDict)) {
                for(let i = 0; i < excelCategories.length; i++) {
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
            verificationResult.r

            res.send(verificationResult);
        })

    })
    .done();

    // Events.all(function (err, docs) {
    //     if (err) {
    //         console.log(err);
    //         return res.sendStatus(500);
    //     }
    //     res.send(docs);
    // })
};


function runScript() {
    mammoth.convertToHtml({path: "docs/word/RPM_RPD_IST_Explutats_2_sm_1.docx"})
    .then(function(result){
        var html = result.value; // generated HTML
        var messages = result.messages; // Any messages, such as warnings during conversion

        var str = html.toString() + "";
        let targetIdx = str.indexOf("(индикаторы) по модулю");

        let targetTableIdx = str.indexOf("<table><tr><td>", targetIdx);

        // cut str
        let closedTableTagIdx = str.indexOf("</table>", targetTableIdx)
        str = str.substr(targetTableIdx, closedTableTagIdx - targetTableIdx + "</table>".length);


        const pyProg = spawnSync('python3', ['./core/table2dataframe.py', str]);
        let resultStr = pyProg.stdout.toString().replaceAll("'", '"');

        var resultDict = JSON.parse(resultStr);
        let excelCategories = readExcel()

        var wellDone = true

        for (const [key, value] of Object.entries(resultDict)) {
            for(let i = 0; i < excelCategories.length; i++) {
                if (excelCategories[i]['__EMPTY_1'] == key) {
                    unmatchedCodes = match(excelCategories[i], value)

                    if (unmatchedCodes.length > 0) {
                        wellDone = false
                        console.log('В Excel не стоит отметка для:\n', key, ': ', unmatchedCodes);
                    }
                }
            }
        }

        console.log(wellDone == false ? 'ЕСТЬ ОШИБКИ в ЗАПОЛНЕНИИ EXCEL' : '')

        return 'FUCK'

    })
    .done();
}


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