
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
  try {
    eval(code);
  } catch(e) {
    print(e);
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
  xmlHttp.open("GET", "x-plus-y.txt", true); // true for asynchronous
  xmlHttp.send(null);
});


const example = `eusvytqrkg
xvmbyfprld
ezjvmffygc
lxhyasfxnz
ewnahyexjq
inwlqdmmjv
vifaooinbu
aemhzikmep
pinwbkwbqi
fghketwyum`;

