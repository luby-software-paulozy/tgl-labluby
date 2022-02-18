const typeGameButtons = document.querySelectorAll('[data-js="typeGame"]');
const numbersContainer = document.querySelector('[data-js="numbersContainer"]');
const addToCartButton = document.querySelector('[data-js="addToCart"]');
const betDescription = document.querySelector('[data-js="betDescription"]');
const clearGameButton = document.querySelector('[data-js="clearGame"]');
const completeGameButton = document.querySelector('[data-js="completeGame"]');
const cartGamesContainer = document.querySelector('[data-js="gamesContainer"]');
const totalPriceContainer = document.querySelector('[data-js="totalPrice"]');

let cartGames = [];

async function getRulesGame() {
  const res = await fetch("./rules.json");

  const data = await res.json();

  return await data;
}
function generateCardNumbers(type, range) {
  switch (type) {
    case "Lotofácil":
      quantityNumbers = range;
      break;
    case "Mega-Sena":
      quantityNumbers = range;
      break;
    case "Quina":
      quantityNumbers = range;
      break;
    default:
      quantityNumbers = 30;
  }

  for (let i = 1; i <= quantityNumbers; i++) {
    const number = document.createElement("div");
    number.classList.add("number");
    number.innerText = i;

    numbersContainer.appendChild(number);

    number.addEventListener("click", () => {
      const numberClasses = Array.from(number.classList);

      return numberClasses.includes("selected")
        ? number.classList.remove("selected")
        : number.classList.add("selected");
    });
  }
}
function handleClickClearGame() {
  selectedNumbers = getSelectedNumbers();

  randomNumbers = [];
  selectedNumbers.forEach((number) => number.classList.remove("selected"));
}
async function handleClickGetRandomNumbers() {
  const { types } = await getRulesGame();
  const selectedGameType = getSelectedGameType();

  let randomNumbers = [];

  const numbers = Array.from(numbersContainer.children);

  let maxNumber;
  let range;

  if (selectedGameType === "Lotofácil") {
    maxNumber = types[0]["max-number"];
    range = types[0]["range"];
  }
  if (selectedGameType === "Mega-Sena") {
    maxNumber = types[1]["max-number"];
    range = types[1]["range"];
  }
  if (selectedGameType === "Lotomania") {
    maxNumber = types[2]["max-number"];
    range = types[2]["range"];
  }

  for (let i = 1; i <= maxNumber; i++) {
    randomNumbers.push(String(Math.ceil(Math.random() * range)));
  }

  randomNumbers.forEach((randomNumber) => {
    numbers.forEach((number) => {
      if (number.innerText === randomNumber) {
        number.classList.add("selected");
      }
    });
  });
}
function handleClickRemoveCartGame(e) {
  const clickedElement = e.target.parentElement;
  cartGamesContainer.removeChild(clickedElement);
  cartGames.pop();
  totalPriceContainer.innerText = "";
  getCartTotalPrice();
}
async function handleClickAddGameInCart() {
  const { types } = await getRulesGame();
  const priceGameType = await getPriceGameType();
  const selectedGameType = getSelectedGameType();

  const selectedNumbers = getSelectedNumbers().map(
    (number) => number.innerText
  );

  const { isValidRulesGame, message } = validateRulesGame(
    types,
    selectedGameType,
    selectedNumbers
  );

  if (!selectedNumbers.length) {
    return alert("Por favor, selecione os números");
  }

  if (!isValidRulesGame) {
    return alert(message);
  }

  const selectedNumbersString = selectedNumbers.join(", ");

  cartGames.push({
    numbers: selectedNumbersString,
    gameType: selectedGameType,
    price: priceGameType,
  });

  getCartTotalPrice();

  handleClickClearGame();
  renderCartGames();
}
function handleClickButtonGameType(button) {
  button.addEventListener("click", async () => {
    const { types } = await getRulesGame();
    let type;
    let range;
    let description;

    if (button.innerText === "Lotofácil") {
      description = types[0].description;
      betDescription.innerText = description;
      type = types[0].type;
      range = types[0].range;

      validateNumberContainer(type, range);
    }

    if (button.innerText === "Mega-Sena") {
      description = types[1].description;
      betDescription.innerText = description;

      type = types[1].type;
      range = types[1].range;

      validateNumberContainer(type, range);
    }

    if (button.innerText === "Lotomania") {
      description = types[2].description;
      betDescription.innerText = description;

      type = types[2].type;
      range = types[2].range;

      validateNumberContainer(type, range);
    }

    const buttonClasses = Array.from(button.classList);
    const gameTypeActive = Array.from(document.querySelectorAll(".active"));

    if (gameTypeActive.length > 0) {
      gameTypeActive.forEach((button) => button.classList.remove("active"));
    }

    if (buttonClasses.includes("active")) {
      button.classList.remove("active");
    } else {
      button.classList.add("active");
    }
  });
}
function validateNumberContainer(type, range) {
  if (!numbersContainer.innerHTML) {
    generateCardNumbers(type, range);
    numbersContainer.style.display = "grid";
  } else {
    numbersContainer.innerHTML = "";
    generateCardNumbers(type, range);
    numbersContainer.style.display = "grid";
  }
}
function validateRulesGame(types, selectedGameType, selectedNumbers) {
  let isValidRulesGame = true;
  let message = "";

  const lotofacilGreatherThan =
    selectedGameType === "Lotofácil" &&
    selectedNumbers.length > types[0]["max-number"];

  const lotofacilLessThan =
    selectedGameType === "Lotofácil" &&
    selectedNumbers.length < types[0]["max-number"];

  const megaGreatherThan =
    selectedGameType === "Mega-Sena" &&
    selectedNumbers.length > types[1]["max-number"];

  const megaLessThan =
    selectedGameType === "Mega-Sena" &&
    selectedNumbers.length < types[1]["max-number"];

  const quinaGreatherThan =
    selectedGameType === "Lotomania" &&
    selectedNumbers.length > types[2]["max-number"];

  const quinaLessThan =
    selectedGameType === "Lotomania" &&
    selectedNumbers.length < types[2]["max-number"];

  if (lotofacilGreatherThan || lotofacilLessThan) {
    message = `Favor selecionar ${types[0]["max-number"]} números`;
    isValidRulesGame = false;
  } else if (megaGreatherThan || megaLessThan) {
    message = `Favor selecionar ${types[1]["max-number"]} números`;
    isValidRulesGame = false;
  } else if (quinaGreatherThan || quinaLessThan) {
    message = `Favor selecionar ${types[2]["max-number"]} números`;
    isValidRulesGame = false;
  }

  return { isValidRulesGame, message };
}
function getSelectedNumbers() {
  return Array.from(document.querySelectorAll(".selected"));
}
function getSelectedGameType() {
  const selectedGameType = document.querySelectorAll(".active");

  if (!selectedGameType.length > 0) {
    return alert("Por favor selecione um tipo de jogo");
  }

  if (selectedGameType.length > 1) {
    return alert("Por favor selecione apenas um tipo de jogo");
  }

  return selectedGameType[0].innerText;
}
async function getPriceGameType() {
  const { types } = await getRulesGame();
  const selectedGameType = getSelectedGameType();

  let price;

  if (selectedGameType === "Lotofácil") {
    price = types[0].price;
  }
  if (selectedGameType === "Mega-Sena") {
    price = types[1].price;
  }
  if (selectedGameType === "Lotomania") {
    price = types[2].price;
  }

  return price;
}
function getCartTotalPrice() {
  const totalPrice = cartGames.reduce((acc, { price }) => acc + price, 0);
  totalPriceContainer.innerText = `R$ ${totalPrice
    .toFixed(2)
    .replace(".", ",")}`;
}
function renderCartGames() {
  const gameInfoContainer = document.createElement("div");
  const trashButton = document.createElement("i");

  trashButton.classList.add("fa-solid", "fa-trash");
  gameInfoContainer.classList.add("gameInfo");

  trashButton.addEventListener("click", handleClickRemoveCartGame);

  const selectedGameType = getSelectedGameType();

  cartGames.forEach(({ numbers, gameType, price }) => {
    let gameClasse = "";

    switch (selectedGameType) {
      case "Lotofácil":
        gameClasse = "lotofacil";
        break;
      case "Mega-Sena":
        gameClasse = "mega";
        break;
      case "Lotomania":
        gameClasse = "quina";
        break;
    }

    const HTMLTemplate = `
      <div class="gamePreview ${gameClasse}">
        <p class="selectedGame">${numbers}</p>
        <span class="gameTypePrice ${gameClasse}">${gameType}</span>
        <span class="priceGame">R$ ${price.toFixed(2).replace(".", ",")}</span>
      </div>
        `;

    gameInfoContainer.innerHTML = HTMLTemplate;
    gameInfoContainer.prepend(trashButton);
    return cartGamesContainer.appendChild(gameInfoContainer);
  });
}

addToCartButton.addEventListener("click", handleClickAddGameInCart);
completeGameButton.addEventListener("click", handleClickGetRandomNumbers);
clearGameButton.addEventListener("click", handleClickClearGame);
Array.from(typeGameButtons).forEach(handleClickButtonGameType);
