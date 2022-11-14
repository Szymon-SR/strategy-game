import './menu.css';


import React, { useEffect, useReducer, useRef, useState } from 'react';


function MainMenu(props) {

    return (
        <div className='main-menu'>
            <AccountBar />
            <MenuPanel />
            <BottomBar />
        </div>
    )
}

function AccountBar(props) {

    return (
        <div className='account-bar'>
            Not logged in - TODO
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
            Made in 2022
        </div>
    )
}

export { MainMenu };