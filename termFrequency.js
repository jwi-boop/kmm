/* global CodeMirror */
const outputList = document.getElementById("output-list");
const myTextArea = document.getElementById("code");
const myCodeMirror = CodeMirror.fromTextArea(myTextArea, {
  mode: "x-shader/x-fragment",
  // theme: "pastel-on-dark",
  lineNumbers: false,
  indentUnit: 4,
  extraKeys: {
    "Ctrl-Space": "autocomplete",
  },
});

const compileButton = document.getElementById("compile-code");
compileButton.onclick = (event) => compile();

const compile = () => {
  outputList.textContent = "";
  const code = myCodeMirror.getValue();
  eval(code);
};

const print = (str) => {
  const li = document.createElement("li");
  li.innerText = str;
  outputList.appendChild(li);
};

const stop_words =
  "a,able,about,across,after,all,almost,also,am,among,an,and,any,are,as,at,be,because,been,but,by,can,cannot,could,dear,did,do,does,either,else,ever,every,for,from,get,got,had,has,have,he,her,hers,him,his,how,however,i,if,in,into,is,it,its,just,least,let,like,likely,may,me,might,most,must,my,neither,no,nor,not,of,off,often,on,only,or,other,our,own,rather,said,say,says,she,should,since,so,some,than,that,the,their,them,then,there,these,they,this,tis,to,too,twas,us,wants,was,we,were,what,when,where,which,while,who,whom,why,will,with,would,yet,you,your";

let text = null;

window.addEventListener("load", (event) => {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = () => {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      text = xmlHttp.responseText;
    }
  };
  xmlHttp.open("GET", "pride-and-prejudice.txt", true); // true for asynchronous
  xmlHttp.send(null);
});
