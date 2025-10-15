/* globals brettgreier */

const lagBrett = str => {
  const res = str.split("\n").map(x => x.split(""));
  res.shift();
  res.pop();
  return res;
};

const brett = brettgreier.map(lagBrett);

const setHtml = (element, children) => {
  while (element.firstChild) element.removeChild(element.firstChild);
  children.forEach(c => element.appendChild(c));
};

(() => {
  const velgEl = document.getElementById("choose");
  const velgBrettEl = idx => {
    const btn = document.createElement("button");
    btn.innerText = "Level " + (idx + 1);
    btn.onclick = () => byttBrett(idx);
    return btn;
  };
  if (velgEl !== null)
    for (var idx = 0; idx < brett.length; idx++) {
      velgEl.appendChild(velgBrettEl(idx));
    }
})();

const msprites = document.getElementById("menneske-sprites");
const ksprites = document.getElementById("katt-sprites");
msprites.remove();
ksprites.remove();

let sprites = msprites;

document.getElementById("katt").onclick = () => {
  sprites = sprites == msprites ? ksprites : msprites;
  render(spill);
};


const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");
const solutionEl = document.getElementById("solution");

const render = spill => {
  const gulv = vec(0, 0);
  const vegg = vec(1, 0);
  const spiller = vec(0, 1);
  const boks = vec(1, 1);
  const maal = vec(0, 2);
  const boksPaaMaal = vec(1, 2);

  var y = 0;
  spill.brett.forEach(rad => {
    var x = 0;
    rad.forEach(rute => {
      const p =
        rute === " "
          ? gulv
          : rute === "#"
          ? vegg
          : rute === "@" || rute === "+"
          ? spiller
          : rute === "$"
          ? boks
          : rute === "."
          ? maal
          : rute === "*"
          ? boksPaaMaal
          : "feil";
      canvasContext.drawImage(
        sprites,
        p.x * 16,
        p.y * 16,
        16,
        16,
        x * 48,
        y * 48,
        48,
        48
      );

      x = x + 1;
    });
    y = y + 1;
  });
  const solutionStuff = [];
  const trekkEl = document.createElement("p");
  trekkEl.innerText = spill.trekkliste;
  trekkEl.classList.add("trekkliste");
  solutionStuff.push(trekkEl);
  if (spill.vunnet) {
    const vunnetEl = document.createElement("p");
    vunnetEl.innerText = "Yay!";
    solutionStuff.push(vunnetEl);
    trekkEl.classList.add("nes-text");
    trekkEl.classList.add("is-success");
    vunnetEl.classList.add("nes-text");
    vunnetEl.classList.add("is-success");
  }
  setHtml(solutionEl, solutionStuff);
};

const lagSpill = brett => {
  var b = 0;
  for (const rad of brett) {
    if (rad.length > b) {
      b = rad.length;
    }
  }
  return {
    bredde: b,
    hoeyde: brett.length,
    brett: brett,
    trekkliste: "",
    redo: "",
    vunnet: vunnet(brett)
  };
};

const vec = (x, y) => ({ x: x, y: y });

const plus = (a, b) => ({ x: a.x + b.x, y: a.y + b.y });

const brettPos = (br, p) => {
  if (p.y < 0 || p.y >= br.length) {
    return false;
  }
  const rad = br[p.y];
  if (p.x < 0 || p.x >= rad.length) {
    return false;
  }
  return rad[p.x];
};

const vunnet = brett => {
  for (const rad of brett) {
    for (const rute of rad) {
      if (rute === "." || rute === "+") {
        return false;
      }
    }
  }
  return true;
};

const brettSett = (br, p, v) => (br[p.y][p.x] = v);

const brettSpillerPos = br => {
  for (var y = 0; y < br.length; y++) {
    const rad = br[y];
    for (var x = 0; x < rad.length; x++) {
      const rute = rad[x];
      if (rute === "@" || rute === "+") {
        return vec(x, y);
      }
    }
  }
  throw "spilleren hvor da?";
};

var spill;

const byttBrett = idx => {
  spill = lagSpill(brett[idx]);
  canvas.width = spill.bredde * 48;
  canvas.height = spill.hoeyde * 48;
  canvasContext.imageSmoothingEnabled = false;
  render(spill);
};

byttBrett(0);

const spiller = ["@", "+"];
const boks = ["$", "*"];
const retninger = [
  { navn: "u", vec: vec(0, -1) },
  { navn: "l", vec: vec(-1, 0) },
  { navn: "d", vec: vec(0, 1) },
  { navn: "r", vec: vec(1, 0) }
];

