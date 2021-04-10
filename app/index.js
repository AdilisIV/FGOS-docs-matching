
const checkBtn = document.getElementById('check-btn');
const logsField = document.getElementById('text_logs');

// var gui = require('nw.gui');
// var win = gui.Window.get();
// win.showDevTools();

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

// var client = new HttpClient();

function onCheckBtnClick() {
    logsField.value = 'fkdjslkm';
    console.log("fuck-funk-fuck")

    // client.get('https://jsonplaceholder.typicode.com/posts', function(response) {
    // // do something with response
    //     logsField.value = response.responseText.toString()
    // });

    httpGetAsync('http://localhost:8082/root', function(responseText) {
        logsField.value = 'FUCK';
        // logsField.value = responseText.value;
    });
}

checkBtn.addEventListener('click', onCheckBtnClick);