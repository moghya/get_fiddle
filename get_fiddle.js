//author : moghya

'use strict';
let sampleURL;
let sampleDoc;
let sampleRequestParams;

function parseSourceCode(sourceCode){
    let parser = new DOMParser();
    let doc = parser.parseFromString(sourceCode,"text/html");
    return doc;
}

function resolveRelativePath(base,relative){
    let pat = /^https?:\/\//i;
		if(pat.test(relative)){
    	return relative;
    }
    let stack = base.split("/"),parts = relative.split("/");
    if(stack.length==3)stack.push("");
    stack.pop();
    for (let i=0; i<parts.length; i++) {
        if (parts[i] == ".")
            continue;
        if (parts[i] == "..")
            stack.pop();
        else
            stack.push(parts[i]);
    }
    return stack.join("/");
}

function resolveAllRelativePaths(doc){
    let attributes = ['href','src'];
    for(let i=0;i<attributes.length;i++){
        let attribute = attributes[i];
        let elements = doc.querySelectorAll('['+attribute+']');
        if(elements===null){
        }else{
            for(let j=0;j<elements.length;j++){
                let val = elements[j].getAttribute(attribute);
                if(val===null || val===""){
                }else{
                    val = resolveRelativePath(sampleURL,val);
                }
                elements[j].setAttribute(attribute,val);
            }
        }
    }
}

function getJavaScriptCodeAndRemoveInlineScriptTag(doc){
    let jsCode = '';
    let scripts = doc.documentElement.getElementsByTagName('script');
    let i =scripts.length; 
    while(i--) {        
        let script = scripts[i];
        let src = script.getAttribute('src');
        if(src===null){
            jsCode+=script.innerHTML;
            script.parentNode.removeChild(script);
        }
    }
    return jsCode;
}


function getHtmlCode(doc){
    let htmlCode = doc.documentElement.innerHTML;
    return htmlCode;
}

function post(path, params, method) {
    method = method || "post"; 
    var form = document.createElement("form");
    form.setAttribute("target", "_blank");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
        }
    }

    document.body.appendChild(form);
    form.submit();
    form.parentNode.removeChild(form);
}

function createAndSendPostQuery(sourceCode){
    
    sampleDoc = parseSourceCode(sourceCode);
    
    resolveAllRelativePaths(sampleDoc);
    
    let jsCode = getJavaScriptCodeAndRemoveInlineScriptTag(sampleDoc);
    let htmlCode = getHtmlCode(sampleDoc);
    let sampleTitle = sampleDoc.getElementsByTagName('title')[0].innerHTML;
    
    let params = {
        panel_html : 0,
        html : htmlCode,
        pannel_js : 0,
        js : jsCode,
        panel_css : 0,
        title : sampleTitle,
        description : 'A simple demo of '+sampleTitle+'.',
        wrap : 'b'
        
    };
    sampleRequestParams = params;
    let API_URL = 'http://jsfiddle.net/api/post/library/pure/';
    let method = 'post';
    
    post(API_URL,params,method);
}

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
