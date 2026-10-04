export default class View {
  constructor(game) {
    this.gameContainer = null;
    this.game = game;
    game.start();
    this.createGameContainer();
    this.populateGameContainer(game.cards);
  }

  createGameContainer() {
    this.gameContainer = document.createElement('div');
    this.gameContainer.id = 'game-container';
    document.body.appendChild(this.gameContainer);
  }

  createCard(card) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');

    const cardFront = document.createElement('div');
    cardFront.classList.add('card-front');

    const cardBack = document.createElement('div');
    cardBack.classList.add('card-back');

    const cardInner = document.createElement('div');
    cardInner.classList.add('card-inner');

    cardFront.textContent = card;
    cardBack.textContent = '👔';
    cardInner.appendChild(cardBack);
    cardInner.appendChild(cardFront);
    cardElement.appendChild(cardInner);
    return cardElement;
  }

  populateGameContainer(cards) {
    this.gameContainer.replaceChildren(...cards.map(card => this.createCard(card)));
  }
}
