const radarColors = ['blue', 'red', 'green'];
const cardColors = ['#ffd700', '#c0c0c0', '#cd7f32']

function getRadarColor(position) {
  if (['CB', 'RB', 'LB', 'LWB', 'RWB'].includes(position)) {
    return radarColors[0];
  } else if (['CM', 'CAM', 'CDM', 'LM', 'RM'].includes(position)) {
    return radarColors[1];
  }
  return radarColors[2];
}

function getCardColor(rating) {
  if (rating >= 75) return cardColors[0];
  if (rating >= 65) return cardColors[1];
  return cardColors[2];
}

function renderCard(player, i) {
  const card = document.createElement('div');
  card.className = 'card';
  card.style.backgroundColor = getCardColor(player.RATING);

  const data = document.createElement('div');
  data.className = 'data';

  const name = document.createElement('p');
  name.className = 'name';
  name.innerText =  `${player.RATING} ${player.NAME}`;

  const club = document.createElement('p');
  club.className = 'club';
  club.innerText = `${player.CLUB}`;

  const league = document.createElement('p');
  league.className = 'league';
  league.innerText = `${player.LEAGUE}`;

  const circle = document.createElement('div');
  circle.className = 'circle';
  circle.id = `circle-${i}`;

  data.appendChild(name);
  data.appendChild(club);
  data.appendChild(league);
  card.appendChild(data);
  card.appendChild(circle);

  return card;
}

export { renderCard, cardColors, getRadarColor };