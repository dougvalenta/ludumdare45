import * as React from 'react';
import { Recipe } from '../generator';
import RecipeDescription from './recipedescription';

interface TableProps {
    recipes: Recipe[];
}

const renderRecipe = (recipe: Recipe, index: number) => recipe ? <li key={index} className={`recipe recipe-${index}`}><img src={`assets/images/recipes/${recipe.image}.png`}/><div className="popover"><h3>{recipe.name}</h3><p><RecipeDescription recipe={recipe}/></p><p>brought by {recipe.broughtBy.name}</p></div></li> : <></>;

export default function Table(props: TableProps) {

    return <div className="table">
            <ul>
                {props.recipes.map(renderRecipe)}
            </ul>
        </div>;

}
