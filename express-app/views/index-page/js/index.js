
const checkBtn = document.getElementById('verify-btn');
const logsTextField = document.getElementById('text_logs');

const wordField = document.getElementById('word_doc');
const excelField = document.getElementById('excel_doc');


function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function onCheckBtnClick() {
    wordFilePath = wordField.files[0].path;
    excelFilePath = excelField.files[0].path;

    var requestUri = "http://localhost:8082/verify"
    
    if (wordFilePath != "") {
        requestUri += `?wordpath=${wordFilePath}`;
    } else {
        logsTextField.value = "Не указан файл — Программа дисциплины (.docx)"
    }

    if (excelFilePath != "") {
        requestUri += `&excelpath=${excelFilePath}`;
    } else {
        logsTextField.value = "Не указан файл — Карта компетенций (.xlsx)"
    }

    httpGetAsync(requestUri, function(response) {
        // var resultDict = JSON.parse(response);

        console.log(response);
        // logsField.value = resultDict[0]['title'];

        logsTextField.value = response;
    });
}

checkBtn.addEventListener('click', onCheckBtnClick);