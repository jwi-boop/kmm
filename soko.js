const lagBrett = str => {
  const res = str.split("\n").map(x => x.split(""));
  res.shift();
  res.pop();
  return res;
};

const brett = [
  `
########
#      #
#   #  #
# @ #  #
# $ # ##
# $ $.#
## ##.#
#    .#
#######
`,
  `
 #####
 #   #
 # #$##
##..@ #
# *.$ #
# # $##
#    #
######
   `
].map(lagBrett);

const lagSpill = brett => ({
  brett: brett,
  trekkliste: "",
  redo: "",
  vunnet: vunnet(brett)
});

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

module.exports = { brett: brett, sjekkLoesning: sjekkLoesning };