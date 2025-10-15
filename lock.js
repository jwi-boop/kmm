"use strict";
const svgNS = "http://www.w3.org/2000/svg";

const halfCirc = (color) => {
  const g = document.createElementNS(svgNS, "g");
  const path = document.createElementNS(svgNS, "path");
  g.appendChild(path);
  path.setAttribute("d", "M -50 0 A 50 50 0 0 1 50 0 Z");
  path.setAttribute("fill", color);
  let rot = 0;
  let norm = (rt) => {
    let r = rt;
    while (r < 0) {
      r += 4;
    }
    while (r > 3) {
      r -= 4;
    }
    return r;
  };

  const anir = document.createElementNS(svgNS, "animateTransform");
  const anirot = (from, to) => {
    path.appendChild(anir);
    anir.setAttribute("attributeType", "XML");
    anir.setAttribute("attributeName", "transform");
    anir.setAttribute("type", "rotate");
    anir.setAttribute("from", `${from * 90} 0 0`);
    anir.setAttribute("to", `${to * 90} 0 0`);
    anir.setAttribute("dur", "0.5s");
    anir.setAttribute("fill", "freeze");
    anir.beginElement();
  };

  const anic = document.createElementNS(svgNS, "animate");
  const anicol = (from, to, dur) => {
    path.appendChild(anic);
    anic.setAttribute("attributeType", "XML");
    anic.setAttribute("attributeName", "fill");
    anic.setAttribute("from", from);
    anic.setAttribute("to", to);
    anic.setAttribute("dur", "0.4s");
    anic.setAttribute("fill", "freeze");
    anic.beginElement();
  };
  
  g.moveTo = (x, y) => g.setAttribute("transform", `translate(${x} ${y})`);
  
  const rotateTo = (to) => {
    let from = rot;
    rot = norm(to);
    anirot(from, to);
  };  
  
  g.rotate = (n) => rotateTo(rot + n);
  g.rotateTo = rotateTo;
  g.rotation = () => rot;
  g.blink = (to) => {
    anicol(color, to);
    setTimeout(() => anicol(to, color), 1000);
  };
  
  return g;
};


const svg = document.getElementById("svg");
const buttonsDiv = document.getElementById("buttons");
const testReset = document.getElementById("test-reset");

const start = [0, 3, 3, 3, 0, 1];

const allButtons = [];
const button = str => {
  const b = document.createElement("button");
  allButtons.push(b);
  b.classList.add("nes-btn");
  b.innerText = str;
  return b;
};

const circs = start.map((n, i) => {
  const c = halfCirc("darkred");
  svg.appendChild(c);
  c.moveTo(100 + i * 100, 100);
  c.rotateTo(n);
  return c;
});

const disableEnable = () => {
    allButtons.forEach((b) => (b.disabled = true));
    setTimeout(() => {
      allButtons.forEach((b) => (b.disabled = false));
    }, 700);
};

const resetButton = button("Reset");
testReset.appendChild(resetButton);
const testButton = button("Test");
testReset.appendChild(testButton);

const testResult = document.getElementById("result");
testResult.innerText = "...";

testButton.onclick = () => {
  let res = true;
  for (const circ of circs) {
    if (circ.rotation() === 0) {
      circ.blink("lawngreen");
    } else {
      circ.blink("red");
      res = false;
    }
  }
  testResult.innerText = res ? "yay :)" : "nope :(";
};

const moves = document.getElementById("moves");

resetButton.onclick = () => circs.forEach((c, i) => {
  moves.innerText = "";
  c.rotateTo(start[i]);
  disableEnable();
  testResult.innerText = "...";
});

const buttons = [
  [3, 2, 1, 1, 0, 0],
  [0, 0, 1, 0, 1, 0],
  [-1, 1, -2, 1, -2, 1],
  [1, 1, 1, 0, 3, 1],
  [-2, +2, 0, -2, +2, -2],
].map((rots, i) => {
  const s = String.fromCharCode("A".charCodeAt(0) + i);
  const b = button(s);
  buttonsDiv.appendChild(b);
  b.innerText = s;
  b.onclick = () => {
    testResult.innerText = "...";
    moves.innerText = moves.innerText + s;
    rots.forEach((num, i) => circs[i].rotate(num));
    disableEnable();
  };
  return b;
});


window.addEventListener("load", (event) => {
  const el = document.getElementById("correct-circ");
  if (el === null) {
    return;
  }
  const c = halfCirc("darkred");
  el.appendChild(c);
  c.moveTo(100, 100);
  c.rotateTo(0);
});