const flytt = (br, type, pos, dir) => {
  const nestePos = plus(pos, dir);
  const nesteRute = brettPos(br, nestePos);
  const rute = brettPos(br, pos);
  if (rute !== type[0] && rute !== type[1]) {
    return false;
  }
  if (nesteRute !== " " && nesteRute !== ".") {
    return false;
  }
  brettSett(br, pos, rute === type[0] ? " " : ".");
  brettSett(br, nestePos, nesteRute === " " ? type[0] : type[1]);
  return true;
};

const trekk = (gammelt, retning) => {
  if (gammelt.vunnet) {
    return gammelt;
  }
  const br = gammelt.brett.map(y => y.slice());
  const pos = brettSpillerPos(br);
  const boksFlyttet = flytt(br, boks, plus(pos, retning.vec), retning.vec);
  const spillerFlyttet = flytt(br, spiller, pos, retning.vec);
  const nyttTrekk = boksFlyttet
    ? retning.navn.toUpperCase()
    : spillerFlyttet
    ? retning.navn
    : "";

  return {
    brett: br,
    trekkliste: gammelt.trekkliste + nyttTrekk,
    redo: "",
    vunnet: vunnet(br)
  };
};

const undo = gammelt => {
  if (gammelt.trekkliste === "") {
    return gammelt;
  }
  const br = gammelt.brett.map(y => y.slice());
  const pos = brettSpillerPos(br);
  const trekk = gammelt.trekkliste.slice(-1);
  const framNummer = retningNummer(trekk);
  const tilbake = retninger[(framNummer + 2) % 4];

  if (!flytt(br, spiller, pos, tilbake.vec)) {
    throw "får ikke flyttet spilleren tilbake";
  }

  if (trekk === trekk.toUpperCase()) {
    if (!flytt(br, boks, plus(pos, retninger[framNummer].vec), tilbake.vec)) {
      throw "får ikke flyttet boksen tilbake";
    }
  }

  return {
    brett: br,
    trekkliste: gammelt.trekkliste.slice(0, -1),
    redo: trekk + gammelt.redo,
    vunnet: vunnet(br)
  };
};

const restart = gammelt => {
  var resultat = gammelt;
  while (resultat.trekkliste !== "") {
    resultat = undo(resultat);
  }
  return resultat;
};

const redo = gammelt => {
  if (gammelt.redo === "") {
    return gammelt;
  }
  const trekkBokstav = gammelt.redo.slice(0, 1);
  const nyRedo = gammelt.redo.slice(1);
  const nytt = trekk(gammelt, retninger[retningNummer(trekkBokstav)]);
  nytt.redo = nyRedo;
  return nytt;
};

const retningNummer = str => {
  const s = str.toLowerCase();
  return s === "u" ? 0 : s === "l" ? 1 : s === "d" ? 2 : s === "r" ? 3 : false;
};

const sjekkLoesning = (brett, str) => {
  var spill = lagSpill(brett);
  const resultat = { feil: [] };
  for (var idx = 0; idx < str.length; idx++) {
    const trekkBokstav = str[idx];
    const framNummer = retningNummer(trekkBokstav);
    if (framNummer === false) {
      resultat.feil.push("trekk " + idx + " er rart: " + trekkBokstav);
    } else {
      const trekklisteFoer = spill.trekkliste;
      spill = trekk(spill, retninger[framNummer]);
      const trekklisteEtter = spill.trekkliste;
      if (trekklisteFoer === trekklisteEtter) {
        resultat.feil.push(
          "trekk " + idx + " lot seg ikke utføre: " + trekkBokstav
        );
      } else {
        const faktiskTrekkBokstav = trekklisteEtter.slice(-1);
        if (faktiskTrekkBokstav !== trekkBokstav) {
          resultat.feil.push(
            "trekk " +
              idx +
              " lot seg bare omtrent utføre. trekk: " +
              trekkBokstav +
              ", faktisk utført trekk: " +
              faktiskTrekkBokstav
          );
        }
      }
    }
  }
  resultat.vunnet = spill.vunnet;
  return resultat;
};

const utfoer = (() => {
  const beveg = retningNummer =>
    (spill = trekk(spill, retninger[retningNummer]));
  const kommandoer = new Map([
    ["w", () => beveg(0)],
    ["a", () => beveg(1)],
    ["s", () => beveg(2)],
    ["d", () => beveg(3)],
    ["z", () => (spill = undo(spill))],
    ["y", () => (spill = redo(spill))],
    ["r", () => (spill = restart(spill))]
  ]);
  return c => () => {
    if (kommandoer.has(c)) {
      kommandoer.get(c)();
      render(spill);
    }
  };
})();

document.onkeypress = ev => utfoer(ev.key.toLowerCase())();
