//author : moghya

'use strict';
let sampleURL;
let sampleDoc;
let sampleRequestParams;

function getSourceCode(url,callbackFunction) {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      callbackFunction(this.responseText);      
    }
  };
  xhttp.open("GET",url, true);
  xhttp.send();
}

function getFiddle(url){
    sampleURL = url;
    getSourceCode(sampleURL,createAndSendPostQuery);
}
