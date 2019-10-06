import { Corpus } from './corpus';
import * as slugify from '@sindresorhus/slugify';

export interface Recipe {
    name: string;
    course: number;
    flavors: string[];
    broughtBy: Guest;
    image: string;
}

export interface Guest {
    name: string;
    preferredFlavors: string[];
    dislikedFlavors: string[];
    knownRecipes: Recipe[];
    status: GuestStatus;
    coursesEaten: Recipe[];
    hearts: number;
    look: string;
}

export type GuestStatus = 'looking' | 'still-looking' | 'eating' | 'eating-liked' | 'eating-favorite' | 'disappointed' | 'leaving' | 'inviting' | 'full' | 'left';

type Gender = 'boy' | 'girl';

const genders = new Corpus<Gender>('boy', 'girl');

const names = {
    'boy': new Corpus<string>('Geoff', 'Danny', 'Drew', 'Bill', 'Rob', 'Patrick', 'Eric', 'Fred', 'Joe', 'Ryan', 'Michael', 'Alan', 'Henry', 'Ollie', 'Roger', 'Marco'),
    'girl': new Corpus<string>('Anne', 'Ruby', 'Bea', 'Kim', 'Joy', 'Georgette', 'Jessica', 'Cathy', 'Sue', 'Bonnie', 'Rhonda', 'Marilyn', 'Dana', 'Liza', 'Paula', 'Juana'),
};

export function reset() {
    genders.randomize();
    names.boy.randomize();
    names.girl.randomize();
    boyLooks.randomize();
    girlLooks.randomize();
    flavors.randomize();
    let flavorsArray = [];
    for (let i = 0; i < flavorCount; i++) {
        flavorsArray.push(flavors.get());
    }
    flavorsInPlay = new Corpus<string>(...flavorsArray);
}

const flavors = new Corpus<string>('creamy', 'cheesy', 'smelly', 'garlicky', 'spicy', 'salty', 'sticky', 'crispy', 'fruity', 'meaty', 'tangy', 'nutty', 'expensive').randomize();

const flavorCount = 9;

let flavorsInPlay: Corpus<string>;

