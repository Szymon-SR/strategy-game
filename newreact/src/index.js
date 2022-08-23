import React, { useContext, useEffect, useReducer, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { CenterPanel } from "./board-components.js";
import { FocusMenu } from "./focus-components.js";

import 'bootstrap/dist/css/bootstrap.min.css';


function initGame(websocket) {
  websocket.addEventListener("open", () => {

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
    websocket.send(JSON.stringify(event));
  });
}


// Components 
const SelectedDispatch = React.createContext(null);
const initialD = { anySelected: false, lastSelected: 0 };

function Game(props) {

  const [gameState, setGameState] = useState({
    playerIndex: 0,
    day: 0,
    home_tiles: [], // home tiles of players, by player index
    money_balances: [0, 0],
    incomes: [0, 0],
    owned_tiles: [[], []],
    tile_incomes: [],
  });

  const [playerIndex, setPlayerIndex] = useState(0);
  const [inviteLink, setInviteLink] = useState("");

  // reducer for logic of selecting / unselecting tiles on map
  const selectedReducer = (state, action) => {
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


  const [selected, dispatch] = useReducer(selectedReducer, initialD);

  const numberOfTiles = 64;  // how many tiles are on the map

  const receiveGameEvents = (websocket) => {
    websocket.addEventListener("message", ({ data }) => {
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
    const websocket = new WebSocket("ws://localhost:8001/");
    initGame(websocket);
    receiveGameEvents(websocket);
  }, [])


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
      <PlayerInfo playerIndex={props.playerIndex} />
      <RoomInfo inviteLink={props.inviteLink} />
      <ScoreInfo />
    </div>
  )
}

function PlayerInfo(props) {
  return (
    <div>
      Your id: {props.playerIndex}
    </div>
  )
}

function RoomInfo(props) {
  return (
    <div>
      {props.inviteLink}
    </div>
  )
}

function ScoreInfo(props) {
  return (
    <div>
      Not yet
    </div>
  )
}






const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);


export { SelectedDispatch };