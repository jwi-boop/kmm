const solutions = document.getElementById("solutions");

fetch("/getSokoSolutions", {})
  .then(res => res.json())
  .then(answers => validAnswers(answers))
  .then(answers => updateSolutions(answers));

const validAnswers = answers => {
  return answers.filter(a => a.name);
};

const answersByName = answers =>
  answers.reduce((acc, a) => {
    const current = acc.find(answer => answer.name === a.name);
    if (current) {
      if (current[a.task] === undefined || a.solution < current[a.task]) {
        current[a.task] = a.solution;
      }
    } else {
      const stuff = { name: a.name };
      stuff[a.task] = a.solution;
      acc.push(stuff);
    }
    return acc;
  }, []);

const updateSolutions = answers => {
  const updatedAnswers = answers.filter(a => a.name);
  const byName = answersByName(updatedAnswers);
  byName.forEach(answer => appendStuff(answer));

  return answers;
};

const appendStuff = answer => {
  const row = document.createElement("tr");
  const name = document.createElement("td");
  name.innerText = answer.name;

  const soko1 = document.createElement("td");
  if (answer["SOKO-1"] !== undefined) {
    soko1.innerText = answer["SOKO-1"];
  }

  const soko2 = document.createElement("td");
  if (answer["SOKO-2"] !== undefined) {
    soko2.innerText = answer["SOKO-2"];
  }
  const totalt = document.createElement("td");
  if (answer["SOKO-1"] !== undefined && answer["SOKO-2"] !== undefined) {
    totalt.innerText = "" + (answer["SOKO-1"] + answer["SOKO-2"]);
  }

  row.appendChild(name);
  row.appendChild(soko1);
  row.appendChild(soko2);
  row.appendChild(totalt);

  solutions.appendChild(row);
};
