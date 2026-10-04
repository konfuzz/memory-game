import { cards } from './data.js';

export default class Game {
  constructor() {
    this.cards = [];
    this.matchedCards = [];
    this.currentCard = null;
    this.state = 'idle';
    this.moves = 0;
  }

  start() {
    const initCards = [...cards, ...cards];
    for (let i = initCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [initCards[i], initCards[j]] = [initCards[j], initCards[i]];
    }
    this.cards = initCards.map((card) => this.createCard(card));
    this.matchedCards = [];
    this.currentCard = null;
    this.state = 'idle';
    this.moves = 0;
  }

  createCard(card) {
    return {
      id: crypto.randomUUID(),
      value: card,
    }
  }

  flipCard(id) {
    if (this.state === 'resolving' || this.state === 'won') {
      return { status: 'ignored' };
    }

    if (this.matchedCards.find((card) => card.id === id)) {
      return { status: 'ignored' };
    }

    if (this.currentCard) {
      if (this.currentCard.id === id) {
        return { status: 'ignored' };
      }

      const pair = this.cards.find((card) => card.id === id);
      if (!pair) {
        return { status: 'ignored' };
      }

      this.moves++;

      if (this.currentCard.value === pair.value) {
        this.matchedCards.push(this.currentCard, pair);
        this.currentCard = null;
        const isWin = this.matchedCards.length === this.cards.length;
        this.state = isWin ? 'won' : 'idle';
        return { status: 'pair', isWin };
      }

      this.currentCard = null;
      this.state = 'resolving';
      return { status: 'fail' };
    }

    this.currentCard = this.cards.find((card) => card.id === id);
    this.state = 'oneOpen';
    return { status: 'flip' };
  }

  resolveFail() {
    if (this.state === 'resolving') {
      this.state = 'idle';
    }
  }
}