const recipeBases = {
    'dip': {
        'creamy': new Corpus<string>('Guacamole'),
        'cheesy': new Corpus<string>('Queso'),
        'smelly': new Corpus<string>('Country Dip'),
        'garlicky': new Corpus<string>('Garlic Bread Dip'),
        'spicy': new Corpus<string>('Salsa'),
        'salty': new Corpus<string>('Fish Dip'),
        'sticky': new Corpus<string>('Caramel'),
        'crispy': new Corpus<string>('Tortilla Chips'),
        'fruity': new Corpus<string>('Jelly', 'Jam', 'Yogurt'),
        'meaty': new Corpus<string>('Liverwurst'),
        'tangy': new Corpus<string>('Thousand Island', 'Barbecue Sauce'),
        'nutty': new Corpus<string>('Hummus', 'Peanut Butter', 'Mixed Nuts'),
        'expensive': new Corpus<string>('Paté', 'Caviar'),
    },
    'salad': {
        'creamy': new Corpus<string>('Egg Salad', 'Coleslaw', 'Potato Salad'),
        'cheesy': new Corpus<string>('Tortellini Salad'),
        'smelly': new Corpus<string>('Tuna Salad', 'Cobb Salad'),
        'garlicky': new Corpus<string>('Garlic Bread Salad'),
        'spicy': new Corpus<string>('Jalapeños'),
        'salty': new Corpus<string>('Salami Salad'),
        'sticky': new Corpus<string>('Caramel Salad'),
        'crispy': new Corpus<string>('Wontons'),
        'fruity': new Corpus<string>('Ambrosia', 'Waldorf'),
        'meaty': new Corpus<string>('Ham Salad', 'Taco Salad'),
        'tangy': new Corpus<string>('Caesar'),
        'nutty': new Corpus<string>('Pesto'),
        'expensive': new Corpus<string>('Arugula'),
    },
    'casserole': {
        'creamy': new Corpus<string>('Noodle Bake'),
        'cheesy': new Corpus<string>('Lasagna', 'Enchiladas'),
        'smelly': new Corpus<string>('Fish Bake'),
        'garlicky': new Corpus<string>('Garlic Bread Casserole'),
        'spicy': new Corpus<string>('Chiles Rellenos'),
        'salty': new Corpus<string>('Ham Hotdish'),
        'sticky': new Corpus<string>('Buns'),
        'crispy': new Corpus<string>('Nachos'),
        'fruity': new Corpus<string>('Pineapple Surprise'),
        'meaty': new Corpus<string>('Shepherd\u2019s Pie'),
        'tangy': new Corpus<string>('Vinegar Boil'),
        'nutty': new Corpus<string>('Almond Ding', 'Cashew Supreme'),
        'expensive': new Corpus<string>('Cassoulet', 'Terrine'),
    },
    'dessert': {
        'creamy': new Corpus<string>('Ice Cream', 'Flan'),
        'cheesy': new Corpus<string>('Cheese Cake'),
        'smelly': new Corpus<string>('Kombucha'),
        'garlicky': new Corpus<string>('Garlic Bread'),
        'spicy': new Corpus<string>('Chocolate-Covered Chilis'),
        'salty': new Corpus<string>('Salted Toffee'),
        'sticky': new Corpus<string>('Taffy'),
        'crispy': new Corpus<string>('Churros'),
        'fruity': new Corpus<string>('Compote'),
        'meaty': new Corpus<string>('Suet Pudding'),
        'tangy': new Corpus<string>('Curd'),
        'nutty': new Corpus<string>('Baklava'),
        'expensive': new Corpus<string>('Mille-Feuille'),
    },
};

