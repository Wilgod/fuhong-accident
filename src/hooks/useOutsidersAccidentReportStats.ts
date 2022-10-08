import { getAccidentReportStats, getAccidentReportStatsForOutsiders, getServiceUserStats } from "../api/FetchFuHongListStats";
import { Dispatch, SetStateAction, useEffect, useState } from 'react';


// Stats
export function useOutsidersAccidentReportStats(permission): [any[], Date, Date, string[], Dispatch<SetStateAction<Date>>, Dispatch<SetStateAction<Date>>, Dispatch<SetStateAction<string[]>>] {
    const [data, setData] = useState<any[]>([]);
    const [startDate, setStartDate] = useState(new Date(new Date().setFullYear(new Date().getFullYear() - 3)));
    const [endDate, setEndDate] = useState(new Date());
    const [serviceUnits, setServiceUnits] = useState<string[]>([]);

    useEffect(() => {
        getAccidentReportStatsForOutsiders({
            startDate: startDate,
            endDate: endDate,
            serviceUnits: serviceUnits
        }).then((res) => {
            let allDate = [];
            debugger
            for (let r of res) {
                let add = false;
                if (permission.indexOf('All') >= 0) {
                    add = true;
                } else {
                    for (let p of permission) {
                        if (r.ServiceUnit == p) {
                            add = true;
                        }
                    }
                }
                if (add) {
                    allDate.push(r);
                }
            }
            setData(allDate);
        }).catch(console.error)
    }, [startDate, endDate, serviceUnits]);

    return [data, startDate, endDate, serviceUnits, setStartDate, setEndDate, setServiceUnits]
}