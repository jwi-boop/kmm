/* globals
  showMoney
*/

(() => {
  const answerForm = document.getElementById("answer-form");
  if (answerForm == null) {
    return;
  }
  const taskInput = answerForm.elements["task"];
  const answerInput = answerForm.elements["answer"];
  const correctAnswer = document.getElementById("correct-answer");
  const wrongAnswer = document.getElementById("wrong-answer");
  
  const correctStr = "The solution is correct!";

  answerForm.onsubmit = (event) => {
    event.preventDefault();

    const data = {
      task: taskInput.value,
      answer: answerInput.value,
    };

    fetch("/addAnswer", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          correctAnswer.innerText = response.message;
          answerInput.className = "nes-input is-success";
          wrongAnswer.hidden = true;
          correctAnswer.hidden = false;
          showMoney();
          var audio = new Audio(
            "./assets/smb_stage_clear.wav"
          );
          audio.play();
        } else {
          wrongAnswer.innerText = response.message;
          answerInput.className = "nes-input is-error";
          answerInput.value = "";
          wrongAnswer.hidden = false;
          correctAnswer.hidden = true;
          var audio = new Audio(
            "./assets/ta-snes_bowser_laugh.wav"
          );
          audio.play();
        }
      });
  };
})();
