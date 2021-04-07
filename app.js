// const officeapi = require('@microsoft/office-js');
var mammoth = require("mammoth");
const { spawn, spawnSync } = require('child_process');
const reader = require('xlsx')

var string_helper = require('./core/string-helper');

Array.prototype.remove = function(index) {
    this.splice(index, 1);
}


console.log('API called successfully');


mammoth.convertToHtml({path: "docs/word/RPM_RPD_IST_Explutats_2_sm_1.docx"})
    .then(function(result){
        var html = result.value; // The generated HTML
        var messages = result.messages; // Any messages, such as warnings during conversion
        // console.log(html);

        var str = html.toString() + "";
        // let str = '/em></p></td></tr></table><ol><li>Распределение компетенций по дисциплинам модуля, планируемые результаты обучения (индикаторы) по модулю </li>';
        let targetIdx = str.indexOf("(индикаторы) по модулю");

        let targetTableIdx = str.indexOf("<table><tr><td>", targetIdx);

        // cut str
        let closedTableTagIdx = str.indexOf("</table>", targetTableIdx)
        str = str.substr(targetTableIdx, closedTableTagIdx - targetTableIdx + "</table>".length);
        // console.log(str);


        const pyProg = spawnSync('python3', ['./core/table2dataframe.py', str]);
        let resultStr = pyProg.stdout.toString().replaceAll("'", '"');

        var resultDict = JSON.parse(resultStr);
        let excelCategories = readExcel()

        // console.log(excelCategories[0]['УК-1'])
        // console.log(excelCategories)
        // console.log(resultDict)

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

    })
    .done();

function match(excelObject, codesArray) {
    /* сравнить
    {
        __EMPTY: '1.17.1',
        __EMPTY_1: 'Корпоративные информационные системы',
        'ОПК-7': '*',
        'ПК-1': '*'
      }

      и

      [ 'ОПК 7', 'ПК 1' ]
      */

    unmatched = codesArray.slice(0)

    for(let i = 0; i < unmatched.length; i++) {
        for (const [key, value] of Object.entries(excelObject)) {
            // console.log(codesArray[i])
            // console.log(key)
            if (unmatched[i] == key) {
                unmatched.remove(i)
            }
        }
    }

    return unmatched;
}

function readExcel() {
    // let filePath = './docs/excel/matrix_kompetentsiy.xlsx'
    let filePath = './docs/excel/Primer_matritsy_kompetentsiy-2.xlsx' // wrong

    let file = reader.readFile(filePath, {sheetStubs: true})
    let data = []
    const sheets = file.SheetNames

    for(let i = 0; i < sheets.length; i++) {
        const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]])
        temp.forEach((res) => {
            data.push(res)
        })
    }

    // Printing data
    // console.log(data[0]['__EMPTY'])

    return data
}