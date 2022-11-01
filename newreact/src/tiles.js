import { useDrag, useDrop } from 'react-dnd'
import React from 'react'
import { useContext } from 'react'

import { SelectedDispatch } from "./App.js"
import { playerColors, dragTypes } from "./constants.js"

function canMoveSoldiers() {
    return true;    // TODO
  }

function Tile(props) {
    const [{ isOver, canDrop }, drop] = useDrop(() => ({
      accept: dragTypes.HEX,
      canDrop: () => canMoveSoldiers(props.hexId),
      drop: (item, monitor) => console.log("drop" + item.sourceId + " " + props.hexId),  // TODO
      collect: monitor => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop()
      }),
    }), [props.hexId])
  
    const ownerColor = playerColors[props.ownerId];
    const soldierOwnerColor = playerColors[props.soldierOwnerId];
  
    // selecting / unselecting
    const dispatch = useContext(SelectedDispatch);
  
    function handleHexClick() {
      dispatch({ type: "click", clickedId: props.hexId });
    }
  
    return (
      <div
        ref={drop}
        onClick={handleHexClick} // this function can be passed if we want to change parent
      >
        <Hex
          hexId={props.hexId}
          isHome={props.isHome}
          ownerColor={ownerColor}
          soldierOwnerColor={soldierOwnerColor}
          soldierCount={props.soldierCount}
        />
      </div>
    );
  }
  
  function Hex(props) {
    const sourceId = props.hexId;
  
    const [{ isDragging }, drag] = useDrag(() => ({
      type: dragTypes.HEX,
      item: { sourceId },
      collect: monitor => ({
        isDragging: !!monitor.isDragging(),
      }),
    }), [sourceId])
  
    return (
  
      <div
        ref={drag}
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

export { Tile };