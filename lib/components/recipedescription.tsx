import * as React from 'react';
import { Recipe } from '../generator';
import Flavor from './flavor';
import Course from './course';

interface RecipeDescriptionProps {
    recipe: Recipe;
}

function aOrAn(flavor: string) {
    return flavor === 'expensive' ? 'an' : 'a';
}

export default function RecipeDescription(props: RecipeDescriptionProps) {
    return <>
        {aOrAn(props.recipe.flavors[0])} <Flavor flavor={props.recipe.flavors[0]}/> and <Flavor flavor={props.recipe.flavors[1]}/> <Course course={props.recipe.course}/>
    </>
}
