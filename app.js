(function () {
  const gameTypeContainer = document.querySelector("[data-js='gameOptions']");
  const numbersContainer = document.querySelector(
    '[data-js="numbersContainer"]'
  );
  const betDescriptionContainer = document.querySelector(
    '[data-js="betDescription"]'
  );
  const titleBetContainer = document.querySelector(".title span");

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

    const gameType = types.filter(
      (gameType) => gameType.type === gameTypeActive[0].textContent
    );

    gameTypeActive[0].classList.add("active");
    numbersContainer.style.display = "grid";

    const title = `<span><strong>NOVA APOSTA</strong> PARA ${gameType[0].type.toUpperCase()}</span>`;
    titleBetContainer.innerHTML = "";
    titleBetContainer.innerHTML = title;

    const description = gameType[0].description;
    betDescriptionContainer.textContent = description;

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
    setBetDescription();
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

  async function setBetDescription() {
    const { types } = await getRules();
    const activeButton = document.querySelector(".active");

    const gameType = types.filter(
      (gameType) => gameType.type === activeButton.textContent
    );

    const description = gameType[0].description;
    const title = `<span><strong>NOVA APOSTA</strong> PARA ${gameType[0].type.toUpperCase()}</span>`;

    betDescriptionContainer.textContent = "";
    titleBetContainer.innerHTML = "";

    titleBetContainer.innerHTML = title;

    return (betDescriptionContainer.textContent = description);
  }

  setBetDescription();
  chooseGame();
})();
