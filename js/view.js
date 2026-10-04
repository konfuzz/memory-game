export default class View {
  constructor(game) {
    this.gameContainer = null;
    this.game = game;
    game.start();
    this.firstCard = null;
    this.movesEl = null;
    this.createMenu();
    this.createGameContainer();
    this.startNewGame();
  }

  startNewGame() {
    this.game.start();
    this.populateGameContainer(this.game.cards);
    this.firstCard = null;
    this.movesEl.textContent = 'Moves: 0';
  }

  createGameContainer() {
    this.gameContainer = document.createElement('div');
    this.gameContainer.id = 'game-container';
    document.body.appendChild(this.gameContainer);
  }

  createMenu() {
    const menu = document.createElement('div');
    menu.id = 'menu';
    const moves = document.createElement('div');
    moves.id = 'moves';
    this.movesEl = moves;
    const newGame = document.createElement('button');
    newGame.id = 'new-game';
    newGame.textContent = 'New Game';

    newGame.addEventListener('click', () => {
      this.startNewGame();
    });

    menu.appendChild(moves);
    menu.appendChild(newGame);
    document.body.appendChild(menu);
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
      const result = this.game.flipCard(cardElement.id);
      switch (result.status) {
        case 'flip':
          cardElement.classList.add('active');
          this.firstCard = cardElement;
          break;
        case 'pair':
          cardElement.classList.add('active');
          this.firstCard = null;
          break;
        case 'fail': {
          const firstCard = this.firstCard;
          this.firstCard = null;
          cardElement.classList.add('active');
          setTimeout(() => {
            firstCard.classList.remove('active');
            cardElement.classList.remove('active');
            this.game.resolveFail();
          }, 1000);
          break;
        }
        case 'ignored':
          break;
      }
      this.movesEl.textContent = `Moves: ${this.game.moves}`;
    });

    return cardElement;
  }

  populateGameContainer(cards) {
    this.gameContainer.replaceChildren(...cards.map(card => this.createCard(card)));
  }
}
