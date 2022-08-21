import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { CenterPanel } from "./board-components.js";

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
class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playerIndex: 0,
      day: 69,
      home_tiles: [11, 21], // home tiles of players, by player index
      money_balances: [420, 240],
      incomes: [0.5, 1.5],
      owned_tiles: [[11, 12, 13], [21, 22, 23]],
    }

    this.numberOfTiles = 64;  // how many tiles are on the map
  }

  receiveGameEvents(websocket) {
    websocket.addEventListener("message", ({ data }) => {
      const event = JSON.parse(data);
      switch (event.type) {
        case "init":
          // Create links for inviting the second player
          const link = "http://0.0.0.0:3000/?join=" + event.join;
          this.setState({inviteLink: link});
          
          // Getting init message means that this is the first player
          // playerIndex = 0
          break;
        case "game_state":
          this.setState(event);
          break;
        case "index_assignment":
          this.setState({playerIndex: event.index});
          break;
        case "error":
          console.error(event.message);
          break;
        default:
          throw new Error(`Unsupported event type: ${event.type}.`);
      }
    });
  }

  componentDidMount() {
    // runs after output has been rendered
    const websocket = new WebSocket("ws://localhost:8001/");
    initGame(websocket);
    this.receiveGameEvents(websocket);
  }

  render() {
    return (
      <div className="game">
        <BaseMenu
          playerIndex = {this.state.playerIndex}
          inviteLink = {this.state.inviteLink}
          />
        <CenterPanel 
          day = {this.state.day}
          home_tiles = {this.state.home_tiles}
          // balance and income are personalized for specific player
          balance = {this.state.money_balances[this.state.playerIndex]}
          income = {this.state.incomes[this.state.playerIndex]}
          owned_tiles = {this.state.owned_tiles}
          numberOfTiles = {this.numberOfTiles}
        />
        <FocusMenu />
      </div>
    );
  }
}

function BaseMenu(props) {
  return (
    <div
      className="base-menu"
    >
      <PlayerInfo playerIndex = {props.playerIndex} />
      <RoomInfo inviteLink = {props.inviteLink} />
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

//Right
function FocusMenu(props) {
  return (
    <div
      className="focus-menu"
    >
      Not yet
    </div>
  )
}




const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

// Inject stylesheet
const linkElement = document.createElement("link");
linkElement.href = import.meta.url.replace(".js", ".css");
linkElement.rel = "stylesheet";
document.head.append(linkElement);