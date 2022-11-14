import React, { useContext } from "react"
import { SelectedDispatch } from "./game-main.js"


//Right
function FocusMenu(props) {
  let child;

  if (props.anySelected) {
    child = <HexAction
      selectedId={props.selectedId}
      selectedIncome={props.selectedIncome}
      selectedDefensiveness={props.selectedDefensiveness}
      handlePlayerActions={props.handlePlayerActions}
    />
  }
  else {
    child = <BaseAction />
  }

  return (
    <div
      className="focus-menu"
    >
      {child}
    </div>
  )
}

function BaseAction(props) {
  return (
    <div>
      Click any tile to see details
    </div>
  )
}

function HexAction(props) {
  return (
    <div>
      <TileInfo
        selectedId={props.selectedId}
        selectedIncome={props.selectedIncome}
        selectedDefensiveness={props.selectedDefensiveness}
      />
      <Actions
        handlePlayerActions={props.handlePlayerActions}
      />
      <Unselect
        selectedId={props.selectedId}
      />
    </div>
  )
}

function TileInfo(props) {
  return (
    <table className="tile-info">
      <tbody>
        <tr>
          <td>Selected Tile</td>
          <td>{props.selectedId}</td>
        </tr>
        <tr>
          <td>Local income</td>
          <td>{props.selectedIncome}</td>
        </tr>
        <tr>
          <td>Local defense</td>
          <td>{props.selectedDefensiveness}</td>
        </tr>
      </tbody>
    </table>
  )
}

function Actions(props) {
  return (
    <div className="action-container">
      <ActionCard
        type="Claim"
        handlePlayerActions={() => props.handlePlayerActions({ type: "claim" })}
      />
      <ActionCard
        type="Recruit"
        handlePlayerActions={() => props.handlePlayerActions({ type: "recruit" })}
      />
      <ActionCard
        type="Tower"
        handlePlayerActions={() => props.handlePlayerActions({ type: "build", building: "tower" })}
      />
      <ActionCard
        type="Windmill"
        handlePlayerActions={() => props.handlePlayerActions({ type: "build", building: "windmill" })}
      />
    </div>
  )
}

function ActionCard(props) {
  let imageSrc = "./images/" + props.type + ".png"

  const descriptions = {
    "Tower": "Increases defense in tile",
    "Windmill": "Increases income in tile by 50%",
    "Claim": "Add this tile to your kingdom",
    "Recruit": "Train one new soldier here",
  };
  const costs = {
    "Tower": "Build for 150",
    "Windmill": "Build for 200",
    "Claim": "Claim for 250",
    "Recruit": "Recruit for 50",
  };

  return (
    <div className="action-card">
      <img alt={props.type} className="action-img" src={require(`${imageSrc}`)} height={"100px"} />
      <div className="action-texts">
        <h4 className="action-title">{props.type}</h4>
        <p className="action-description">{descriptions[props.type]}</p>
      </div>
      <button className="action-button" onClick={props.handlePlayerActions}>{costs[props.type]}</button>
    </div>
  )
}

function Unselect(props) {
  // unselecting
  const dispatch = useContext(SelectedDispatch);

  function handleClick() {
    dispatch({ type: "unselect", clickedId: props.selectedId });
  }

  return (
    <button className="unselect" onClick={handleClick}>
      Close
    </button>
  )
}

export { FocusMenu };