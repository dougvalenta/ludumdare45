import * as React from 'react';

interface ClickthroughProps {
    children: JSX.Element[];
    onDone: () => any;
    className?: string;
}

export default function Clickthrough(props: ClickthroughProps): JSX.Element {
    const [ index, setIndex ] = React.useState(0);

    const onClick = React.useCallback(() => {
        if (index < props.children.length - 1) {
            setIndex(index + 1);
        } else {
            props.onDone();
        }
    }, [ index, setIndex, props.children.length, props.onDone ]);

    React.useEffect(() => {
        if (index >= props.children.length) {
            props.onDone();
        }
    }, [ index, props.children.length, props.onDone ]);

    return <div className={props.className} onClick={onClick}>{props.children[index]}</div>;
}
