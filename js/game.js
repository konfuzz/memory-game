import { cards } from './data.js';

export default class Game {
  constructor() {
    this.cards = [];
    this.matchedCards = 0;
    this.currentCard = null;
  }

  start() {
    this.cards = [...cards, ...cards];
    this.cards.sort(() => Math.random() - 0.5);
    this.matchedCards = 0;
    this.currentCard = null;
  }
}
