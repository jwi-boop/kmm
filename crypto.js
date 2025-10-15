/* global CodeMirror */
const frequencyList = document.getElementById("frequency-list");
const plainTextBox = document.getElementById("plaintext");
const myTextArea = document.getElementById("code");
const freqDiagram = document.getElementById("freqDiag");
const myCodeMirror = CodeMirror.fromTextArea(myTextArea, {
  mode: "x-shader/x-fragment",
  // theme: "pastel-on-dark",
  lineNumbers: false,
  indentUnit: 4,
  extraKeys: {
    "Ctrl-Space": "autocomplete"
  }
});

const frequencyRects = () => {
	
	let counter = str => {
	  return str.split("").reduce((total, letter) => {
		total[letter] ? total[letter]++ : total[letter] = 1;
		return total;
	  }, {});
	};
	
	var freqs = counter(plainText());
	freqs[" "] = 0;
  freqs[","] = 0;
  freqs["."] = 0;
  freqs[":"] = 0;
	
	var myElements = [];
	var background = "blue";
	
	var sum = Object.values(freqs).reduce((a, b) => a + b);
	console.log(freqs);
	
	for (const [letter, count] of Object.entries(freqs))
	{
		if(letter==" " || letter==","|| letter=="."|| letter==":"){
			continue;
		}
		if(background == "blue"){
		background = "red";}
		else{
		background = "blue";}
		
		const widthPercent = count / sum * 100;
		const ele = document.createElement("div");
		ele.setAttribute("style", `width:${widthPercent}%;height:100px;background:${background};`);
		
		const textElement = document.createElement("div");
		textElement.setAttribute("style", `width:100%%;height:100%;opacity:1;`);
		
		const actualText = document.createElement("div");
		actualText.textContent = `${letter} \n ${parseInt(widthPercent)}`;
		actualText.setAttribute("style", "text-align: center; vertical-align: middle; font-size: 10px; color: yellow; white-space: pre;");
		
		textElement.appendChild(actualText);
		ele.appendChild(textElement);
		myElements.push(ele);
	}
	
	return myElements;
}

const compileButton = document.getElementById("compile-code");
compileButton.onclick = event => compile();

const plainText = () => {
	return cipher.split("").map(function (character) {
	return dict[character.toUpperCase()];
	}).join("");
}

const compile = () => {
  const code = myCodeMirror.getValue();
  eval(code);
  
 plainTextBox.textContent = plainText();
 freqDiagram.replaceChildren(...frequencyRects());
}

const cipher = "ZIOL OL Q LGDTVIQZ SGFU ZTBZ ZIQZ LIGXSR DQAT OZ HGLLOWST ZG KXF LODHST YKTJXTFEN QFQSNLOL. OY ZIT EOHITKZTBZ OL ZGG LIGKZ ZITF YKOFUT EIQKQEZTKL SOAT M GK B WTEGDT ZGG YKTJXTFZ, QFR ZIQZ DQATL ZIT ZQLA IQKRTK ZG LGSCT. ZIOL NTQKL FKA ZTSTZIGF KQOLTL DGFTN OF LXHHGKZ GY ZIT YGSSGVOFU ZVG GKUQFOMQZOGFL; RGEZGKL VOZIGXZ WGKRTKL QFR RFRO. WGZI ZITLT GKUQFOMQZOGFL QKT OFCGSCTR OF ZIT HKTCTFZOGF QFR ZKTQZDTFZ GY ROLTQLTL QEKGLL TZIFOEOZN, LTBXQS GKOTFZQZOGF, KTSOUOGF, HGSOEOEQS COTV, QUT QFR UTFRTK. ZIOL NTQK ZIT YGEXL OL GF WQFUSQRTLI, ZIT ETFZKQS QYKOEQF KTHXWSOE, ZIT RTDGEKQZOE KTHXWSOE GY EGFUG, QFR LOTKKQ STGFT. OF GKRTK ZG LGSCT ZIOL ZQLA NGX FTTR ZG LXWDOZ ZIT YGSSGVOFU TFUSOLI VGKR, Q SGQF VGKR GY UTKDQF GKOUOF: MTOZUTOLZ";

const dict = {
	"A" : "A",
	"B" : "B",
	"C" : "C",
	"D" : "D",
	"E" : "E",
	"F" : "F",
	"G" : "G",
	"H" : "H",
	"I" : "I",
	"J" : "J",
	"K" : "K",
	"L" : "L",
	"M" : "M",
	"N" : "N",
	"O" : "O",
	"P" : "P",
	"Q" : "Q",
	"R" : "R",
	"S" : "S",
	"T" : "T",
	"U" : "U",
	"V" : "V",
  "W" : "W",
	"X" : "X",
	"Y" : "Y",
	"Z" : "Z",
	"." : ".",
	":" : ":",
  "," : ",",
	" " : " "};

compile();
