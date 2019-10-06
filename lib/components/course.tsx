import * as React from 'react';

interface CourseProps {
    course: number;
}

const courses = [ 'dip', 'salad', 'casserole', 'dessert' ];

export default function Course(props: CourseProps) {
    return <span className={`course course-${courses[props.course]}`}>{courses[props.course]}</span>
}
