const signupForm = document.getElementById("signup-form");
const nameInput = signupForm.elements["name"];
const passwordInput = signupForm.elements["password"];
const teamSelect = signupForm.elements["team"];
const resultDiv = document.getElementById("result");

signupForm.onsubmit = event => {
  event.preventDefault();

  const data = {
    name: nameInput.value,
    password: passwordInput.value,
    team: teamSelect.value
  };

  fetch("/addUser", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  })
    .then(res => res.json())
    .then(response => {
      resultDiv.innerText = response.message;
      if (response.message = "success") {
        window.location.pathname = "/login";
      }
    });
};