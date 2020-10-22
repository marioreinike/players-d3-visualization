import { renderCard, getRadarColor } from './card.js';

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

async function renderPlayers() {
  const playersData = await d3.csv('fifa_20_data.csv');

  const players = playersData.slice();

  players.forEach((player, i) => {
    cards.appendChild(renderCard(player, i));
  });
  renderSvg(players);
}

async function renderSvg(players) {
  const scaleValue = d3.scaleLinear()
    .domain([1, 99])
    .range([0, 0.35 * svgSize]);
  
  const convertAngle = (angle, radius) => {
    const x = scaleValue(radius) * Math.cos(angle) + svgCenter;
    const y = scaleValue(radius) * Math.sin(angle) + svgCenter;
    return { x, y };
  };

  // CREAMOS LA SELECCION
  const svg = d3.selectAll('.circle').append('svg');
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
  features.map((feature, index) => {
    const angle = (Math.PI / 2) + (index / features.length * 2 * Math.PI);
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
  const createChart = (player) => {
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

  const renderPlayerChart = async (player, i) => {
    const playerSvg = d3.select(`#circle-${i}`).select('svg');
    playerSvg
      .append('path')
      .attr('d', createChart(player))
      .attr('fill', getRadarColor(player.POSITION))
      .attr('fill-opacity', 0.7);
  };

  players.forEach(renderPlayerChart);
}

renderPlayers();
