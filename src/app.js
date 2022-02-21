(function () {
  const gameTypeContainer = document.querySelector("[data-js='gameOptions']");
  const addToCartButton = document.querySelector('[data-js="addToCart"]');
  const clearGameButton = document.querySelector('[data-js="clearGame"]');
  const emptyCartImage = document.querySelector('[data-js="emptyCartImage"]');
  const completeGameButton = document.querySelector('[data-js="completeGame"]');
  const numbersContainer = document.querySelector(
    '[data-js="numbersContainer"]'
  );
  const betDescriptionContainer = document.querySelector(
    '[data-js="betDescription"]'
  );
  const titleBetContainer = document.querySelector(".title span");
  const cartGamesContainer = document.querySelector(
    '[data-js="gamesContainer"]'
  );
  const totalPriceContainer = document.querySelector('[data-js="totalPrice"]');
  const totalPriceText = document.querySelector('[data-js="totalPriceCont"]');
  const toastContainer = document.querySelector('[data-js="toast"]');
  const toggleThemeButton = document.querySelector('[data-js="toggleTheme"]');

  let cartGames = [];

  async function getRules() {
    const res = await fetch("../src/rules.json");

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

    gameTypeActive[0].classList.add("active");
    gameTypeActive[0].style.background = `${gameType[0].color}`;
    gameTypeActive[0].style.color = `#fff`;

    totalPriceText.style.display = "none";
    getRangeCardNumbers(types);
  }

  function getRangeCardNumbers(gameTypes) {
    const activeButton = document.querySelector(".active");
    let range = 30;

    const gameType = gameTypes.filter(
      (gameType) => gameType.type === activeButton.innerText
    );

    gameTypes.forEach((gameType) => {
      if (gameType.type === activeButton.innerText) {
        range = gameType.range;
      }
    });

    createCardNumber(range, gameType);
  }

  function createCardNumber(range, gameType) {
    for (let i = 1; i <= range; i++) {
      const number = document.createElement("div");
      number.classList.add("number");
      number.innerText = i;

      number.addEventListener("click", () => {
        const numberClasses = Array.from(number.classList);

        numberClasses.includes("selected")
          ? number.classList.remove("selected")
          : number.classList.add("selected");

        const selectedNumbers = getSelectedNumbers();

        console.log(gameType);

        if (selectedNumbers.length > gameType[0]["max-number"]) {
          return showSelectedMuchNumbersToast(
            `Selecione apenas ${gameType[0]["max-number"]} números, você selecionou ${selectedNumbers.length}`
          );
        }
      });

      numbersContainer.appendChild(number);
    }
  }

  async function handleClickGameType(e) {
    const { types } = await getRules();
    const clickedButton = e.target;
    const clickedButtonClasses = Array.from(clickedButton.classList);
    const activeButton = document.querySelector(".active");

    const oldGame = types.filter(
      (gameType) => gameType.type === activeButton.textContent
    );

    const game = types.filter(
      (gameType) => gameType.type === clickedButton.textContent
    );

    console.log(oldGame);

    if (activeButton) {
      activeButton.classList.remove("active");
      activeButton.style.background = "transparent";
      activeButton.style.color = `${oldGame[0].color}`;
    }

    if (!clickedButtonClasses.includes("active")) {
      clickedButton.classList.add("active");
      clickedButton.style.background = `${game[0].color}`;
      clickedButton.style.color = `#fff`;
    }

    // if (clickedButtonClasses.includes("active")) {
    //   clickedButton.classList.remove("active");
    // } else {
    //   clickedButton.classList.add("active");
    // }

    numbersContainer.innerHTML = "";
    setBetDescription();
    getRangeCardNumbers(types);
  }

  function createButtonGameType(gameType) {
    const buttonGameType = document.createElement("div");

    buttonGameType.classList.add("gameType", gameType.type);
    buttonGameType.textContent = gameType.type;
    buttonGameType.style.border = `2px solid ${gameType.color}`;
    buttonGameType.style.color = `${gameType.color}`;

    buttonGameType.addEventListener("click", handleClickGameType);
    return gameTypeContainer.appendChild(buttonGameType);
  }

  function getSelectedNumbers() {
    const selectedNumbers = document.querySelectorAll(".selected");

    return Array.from(selectedNumbers);
  }

  function clearGame() {
    const selectedNumbers = getSelectedNumbers();

    selectedNumbers.forEach((number) => number.classList.remove("selected"));
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

  async function completeGame() {
    const { types } = await getRules();
    const selectedNumbers = getSelectedNumbers();
    const activeButton = document.querySelector(".active");
    const numbers = Array.from(numbersContainer.children);

    let maxNumbers = 0;
    let randomNumbers = [];

    types.forEach((gameType) => {
      if (gameType.type === activeButton.textContent) {
        maxNumbers = gameType["max-number"];

        if (selectedNumbers.length < maxNumbers) {
          const missing = maxNumbers - selectedNumbers.length;

          for (let i = 0; i < missing; i++) {
            let randomNumber = Math.ceil(Math.random() * gameType.range);

            if (randomNumbers.includes(randomNumber)) {
              i--;
            } else [randomNumbers.push(randomNumber)];
          }
        }
      }

      randomNumbers.forEach((randomNumber) => {
        numbers.forEach((number) => {
          if (number.textContent === String(randomNumber)) {
            number.classList.add("selected");
          }
        });
      });
    });
  }

  function deleteCartGame(e) {
    const clickedElementParent = e.target.parentElement;

    cartGamesContainer.removeChild(clickedElementParent);

    cartGames = cartGames.filter(
      (game) => game.id !== Number(clickedElementParent.id)
    );

    if (cartGames.length < 1) {
      emptyCartImage.style.display = "block";
      totalPriceText.style.display = "none";
    }
    getTotalPrice();
  }

  function getTotalPrice() {
    const totalPrice = cartGames.reduce(
      (acc, { price }) => Number(acc) + Number(price),
      0
    );

    return `R$ ${(totalPriceContainer.textContent = totalPrice
      .toFixed(2)
      .replace(".", ","))}`;
  }

  async function populateCartGame() {
    const { types } = await getRules();

    const gameInfoContainer = document.createElement("div");
    const trashButton = document.createElement("i");

    trashButton.classList.add("fa-solid", "fa-trash");
    gameInfoContainer.classList.add("gameInfo");

    trashButton.addEventListener("click", deleteCartGame);

    cartGames.forEach(({ numbers, gameType, price, id }) => {
      const gameColor = types.filter((game) => game.type === gameType);

      const HTMLTemplate = `
      <div 
        class="gamePreview ${gameType}" 
        style="
          border-left: 4px solid ${gameColor[0].color};"
      >
        <p class="selectedGame">${numbers}</p>
        <span 
          class="gameTypePrice" 
            style="
              color: ${gameColor[0].color}"
        >${gameType}</span>
        <span class="priceGame">R$ ${price.toFixed(2).replace(".", ",")}</span>
      </div>
        `;

      emptyCartImage.style.display = "none";
      totalPriceText.style.display = "block";
      gameInfoContainer.id = id;
      gameInfoContainer.innerHTML = HTMLTemplate;
      gameInfoContainer.prepend(trashButton);
      cartGamesContainer.appendChild(gameInfoContainer);
    });

    getTotalPrice();
  }

  function showToastWarning(gameType, selectedNumbers) {
    toastContainer.textContent =
      gameType["max-number"] - selectedNumbers.length === 1
        ? `Falta ${gameType["max-number"] - selectedNumbers.length} número`
        : `Faltam ${gameType["max-number"] - selectedNumbers.length} números`;

    if (gameType["max-number"] - selectedNumbers.length < 1) {
      toastContainer.textContent = `Selecione apenas ${
        gameType["max-number"]
      } números, remova ${selectedNumbers.length - gameType["max-number"]}`;
    }

    toastContainer.classList.add("warning");
    toastContainer.style.display = "block";
    setTimeout(() => {
      toastContainer.style.display = "none";
    }, 2000);
  }

  function showToastSuccess() {
    toastContainer.textContent = `Jogo adicionado com sucesso`;
    toastContainer.classList.remove("warning");
    toastContainer.classList.add("success");
    toastContainer.style.display = "block";
    setTimeout(() => {
      toastContainer.style.display = "none";
    }, 2000);
  }

  function showSelectedMuchNumbersToast(message) {
    toastContainer.textContent = message;
    toastContainer.classList.add("warning");
    toastContainer.style.display = "block";
    setTimeout(() => {
      toastContainer.style.display = "none";
    }, 2000);
  }

  async function addGameInCart() {
    const { types } = await getRules();
    const selectedNumbers = getSelectedNumbers();
    const activeButton = document.querySelector(".active");

    let gameTypeSelected = "";
    let gameTypePrice = 0;

    types.forEach((gameType) => {
      if (gameType.type === activeButton.textContent) {
        gameTypeSelected = gameType.type;
        gameTypePrice = gameType.price;
      }
    });

    let isValid = true;

    types.forEach((gameType) => {
      if (gameTypeSelected === gameType.type) {
        if (
          selectedNumbers.length < gameType["max-number"] ||
          selectedNumbers.length > gameType["max-number"]
        ) {
          isValid = false;
          showToastWarning(gameType, selectedNumbers);
        }
      }
    });

    if (!isValid) {
      return;
    }

    showToastSuccess();

    const selectedNumbersString = selectedNumbers
      .map((number) => number.textContent)
      .join(", ");

    cartGames.push({
      numbers: selectedNumbersString,
      gameType: gameTypeSelected,
      price: gameTypePrice,
    });

    cartGames.forEach((game, index) => {
      game.id = index;
    });

    clearGame();
    populateCartGame();
  }

  function toggleTheme() {
    document.body.classList.toggle("dark-theme");
  }

  toggleThemeButton.addEventListener("click", toggleTheme);
  addToCartButton.addEventListener("click", addGameInCart);
  completeGameButton.addEventListener("click", completeGame);
  clearGameButton.addEventListener("click", clearGame);
  chooseGame();
})();
