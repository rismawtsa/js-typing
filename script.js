const QUOTE_API_URL = "https://api.quotable.io/random";
const QUOTES_JSON = "./quotes.json";

const containerElement = document.querySelector(".container");
const quoteDisplayElement = document.querySelector(".quote-display");
const quoteInputElement = document.querySelector(".quote-input");
const reloadButtonElement = document.querySelector(".reload");

let quote = "";
let defaultQuoteIndex = 0;

const getQuoteJson = async () => {
  const response = await fetch(QUOTES_JSON);
  const data = await response.json();
  const { content, author } = data.quotes[defaultQuoteIndex];

  quote = `${content} ${author}`;

  if (defaultQuoteIndex < data.quotes.length) defaultQuoteIndex++;
  else defaultQuoteIndex = 0;
};

const getRandomQuote = async () => {
  try {
    const response = await fetch(QUOTE_API_URL);
    const { content, author } = await response.json();

    quote = `${content} ${author}`;
  } catch (error) {
    return getQuoteJson();
  }
};

const generateQuote = () => {
  quoteDisplayElement.innerHTML = "";
  quoteInputElement.value = null;

  const quotes = quote.split(" ");
  quotes.forEach((word, indexWord) => {
    const wordDiv = document.createElement("div");

    word.split("").forEach((character, indexChar) => {
      const characterSpan = document.createElement("span");
      characterSpan.classList.add("char");
      if (indexWord === 0 && indexChar === 0)
        characterSpan.classList.add("current");
      characterSpan.innerText = character;
      wordDiv.appendChild(characterSpan);
    });

    if (indexWord < quotes.length - 1) {
      const spaceSpan = document.createElement("span");
      spaceSpan.classList.add("char");
      spaceSpan.innerText = " ";
      wordDiv.appendChild(spaceSpan);
    }

    quoteDisplayElement.appendChild(wordDiv);
  });
};

document.addEventListener("click", (event) => {
  const infoDiv = document.querySelector(".info");
  if (
    quoteDisplayElement.contains(event.target) ||
    (infoDiv && infoDiv.contains(event.target))
  ) {
    infoDiv && infoDiv.remove();
    quoteDisplayElement.classList.remove("filter");
    quoteInputElement.focus();
  }
});

quoteInputElement.addEventListener("blur", function (e) {
  if (!reloadButtonElement.contains(event.target)) {
    quoteDisplayElement.classList.add("filter");
    const infoDiv = document.querySelector(".info");

    if (!infoDiv) {
      const newInfoDiv = document.createElement("div");
      newInfoDiv.classList.add("info");
      newInfoDiv.innerText = "Click to active....";
      containerElement.insertBefore(newInfoDiv, reloadButtonElement);
    }
  }
});

quoteInputElement.addEventListener("input", (event) => {
  const arrayQuote = document.querySelectorAll(".char");
  const arrayValue = event.target.value;

  if (arrayValue.length === 1) getRandomQuote();

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
    }
  });

  const currentSpan = document.querySelector(".current");
  currentSpan && currentSpan.classList.remove("current");
  if (arrayValue.length < arrayQuote.length) {
    arrayQuote[arrayValue.length].classList.add("current");
  }

  if (correct) {
    generateQuote();
  }
});

reloadButtonElement.addEventListener("click", () => {
  const infoDiv = document.querySelector(".info");
  infoDiv && infoDiv.remove();
  quoteDisplayElement.classList.remove("filter");
  quoteInputElement.focus();

  quoteDisplayElement.innerHTML = "";
  quoteInputElement.value = null;

  getQuote();
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

getQuote();
