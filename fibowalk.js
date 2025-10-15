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

const print = (obj) => {
  const li = document.createElement("li");
  if (obj instanceof HTMLElement) {
    li.appendChild(obj);
  } else {
    li.innerText = obj;  
  }
  outputList.appendChild(li);
};