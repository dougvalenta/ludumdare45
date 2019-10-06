import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Game from './lib/components/game';

const script = document.currentScript;
const container = document.createElement('div');
container.className = 'game';
script.parentElement.appendChild(container);

ReactDOM.render(
    <Game/>,
    container
);
