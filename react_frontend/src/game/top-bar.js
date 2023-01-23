import React from 'react';


function TopBar(props) {
    // menu which displays basic data about player's country
    return (
      <table className="top-bar">
        <tbody>
          <tr>
            <td>
              Day
            </td>
            <td>
              {props.day}
            </td>
            <td>
              Money
            </td>
            <td>
              {props.balance}
            </td>
            <td>
              Income
            </td>
            <td>
              {props.income}
            </td>
          </tr>
        </tbody>
      </table>
    )
  }

export { TopBar };