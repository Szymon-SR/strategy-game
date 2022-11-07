import React, { useState } from "react"
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { Tile } from './tiles.js'

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
      <DndProvider backend={HTML5Backend}>
        <Board
          numberOfTiles={props.numberOfTiles}
          home_tiles={props.home_tiles}
          owned_tiles={props.owned_tiles}
          tileCoordinates={props.tileCoordinates}
          soldierPositions={props.soldierPositions}
          playerIndex={props.playerIndex}
        />
      </DndProvider>
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
  const [popupVisible, setPopupVisible] = useState(false);
  const [attackSource, setAttackSource] = useState(0);
  const [attackTarget, setAttackTarget] = useState(0);
  const [availableSoldiers, setAvailableSoldiers] = useState(0);

  function popupOff() {
    setPopupVisible(false);
  }

  function attackPopupOn(sourceId, targetId, soldierCount) {
    setAttackSource(sourceId);
    setAttackTarget(targetId);
    setPopupVisible(true);
    setAvailableSoldiers(soldierCount);
  }

  return (
    <div
      className="board"
    >
      {popupVisible ? <AttackPopup popupOff={popupOff} sourceId={attackSource} targetId={attackTarget} availableSoldiers={availableSoldiers} /> : null}
      <Map
        numberOfTiles={props.numberOfTiles}
        home_tiles={props.home_tiles}
        owned_tiles={props.owned_tiles}
        tileCoordinates={props.tileCoordinates}
        soldierPositions={props.soldierPositions}
        playerIndex={props.playerIndex}
        attackPopupOn={attackPopupOn}
      />
    </div>
  )
}

function AttackPopup(props) {
  return (
    <div className="modal">
      <div className="modal_content">
        <span className="close" onClick={props.popupOff}>
          &times;
        </span>
        <p>{props.sourceId} {props.targetId}</p>
      </div>
    </div>
  );
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
      coords={props.tileCoordinates[id]}
      soldierOwnerId={soldierOwners[id]}
      soldierCount={soldierCounts[id]}
      playerIndex={props.playerIndex}
      attackPopupOn={props.attackPopupOn}
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



export { CenterPanel };