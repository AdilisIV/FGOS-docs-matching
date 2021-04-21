const fs = require('fs');

var CloudmersiveConvertApiClient = require('cloudmersive-convert-api-client');
var defaultClient = CloudmersiveConvertApiClient.ApiClient.instance;


exports.convert = async function(path) {
    return new Promise((resolve, reject) => {

        // если расширение файла уже .docx, то не конвертим
        // -> просто вазвращаем filePath исходного файла

        // иначе, конвертируем и возвращаем filePath до сохраненного .docx

        let pathToDoc = path;

        let fileName = getFileNameFrom(pathToDoc)
        let fileExt = getFileExtFrom(pathToDoc)
        let fileDirectory = getFileDirectoryFrom(pathToDoc)



        if (fileExt == "docx") {
            resolve(pathToDoc)
        } else if (fileExt == "doc") {
            // convert this
            var Apikey = defaultClient.authentications['Apikey'];
            Apikey.apiKey = '22edeefa-5edc-4ce8-8872-a53ea8b0e30c';

            var apiInstance = new CloudmersiveConvertApiClient.ConvertDocumentApi();
            var inputFile = Buffer.from(fs.readFileSync(pathToDoc).buffer);

            var convertionCallback = function (error, data, response) {
                if (error) {
                    console.error(error);
                    reject(new Error("Ошибка при конвертации doc файла в docx"))
                } else {
                    let newFilePath = `${fileDirectory}${fileName}.docx`
                    fs.writeFile(newFilePath, data, (err) => {
                        if (err) {
                            reject(new Error("Произошла ошибка при попытке записи на диск сконвертированного в docx файла"))
                        }
                        console.log('The file has been saved!');
                        resolve(newFilePath)
                    });
                }
            };

            apiInstance.convertDocumentDocToDocx(inputFile, convertionCallback);
        } else {
            let errorDescription = `Для программы дисциплины поддерживается формат файла (.doc или .docx). Вы указали — ${fileExt}`
            reject(new Error(errorDescription))
        }
    })
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