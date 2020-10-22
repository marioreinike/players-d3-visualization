const clubSelect = document.getElementById('club-select');
const leagueSelect = document.getElementById('league-select');
const minRatingRange = document.getElementById('min-rating-range');
const maxRatingRange = document.getElementById('max-rating-range');
const minRatingValue = document.getElementById('min-rating-value');
const maxRatingValue = document.getElementById('max-rating-value');

async function setSelectOptions(players) {
  [clubSelect, leagueSelect].forEach(elem => {
    const opt = document.createElement('option');
    opt.appendChild(document.createTextNode('Todos'));
    opt.value = '';
    elem.appendChild(opt);
  });
  players
    .map(p => p.CLUB)
    .filter((v, i, a) => a.indexOf(v) === i)
    .forEach(club => {
      const opt = document.createElement('option');
      opt.appendChild(document.createTextNode(club));
      opt.value = club;
      clubSelect.appendChild(opt);
    });
  players
    .map(p => p.LEAGUE)
    .filter((v, i, a) => a.indexOf(v) === i)
    .forEach(club => {
      const opt = document.createElement('option');
      opt.appendChild(document.createTextNode(club));
      opt.value = club;
      leagueSelect.appendChild(opt);
    });
  minRatingValue.innerText = minRatingRange.value.toString();
  maxRatingValue.innerText = maxRatingRange.value.toString();
}

async function filterPlayers(players) {
  console.log('filtering');
  minRatingValue.innerText = minRatingRange.value.toString();
  maxRatingValue.innerText = maxRatingRange.value.toString();
  return players;
}

export { setSelectOptions, filterPlayers };