const recipeModifiers = {
    'dip': {
        'creamy': new Corpus<string>('Whipped'),
        'cheesy': new Corpus<string>('Parmesan'),
        'smelly': new Corpus<string>('Sauerkraut', 'Seafood'),
        'garlicky': new Corpus<string>('Garlic Bread'),
        'spicy': new Corpus<string>('General Tso\u2019s'),
        'salty': new Corpus<string>('Soy', 'Cured'),
        'sticky': new Corpus<string>('Honey-Baked'),
        'crispy': new Corpus<string>('Deep-Fried'),
        'fruity': new Corpus<string>('Apple', 'Lemon'),
        'meaty': new Corpus<string>('Hamburger', 'Bacon'),
        'tangy': new Corpus<string>('Cider', 'Horseradish', 'Mustard'),
        'nutty': new Corpus<string>('Cashew', 'Almond', 'Walnut', 'Peanut'),
        'expensive': new Corpus<string>('Organic', 'Artisinal', 'Local', 'Gold-Leaf', 'Balsamic'),
    },
    'salad': {
        'creamy': new Corpus<string>('Creamed', 'Buttered'),
        'cheesy': new Corpus<string>('Three-Cheese', 'Feta'),
        'smelly': new Corpus<string>('Three-Bean', 'Anchovy', 'Tuna'),
        'garlicky': new Corpus<string>('Garlic Bread'),
        'spicy': new Corpus<string>('Jalapeño', 'Habanero'),
        'salty': new Corpus<string>('Miso', 'Seaweed'),
        'sticky': new Corpus<string>('Honey'),
        'crispy': new Corpus<string>('Wonton', 'Iceberg', 'Fried Chicken', 'Corn Chip'),
        'fruity': new Corpus<string>('Mixed Berry', 'Citrus', 'Canteloupe', 'Tropical'),
        'meaty': new Corpus<string>('Roast Beef', 'Bacon', 'Italian'),
        'tangy': new Corpus<string>('Kimchi', 'Pickle'),
        'nutty': new Corpus<string>('Cashew', 'Almond', 'Walnut', 'Peanut'),
        'expensive': new Corpus<string>('Organic', 'Artisinal', 'Local', 'Caviar', 'Balsamic'),
    },
    'casserole': {
        'creamy': new Corpus<string>('Alfredo'),
        'cheesy': new Corpus<string>('Cheddar', 'Cream Cheese'),
        'smelly': new Corpus<string>('Fish Sauce'),
        'garlicky': new Corpus<string>('Garlic Bread'),
        'spicy': new Corpus<string>('Wasabi', 'Cayenne'),
        'salty': new Corpus<string>('Salt-Crusted', 'Sea-Salt'),
        'sticky': new Corpus<string>('Honey-Baked', 'Glazed', 'Candied'),
        'crispy': new Corpus<string>('Fried', 'Twice-Baked'),
        'fruity': new Corpus<string>('Figgy', 'Banana', 'Orange'),
        'meaty': new Corpus<string>('Hot Dog', 'Cold Cut', 'Hamburger'),
        'tangy': new Corpus<string>('Lime', 'Sweet-and-Sour'),
        'nutty': new Corpus<string>('Cashew', 'Almond', 'Walnut', 'Peanut'),
        'expensive': new Corpus<string>('Truffled', 'Balsamic', 'Wagyu', 'Free Range', 'Red Wine'),
    },
    'dessert': {
        'creamy': new Corpus<string>('Double-Cream', 'All-Butter'),
        'cheesy': new Corpus<string>('Ricotta', 'Cream Cheese'),
        'smelly': new Corpus<string>('Bean', 'Fermented'),
        'garlicky': new Corpus<string>('Garlic Bread'),
        'spicy': new Corpus<string>('Chili'),
        'salty': new Corpus<string>('Salted'),
        'sticky': new Corpus<string>('Butterscotch'),
        'crispy': new Corpus<string>('Fried'),
        'fruity': new Corpus<string>('Apple Cinnamon'),
        'meaty': new Corpus<string>('Maple Bacon'),
        'tangy': new Corpus<string>('Lemon-Lime', 'Tamarind'),
        'nutty': new Corpus<string>('Praline', 'Cashew', 'Almond', 'Walnut', 'Peanut'),
        'expensive': new Corpus<string>('Balsamic', 'Champagne', 'Gold-Leaf'),
    },
}

const boyLooks = new Corpus<number>(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11).randomize();
const girlLooks = new Corpus<number>(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11).randomize();

const looks = { boy: boyLooks, girl: girlLooks };

const courses = [ 'dip', 'salad', 'casserole', 'dessert' ];

function choose<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

export function cook(): Guest {
    flavorsInPlay.randomize();
    const gender = genders.get();
    const name = names[gender].get();
    const guest: Guest = {
        name,
        preferredFlavors: [ flavorsInPlay.get(), flavorsInPlay.get() ],
        dislikedFlavors: [ flavorsInPlay.get() ],
        knownRecipes: [],
        coursesEaten: [],
        status: 'looking',
        hearts: 0,
        look: `${gender}/${looks[gender].get()}`,
    };
    let skippedCourse = Math.floor(Math.random() * courses.length);
    for (let i = 0; i < courses.length; i++) {
        if (i !== skippedCourse) {
            const courseFlavors = Math.random() > 0.5 ? [ choose(guest.preferredFlavors), flavorsInPlay.get() ] : [ flavorsInPlay.get(), choose(guest.preferredFlavors) ];
            const modifier = recipeModifiers[courses[i]][courseFlavors[0]].get();
            const base = recipeBases[courses[i]][courseFlavors[1]].get();
            const image = `${courses[i]}/${slugify(base)}`;
            const recipe: Recipe = {
                name: `${modifier} ${base}`,
                flavors: courseFlavors,
                broughtBy: guest,
                course: i,
                image,
            };
            guest.knownRecipes.push(recipe);
        }
    }
    return guest;
}

reset();
