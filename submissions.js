/*
  globals
*/

const elem = (tagName, props, ...children) => {
  const el = Object.assign(document.createElement(tagName), props);
  el.replaceChildren(...children);
  return el;
};

const amountPerTask = Number.parseInt(document.getElementById("amount-per-task").innerText);
const noOfTasks = Number.parseInt(document.getElementById("number-of-tasks").innerText);
const maxAmount = Number.parseInt(document.getElementById("max-amount").innerText);
const collectionProgress = {};

const topCollectors = document.getElementById("top-collectors");

const answersList = document.getElementById("answers");

const createResult = answers => {
  const withnames = answers.filter(a => a.name);
  
  const players = withnames.reduce((acc, answer) => {
    const current = acc.find(each => each.name === answer.name);
    if (current) {
      current.tasks.push(answer.task);
      if (answer.timestamp > current.timestamp) {
        current.timestamp = answer.timestamp;
      }
    } else {
      acc.push({
        name: answer.name,
        team: answer.team,
        tasks: [answer.task],
        timestamp: answer.timestamp,
      });
    }
    return acc;
  }, []);
  return {
    answerCount: withnames.length,
    players: players
  };
};

const resultDiv = (total) => {
  const collected = Math.min(total.solved * amountPerTask, maxAmount);
  const max = Math.min(total.max * amountPerTask, maxAmount);
  return elem(
      "div",
      { className: "nes-container with-title is-centered"},
      elem("p", { className: "title"}, total.title),
      elem(
        "h1",
        {},
        elem("i", { className: "nes-icon coin is-medium"}),
        ` ${collected} kr collected `,
        elem("i", { className: "nes-icon coin is-medium"}),
        elem("br"),
        elem("img", { height: 200, src: "./assets/running_dog.gif"}),
        elem(
          "p",
          {},
          elem("progress", { className: "nes-progress is-success", value: collected, max: max }))));
};
  

const updateCollectionProgress = res => {
  const scores = new Map();

  for (const player of res.players) {
    if (!scores.has(player.team)) {
      scores.set(player.team, { title: player.team, solved: 0, max: 0 });
    }
    const score = scores.get(player.team);
    score.solved = score.solved + player.tasks.length;
    score.max = score.max + noOfTasks;      
  }
  
  const sorted = [...scores.values()].sort((a, b) => b.solved - a.solved);
  const total = { title: "Money Collected", solved: res.answerCount, max: res.players.length * noOfTasks };
  document.getElementById("amount-per-task").after(
    //resultDiv(total, sorted),
    resultDiv(total, []),
    //resultDiv(sorted[0], []),
    //resultDiv(sorted[1], [])
  );
  
  return res;
};

const updateTopCollectors = res => {
  const sorted = res.players.sort((a, b) => {
    const res = b.tasks.length - a.tasks.length;
    if (res !== 0) {
      return res;
    }
    return a.timestamp.localeCompare(b.timestamp);
  });

  sorted.forEach(answer => appendTopCollector(answer));

  return res;
};

const appendTopCollector = answer => {
  const row = document.createElement("tr");
  const name = document.createElement("td");
  name.innerText = answer.name;
  const team = document.createElement("td");
  team.innerText = answer.team;
  
  const completedTasks = document.createElement("td");
  completedTasks.innerText = answer.tasks.join(", ");

  const progress = document.createElement("td");
  const bar = document.createElement("progress");
  bar.className = "nes-progress is-success";
  bar.max = noOfTasks;
  bar.value = answer.tasks.length;
  progress.appendChild(bar);
  const timestamp = document.createElement("td");
  timestamp.innerText = answer.timestamp;

  row.appendChild(name);
  row.appendChild(team);
  row.appendChild(completedTasks);
  row.appendChild(progress);
  row.appendChild(timestamp);

  topCollectors.appendChild(row);
};


fetch("/getAnswers", {})
  .then(res => res.json())
  .then(createResult)
  .then(updateCollectionProgress)
  .then(updateTopCollectors);

