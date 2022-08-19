import { createBoard, visualizeAttack, paintHexByPlayerId, addHomeIcon } from "./game.js";
console.log("Hejo")

var playerIndex = -1

function initGame(websocket) {
  websocket.addEventListener("open", () => {
    // Send an "init" event according to who is connecting.
    const params = new URLSearchParams(window.location.search);
    let event = { type: "init" };
    if (params.has("join")) {
      // Second player joins an existing game.
      event.join = params.get("join");
    } 
    else {
      // First player starts a new game.
    }
    websocket.send(JSON.stringify(event));
  });
}

function showMessage(message) {
  window.setTimeout(() => window.alert(message), 50);
}

function receiveGameEvents(board, websocket) {
  // var t = setInterval(function () {
  //   // you can change `random` to any variable you want to be displayed
  //   var random = Math.random();
  //   document.getElementById("value days").innerHTML = random;
  // }, 500);
  websocket.addEventListener("message", ({ data }) => {
    

    // event will look like: event = {"type": "attack", "player": "red", "hexId": 3, "success": 1}
    const event = JSON.parse(data);
    switch (event.type) {
      case "init":
        // Create links for inviting the second player
        const inviteLink = "http://0.0.0.0:8000/?join=" + event.join
        document.querySelector(".room").innerHTML = '<a href="' + inviteLink + '">' + inviteLink + '</a>';

        
        // Getting init message means that this is the first player
        playerIndex = 0
        break;
      case "game_state":
        updateGame(board, event)
        break;
      case "index_assignment":
        playerIndex = event.index
        break;
      case "attack":
        visualizeAttack(board, event.player, event.hexId, event.success)
        break;
      // case "win":
      //   showMessage(`Player ${event.player} wins!`);
      //   // No further messages are expected; close the WebSocket connection.
      //   websocket.close(1000);
      //   break;
      case "error":
        showMessage(event.message);
        break;
      default:
        throw new Error(`Unsupported event type: ${event.type}.`);
    }
  });
}

function updateGame(board, gameData) {
  document.getElementById("value days").innerHTML = gameData.day;
  
  // home tiles
  if (gameData.day == 1) {
    console.log("wiad")
    for (const tile of gameData.home_tiles) {
      addHomeIcon(board, tile)
    }
  }

  document.getElementById("value money").innerHTML = gameData.money_balances[playerIndex]
  document.getElementById("value income").innerHTML = gameData.incomes[playerIndex]
  
  // paint owned tiles
  for (const [index, tileList] of gameData.owned_tiles.entries()) {
    for (const tile of tileList) {
      paintHexByPlayerId(board, index, tile)
    }
  }
}



function waitForHexClicks(board, websocket) {

  // When clicking a hex, send an event
  board.addEventListener("click", ({ target }) => {
    const id = target.dataset.hexId;

    if (id === undefined) {
      return;
    }
    var previoslySelected = document.querySelector(".hex.clicked");
    if (previoslySelected && previoslySelected.dataset.hexId != target.dataset.hexId) {
      // Only one hex can be selected at once
      previoslySelected.classList.remove("clicked");
    }

    target.classList.toggle("clicked");
    
    // if any hex is selected, show side action panel corresponding to this hex
    var nowSelected = document.querySelector(".hex.clicked");
    if (nowSelected) {
      document.getElementById("general-action").classList.add("hidden");
      document.getElementById("hex-action").classList.remove("hidden");
    }
    else {
      document.getElementById("general-action").classList.remove("hidden");
      document.getElementById("hex-action").classList.add("hidden");
    }
  });
}




function sendAttack(id, websocket) {
  const event = {
    type: "attack",
    tileId: parseInt(id, 10),
    playerId: parseInt(playerIndex, 10),
  };
  websocket.send(JSON.stringify(event));
}

window.addEventListener("DOMContentLoaded", () => {
  // Initialize the UI.
  const body = document.querySelector("body");
  const board = document.querySelector(".board");
  createBoard(board);
  // Open the WebSocket connection and register event handlers.
  const websocket = new WebSocket("ws://localhost:8001/");
  initGame(websocket);
  receiveGameEvents(board, websocket);
  waitForHexClicks(board, websocket);


});





