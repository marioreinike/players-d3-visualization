import { renderCardData, renderSvg, features } from './card.js';
import { setSelectOptions, filterPlayers } from './filters.js';

const cards = document.getElementById('cards');
let players;

async function getPlayers() {
  players = await d3.csv('fifa_20_data.csv');
  setSelectOptions(players);
  renderPlayers(players);
}

async function renderPlayers(players) {
  await players.forEach(async (player, index) => {
    const card = await renderCardData(player, index);
    cards.appendChild(card);
    await renderSvg(player, index);
  });
  document.getElementById('qty').innerText = `${players.length}`;
  await renderAverage(players);
  await setHover();
}

async function renderAverage(players) {
  // Drop previus card
  const previusCard = document.getElementById('average');
  if (previusCard) previusCard.remove();
  if (!players.length) return;
  // construct average player
  const average = {
    NAME: 'Promedio',
    CLUB: '',
    LEAGUE: '',
    POSITION: 'AVG',
    RATING: d3.mean(players.map(p => p.RATING)),
  };
  features.forEach(feature => {
    average[feature] = d3.mean(players.map(p => p[feature]));
  });
  // construct card
  const avgCard = await renderCardData(average, 'avg');
  avgCard.id = 'average';
  document.getElementById('navbar').appendChild(avgCard);
  // render svg
  await renderSvg(average, 'avg');
}

async function setHover() {
  d3.selectAll('.card')
    .on('mouseenter', (e, d) => {
      d3.selectAll(`.${e.target.classList[1]}`)
        .style('border', '2px solid red');
    })
    .on('mouseleave', (e, d) => {
      d3.selectAll(`.${e.target.classList[1]}`)
        .style('border', 'none');
    });
}


getPlayers();

d3.select('#min-rating-range').on('input', (e) => {
  document.getElementById('min-rating-value').innerText = e.target.value;
});

d3.select('#max-rating-range').on('input', (e) => {
  document.getElementById('max-rating-value').innerText = e.target.value;
});

d3.select('#clean').on('click', (e) => {
  document.getElementById('club-select').selectedIndex = 0;
  document.getElementById('league-select').selectedIndex = 0;
  document.getElementById('min-rating-range').value = 1;
  document.getElementById('max-rating-range').value = 99;
  document.getElementById('min-rating-value').innerText = 1;
  document.getElementById('max-rating-value').innerText = 99;
  document.getElementById('cards').innerHTML = '';
  renderPlayers(players);
});

d3.selectAll('.filter').on('change', async (e) => {
  const filtered = await filterPlayers(players);
  // Eliminamos lo que hay en #cards
  document.getElementById('cards').innerHTML = '';
  // creamos las nuevas tarjetas
  await renderPlayers(filtered);
});
