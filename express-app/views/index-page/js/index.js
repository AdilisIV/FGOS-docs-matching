
const checkBtn = document.getElementById('verify-btn');
const logsTextField = document.getElementById('text_logs');

const wordField = document.getElementById('word_doc');
const excelField = document.getElementById('excel_doc');

const activityIndicator = document.getElementById('activity-indicator');

var isInProgress = false


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
    if (isInProgress == true) {
        return;
    }

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

    startIndicating()
    isInProgress = true

    httpGetAsync(requestUri, function(response) {
        
        stopIndicating()
        isInProgress = false
        console.log(response);

        logsTextField.value = response;
    });
}

function startIndicating() {
    checkBtn.setAttribute('disabled', 'disabled');
    activityIndicator.style.display = 'block'
}

function stopIndicating() {
    checkBtn.removeAttribute("disabled")
    activityIndicator.style.display = 'none'
}

checkBtn.addEventListener('click', onCheckBtnClick);