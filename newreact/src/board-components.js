import React, { useContext } from "react"
import { playerColors, SelectedDispatch } from "./App.js"

import Badge from 'react-bootstrap/Badge';

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
        soldierPositions={props.soldierPositions}
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
        soldierPositions={props.soldierPositions}
      />
    </div>
  )
}

function Map(props) {
  const hexIds = [...Array(props.numberOfTiles).keys()];

  const hexOwners = new Array(props.numberOfTiles).fill(0);    // hexId => ownerId
  for (const [index, playerOwned] of props.owned_tiles.entries()) {
    for (const hexId of playerOwned) {
      hexOwners[hexId] = index + 1
    }
  }

  // hexId => player Id of player who has soldiers on this tile
  const soldierOwners = new Array(props.numberOfTiles).fill(0);
  // number of soldiers on given tile
  const soldierCounts = new Array(props.numberOfTiles).fill(0);

  for (const [index, positionsObj] of props.soldierPositions.entries()) {
    for (const hexId in positionsObj) {
      soldierOwners[hexId] = index + 1;
      soldierCounts[hexId] = positionsObj[hexId];
    }
  }

  // console.log(soldierOwners);
  // console.log(soldierCounts);

  // create all hex tiles
  const hexItems = hexIds.map((id) =>
    <Hex
      key={id.toString()}
      hexId={id}
      isHome={props.home_tiles.includes(id)} // it is home or it is not
      ownerId={hexOwners[id]}
      soldierOwnerId={soldierOwners[id]}
      soldierCount={soldierCounts[id]}
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
  // let badgeComponent;

  // if (props.soldierCount > 0) {
  //   const bgs = ["success", "danger", "primary"];
  //   badgeComponent = <Badge pill as="p" bg={bgs[props.soldierOwnerId]}> {props.soldierCount} </Badge>
  // }
  // else {
  //   badgeComponent = <Badge pill as="p"> {props.soldierCount} </Badge>
  // }

  const badgeColors = ["success", "danger", "primary"];
  let badgeColor = badgeColors[props.soldierOwnerId]

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
      <Badge pill as="p" bg={badgeColor}> {props.soldierCount} </Badge>
    </div>
  );
}

export { CenterPanel };