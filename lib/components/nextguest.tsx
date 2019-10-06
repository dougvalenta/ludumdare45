import * as React from 'react';
import { Guest, Recipe } from '../generator';
import Flavor from './flavor';
import Course from './course';

interface NextGuestProps {
    guest: Guest;
    onRecipe: (recipe: Recipe) => any;
}

function aOrAn(flavor: string) {
    if (flavor === 'expensive') return 'an';
    return 'a';
}

const rsquo = '\u2019';

export default function NextGuest(props: NextGuestProps): JSX.Element {

    const renderRecipe = React.useCallback((recipe: Recipe) => <li className="recipe" key={recipe.name} onClick={() => props.onRecipe(recipe)}>
        <h3>{recipe.name}</h3> 
        {aOrAn(recipe.flavors[0])} <Flavor flavor={recipe.flavors[0]}/> and <Flavor flavor={recipe.flavors[1]}/> <Course course={recipe.course}/>
    </li>, [ props.onRecipe ]);

    return <div className="next-guest">
        <img src={`assets/images/${props.guest.look}.png`}/>
        <h2>{props.guest.name}:</h2>
        <p>Thanks for inviting me! I hope you{rsquo}ll have plenty of <Flavor flavor={props.guest.preferredFlavors[0]}/> and <Flavor flavor={props.guest.preferredFlavors[1]}/> foods for me to try. Remember, I don{rsquo}t like any <Flavor flavor={props.guest.dislikedFlavors[0]}/> foods. Which of my <i>specialties</i> shall I bring?</p>
        <ul>
            {props.guest.knownRecipes.map(renderRecipe)}
        </ul>
    </div>

}