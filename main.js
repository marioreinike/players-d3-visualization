import { renderCard } from './card.js';

async function renderPlayers() {
  const players = await d3.csv('fifa_20_data.csv');
  players.forEach(renderCard);
}

renderPlayers();
