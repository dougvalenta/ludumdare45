import * as React from 'react';
import PotLuck from './potluck';
import * as Generator from '../generator';

type GameState = 'loading' | 'ready' | 'playing' | 'won' | 'lost';

const audioContext = new AudioContext();

let musicBuffer: AudioBuffer;
let stabBuffer: AudioBuffer;

let musicSource: AudioBufferSourceNode;
let stabSource: AudioBufferSourceNode;


export default function Game(): JSX.Element {
    const [ state, setState ] = React.useState<GameState>('loading');

    React.useEffect(() => {
        if (state === 'loading') {
            const musicRequest = new XMLHttpRequest();
            musicRequest.open('GET', 'assets/music/music.mp3', true);
            musicRequest.responseType = 'arraybuffer';
            musicRequest.onload = function () {
                audioContext.decodeAudioData(musicRequest.response, function (buffer) {
                    musicBuffer = buffer;
                    setState('ready');
                });
            }
            musicRequest.send();
            const stabRequest = new XMLHttpRequest();
            stabRequest.open('GET', 'assets/music/stab.mp3', true);
            stabRequest.responseType = 'arraybuffer';
            stabRequest.onload = function () {
                audioContext.decodeAudioData(stabRequest.response, function (buffer) {
                    stabBuffer = buffer;
                });
            }
            stabRequest.send();
        }
    }, [true]);

    const onPlay = React.useCallback(() => {
        Generator.reset();
        musicSource = audioContext.createBufferSource();
        musicSource.buffer = musicBuffer;
        musicSource.loop = true;
        musicSource.connect(audioContext.destination);
        musicSource.start(0);
        setState('playing');
    }, [setState]);

    const onWin = React.useCallback(() => {
        musicSource.stop();
        stabSource = audioContext.createBufferSource();
        stabSource.buffer = stabBuffer;
        stabSource.connect(audioContext.destination);
        stabSource.start(0);
        setState('won');
    }, [setState]);

    const onLose = React.useCallback(() => {
        musicSource.stop();
        stabSource = audioContext.createBufferSource();
        stabSource.buffer = stabBuffer;
        stabSource.connect(audioContext.destination);
        stabSource.start(0);
        setState('lost');
    }, [setState]);

    switch (state) {
        case 'loading':
            return <div className="splash"><h3>Loading...</h3></div>;
        case 'ready':
            return <div className="splash"><button onClick={onPlay}>Play</button></div>;
        case 'playing':
            return <PotLuck onWin={onWin} onLose={onLose}/>
        case 'won':
            return <div className="congratulations"><p>You threw a smashing pot luck!</p><button onClick={onPlay}>Play Again</button></div>;
        case 'lost':
            return <div className="sorry"><p>Your pot luck was a dud!</p><button onClick={onPlay}>Play Again</button></div>;
    }

}
