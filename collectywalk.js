
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
    printstr(e);
  }
};

const objectAsString = (obj, lvl) => {
  if (lvl > 2 || typeof(obj) !== "object") {
    return `${obj}`;
  }
  if (Array.isArray(obj)) {
    return `[${obj.map(x => objectAsString(x, lvl + 1)).join(", ")}]`;
  }
  return `{ ${Object.keys(obj)
    .map(property => {
      const value = obj[property];
      if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
        return `${property}: {${objectAsString(value, lvl + 1)}}`;
      } else {
        return `${property}: ${value}`;
      }
    })
    .join('; ')} }`;
};

const print = (obj) => {
  printstr(objectAsString(obj));
};

const printstr = (obj) => {
  const li = document.createElement("li");
  li.innerText = obj;
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
  xmlHttp.open("GET", "collectywalk.txt", true); // true for asynchronous
  xmlHttp.send(null);
});


const example = `┌┐──┌┐│┌┐┌┌┐┌┐┌┐┌┐┌┐┌┐└─┌┐─│┌──┐┌└─┌┐─┌┐
┌└──┘└┘││└┘││││└┘└┘│││┌─┘└──┘┌┐│└┐┌┘└─┘│
│┐┌→───┘└┐┌┘│└┘│┌─│││└┘┌─┌┐┌┐┌┘│┌└┘┌─┐┌│
││└┐┌─┐─┐││┌┘┌─│└┐│└┘│┌┘┌┘│┌┘│││└──│││││
│┌─┘┌─│┌┘│││┐└─┘││└──┘└┐│┌┘└┐││└┐│┌┘│└┐│
┌┘───┐││─└─┘└┐└┐┐└┐┌───┘│└─┐│└┘││┌┘┌┘─└┐
└───┐└┘└─┐└─┐│─┘│┌┘└────┘─│││──┐└┘│└─┐││
│─┌│└──┐┌┘│┌┘│┌┐││┌┐──┌───┐│└┐┌┘┌││──└┐│
└┐└─┐┌─│└┐└┘┐└┘││└┘└─┐└┐┌─└┘│└┘┌┘│└───┘│
┌┘└─└┘┌┘││┌┐└─┌┘└┐──┐│││┌──┐││┌┘┌──────│
└─┌───┘─│││└─┌┘┐─└──┘└┐└┘┌─┘└─┘┌│┌─────┘
┌─┘─────┘││┌─┘─┘┌┐┌─┐┐└┐┌┘┌──┌─┘│└────┐┐
│───┐│┌┐┌┘│└────┘││┌┘└┐│││┌─┐│┌─└┐└─┐│││
└┐└┐│└┘││┌┘┌┐┌───└┐│┌─│└┘│││└┘└──┘┌┐│┌┘│
┌└┐│└─┐┌┘│┌┐└┘┌┌┐│└┘└┐└──┘│─┌───┐┌┘└┐└─┐
└┐│└─┐│││││└┐─┘││┌─┐┌┘─┌──└─┘┌┐│└┘┌┐└─┌┘
┌┘│┌┐│└┘││└─┘┌┐││└─┘│┐┌──┐─┐─│└┐│┌┐└─┌┘│
└┐└┘│┌─┐│└───┘││└┐┌─┘││┌┐│─└─┐│└┘││┌─┘││
│└┐││││└┐┌─┐┌──┘┌││┌─┐│┌┘│┌─┐└──┌┘└┘┌┐││
└─└┘└┘└─└┘─└┘───┘└─┘─└┘└─└┘│└───┘───┘│└┘`;

const point = (() => {

  const points = new Map();
  return (x, y) => {
    const str = `${x},${y}`;
    if (points.has(str)) {
      return points.get(str);
    }
    const res = { x: x, y: y };
    points.set(str, res);
    return res;
  }
})()

const read = (str) =>
  new Map(
    str.split("\n").flatMap((line, y) =>
      line.split("").map((c, x) => [point(x, y), c])));

const printmap = (map) => {
  let start = point(0, 0);
  const res = [];
  while (map.has(start)) {
    let line = "";
    let pos = start;
    while (map.has(pos)) {
      line += map.get(pos);
      pos = E(pos);
    }
    res.push(line);
    start = S(start);
  }
  print(res.join("\n"));
};

const N = (v) => point(v.x, v.y - 1);
const S = (v) => point(v.x, v.y + 1);
const E = (v) => point(v.x + 1, v.y);
const W = (v) => point(v.x - 1, v.y);
