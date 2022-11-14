import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './game/map.css';

import { Game } from "./game/game-main.js";
import { MainMenu } from "./menu/App.js"

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<MainMenu />);
