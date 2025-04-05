const addPlayerBtn = document.getElementById('add-player-btn');
const playerInput = document.getElementById('player-name');
const playerList=document.getElementById('player-list');
const createBtn = document.getElementById('create-btn');
const tournamentNameInput = document.getElementById('tournament-name');
const pointNumberInput = document.getElementById('point-number');


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


    //check if every form is filled
    if(!tournamentName || !pointsPerMatch ||players.length < 4){
        alert("Please fill out all forms and add at least 4 players!");
        return;
    }

    //check if pointsPerMatch is a number
    if(isNaN(Number(pointsPerMatch))){
        alert("The 'Points per Match' field must contain a number");
        return;
    }


    localStorage.setItem('tournamentName', tournamentName);
    localStorage.setItem('pointsPerMatch', pointsPerMatch);
    localStorage.setItem('players', JSON.stringify(players));

    //switch to game window
    window.location.href = 'play.html';


});

