const QUOTE_API_URL = "https://api.quotable.io/";
const getQuoteApiUrl = (param) => QUOTE_API_URL + param;

const quoteDisplayElement = document.querySelector(".quote-display");
const quoteInputElement = document.querySelector(".quote-input");
const reportLinkElement = document.querySelector(".report-link");
const reportContainerElement = document.querySelector(".report-container");
const reloadButtonElement = document.querySelector(".reload");

let quote = "";
let intervalId;
let timer = 0;
let totalError = 0;
let report = [];

const startTimer = () => {
  timer = 0;
  const startTime = new Date();
  intervalId = setInterval(() => {
    timer = Math.floor((new Date() - startTime) / 1000);
  }, 1000);
};

const getRandomQuote = async () => {
  try {
    const response = await fetch(getQuoteApiUrl("random"));
    const { content, author } = await response.json();

    quote = `${content} ${author}`;
  } catch (error) {
    console.log("getRandomQuote", { error: error.message });
  }
};

const generateQuote = () => {
  quoteDisplayElement.innerHTML = "";
  quoteInputElement.value = null;
  quote.split("").forEach((character) => {
    const characterSpan = document.createElement("span");
    characterSpan.classList.add("char");
    characterSpan.innerText = character;
    quoteDisplayElement.appendChild(characterSpan);
  });
};

quoteInputElement.addEventListener("keydown", () => {
  reportContainerElement.style.display = "none";
});

quoteInputElement.addEventListener("input", (event) => {
  const arrayQuote = document.querySelectorAll(".char");
  const arrayValue = event.target.value;

  if (arrayValue.length === 1) {
    startTimer();
    getRandomQuote();
  }

  let correct = true;
  arrayQuote.forEach((characterSpan, index) => {
    const character = arrayValue[index];

    if (character == null) {
      characterSpan.classList.remove("correct");
      characterSpan.classList.remove("incorrect");
      correct = false;
    } else if (character === characterSpan.innerText) {
      characterSpan.classList.add("correct");
      characterSpan.classList.remove("incorrect");
    } else {
      characterSpan.classList.remove("correct");
      characterSpan.classList.add("incorrect");
      correct = false;
      totalError++;
    }
  });

  if (correct) {
    report.push({ error: totalError, time: timer });
    generateQuote();
    totalError = 0;
    clearInterval(intervalId);
  }
});

reportLinkElement.addEventListener("click", () => {
  if (reportContainerElement.style.display === "block") {
    reportContainerElement.style.display = "none";
  } else {
    reportContainerElement.style.display = "block";
    reportContainerElement.innerHTML = "";

    const total = { time: 0, error: 0 };
    const detailReportContainerElement = document.createElement("div");
    report.forEach((item, idx) => {
      const divElement = document.createElement("div");
      const labelElement = document.createElement("label");
      labelElement.innerText = `${idx + 1}.`;
      divElement.append(labelElement);

      const timeElement = document.createElement("span");
      timeElement.innerText = `Time: ${item.time}s`;
      divElement.append(timeElement);
      total["time"] = total["time"] + item.time;

      const errorElement = document.createElement("span");
      errorElement.innerText = `Error: ${item.error}`;
      divElement.append(errorElement);
      total["error"] = total["error"] + item.error;

      detailReportContainerElement.append(divElement);
    });

    const totalTimeElement = document.createElement("span");
    totalTimeElement.classList.add("time");
    totalTimeElement.innerText = `Time: ${total.time}s`;
    reportContainerElement.append(totalTimeElement);

    const totalErrorElement = document.createElement("span");
    totalErrorElement.classList.add("error");
    totalErrorElement.innerText = `Error: ${total.error}`;
    reportContainerElement.append(totalErrorElement);

    if (report.length > 0) {
      const detailHeaderElement = document.createElement("h4");
      detailHeaderElement.classList.add("detail-header");
      detailHeaderElement.innerText = "Detail";
      reportContainerElement.append(detailHeaderElement);
    }
    reportContainerElement.append(detailReportContainerElement);
  }
});

const generateSkeleton = () => {
  for (let index = 0; index < 2; index++) {
    const skeletonElement = document.createElement("div");
    skeletonElement.classList.add("skeleton");
    quoteDisplayElement.append(skeletonElement);
  }
};

const getQuote = async () => {
  generateSkeleton();
  await getRandomQuote();
  generateQuote();
};

reloadButtonElement.addEventListener("click", () => {
  quoteDisplayElement.innerHTML = "";
  getQuote();
});

getQuote();
