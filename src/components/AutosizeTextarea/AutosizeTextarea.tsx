import * as React from 'react'
import { useLayoutEffect, useRef } from 'react'
import autosize from "autosize";


interface IAutosizeTextareaProps {
    className?: string;
    id?: string;
    name?: string;
    placeholder?: string;
    value?: string;
    onChange?: (event: any) => void;
}

export default function Textarea({ ...props }: IAutosizeTextareaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>();
    useLayoutEffect(() => {
        autosize(textareaRef.current);
    }, []);

    return (
        <textarea ref={textareaRef} {...props} />
    )
}
