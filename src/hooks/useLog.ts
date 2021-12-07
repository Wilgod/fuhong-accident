

import { useState, useEffect } from "react";
import { getLog } from "../api/LogHelper";

export default function useLog(): any {
    const [log, setLog] = useState<any[]>([]);

    useEffect(() => {
        getLog().then((res) => {
            setLog(res);
        }).catch(console.error);
    })

    return [log];
}