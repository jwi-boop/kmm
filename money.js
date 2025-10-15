/* global CodeMirror */
const outputList = document.getElementById("output-list");
const myTextArea = document.getElementById("code");
const myCodeMirror = CodeMirror.fromTextArea(myTextArea, {
  mode: "x-shader/x-fragment",
  // theme: "pastel-on-dark",
  lineNumbers: false,
  indentUnit: 2,
  extraKeys: {
    "Ctrl-Space": "autocomplete",
  },
  viewportMargin: Infinity,
});

const compileButton = document.getElementById("compile-code");
compileButton.onclick = (event) => compile();

const compile = () => {
  outputList.textContent = "";
  const str = myCodeMirror.getValue();
  try {
    eval(str);
  } catch(err) {
    print(err);
    throw err;
  }
};

const print = (str) => {
  const li = document.createElement("li");
  li.innerText = str;
  outputList.appendChild(li);
};

let text = null;

window.addEventListener("load", (event) => {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = () => {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      text = xmlHttp.responseText;
    }
  };
  xmlHttp.open("GET", "penger.txt", true); // true for asynchronous
  xmlHttp.send(null);
});
