import './menu.css';


import React, { useEffect, useReducer, useRef, useState } from 'react';


function MainMenu(props) {

    return (
        <div className='main-menu'>
            <MenuPanel />
            <BottomBar />
        </div>
    )
}

function MenuPanel(props) {

    return (
        <div className='menu-panel'>
            <button>Start new game</button>
            <button>Join game</button>
        </div>
    )
}

function BottomBar(props) {

    return (
        <div className='bottom-bar'>

        </div>
    )
}

export { MainMenu };