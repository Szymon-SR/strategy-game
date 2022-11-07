import { DragPreviewImage, useDrag, useDrop } from 'react-dnd'
import React from 'react'
import { useContext } from 'react'

import { SelectedDispatch } from "./App.js"
import { playerColors, dragTypes, neighborsDeltas } from "./constants.js"




function canMoveSoldiers(srcCoords, dstCoords) {
    // checks if two tiles are neighboring, based on
    // cube coordinates sent from backend
    // explanation in tile.py file

    if (srcCoords === undefined || dstCoords === undefined) {
        return false;
    }

    const deltas = [srcCoords[0] - dstCoords[0],
    srcCoords[1] - dstCoords[1],
    srcCoords[2] - dstCoords[2],
    ]
    deltas.sort()

    var i = deltas.length;
    while (i--) {
        if (deltas[i] !== neighborsDeltas[i]) return false;
    }
    return true
}
// console.log("drop" + item.sourceId + " " + props.hexId),  // TODO

function Tile(props) {
    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: dragTypes.HEX,
        canDrop: (item, monitor) => canMoveSoldiers(item.sourceCoords, props.coords),
        drop: (item, monitor) => props.attackPopupOn(item.sourceId, props.hexId, props.soldierCount[props.playerIndex]),
        collect: monitor => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop()
        }),
    }), [props.coords])

    const ownerColor = playerColors[props.ownerId];
    const soldierOwnerColor = playerColors[props.soldierOwnerId];

    // selecting / unselecting
    const dispatch = useContext(SelectedDispatch);

    function handleHexClick() {
        dispatch({ type: "click", clickedId: props.hexId });
    }

    // true if and only if our player has soldiers on this tile
    const ownSoldiers = props.soldierOwnerId === props.playerIndex + 1;

    return (
        <div
            ref={drop}
            onClick={handleHexClick} // this function can be passed if we want to change parent
        >
            <Hex
                hexId={props.hexId}
                isHome={props.isHome}
                ownerColor={ownerColor}
                coords={props.coords}
                soldierOwnerColor={soldierOwnerColor}
                soldierCount={props.soldierCount}
                isOver={isOver}
                canDrop={canDrop}
                ownSoldiers={ownSoldiers}
            />

        </div>
    );
}

function Hex(props) {
    const sourceId = props.hexId;
    const sourceCoords = props.coords;

    const [{ isDragging }, drag, preview] = useDrag(() => ({
        type: dragTypes.HEX,
        item: { sourceId, sourceCoords },
        canDrag: () => props.ownSoldiers,
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    }), [sourceId, sourceCoords])

    const homeClass = props.isHome ? 'home' : ''
    const canDropClass = props.canDrop ? 'can-drop' : ''
    const classes = `hex ${props.ownerColor} ${homeClass} ${canDropClass}`

    const soldierImg = './images/soldier.jpg';

    return (
        <>
            <DragPreviewImage connect={preview} src={soldierImg} />
            <div
                ref={drag}
                className={classes}
            >
                <SoldierBadge
                    color={props.soldierOwnerColor}
                    soldierCount={props.soldierCount}
                />
            </div>
        </>
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