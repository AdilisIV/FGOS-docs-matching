const reader = require('xlsx')


exports.excelData = function (path, callback) {
    // db.get().collection('cityevents').find().sort({"start": 1}).limit(1000).toArray(function (err, docs) {
    //     callback(err, docs);
    // })
    let excelData = readExcel(path)
    callback(null, excelData)
};

function readExcel(filePath) {
    // let filePath = './docs/excel/matrix_kompetentsiy.xlsx'
    // let filePath = '/Users/mac/Documents/fgos-matching/docs/excel/Primer_matritsy_kompetentsiy-2.xlsx' // wrong

    let file = reader.readFile(filePath.toString(), {sheetStubs: true})
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