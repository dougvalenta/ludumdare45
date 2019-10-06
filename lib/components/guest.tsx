import * as React from 'react';
import * as Generator from '../generator';
import Flavor from './flavor';
import Course from './course';

interface GuestProps {
    guest: Generator.Guest;
};

const rsquo = '\u2019';


export default function Guest(props: GuestProps) {

    let status: JSX.Element = <></>;
    let icon: JSX.Element = <></>;
    switch (props.guest.status) {
        case 'looking':
            icon = <span className='icon icon-looking'></span>;
            status = <p>looking for a yummy <Course course={props.guest.coursesEaten.length}/></p>;
            break;
        case 'still-looking':
            icon = <span className='icon icon-still-looking'></span>;
            status = <p>still looking for the yummiest <Course course={props.guest.coursesEaten.length}/></p>;
            break;
        case 'eating-favorite':
            icon = <span className='icon icon-heart-multi'></span>;
            status = <p>found a new favorite, {props.guest.coursesEaten[props.guest.coursesEaten.length - 1].name}</p>;
            break;
        case 'eating-liked':
            icon = <span className='icon icon-heart'></span>;
            status = <p>chowing down on {props.guest.coursesEaten[props.guest.coursesEaten.length - 1].name}</p>;
            break;
        case 'eating':
            icon = <span className='icon icon-eating'></span>;
            status = <p>reluctantly nibbling {props.guest.coursesEaten[props.guest.coursesEaten.length - 1].name}</p>;
            break;
        case 'disappointed':
            icon = <span className='icon icon-disappointed'></span>
            status = <p>not finding any yummy <Course course={props.guest.coursesEaten.length}/></p>;
            break;
        case 'leaving':
            status = <p>heading for the nearest exit</p>;
            break;
        case 'inviting':
            icon = <span className='icon icon-inviting'></span>;
            status = <p>scribbling something on a napkin</p>;
            break;
        case 'full':
            status = <p>couldn{rsquo}t eat another bite</p>;
    }

    let hearts: JSX.Element[] = [];
    for (let i = 0; i < 5; i++) {
        if (i < props.guest.hearts) {
            hearts.push(<span className="heart heart-filled"></span>);
        } else {
            hearts.push(<span className="heart heart-empty"></span>);
        }
    }

    return <div className="guest">
        <img src={`assets/images/${props.guest.look}.png`}/>
        {icon}
        <div className="popover">
            <h3>{props.guest.name}</h3>
            <div className="hearts">{hearts}</div>
            <p>likes <Flavor flavor={props.guest.preferredFlavors[0]}/> and <Flavor flavor={props.guest.preferredFlavors[1]}/> foods, dislikes <Flavor flavor={props.guest.dislikedFlavors[0]}/> foods</p>
            {status}
        </div>
    </div>;

}


