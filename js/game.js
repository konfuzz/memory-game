import { cards } from './data.js';

export default class Game {
  constructor() {
    this.cards = [];
    this.matchedCards = [];
    this.currentCard = null;
  }

  start() {
    const initCards = [...cards, ...cards];
    this.cards = initCards.sort(() => Math.random() - 0.5).map((card) => this.createCard(card));
    this.matchedCards = [];
    this.currentCard = null;
  }

  createCard(card) {
    return {
      id: crypto.randomUUID(),
      value: card,
    }
  }

  flipCard(id) {
    if (this.currentCard) {
      if (this.currentCard.id === id) {
        return;
      }

      if (this.matchedCards.find((card) => card.id === id)) {
        return;
      }

      const pair = this.cards.find((card) => card.id === id);

      if (this.currentCard.value === pair.value) {
        this.matchedCards.push(this.currentCard, pair);
        this.currentCard = null;
        return { status: 'pair' }
      }

      this.currentCard = null;
      return { status: 'fail' }
    }
    this.currentCard = this.cards.find((card) => card.id === id);
    return { status: 'flip' };
  }
}
