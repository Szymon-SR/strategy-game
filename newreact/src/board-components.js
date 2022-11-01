import React, { useContext } from "react"
import { DndProvider, useDrag } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { SelectedDispatch } from "./App.js"
import { playerColors, dragTypes } from "./constants.js"

// const NUMBER_OF_PLAYERS = 2

// All components in the Center panel

function CenterPanel(props) {
  return (
    <div
      className="center-panel"
    >
      <TopBar
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

function TopBar(props) {
  // menu which displays basic data about player's country
  return (
    <table>
      <tbody>
        <tr>
          <td>
            Day
          </td>
          <td>
            {props.day}
          </td>
          <td>
            Money
          </td>
          <td>
            {props.balance}
          </td>
          <td>
            Income
          </td>
          <td>
            {props.income}
          </td>
        </tr>
      </tbody>
    </table>
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
    <Tile
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

function Tile(props) {
  const ownerColor = playerColors[props.ownerId];
  const soldierOwnerColor = playerColors[props.soldierOwnerId];

  // selecting / unselecting
  const dispatch = useContext(SelectedDispatch);

  function handleHexClick() {
    dispatch({ type: "click", clickedId: props.hexId });
  }

  return (

    <div
      onClick={handleHexClick} // this function can be passed if we want to change parent
    >
      <Hex
        isHome={props.isHome}
        ownerColor={ownerColor}
        soldierOwnerColor={soldierOwnerColor}
        soldierCount={props.soldierCount}
      />
    </div>
  );
}

function Hex(props) {
  const [{isDragging}, drag] = useDrag(() => ({
    type: dragTypes.HEX,
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  return (

    <div
      // ref={drag}
      className={props.isHome ? "hex " + props.ownerColor + " home" : "hex " + props.ownerColor}
    >
      <SoldierBadge
        color={props.soldierOwnerColor}
        soldierCount={props.soldierCount}
      />
    </div>
  );
}

function SoldierBadge(props) {
  if (props.soldierCount === 0) {
    return (
      <p></p>
    );
  }
  else {
    return (
      <p className={"badge-" + props.color}>{props.soldierCount}</p>
    );
  }
}

export { CenterPanel };