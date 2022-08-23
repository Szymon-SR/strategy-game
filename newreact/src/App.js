import React, { useContext, useEffect, useReducer, useRef, useState } from 'react';

import { CenterPanel } from "./board-components.js";
import { FocusMenu } from "./focus-components.js";

import Table from 'react-bootstrap/Table';

// Components 
const SelectedDispatch = React.createContext(null);
const initialD = { anySelected: false, lastSelected: 0 };

function Game(props) {

  const websocket = useRef(null);

  const [playerIndex, setPlayerIndex] = useState(0);
  const [inviteLink, setInviteLink] = useState("");

  const [gameState, setGameState] = useState({
    day: 0,
    home_tiles: [], // home tiles of players, by player index
    money_balances: [0, 0],
    incomes: [0, 0],
    owned_tiles: [[], []],
    tile_incomes: [],
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

    console.log(state)

    switch (action.type) {
      case "click": {
        if (state.lastSelected == action.clickedId) {
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
    
    const validActions = ["claim", "build"]
    console.assert(validActions.includes(action.type))

    if (action.type == "build") {
      message.building = action.building;
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
          const link = "http://0.0.0.0:3000/?join=" + event.join;
          setInviteLink(link);

          // Getting init message means that this is the first player
          // playerIndex = 0
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
      <SelectedDispatch.Provider value={dispatch}>
        <CenterPanel
          day={gameState.day}
          home_tiles={gameState.home_tiles}
          // balance and income are personalized for specific player
          balance={gameState.money_balances[playerIndex]}
          income={gameState.incomes[playerIndex]}
          owned_tiles={gameState.owned_tiles}
          numberOfTiles={numberOfTiles}
        />
        <FocusMenu
          anySelected={selected.anySelected}
          selectedId={selected.lastSelected}
          selectedIncome={gameState.tile_incomes[selected.lastSelected]}
          handlePlayerActions={handlePlayerActions}
        />
      </SelectedDispatch.Provider>
    </div>
  );
}

// ==============================================

function BaseMenu(props) {
  return (
    <div
      className="base-menu"
    >
      <Table>
        <tbody>
          <tr>
            <td>Your id</td>
            <td>{props.playerIndex}</td>
          </tr>
          <tr>
            <td>Invite link</td>
            <td>{props.inviteLink}</td>
          </tr>
          <tr>
            <td>Scores</td>
            <td>TODO</td>
          </tr>
        </tbody>
      </Table>
      {/* <PlayerInfo playerIndex={props.playerIndex} />
        <RoomInfo inviteLink={props.inviteLink} />
        <ScoreInfo /> */}
    </div>
  )
}

// function PlayerInfo(props) {
//   return (
//     <div>
//       Your id: {props.playerIndex}
//     </div>
//   )
// }

// function RoomInfo(props) {
//   return (
//     <div>
//       {props.inviteLink}
//     </div>
//   )
// }

// function ScoreInfo(props) {
//   return (
//     <div>
//       Not yet
//     </div>
//   )
// }


export { SelectedDispatch, Game };  