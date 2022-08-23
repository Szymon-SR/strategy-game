import { useContext } from "react"
import { SelectedDispatch } from "./index.js"


//Right
function FocusMenu(props) {
    let child;

    if (props.anySelected) {
        child = <HexAction />
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
            BaseAc
        </div>
    )
}

function HexAction(props) {
    return (
        <div>
            HexAc
        </div>
    )
}

function TileInfo(props) {
    return (
        <div>
            HexAc
        </div>
    )
}

function Actions(props) {
    return (
        <div>
            HexAc
        </div>
    )
}

function Unselect(props) {
    return (
        <div>
            HexAc
        </div>
    )
}

export { FocusMenu };