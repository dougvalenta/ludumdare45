import * as React from 'react';
import * as Generator from '../generator';
import Table from './table';
import Clickthrough from './clickthrough';
import NextGuest from './nextguest';
import Course from './course';
import Guests from './guests';
import { Corpus } from '../corpus';
import Scoreboard from './scoreboard';

interface PotLuckProps {
    onWin: () => any;
    onLose: () => any;
}

type PotLuckState = 'intro' | 'next-guest' | 'gossip' | 'full' | 'leaving' | 'inviting' | 'fa-la-la';

const rsquo = '\u2019';

function match(flavors: string[], other: string[]) {
    let matches = 0;
    for (const flavor of flavors) {
        for (const otherFlavor of other) {
            if (flavor === otherFlavor) {
                matches++;
            }
        }
    }
    return matches;
}

const genericGossip = new Corpus<string>('Pass the garlic bread!', 'Frightful weather we\u2019re having.', 'I just love sharing my cooking, don\u2019t you?');
const initialGossip = genericGossip.get();

const ldquo = '\u201c';
const rdquo = '\u201d';

const invitationsToWin = 3;

function isAnyoneLeaving(guests: Generator.Guest[]) {
    for (const guest of guests) {
        if (guest.status === 'leaving') {
            return guest;
        }
    }
}

function isAnyoneInviting(guests: Generator.Guest[]) {
    for (const guest of guests) {
        if (guest.status === 'inviting') {
            return guest;
        }
    }
}

function qualifier(hearts: number) {
    switch (hearts) {
        case 0:
        case 1:
            return 'dissatisfying';
        case 2:
        case 3:
            return 'passable';
        case 4:
            return 'really nice';
        case 5:
            return 'wonderful';
    }
}

function getLeavingReason(guest: Generator.Guest) {
    if (guest.coursesEaten.length < 4) {
        return <>{guest.name} is leaving in search of <Course course={guest.coursesEaten.length}/>!</>
    } else {
        return <>{guest.name} is heading to bed after a {qualifier(guest.hearts)} meal.</>
    }
}

const fullHouseCount = 8;
const maxGuestCount = 24;

