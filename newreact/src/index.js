import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

class Game extends React.Component {
  constructor(props) {
    super(props);
    // TODO change to real
    this.gameState = {
      day: 69,
      home_tiles: [11, 21], // home tiles of players, by player index
      money_balances: [420, 240],
      incomes: [0.5, 1.5],
      owned_tiles: [[11, 12, 13], [21, 22, 23]],
  }
  playerIndex = 

  }

  render() {


    return (
      <div className="game">
        <BaseMenu  />
        <CenterPanel />
        <FocusMenu />
      </div>
    );
  }
}

function BaseMenu(props) {
  return (
    <div
      className="basemenu"
    >
      <PlayerInfo />
      <RoomInfo />
      <ScoreInfo />
    </div>
  )
}


function Hex(props) {
  const [hexId, setHexId] = useState(props.hexNumber);
  const [ownerId, setOwnerID] = useState(0);

  return (
    <div
      className={`hex neutral`}
      onClick={props.onClick} // this function can be passed if we want to change parent
    >
    </div>
  );
}

//   for (let hexNumber = 0; hexNumber < 64; hexNumber++) {
//     const hexElement = document.createElement("div");
//     hexElement.className = "hex neutral";
//     hexElement.dataset.hexId = hexNumber;
//     mapElement.append(hexElement);
//   }


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

// Inject stylesheet
const linkElement = document.createElement("link");
linkElement.href = import.meta.url.replace(".js", ".css");
linkElement.rel = "stylesheet";
document.head.append(linkElement);