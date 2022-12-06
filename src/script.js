const QUOTE_API_URL = "https://api.quotable.io/random";
const QUOTES_JSON = "./quotes.json";

const bodyElement = document.querySelector("body");
const settingButtonElement = document.querySelector(".btn-setting");
const settingElement = document.querySelector(".setting");
const modeSwitchElement = document.getElementsByName("checkbox-mode")[0];
const autonextSwitchElement =
  document.getElementsByName("checkbox-autonext")[0];
const containerElement = document.querySelector(".container");
const quoteDisplayElement = document.querySelector(".quote-display");
const quoteInputElement = document.querySelector(".quote-input");
const controlElement = document.querySelector(".control");
const reloadButtonElement = document.querySelector(".btn-reload");
const copyButtonElement = document.querySelector(".btn-copy");

let infoDiv;

let currentQuote = "";
let nextQuote = "";
let defaultQuoteIndex = 0;

const mode = localStorage.getItem("mode");
if (mode) {
  bodyElement.classList.add("dark-mode");
  modeSwitchElement.checked = true;
}

const getAutonextFlag = () => {
  const autonextLs = localStorage.getItem("autonext");
  if (autonextLs === "false") return false;

  return true;
};

if (getAutonextFlag()) {
  autonextSwitchElement.checked = true;
} else {
  autonextSwitchElement.checked = false;
}

const generateSkeleton = () => {
  for (let index = 0; index < 2; index++) {
    const skeletonElement = document.createElement("div");
    skeletonElement.classList.add("skeleton");
    quoteDisplayElement.append(skeletonElement);
  }
};

const getQuoteJson = async () => {
  const response = await fetch(QUOTES_JSON);
  const data = await response.json();
  const { content, author } = data.quotes[defaultQuoteIndex];

  nextQuote = `${content} ${author}`;

  if (defaultQuoteIndex < data.quotes.length) defaultQuoteIndex++;
  else defaultQuoteIndex = 0;
};

const getRandomQuote = async () => {
  try {
    const response = await fetch(QUOTE_API_URL);
    const { content, author } = await response.json();

    nextQuote = `${content} ${author}`;
  } catch (error) {
    return getQuoteJson();
  }
};

const generateQuote = () => {
  quoteDisplayElement.innerHTML = "";
  quoteInputElement.value = "";

  const quotes = nextQuote.split(" ");
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

const enableInput = () => {
  infoDiv && infoDiv.remove();
  infoDiv = undefined;
  quoteDisplayElement.classList.remove("filter");
  quoteInputElement.focus();
};

settingButtonElement.addEventListener("click", () => {
  if (settingElement.style.display === "block") {
    settingElement.style.display = "none";
  } else {
    settingElement.style.display = "block";
  }
});

modeSwitchElement.addEventListener("click", () => {
  if (bodyElement.classList.contains("dark-mode")) {
    bodyElement.classList.remove("dark-mode");
    localStorage.setItem("mode", "");
  } else {
    bodyElement.classList.add("dark-mode");
    localStorage.setItem("mode", "dark");
  }
});

autonextSwitchElement.addEventListener("click", () => {
  if (autonextSwitchElement.checked) {
    localStorage.setItem("autonext", true);
  } else {
    localStorage.setItem("autonext", false);
  }
});

document.addEventListener("click", (event) => {
  if (
    quoteDisplayElement.contains(event.target) ||
    (infoDiv && infoDiv.contains(event.target))
  ) {
    enableInput();
  }

  if (
    !settingElement.contains(event.target) &&
    !settingButtonElement.contains(event.target)
  ) {
    settingElement.style.display = "none";
  }
});

quoteInputElement.addEventListener("blur", function (event) {
  quoteDisplayElement.classList.add("filter");

  if (!infoDiv) {
    infoDiv = document.createElement("div");
    infoDiv.classList.add("info");
    infoDiv.innerText = "Click to active....";
    containerElement.insertBefore(infoDiv, controlElement);
  }
});

quoteInputElement.addEventListener("input", (event) => {
  const getNextQuote = () => {
    currentQuote = "";
    generateQuote();
    enableInput();
  };

  const arrayQuote = document.querySelectorAll(".char");
  const arrayValue = event.target.value;

  if (arrayValue.length === 1) {
    currentQuote = nextQuote;
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
    }
  });

  const currentSpan = document.querySelector(".current");
  currentSpan && currentSpan.classList.remove("current");
  if (arrayValue.length < arrayQuote.length) {
    arrayQuote[arrayValue.length].classList.add("current");
  }

  if (correct) {
    if (autonextSwitchElement.checked) {
      getNextQuote();
    } else {
      const arrowIcon = document.createElement("button");
      arrowIcon.classList.add("btn", "btn-next");
      arrowIcon.innerHTML =
        '<img class="icon" src="/icons/right-arrow.svg" alt="next" title="next quote"/>';
      arrowIcon.title = "next quote";
      arrowIcon.addEventListener("click", getNextQuote);
      quoteDisplayElement.appendChild(arrowIcon);
    }
  }
});

copyButtonElement.addEventListener("click", () => {
  enableInput();
  const quote = currentQuote || nextQuote;
  navigator.clipboard.writeText(quote);
});

reloadButtonElement.addEventListener("click", () => {
  quoteDisplayElement.innerHTML = "";
  quoteInputElement.value = "";
  enableInput();

  getQuote();
});

const getQuote = async () => {
  generateSkeleton();
  await getRandomQuote();
  generateQuote();
};

getQuote();
