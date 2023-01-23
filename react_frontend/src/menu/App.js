import './menu.css';
import { Routes, Route, Outlet, Link } from "react-router-dom";

import React, { useEffect, useReducer, useRef, useState } from 'react';


function MainMenu(props) {

    return (
        <div className='main-menu'>
            <AccountBar />
            <MenuPanel />
            <BottomBar />
            <Routes>
                
            </Routes>
        </div>
    )
}

function AccountBar(props) {

    return (
        <div className='account-bar'>
            <button>Register</button>
            <button>Login</button>
        </div>
    )
}

function MenuPanel(props) {

    return (
        <div className='menu-panel'>
            <button className='join-button'>Create new game</button>
            <button className='join-button'>Join game</button>
            <button className='join-button'>Online Statistics</button>
        </div>
    )
}

function BottomBar(props) {

    return (
        <div className='bottom-bar'>
            Strategy game
        </div>
    )
}

export { MainMenu };