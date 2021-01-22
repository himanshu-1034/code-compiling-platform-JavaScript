const executeCodeURL = "https://codequotient.com/api/executeCode";
const codeResultURL = "https://codequotient.com/api/codeResult/";

var codingLanguage = document.getElementById("codingLanguage");
var compileCodeButton = document.getElementById("compileCodeButton");
var codeArea = document.getElementById("codeArea");
var consoleOutput = document.getElementById("consoleOutput");




function getCodeStatus(callback){
    var request = new XMLHttpRequest();
request.open("POST",executeCodeURL);
request.addEventListener("load",function(){
    callback(JSON.parse(request.responseText));
});
var data = { code : codeArea.value , langId : codingLanguage.value};
request.setRequestHeader("Content-Type","application/json");
request.send(JSON.stringify(data));
}


function getCodeId(){
    consoleOutput.innerHTML = "";
    getCodeStatus(function(response){
        if(response.codeId){
            writeCodeonConsole(response.codeId);
        }else{
            console.log(response.error);
        }

    });
}

function writeCodeonConsole(codeId){
    var resultRequest = new XMLHttpRequest();
    resultRequest.open("GET",codeResultURL+codeId);
    resultRequest.send();
    resultRequest.addEventListener('load',function(){
        var resultResponse = JSON.parse(resultRequest.responseText);
        var resultData = JSON.parse(resultResponse.data);
        console.log(resultData);
        if(resultData.status==="Pending"){
            setTimeout(writeCodeonConsole(codeId),1000);
        }else if(resultData.errors){
            consoleOutput.innerHTML = resultData.errors;
        }else if(resultData.output){
            consoleOutput.innerHTML = resultData.output;
        }
    });
}

compileCodeButton.addEventListener('click',getCodeId);
