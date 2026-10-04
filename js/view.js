export default class View {
  constructor(game) {
    this.gameContainer = null;
    this.game = game;
    game.start();
    this.deck = [];
    this.createGameContainer();
    this.populateGameContainer(game.cards);
    console.log(game.cards);
  }

  createGameContainer() {
    this.gameContainer = document.createElement('div');
    this.gameContainer.id = 'game-container';
    document.body.appendChild(this.gameContainer);
    this.deck = [];
  }

  createCard(card) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.id = card.id;

    const cardFront = document.createElement('div');
    cardFront.classList.add('card-front');

    const cardBack = document.createElement('div');
    cardBack.classList.add('card-back');

    const cardInner = document.createElement('div');
    cardInner.classList.add('card-inner');

    cardFront.textContent = card.value;
    cardBack.textContent = '👔';
    cardInner.appendChild(cardBack);
    cardInner.appendChild(cardFront);
    cardElement.appendChild(cardInner);

    cardElement.addEventListener('click', () => {
      this.deck.push(cardElement);
      const result = this.game.flipCard(cardElement.id);
      cardElement.classList.add('active');
      switch (result.status) {
        case 'pair':
          this.deck = [];
          break;
        case 'fail':
          setTimeout(() => {
            this.deck[0].classList.remove('active');
            cardElement.classList.remove('active');
            this.deck = [];
          }, 1000)
          break;
        case 'flip':
          break;
      }
    });

    return cardElement;
  }

  populateGameContainer(cards) {
    this.gameContainer.replaceChildren(...cards.map(card => this.createCard(card)));
  }
}
