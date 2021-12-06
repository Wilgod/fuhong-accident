import { getServiceUserAccidentAge } from "../api/FetchFuHongListStats";
import { useEffect, useState } from 'react';


// Stats
export function useServiceUserAge(): any {
    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState(new Date(new Date().setFullYear(new Date().getFullYear() - 3)));
    const [endDate, setEndDate] = useState(new Date());
    const [serviceUnits, setServiceUnits] = useState<string[]>([]);

    useEffect(() => {
        getServiceUserAccidentAge({
            startDate: startDate,
            endDate: endDate,
            serviceUnits: serviceUnits
        }).then((res) => {
            console.log(res);
            setData(res);
        }).catch(console.error)
    }, [startDate, endDate, serviceUnits]);

    return [data, startDate, endDate, setStartDate, setEndDate, setServiceUnits]
}