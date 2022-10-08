

import { useState, useEffect } from "react";
import { getEmailRecords } from "../api/EmailRecordHelper";


export default function useEmailRecord(permission): any {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        getEmailRecords(permission).then((res) => {
            console.log(res);
            setData(res);
        }).catch(console.error);
    }, [])

    return [data];
}