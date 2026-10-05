export default class View {
  constructor(game) {
    this.gameContainer = null;
    this.game = game;
    game.start();
    this.firstCard = null;
    this.movesEl = null;
    this.winModal = this.createWinModal();
    this.leaderboardModal = this.createLeaderboardModal();
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

    const openLeaderboardButton = document.createElement('button');
    openLeaderboardButton.id = 'open-leaderboard';
    openLeaderboardButton.textContent = 'Leaderboard';

    openLeaderboardButton.addEventListener('click', () => {
      this.openLeaderboard();
    });

    newGame.addEventListener('click', () => {
      this.startNewGame();
    });

    menu.appendChild(moves);
    menu.appendChild(newGame);
    menu.appendChild(openLeaderboardButton);

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
          if (result.isWin) {
            this.openWinModal();
            this.createLeadersList(this.game.getLeaderboard());
          }
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

  createModal(id) {
    const modal = document.createElement('dialog');
    modal.id = id;
    modal.setAttribute('closedby', 'any');
    return modal;
  }

  createWinModal() {
    const modal = this.createModal('win-modal');
    const wrapper = document.createElement('div');
    const text = document.createElement('p');
    text.textContent = 'You won!';
    wrapper.appendChild(text);

    const movesEl = document.createElement('p');
    movesEl.classList.add('moves');
    wrapper.appendChild(movesEl);

    const newGameButton = document.createElement('button');
    newGameButton.textContent = 'New Game';
    newGameButton.addEventListener('click', () => {
      modal.close();
      this.startNewGame();
    });
    wrapper.appendChild(newGameButton);

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.addEventListener('click', () => {
      modal.close();
    });
    wrapper.appendChild(closeButton);

    modal.appendChild(wrapper);
    document.body.append(modal);
    return modal;
  }

  openWinModal() {
    this.winModal.showModal();
    this.winModal.querySelector('.moves').textContent = `Moves: ${this.game.moves}`;
  }

  createLeaderboardModal() {
    const modal = this.createModal('leaderboard-modal');
    const wrapper = document.createElement('div');

    const header = document.createElement('h2');
    header.textContent = 'Leaderboard';
    wrapper.appendChild(header);

    const scores = this.game.getLeaderboard();
    const scoresList = document.createElement('ol');
    this.scoresList = scoresList;
    this.createLeadersList(scores);

    wrapper.appendChild(scoresList);

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.addEventListener('click', () => {
      modal.close();
    });
    wrapper.appendChild(closeButton);

    modal.appendChild(wrapper);
    document.body.append(modal);
    return modal;
  }

  createLeadersList(scores) {
    console.log(scores);
    this.scoresList.replaceChildren();
    console.log(this.scoresList);
    scores.forEach(score => {
      const li = document.createElement('li');
      li.textContent = `Moves: ${score.moves} --- Time: ${new Date(score.timestamp).toLocaleDateString('ru-RU')}`;
      this.scoresList.appendChild(li);
    });
  }

  openLeaderboard() {
    this.leaderboardModal.showModal();
  }
}
