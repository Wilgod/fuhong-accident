import { getLicenseStats } from "../api/FetchFuHongListStats";
import { Dispatch, SetStateAction, useEffect, useState } from 'react';


// Stats
export function useLicenseStats(): [any[], Date, Date, Dispatch<SetStateAction<Date>>, Dispatch<SetStateAction<Date>>, Dispatch<SetStateAction<string[]>>] {
    const [data, setData] = useState<any[]>([]);
    const [startDate, setStartDate] = useState(new Date(new Date().setFullYear(new Date().getFullYear() - 3)));
    const [endDate, setEndDate] = useState(new Date());
    const [serviceUnits, setServiceUnits] = useState<string[]>([]);

    useEffect(() => {
        getLicenseStats({
            startDate: startDate,
            endDate: endDate,
            serviceUnits: serviceUnits
        }).then((res) => {
            setData(res);
        }).catch(console.error)
    }, [startDate, endDate, serviceUnits]);

    return [data, startDate, endDate, setStartDate, setEndDate, setServiceUnits]
}