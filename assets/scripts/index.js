const addPlayerBtn = document.getElementById('add-player-btn');
const playerInput = document.getElementById('player-name');
const playerList=document.getElementById('player-list');
const createBtn = document.getElementById('create-btn');
const tournamentNameInput = document.getElementById('tournament-name');
const pointNumberInput = document.getElementById('point-number');
const courtNumberInput = document.getElementById('court-number');

const players = [];



//add-player button
addPlayerBtn.addEventListener('click',() =>{
    //add player to players
    const name = playerInput.value.trim();
    players.push(name);

    //add list item to list
    const li = document.createElement('li');
    li.textContent = name;
    playerList.appendChild(li);

    //reset input text
    playerInput.value = '';
    playerInput.focus();

});




//create button
createBtn.addEventListener('click',()=>{
    const tournamentName = tournamentNameInput.value.trim();
    const pointsPerMatch = pointNumberInput.value.trim();
    const courtNumber = courtNumberInput.value.trim();

    //verifications
    if(!tournamentName || !pointsPerMatch || !courtNumber ||players.length < 4){
        alert("Please fill out all forms and add at least 4 players!");
        return;
    }

    localStorage.setItem('tournamentName', tournamentName);
    localStorage.setItem('pointsPerMatch', pointsPerMatch);
    localStorage.setItem('courtNumber', courtNumber);
    localStorage.setItem('players', JSON.stringify(players));

    //switch to game window
    window.location.href = 'play.html';


});

