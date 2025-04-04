let pointsPerMatch = 24;
let playerScores = {};
let rounds = [];
let actRound = 1;

//window onload
window.onload = () => {
    const tournamentName = localStorage.getItem('tournamentName') || 'Tournament';
    pointsPerMatch = parseInt(localStorage.getItem('pointsPerMatch')) || 24;
    const players = JSON.parse(localStorage.getItem('players')) || [];

    const header = document.getElementById('main-header');
    header.textContent = tournamentName;

    // initialize score table
    players.forEach(name => {
        if (!(name in playerScores)) {
            playerScores[name] = 0;
        }
    });

    const { matches, sitting } = generateMatches(players);
    renderMatches(matches, sitting, pointsPerMatch);

    // render leaderboard initially (will be empty at first)
    renderLeaderboard();
};

  


//generate matches function
function generateMatches(players) {
    const shuffled = [...players].sort(() => Math.random() - 0.5);
    const matches = [];
  
    while (shuffled.length >= 4) {
      const match = shuffled.splice(0, 4); 
      matches.push(match);
    }
  
    const sitting = [...shuffled];
    return { matches, sitting };
  }



// matches and sittings function
function renderMatches(matches, sitting,pointsPerMatch) {
    const matchesContainer = document.getElementById('matches-container');
    const sittingList = document.getElementById('sitting-list');
  
    matchesContainer.innerHTML = '';  // clear html
    sittingList.innerHTML = '';
  
    const roundHeading = document.createElement('h2');
    roundHeading.innerText = `Round ${actRound}`;
    actRound++;
    roundHeading.className = 'round-heading';
    matchesContainer.appendChild(roundHeading);

    matches.forEach(match => {
        const [p1, p2, p3, p4] = match;
  
        const matchDiv = document.createElement('div');
        matchDiv.className = 'match';
  
        //team1
        const team1 = document.createElement('div');
        team1.className = 'match-players-container';
        team1.innerHTML = `<div class="match-player">${p1}</div><div class="match-player">${p2}</div>`;
  


        // score
        const score = document.createElement('div');
        score.className = 'score-container';
        // score dropdowns
        const selectLeft = document.createElement('select');
        const selectRight = document.createElement('select');
        
        // fill dropdown to pointPerMatch
        for (let i = 0; i <= pointsPerMatch; i++) {
            const optionLeft = new Option(i, i);
            const optionRight = new Option(i, i);
            selectLeft.appendChild(optionLeft);
            selectRight.appendChild(optionRight);
        }


        // fill automaticly when selected one
        selectLeft.addEventListener('change', () => {
            const leftVal = parseInt(selectLeft.value);
            selectRight.value = pointsPerMatch - leftVal;
        });

        selectRight.addEventListener('change', () => {
            const rightVal = parseInt(selectRight.value);
            selectLeft.value = pointsPerMatch - rightVal;
        });

        score.appendChild(selectLeft);
        score.appendChild(document.createTextNode(' vs '));
        score.appendChild(selectRight);




        // team2
        const team2 = document.createElement('div');
        team2.className = 'match-players-container';
        team2.innerHTML = `<div class="match-player">${p3}</div><div class="match-player">${p4}</div>`;
  
        matchDiv.appendChild(team1);
        matchDiv.appendChild(score);
        matchDiv.appendChild(team2);
  
        matchesContainer.appendChild(matchDiv);
    });

    sitting.forEach(player => {
        const li = document.createElement('li');
        li.textContent = player;
        sittingList.appendChild(li);
      });
}



// complete round button
document.getElementById('complete-round-btn').addEventListener('click', () => {
    const matchDivs = document.querySelectorAll('.match');
    const roundData = [];


    // verify dropdowns
    for (let matchDiv of matchDivs) {
        const selects = matchDiv.querySelectorAll('select');
        if (selects[0].value === '0' && selects[1].value === '0') {
            alert("Please select scores for all matches before completing the round.");
            return;
        }
    }


    // saving points
    matchDivs.forEach(matchDiv => {
        const players = matchDiv.querySelectorAll('.match-player');
        const selects = matchDiv.querySelectorAll('select');

        const team1 = [players[0].textContent, players[1].textContent];
        const team2 = [players[2].textContent, players[3].textContent];

        const score1 = parseInt(selects[0].value);
        const score2 = parseInt(selects[1].value);

        // update player scores
        team1.forEach(p => playerScores[p] += score1);
        team2.forEach(p => playerScores[p] += score2);

        roundData.push({ team1, team2, score1, score2 });
    });

    rounds.push(roundData);
    renderLeaderboard();
    alert("Round saved !");

    // disable button
    document.getElementById('complete-round-btn').disabled = true;
    document.getElementById('new-round-btn').disabled = false;
});




//new round button
document.getElementById('new-round-btn').addEventListener('click', () => {
    const allPlayers = Object.keys(playerScores);
    const { matches, sitting } = generateMatches(allPlayers);
    renderMatches(matches, sitting, pointsPerMatch);

    //enable complete round button
    document.getElementById('complete-round-btn').disabled = false;
    document.getElementById('new-round-btn').disabled = true;
});



// render Leaderboard
function renderLeaderboard() {
    const container = document.getElementById('leaderboard-container');
    const header = document.getElementById('leaderboard-header');
    const body = document.getElementById('leaderboard-body');
  
    container.style.display = 'block'; // show table
  
    header.innerHTML = '';
    body.innerHTML = '';
  
    // points per round
    const perRoundPoints = {};
    Object.keys(playerScores).forEach(name => perRoundPoints[name] = []);
  
    rounds.forEach(round => {
      const roundPoints = {};
      Object.keys(playerScores).forEach(name => roundPoints[name] = 0);
  
      round.forEach(match => {
        match.team1.forEach(p => roundPoints[p] += match.score1);
        match.team2.forEach(p => roundPoints[p] += match.score2);
      });
  
      for (const [player, points] of Object.entries(roundPoints)) {
        perRoundPoints[player].push(points);
      }
    });
  
    // sort players by points
    const playersSorted = Object.keys(playerScores).sort((a, b) =>
      playerScores[b] - playerScores[a]
    );
  
    // header
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `<th>Ranking</th><th>Player</th>` +
      rounds.map((_, i) => `<th>R${i + 1}</th>`).join('') +
      `<th>Total</th>`;
    header.appendChild(headerRow);
  
    // rows
    playersSorted.forEach((player, index) => {
      const row = document.createElement('tr');
      const total = playerScores[player];
      const roundCells = perRoundPoints[player].map(p => `<td>${p}</td>`).join('');
  
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${player}</td>
        ${roundCells}
        <td>${total}</td>
      `;
      body.appendChild(row);
    });
}



//finish button
document.getElementById('finish-btn').addEventListener('click', () => {
    // save rounds data
    localStorage.setItem('rounds', JSON.stringify(rounds));
    localStorage.setItem('playerScores', JSON.stringify(playerScores));

    // switch to results page
    window.location.href = 'results.html'; 
});


  

