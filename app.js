(function () {
  const gameTypeContainer = document.querySelector("[data-js='gameOptions']");
  const numbersContainer = document.querySelector(
    '[data-js="numbersContainer"]'
  );
  const betDescriptionContainer = document.querySelector(
    '[data-js="betDescription"]'
  );

  async function getRules() {
    const res = await fetch("./rules.json");

    const data = await res.json();

    return data;
  }

  async function chooseGame() {
    const { types } = await getRules();

    types.forEach((gameType) => {
      createButtonGameType(gameType);
    });

    const gameTypeActive = Array.from(document.querySelectorAll(".gameType"));

    gameTypeActive[0].classList.add("active");
    betDescriptionContainer.textContent = types[0].description;

    numbersContainer.style.display = "grid";
    getRangeCardNumbers(types);
  }

  function getRangeCardNumbers(gameTypes) {
    const activeButton = document.querySelector(".active");
    let range = 30;

    gameTypes.forEach((gameType) => {
      if (gameType.type === activeButton.innerText) {
        range = gameType.range;
      }
    });

    createCardNumber(range);
  }

  function createCardNumber(range) {
    for (let i = 1; i <= range; i++) {
      const number = document.createElement("div");
      number.classList.add("number");
      number.innerText = i;

      number.addEventListener("click", () => {
        const numberClasses = Array.from(number.classList);

        return numberClasses.includes("selected")
          ? number.classList.remove("selected")
          : number.classList.add("selected");
      });

      numbersContainer.appendChild(number);
    }
  }

  async function handleClick(e) {
    const { types } = await getRules();
    const clickedButton = e.target;
    const clickedButtonClasses = Array.from(clickedButton.classList);
    const activeButton = document.querySelector(".active");

    if (activeButton) {
      activeButton.classList.remove("active");
    }

    if (clickedButtonClasses.includes("active")) {
      clickedButton.classList.remove("active");
    } else {
      clickedButton.classList.add("active");
    }

    numbersContainer.innerHTML = "";
    getRangeCardNumbers(types);
  }

  function createButtonGameType(gameType) {
    const buttonGameType = document.createElement("div");

    buttonGameType.classList.add("gameType", gameType.type);
    buttonGameType.textContent = gameType.type;

    buttonGameType.addEventListener("click", handleClick);
    return gameTypeContainer.appendChild(buttonGameType);
  }

  function getSelectedNumbers() {
    const selectedNumbers = document.querySelectorAll(".selected");

    return Array.from(selectedNumbers);
  }

  chooseGame();
})();
