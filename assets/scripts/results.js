window.onload = () => {
    const header = document.getElementById('leaderboard-header');
    const body = document.getElementById('leaderboard-body');
    const winnerHeading = document.getElementById('winner');
  
    const rounds = JSON.parse(localStorage.getItem('rounds')) || [];
    const playerScores = JSON.parse(localStorage.getItem('playerScores')) || {};
  
    // selecting winner
    const playersSorted = Object.keys(playerScores).sort((a, b) => playerScores[b] - playerScores[a]);
    const winner = playersSorted[0];
    winnerHeading.textContent = `Winner: ${winner} 🥇`;
  
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
  
    // header
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `<th>Rank</th><th>Player</th>` +
      rounds.map((_, i) => `<th>R${i + 1}</th>`).join('') +
      `<th>Total points</th>`;
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
};



//clear data every new tournament
document.getElementById('new-tournament-btn').addEventListener('click', () => {
  localStorage.clear(); 
});
