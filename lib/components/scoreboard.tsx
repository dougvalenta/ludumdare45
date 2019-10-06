import * as React from 'react';

interface ScoreboardProps {
    guestsRemaining: number;
    guestsTotal: number;
    invitationsReceived: number;
    invitationsGoal: number;
    highlightInvitations?: boolean;
}

export default function Scoreboard(props: ScoreboardProps) {

    return <div className="scoreboard">
        <div className="guests-score" title="Guests remaining to arrive">
            {props.guestsRemaining.toString()}/{props.guestsTotal.toString()}
        </div>
        <div className={`invitations-score${props.highlightInvitations ? ' highlighted' : ''}`} title="Invitations reciprocated">
            {props.invitationsReceived.toString()}/{props.invitationsGoal.toString()}
        </div>
    </div>

}
