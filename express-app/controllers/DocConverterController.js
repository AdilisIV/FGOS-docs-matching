const fs = require('fs');

var CloudmersiveConvertApiClient = require('cloudmersive-convert-api-client');
var defaultClient = CloudmersiveConvertApiClient.ApiClient.instance;


exports.convert = function(path, callback) {

    // если расширение файла уже .docx, то не конвертим
    // -> просто вазвращаем filePath исходного файла

    // иначе, конвертируем и возвращаем filePath до сохраненного .docx

    let pathToDoc = path;

    let fileName = getFileNameFrom(pathToDoc)
    let fileExt = getFileExtFrom(pathToDoc)
    let fileDirectory = getFileDirectoryFrom(pathToDoc)



    if (fileExt == "docx") {
        callback(null, pathToDoc)
    } else if (fileExt == "doc") {
        // convert this
        var Apikey = defaultClient.authentications['Apikey'];
        Apikey.apiKey = '22edeefa-5edc-4ce8-8872-a53ea8b0e30c';
    
        var apiInstance = new CloudmersiveConvertApiClient.ConvertDocumentApi();
        var inputFile = Buffer.from(fs.readFileSync(pathToDoc).buffer); // File | Input file to perform the operation on.
    
        var convertionCallback = function (error, data, response) {
            if (error) {
                console.error(error);
                callback('Ошибка при конвертации doc файла в docx', null)
            } else {
                // console.log('API called successfully. Returned data: ' + data);
                let newFilePath = `${fileDirectory}${fileName}.docx`
                fs.writeFile(newFilePath, data, (err) => {
                    if (err) {
                        callback('Произошла ошибка при попытке записи на диск сконвертированного в docx файла', null);
                    }
                    console.log('The file has been saved!');
                    callback(null, newFilePath)
                });
            }
        };
    
        apiInstance.convertDocumentDocToDocx(inputFile, convertionCallback);
    } else {
        let error = `Для программы дисциплины поддерживается формат файла (.doc или .docx). Вы указали — ${fileExt}`
        callback(error, null);
    }

} 

function getFileNameFrom(path) {
    let startIdx = path.lastIndexOf("/") + 1
    var endIdx = path.lastIndexOf('.')
    return path.substring(startIdx, endIdx);
}

function getFileExtFrom(fileName) {
    var ext = fileName.substr(fileName.lastIndexOf('.') + 1);
    return ext
}

function getFileDirectoryFrom(path) {
    let startIdx = path.lastIndexOf("/")
    return path.substring(0, startIdx+1);
}