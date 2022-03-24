import { getServiceUserStats } from "../api/FetchFuHongListStats";
import { Dispatch, SetStateAction, useEffect, useState } from 'react';


// Stats
export function useServiceUserStats(): [any[], Date, Date,string[], Dispatch<SetStateAction<Date>>, Dispatch<SetStateAction<Date>>, Dispatch<SetStateAction<string[]>>] {
    const [data, setData] = useState<any[]>([]);
    const [startDate, setStartDate] = useState(new Date(new Date().setFullYear(new Date().getFullYear() - 2)));
    const [endDate, setEndDate] = useState(new Date());
    const [serviceUnits, setServiceUnits] = useState<string[]>([]);

    useEffect(() => {
        getServiceUserStats({
            startDate: startDate,
            endDate: endDate,
            serviceUnits: serviceUnits
        }).then((res) => {
            setData(res);
        }).catch(console.error)
    }, [startDate, endDate, serviceUnits]);

    return [data, startDate, endDate, serviceUnits, setStartDate, setEndDate, setServiceUnits]
}