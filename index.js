const CAT_TYPE = 1;
const DOG_TYPE = 2;
const MONKEY_TYPE = 3;
const GIRRAFFE_TYPE = 4;

const CAT_IMG = "./images/catCard.jpg";
const DOG_IMG = "./images/dogCard.jpg";
const MONKEY_IMG = "./images/monkeyCard.jpg";
const GIRRAFFE_IMG = "./images/girraffe.jpg";

const cardsWrapper = document.getElementById("cardsWrapper");
const winNumberWrapper = document.getElementById("winNumberWrapper");
const initScore = document.getElementById("initScore");

let clickedCardWatcher = new Map();
let counterTrue = 0;

class Card {
  constructor() {
    this.type = 0;
    this.isFlipped = false;
    this.src = "";
  }

  flip() {
    this.isFlipped = !this.isFlipped;
  }
}

class CatCard extends Card {
  constructor(props) {
    super(props);
    this.type = CAT_TYPE;
    this.src = CAT_IMG;
  }
}

class DogCard extends Card {
  constructor(props) {
    super(props);
    this.type = DOG_TYPE;
    this.src = DOG_IMG;
  }
}

class MonkeyCard extends Card {
  constructor(props) {
    super(props);
    this.type = MONKEY_TYPE;
    this.src = MONKEY_IMG;
  }
}

class GirraffeCard extends Card {
  constructor(props) {
    super(props);
    this.type = GIRRAFFE_TYPE;
    this.src = GIRRAFFE_IMG;
  }
}

class CardFactory {
  create(type) {
    let card;
    switch (type) {
      case MONKEY_TYPE:
        card = new MonkeyCard();
        break;
      case DOG_TYPE:
        card = new DogCard();
        break;
      case CAT_TYPE:
        card = new CatCard();
        break;
      case GIRRAFFE_TYPE:
        card = new GirraffeCard();
        break;
    }
    return card;
  }
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

const cardTypes = [MONKEY_TYPE, DOG_TYPE, CAT_TYPE, GIRRAFFE_TYPE];

function generateCardArr() {
  const result = [];

  const factory = new CardFactory();
  const accessibleCardTypes = shuffle(cardTypes).slice(0, 3);
  const doubleCardTypes = shuffle(
    accessibleCardTypes.concat(accessibleCardTypes)
  );

  doubleCardTypes.forEach(function (el) {
    let card = factory.create(el);
    result.push(card);
  });

  return result;
}

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

function count() {
  let n = localStorage.getItem("nowNumber");
  n++;
  localStorage.setItem("nowNumber", n);
}

function isFlippedCheck(cardItem, imgElement) {
  if (cardItem.isFlipped) {
    imgElement.setAttribute("src", cardItem.src);
  } else {
    imgElement.setAttribute("src", "./images/reverseSide.png");
  }
}

function initCardElement(cardItem) {
  const imgWrapper = document.createElement("div");
  imgWrapper.className = "imgWrapper";
  cardsWrapper.appendChild(imgWrapper);

  const imgElement = document.createElement("img");
  imgElement.className = "cardImg";
  imgWrapper.appendChild(imgElement);
  isFlippedCheck(cardItem, imgElement);
  return { imgWrapper, imgElement };
}

function relogCardsFalse(arr,firstEl,secondEl){
  setTimeout(function () {
    arr[firstEl].flip();
    arr[secondEl].flip();
    document
      .getElementsByClassName("cardImg")
      [firstEl].setAttribute("src", "./images/reverseSide.png");
    document
      .getElementsByClassName("cardImg")
      [secondEl].setAttribute("src", "./images/reverseSide.png");
    clickedCardWatcher.clear();
  }, 1000);
}

function delCardsTrue(){
  setTimeout(function () {
    document
      .getElementsByClassName("imgWrapper")
      [[...clickedCardWatcher][0][0]].classList.add("hidden");
    document
      .getElementsByClassName("imgWrapper")
      [[...clickedCardWatcher][1][0]].classList.add("hidden");
    clickedCardWatcher.clear();
    counterTrue = counterTrue + 1;
    if (counterTrue == 3) {
      removeAllChildNodes(cardsWrapper);
      count();
      init();
    }
  }, 1000);
}

function init() {
  counterTrue = 0;
  if (localStorage.getItem("nowNumber")) {
    initScore.innerHTML = `WIN SCORE ${localStorage.getItem("nowNumber")}`;
  }
  const cards = generateCardArr();
  
  cards.forEach(function (cardItem, index, arr) {
    const { imgElement, imgWrapper } = initCardElement(cardItem);

    imgWrapper.addEventListener("click", function (e) {
      if (clickedCardWatcher.size < 2) {
        if (clickedCardWatcher.get(index)) {
          clickedCardWatcher.delete(index);
        } else {
          clickedCardWatcher.set(index, cardItem);
        }
        if (
          [...clickedCardWatcher][0] &&
          [...clickedCardWatcher][1] &&
          [...clickedCardWatcher][0][1].type ===
            [...clickedCardWatcher][1][1].type
        ) {
          delCardsTrue();
        } else if (
          [...clickedCardWatcher][0] &&
          [...clickedCardWatcher][1] &&
          [...clickedCardWatcher][0][1].type !==
            [...clickedCardWatcher][1][1].type
        ) {
          const firstEl = [...clickedCardWatcher][0][0];
          const secondEl = [...clickedCardWatcher][1][0];
          relogCardsFalse(arr,firstEl,secondEl);
        }
        cardItem.flip(arr);
        isFlippedCheck(cardItem, imgElement);
      }
    });
  });
}

init();
