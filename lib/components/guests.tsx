import * as React from 'react';
import * as Generator from '../generator';
import Guest from './guest';

interface GuestsProps {
    guests: Generator.Guest[];
}

const renderGuest = (guest: Generator.Guest) => <Guest guest={guest} key={guest.name}/>;

export default function Guests(props: GuestsProps) {
    return <div className="guests">
        {props.guests.map(renderGuest)}
    </div>;
}
