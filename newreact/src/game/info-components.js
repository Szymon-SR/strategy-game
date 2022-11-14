import React from 'react';
import { playerColors } from "./constants.js"


function BaseMenu(props) {
  return (
    <div
      className="base-menu"
    >
      <table className='base-menu'>
        <tbody>
          <tr>
            <td>Your id</td>
            <td>{props.playerIndex}</td>
          </tr>
          <tr>
            <td>Your color</td>
            <td>{playerColors[props.playerIndex + 1]}</td>
          </tr>
          <tr>
            <td>Invite link</td>
            <td><a href={props.inviteLink}>{props.inviteLink}</a></td>
          </tr>
          <tr>
            <td>Scores</td>
            <td>TODO</td>
          </tr>
        </tbody>
      </table>
      {/* <PlayerInfo playerIndex={props.playerIndex} />
          <RoomInfo inviteLink={props.inviteLink} />
          <ScoreInfo /> */}
    </div>
  )
}


export { BaseMenu };