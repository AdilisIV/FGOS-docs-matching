const reader = require('xlsx')


exports.excelData = function (path, callback) {
    let excelData = readExcel(path)
    if (excelData) {
        callback(null, excelData)
    } else {
        callback("Не удалось прочитать указанный excel файл. Формат файла должен быть .xlsx", null)
    }
};

function readExcel(filePath) {
    let fileExt = getFileExtFrom(filePath)
    if (fileExt != "xlsx") {
        return null
    }

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

function getFileExtFrom(fileName) {
    var ext = fileName.substr(fileName.lastIndexOf('.') + 1);
    return ext
}