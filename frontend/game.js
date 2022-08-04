const playerColors = ["red", "black"]

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

function visualizeAttack(board, player, hexId, success) {
  // get the hex element on the map
  const hexElement = board.querySelectorAll(".hex")[hexId];
  if (hexElement === undefined) {
    throw new Error("Specified hex is not on the map");
  }
  if (success == 1) {
    // tile was conquered, change css class so it switches colors
    hexElement.classList.replace("neutral", playerColors[player])
  }

}

export { createBoard, visualizeAttack };
