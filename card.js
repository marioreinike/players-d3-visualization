const radarColors = ['blue', 'red', 'green'];
const cardColors = ['#ffd700', '#c0c0c0', '#cd7f32']
const svgSize = 160;
const svgCenter = svgSize / 2;
const features = [
  'PACE',
  'SHOOTING',
  'PASSING',
  'DRIBBLING',
  'DEFENDING',
  'PHYSICAL'
]

const cards = document.getElementById('cards');

async function renderCard(player, index) {
  const card = await renderCardData(player, index);
  cards.appendChild(card);
  await renderSvg(player, index);
  return card;
}

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

async function renderCardData(player, i) {
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

async function renderSvg(player, index) {
  const scaleValue = d3.scaleLinear()
    .domain([1, 99])
    .range([0, 0.35 * svgSize]);
  
  const convertAngle = (angle, radius) => {
    const x = scaleValue(radius) * Math.cos(angle) + svgCenter;
    const y = scaleValue(radius) * Math.sin(angle) + svgCenter;
    return { x, y };
  };

  // CREAMOS LA SELECCION
  const svg = d3.select(`#circle-${index}`).append('svg');

  // CIRCULO BLANCO
  svg
    .attr('height', svgSize)
    .attr('width', svgSize)
    .append('circle')
    .attr('cx', svgCenter)
    .attr('cy', svgCenter)
    .attr('fill', 'white')
    .attr('r', svgSize / 2);

  // PATH DE BORDES
  const path = d3.path();
  for (let i = 0; i < features.length; i++) {
    const angle = (Math.PI / 2) + (i / features.length * 2 * Math.PI);
    const position = convertAngle(angle, 99);
    if (i == 0)
      path.moveTo(position.x, position.y);
    else
      path.lineTo(position.x, position.y);
  }
  path.closePath();
  svg.append('path')
    .attr('d', path)
    .attr('stroke', 'black')
    .attr('fill', 'none');

  // EJES
  features.map((feature, i) => {
    const angle = (Math.PI / 2) + (i / features.length * 2 * Math.PI);
    const linePosition = convertAngle(angle, 99);
    svg.append('line')
      .attr('x1', svgCenter)
      .attr('y1', svgCenter)
      .attr('x2', linePosition.x)
      .attr('y2', linePosition.y)
      .attr('stroke', 'black');
    const labelPosition = convertAngle(angle, 120);
    svg.append('text')
      .attr('x', labelPosition.x)
      .attr('y', labelPosition.y)
      .text(feature.slice(0, 3))
      .attr('alignment-baseline', 'middle')
      .attr('text-anchor', 'middle');
  });

  // PATH VALORES
  const createChartPath = (player) => {
    const path = d3.path();
    features.map((feature, i) => {
      const angle = (Math.PI / 2) + (i / features.length * 2 * Math.PI);
      const position = convertAngle(angle, player[feature]);
      if (i == 0)
        path.moveTo(position.x, position.y);
      else
        path.lineTo(position.x, position.y);
    });
    path.closePath();
    return path;
  };
  svg
    .append('path')
    .attr('d', createChartPath(player))
    .attr('fill', getRadarColor(player.POSITION))
    .attr('fill-opacity', 0.7);
}

export { renderCard };