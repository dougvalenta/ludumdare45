import * as React from 'react';

interface FlavorProps {
    flavor: string;
}

export default function Flavor(props: FlavorProps) {
    return <span className={`flavor flavor-${props.flavor}`}>{props.flavor}</span>
}
