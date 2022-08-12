const playerColors = ["red", "blue"]

function createBoard(board) {
  // Inject stylesheet
  const linkElement = document.createElement("link");
  linkElement.href = import.meta.url.replace(".js", ".css");
  linkElement.rel = "stylesheet";
  document.head.append(linkElement);
  
  // Generate hex map.

  const mapElement = document.createElement("div");
  mapElement.className = "map";
  board.append(mapElement);

  for (let hexNumber = 0; hexNumber < 64; hexNumber++) {
    const hexElement = document.createElement("div");
    hexElement.className = "hex neutral";
    hexElement.dataset.hexId = hexNumber;
    mapElement.append(hexElement);
  }
}

function getHexById(board, hexId) {
  const element = board.querySelectorAll(".hex")[hexId];

  if (element === undefined) {
    throw new Error("Specified hex is not on the map");
  }

  return element;
}

function paintHexByPlayerId(board, playerId, hexId) {
  // change css class so it switches colors
  const hexElement = getHexById(board, hexId);
  //hexElement.className = "hex " + playerColors[playerId];
  hexElement.classList.remove("neutral")
  hexElement.classList.add(playerColors[playerId])
}

function addHomeIcon(board, hexId) {
  // var icon = document.createElement("img")
  // icon.setAttribute("src", "images/castle.png")
  // icon.setAttribute("height", "20")
  // icon.setAttribute("width", "20")
  
  const hexElement = getHexById(board, hexId);
  // hexElement.appendChild(icon)
  hexElement.classList.add("home");
}

function visualizeAttack(board, player, hexId, success) {
  if (success == 1) {
    // tile was conquered, switches colors
    paintHexByPlayerId(board, player, hexId)
  }
}

export { createBoard, visualizeAttack, paintHexByPlayerId, addHomeIcon };
