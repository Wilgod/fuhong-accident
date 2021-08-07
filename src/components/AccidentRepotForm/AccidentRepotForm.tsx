import * as React from 'react';
import { useState } from "react";
import { WebPartContext } from '@microsoft/sp-webpart-base';
import AutosizeTextarea from "../AutosizeTextarea/AutosizeTextarea";
interface IAccidentFollowUpRepotFormProps {
    context: WebPartContext;
}

interface IAccidentFollowUpRepotFormStates {
    textarea: string;
}



export default function AccidentFollowUpRepotForm({ context }: IAccidentFollowUpRepotFormProps) {
    const [date, setDate] = useState(new Date());
    const [form, setForm] = useState<IAccidentFollowUpRepotFormStates>({
        textarea: ""
    });


    const radioButtonHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setForm({ ...form, [name]: value });
    }

    const textFieldHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setForm({ ...form, [name]: value });
    }

    const checkboxHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        const arr = form[name];
        if (Array.isArray(arr)) {
            if (arr.indexOf(value) > -1) {
                const result = arr.filter((item) => item !== value);
                setForm({ ...form, [name]: result });
            } else {
                setForm({ ...form, [name]: [...arr, value] });
            }
        }
    }

    return (
        <div>
            <AutosizeTextarea className="form-control" name="textarea" value={form.textarea} placeholder="請註明" onChange={textFieldHandler} />
        </div>
    )
}
