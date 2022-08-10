import { createBoard, visualizeAttack } from "./game.js";
console.log("Hejo")

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
        document.querySelector(".room").innerHTML = "http://0.0.0.0:8000/?join=" + event.join;
        break;
      case "game_state":
        updateGame(event)
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

function updateGame(gameData) {
  document.getElementById("value days").innerHTML = gameData.day;
}

function sendAttacks(board, websocket) {
  // When clicking a hex, send an event
  board.addEventListener("click", ({ target }) => {
    const id = target.dataset.hexId;
    // Ignore clicks outside a column.
    if (id === undefined) {
      return;
    }
    console.info("Hejo2")
    const event = {
      type: "attack",
      id: parseInt(id, 10),
    };
    websocket.send(JSON.stringify(event));
  });
}

window.addEventListener("DOMContentLoaded", () => {
  // Initialize the UI.
  const board = document.querySelector(".board");
  createBoard(board);
  // Open the WebSocket connection and register event handlers.
  const websocket = new WebSocket("ws://localhost:8001/");
  initGame(websocket);
  receiveGameEvents(board, websocket);
  sendAttacks(board, websocket);
});





