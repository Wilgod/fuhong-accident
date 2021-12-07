

import { useState, useEffect } from "react";
import { getEmailRecords } from "../api/EmailRecordHelper";


export default function useEmailRecord(): any {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        getEmailRecords().then((res) => {
            console.log(res);
            setData(res);
        }).catch(console.error);
    }, [])

    return [data];
}