export default function PotLuck(props: PotLuckProps): JSX.Element {
    const [ recipes, setRecipes ] = React.useState<Generator.Recipe[]>(new Array(16));
    const [ guests, setGuests ] = React.useState<Generator.Guest[]>([]);
    const [ nextGuest, setNextGuest ] = React.useState<Generator.Guest>(null);
    const [ state, setState ] = React.useState<PotLuckState>('intro');
    const [ totalGuests, setTotalGuests ] = React.useState(0);
    const [ gossip, setGossip ] = React.useState(initialGossip);
    const [ invitations, setInvitations ] = React.useState(0);

    const onIntroDone = React.useCallback(() => {
        setState('next-guest');
        setNextGuest(Generator.cook());
    }, [ setState ]);

    const step = React.useCallback((recipes: Generator.Recipe[]) => {
        let gossipPossibilities: string[] = [];
        for (const guest of guests) {
            switch (guest.status) {
                case 'looking':
                    for (const recipe of recipes) {
                        if (recipe) {
                            if (recipe.course === guest.coursesEaten.length) {
                                if (match(recipe.flavors, guest.preferredFlavors) >= 2) {
                                    guest.coursesEaten.push(recipe);
                                    guest.status = 'eating-favorite';
                                    guest.hearts += 2;
                                    gossipPossibilities.push(`${guest.name}\u2019s loving ${recipe.broughtBy.name}\u2019s ${recipe.name}.`);
                                    break;        
                                }
                            }
                        }
                    }
                    if (guest.status === 'looking') {
                        guest.status = 'still-looking';
                    }
                    break;
                case 'still-looking':
                case 'disappointed':
                    for (const recipe of recipes) {
                        if (recipe) {
                            if (recipe.course === guest.coursesEaten.length) {
                                if (match(recipe.flavors, guest.preferredFlavors) >= 2) {
                                    guest.coursesEaten.push(recipe);
                                    guest.status = 'eating-favorite';
                                    guest.hearts += 2;
                                    gossipPossibilities.push(`${guest.name}\u2019s loving ${recipe.broughtBy.name}\u2019s ${recipe.name}.`);
                                    break;        
                                }
                            }
                        }
                    }
                    if (guest.status !== 'eating-favorite') {
                        for (const recipe of recipes) {
                            if (recipe) {
                                if (recipe.course === guest.coursesEaten.length) {
                                    if (match(recipe.flavors, guest.preferredFlavors) >= 1) {
                                        guest.coursesEaten.push(recipe);
                                        guest.status = 'eating-liked';
                                        guest.hearts += 1;
                                        gossipPossibilities.push(`Look who\u2019s digging into the ${recipe.name}.`);
                                        break;        
                                    }
                                }
                            }
                        }
                        if (guest.status !== 'eating-liked') {
                            for (const recipe of recipes) {
                                if (recipe) {
                                    if (recipe.course === guest.coursesEaten.length) {
                                        if (match(recipe.flavors, guest.dislikedFlavors) == 0) {
                                            guest.coursesEaten.push(recipe);
                                            guest.status = 'eating';
                                            break;        
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (guest.status === 'still-looking') {
                        guest.status = 'disappointed';
                        gossipPossibilities.push(`Uh oh! ${guest.name} looks really hungry!`)
                    } else if (guest.status === 'disappointed') {
                        guest.status = 'leaving';
                    }
                    break;
                case 'eating-favorite':
                case 'eating-liked':
                case 'eating':
                    if (guest.coursesEaten.length < 4) {
                        guest.status = 'looking';
                    } else {
                        if (guest.hearts >= 5) {
                            guest.status = 'inviting';
                            gossipPossibilities.push(`What\u2019s ${guest.name} scribbling on that napkin?`);
                        } else {
                            guest.status = 'full';
                        }
                    }
                    break;
                case 'full':
                case 'inviting':
                    guest.status = 'leaving';
                    break;
            }
        }
        if (gossipPossibilities.length > 0) {
            setGossip(new Corpus<string>(...gossipPossibilities).randomize().get());
        } else {
            setGossip(genericGossip.get());
        }
    }, [ guests, recipes, setGossip ]);

    const addNextGuest = React.useCallback((recipe: Generator.Recipe) => {
        
        let recipeIndex = Math.floor(Math.random() * 16);
        while (recipes[recipeIndex]) {
            if (recipeIndex < 15) {
                recipeIndex++;
            } else {
                recipeIndex = 0;
            }
        }
        recipes[recipeIndex] = recipe;
        setRecipes(recipes);

        step(recipes);

        guests.push(nextGuest);
        setGuests(guests);
        setTotalGuests(totalGuests + 1);

        setState('gossip');
    }, [ step, guests, nextGuest, setGuests, recipes, setRecipes, setNextGuest, totalGuests, setTotalGuests ]);

    const handleLeavingAndInviting = React.useCallback((guests: Generator.Guest[]) => {
        let leaving = isAnyoneLeaving(guests);
        let inviting = isAnyoneInviting(guests);
        if (leaving) {
            for (let i = 0; i < recipes.length; i++) {
                if (recipes[i]) {
                    if (recipes[i].broughtBy === leaving) {
                        recipes[i] = null;
                        break;
                    }
                }
            }
            setRecipes(recipes);
            setState('leaving');
            return true;
        } else if (inviting) {
            setState('inviting');
            setInvitations(invitations + 1);
            return true;
        }
        return false;
    }, [recipes, setRecipes, setState, setInvitations, invitations ]);

    const onGossipDone = React.useCallback(() => {
        if (!handleLeavingAndInviting(guests)) {
            if (guests.length >= fullHouseCount) {
                setState('full');
            } else if (totalGuests < maxGuestCount) {
                setState('next-guest');
                setNextGuest(Generator.cook());
            } else {
                setState('fa-la-la');
            }
        }
    }, [ handleLeavingAndInviting, totalGuests, guests, setState, setNextGuest ]);

    const onFullHouseDone = React.useCallback(() => {
        step(recipes);
        setState('gossip');
    }, [ step, setState ]);

    const onLeavingDone = React.useCallback(() => {
        if (guests.length === 1) {
            props.onLose();
            return;
        }
        let leaving = isAnyoneLeaving(guests);
        leaving.status = 'left';
        guests.splice(guests.indexOf(leaving), 1);
        setGuests(guests);
        if (!handleLeavingAndInviting(guests)) {
            if (guests.length >= fullHouseCount) {
                setState('full');
            } else if (totalGuests < maxGuestCount) {
                setState('next-guest');
                setNextGuest(Generator.cook());
            } else {
                setState('fa-la-la');
            }
        }
    }, [ guests, setGuests, handleLeavingAndInviting, setState, setNextGuest, totalGuests, props ]);

    const onInviteDone = React.useCallback(() => {
        if (invitations >= invitationsToWin) {
            props.onWin();
        } else {
            let inviting = isAnyoneInviting(guests);
            inviting.status = 'leaving';
            handleLeavingAndInviting(guests);
        }
    }, [ guests, handleLeavingAndInviting, props, invitations ]);

    switch (state) {
        case 'intro':
            return <><Clickthrough key='clickthrough' className="intro" onDone={onIntroDone}>
                <p key={1}>You{rsquo}ve decided to hold a pot luck. But will your friends{rsquo} recipes be able to please everyone{rsquo}s tastes?</p>
                <p key={2}>Choose what you ask people to bring carefully, so everyone can enjoy all four courses. You{rsquo}ll need to end up
                    with a <Course course={0}/>, <Course course={1}/>, <Course course={2}/>, and <Course course={3}/> to each person{rsquo}s liking.
                </p>
                <p key={3}>When your guests are having fun, you{rsquo}ll score invitations to their parties. But if a guest finds all your options
                    disgusting, they{rsquo}ll leave and take their food with them!
                </p>
                <p key={4}>There are {maxGuestCount} guests on their way, and you{rsquo}ll need to nab {invitationsToWin} reciprocated invitations to count the day a success.</p>
                <p key={5}>Good luck! Your first guest is about to arrive...</p>
            </Clickthrough><Table key='table' recipes={recipes}/><Guests key='guests' guests={guests}/></>;
        case 'next-guest':
            return <><NextGuest key='nextguest' guest={nextGuest} onRecipe={addNextGuest}/><Table key='table' recipes={recipes}/><Guests key='guests' guests={guests}/></>;
        case 'gossip':
            return <>
                <Scoreboard key='scoreboard' guestsRemaining={maxGuestCount - totalGuests} guestsTotal={maxGuestCount} invitationsReceived={invitations} invitationsGoal={invitationsToWin}/> 
                <Clickthrough key='clickthrough' className="gossip" onDone={onGossipDone}>
                    {[<p>{ldquo}{gossip}{rdquo}</p>]}
                </Clickthrough>
                <Table key='table' recipes={recipes}/><Guests key='guests' guests={guests}/>
            </>;
        case 'full':
            return <>
            <Scoreboard key='scoreboard' guestsRemaining={maxGuestCount - totalGuests} guestsTotal={maxGuestCount} invitationsReceived={invitations} invitationsGoal={invitationsToWin}/> 
                 <Clickthrough key='clickthrough' className="full-house" onDone={onFullHouseDone}>{[<></>]}</Clickthrough>
                <Table key='table' recipes={recipes}/><Guests key='guests' guests={guests}/></>;
        case 'leaving':
            return <>
            <Scoreboard key='scoreboard' guestsRemaining={maxGuestCount - totalGuests} guestsTotal={maxGuestCount} invitationsReceived={invitations} invitationsGoal={invitationsToWin}/> 
            <Clickthrough key='clickthrough' className='gossip' onDone={onLeavingDone}>
                {[<p key={guests.length}>{getLeavingReason(isAnyoneLeaving(guests))}</p>]}
            </Clickthrough>
            <Table key='table' recipes={recipes}/><Guests key='guests' guests={guests}/></>;
        case 'inviting':
            return <>
            <Scoreboard key='scoreboard' guestsRemaining={maxGuestCount - totalGuests} guestsTotal={maxGuestCount} invitationsReceived={invitations} invitationsGoal={invitationsToWin} highlightInvitations={true}/> 
            <Clickthrough key='clickthrough' className="invite" onDone={onInviteDone}>
                {[<p key={1}>Got an invitation from {isAnyoneInviting(guests).name}!</p>]}
            </Clickthrough>
            <Table key='table' recipes={recipes}/><Guests key='guests' guests={guests}/></>;
        case 'fa-la-la':
            return <>
            <Scoreboard key='scoreboard' guestsRemaining={maxGuestCount - totalGuests} guestsTotal={maxGuestCount} invitationsReceived={invitations} invitationsGoal={invitationsToWin}/> 
            <Clickthrough key='clickthrough' className="fa-la-la" onDone={onFullHouseDone}>{[<></>]}</Clickthrough>
                <Table key='table' recipes={recipes}/><Guests  key='guests' guests={guests}/></>;
    }

}
