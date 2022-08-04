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
    hexElement.className = "hex";
    hexElement.dataset.hexId = hexNumber;
    mapElement.append(hexElement);
  }
}



export { createBoard };
