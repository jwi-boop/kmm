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

const triTable = (arrays) => {
  const triTr = (n) => (a) => {
    const tr = document.createElement("tr");
    const pad = n - a.length;
    if (pad > 0) {
      const padl = tr.appendChild(document.createElement("td"));
      padl.setAttribute("colspan", `${pad}`);
    }

    for (const x of a) {
      const td = tr.appendChild(document.createElement("td"));
      td.setAttribute("colspan", "2");
      td.innerText = `${x}`;
    }

    if (pad > 0) {
      const padr = tr.appendChild(document.createElement("td"));
      padr.setAttribute("colspan", `${pad}`);
    }
    return tr;
  };

  const maxLength = Math.max(...arrays.map((a) => a.length));
  const table = document.createElement("table");
  table.replaceChildren(...arrays.map(triTr(maxLength)));
  return table;
};

document.getElementById("example").appendChild(triTable([
  [1],
  [1, 1],
  [1, 2, 1],
  [1, 3, 3, 1],
  [1, 4, 6, 4, 1],
  [1, 5, 10, 10, 5, 1],
]));
