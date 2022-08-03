function createBoard(board) {
  // Inject stylesheet
  const linkElement = document.createElement("link");
  linkElement.href = import.meta.url.replace(".js", ".css");
  linkElement.rel = "stylesheet";
  document.head.append(linkElement);
  
  // Generate hex map.

  const columnElement = document.createElement("div");
  columnElement.className = "column";
  board.append(columnElement);
  //columnElement.dataset.column = column;
  for (let hexNumber = 0; hexNumber < 102; hexNumber++) {
    const cellElement = document.createElement("div");
    cellElement.className = "hex";
    cellElement.dataset.hexId = hexNumber;
    columnElement.append(cellElement);
  }
}



export { createBoard };
