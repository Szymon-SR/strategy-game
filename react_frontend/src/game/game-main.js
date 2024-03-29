import React, { useEffect, useReducer, useRef, useState } from 'react';

import { BaseMenu } from './info-components.js';
import { CenterPanel } from "./board-components.js";
import { FocusMenu } from "./focus-components.js";
import { TopBar } from './top-bar.js';

// Components 
const SelectedDispatch = React.createContext(null);
const initialD = { anySelected: false, lastSelected: 0 };

function Game(props) {

  const websocket = useRef(null);

  const [playerIndex, setPlayerIndex] = useState(0);
  const [inviteLink, setInviteLink] = useState("");

  const [gameState, setGameState] = useState({
    game_status: 1,
    day: 0,
    player_statuses: [1, 1],
    home_tiles: [], // home tiles of players, by player index
    money_balances: [0, 0],
    incomes: [0, 0],
    owned_tiles: [[], []],
    tile_incomes: [],
    tile_defenses: [],
    tile_coordinates: [],
    soldier_positions: [],
  });

  const initGame = () => {
    websocket.current.addEventListener("open", () => {

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
      websocket.current.send(JSON.stringify(event));
    });
  }

  const selectedReducer = (state, action) => {
    // reducer for handling of selecting / unselecting tiles on map, by clicking on tiles

    switch (action.type) {
      case "click": {
        if (state.lastSelected === action.clickedId) {
          // if the same hex was clicked, it is possible to unselect it
          return { anySelected: !state.anySelected, lastSelected: action.clickedId };
        }

        // a new hex was clicked, always it is selected
        return { anySelected: true, lastSelected: action.clickedId }
      }
      case "unselect": {
        return { anySelected: false, lastSelected: action.clickedId }
      }
      default: {
        console.error("Bad selection type");
      }
    }
  }

  const handlePlayerActions = (action) => {
    // handles actions from the side menu, actions which player does on a specific tile
    let message = { type: action.type, player_id: playerIndex, hex_id: selected.lastSelected };

    const validActions = ["claim", "build", "move", "recruit"]
    console.assert(validActions.includes(action.type))

    if (action.type === "build") {
      message.building = action.building;
    }
    if (action.type === "move") {
      message.source_id = action.source_id;
      message.target_id = action.target_id;
      message.count = action.count;
    }

    websocket.current.send(JSON.stringify(message));
  }


  const [selected, dispatch] = useReducer(selectedReducer, initialD);

  const numberOfTiles = 64;  // how many tiles are on the map

  const receiveGameEvents = () => {
    websocket.current.addEventListener("message", ({ data }) => {
      const event = JSON.parse(data);
      switch (event.type) {
        case "init":
          // Create links for inviting the second player
          const link = "" + event.join;
          setInviteLink(link);
          break;
        case "game_state":
          setGameState(event);
          break;
        case "index_assignment":
          setPlayerIndex(event.index);
          break;
        case "error":
          console.error(event.message);
          break;
        default:
          throw new Error(`Unsupported event type: ${event.type}.`);
      }
    });
  }

  useEffect(() => {
    websocket.current = new WebSocket("ws://localhost:8001/");
    initGame();
    receiveGameEvents();
  }, []);


  return (
    <div className="game">
      <BaseMenu
        playerIndex={playerIndex}
        inviteLink={inviteLink}
      />
      <TopBar
        day={gameState.day}
        // balance and income are personalized for specific player
        balance={gameState.money_balances[playerIndex]}
        income={gameState.incomes[playerIndex]}
      />
      <SelectedDispatch.Provider value={dispatch}>
        <CenterPanel
          gameStatus={gameState.game_status}
          playerStatus={gameState.player_statuses[playerIndex]}
          home_tiles={gameState.home_tiles}
          owned_tiles={gameState.owned_tiles}
          numberOfTiles={numberOfTiles}
          tileCoordinates={gameState.tile_coordinates}
          soldierPositions={gameState.soldier_positions}
          playerIndex={playerIndex}
          handlePlayerActions={handlePlayerActions}
        />
        <FocusMenu
          anySelected={selected.anySelected}
          selectedId={selected.lastSelected}
          selectedIncome={gameState.tile_incomes[selected.lastSelected]}
          selectedDefensiveness={gameState.tile_defenses[selected.lastSelected]}
          handlePlayerActions={handlePlayerActions}
        />
      </SelectedDispatch.Provider>
    </div>
  );
}



export { SelectedDispatch, Game };  