import React, { useContext } from "react"
import { SelectedDispatch } from "./App.js"

const playerColors = ["neutral", "red", "blue"]
const NUMBER_OF_PLAYERS = 2

// All components in the Center panel

function CenterPanel(props) {
  return (
    <div
      className="center-panel"
    >
      <TopMenu
        day={props.day}
        balance={props.balance}
        income={props.income}
      />
      <Board
        numberOfTiles={props.numberOfTiles}
        home_tiles={props.home_tiles}
        owned_tiles={props.owned_tiles}
      />
    </div>
  )
}

function TopMenu(props) {
  // menu which displays basic data about player's country
  return (
    <div
      className="top-menu"
    >
      <DataCell class="data-name" value="Day" />
      <DataCell class="data-value" value={props.day} />
      <DataCell class="data-name" value="Money" />
      <DataCell class="data-value" value={props.balance} />
      <DataCell class="data-name" value="Income" />
      <DataCell class="data-value" value={props.income} />
    </div>
  )
}

function DataCell(props) {
  // for use in top menu, for each data value
  return (
    <div
      className={props.class}
    >
      {props.value}
    </div>
  )
}

function Board(props) {
  return (
    <div
      className="board"
    >
      <Map
        numberOfTiles={props.numberOfTiles}
        home_tiles={props.home_tiles}
        owned_tiles={props.owned_tiles}
      />
    </div>
  )
}

function Map(props) {
  const hexIds = [...Array(props.numberOfTiles).keys()];

  const hexOwners = new Array(props.numberOfTiles).fill(0);    // hexId => ownerId
  for (const [playerI, playerOwned] of props.owned_tiles.entries()) {
    for (const hexId of playerOwned) {
      hexOwners[hexId] = playerI + 1
    }
  }

  // create all hex tiles
  const hexItems = hexIds.map((id) =>
    <Hex
      key={id.toString()}
      hexId={id}
      isHome={props.home_tiles.includes(id)} // it is home or it is not ;)
      ownerId={hexOwners[id]}
    />
  );

  return (
    <div
      className="map"
    >
      {hexItems}
    </div>
  )
}

function Hex(props) {
  //const [hexId, setHexId] = useState(props.hexNumber);
  //const [ownerId, setOwnerID] = useState(0);

  const ownerColor = playerColors[props.ownerId];

  // selecting / unselecting
  const dispatch = useContext(SelectedDispatch);

  function handleHexClick() {
    dispatch({ type: "click", clickedId: props.hexId });
  }

  return (
    <div
      className={props.isHome ? "hex " + ownerColor + " home" : "hex " + ownerColor}
      onClick={handleHexClick} // this function can be passed if we want to change parent
    >
      {props.hexId}
    </div>
  );
}

//   for (let hexNumber = 0; hexNumber < 64; hexNumber++) {
//     const hexElement = document.createElement("div");
//     hexElement.className = "hex neutral";
//     hexElement.dataset.hexId = hexNumber;
//     mapElement.append(hexElement);
//   }

export { CenterPanel };