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
  // construct card (and drop previus one)
  const avgCard = await renderCardData(average, 'avg');
  const previusCard = document.getElementById('average');
  if (previusCard) document.removeChild(previusCard);
  avgCard.id = 'average';
  document.getElementById('navbar').appendChild(avgCard);
  // render svg
  await renderSvg(average, 'avg');
}

async function setHover() {
  let selection;
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

d3.selectAll('.filter').on('change', (e) => {
  console.log(e.target.value);
  const filtered = filterPlayers(players);
});


