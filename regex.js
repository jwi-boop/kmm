const regexForm = document.getElementById("regex-form");
const regex = regexForm.elements["regex"];
const regexInput = document.getElementById("regex-input");
const regexResults = document.getElementById("regex-results");

regexForm.onsubmit = event => {
  event.preventDefault();
  updateRegexResults();
};

const updateRegexResults = () => {
  try {
    const re = new RegExp(regex.value, "gm");
    const result = regexInput.value.matchAll(re);
    const matches = Array.from(result);
    regexResults.innerText = matches.length;
  } catch (error) {
    console.error(error);
    regexResults.innerText = "ERROR";
  }
}

updateRegexResults();