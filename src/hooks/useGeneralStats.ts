import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { getNewServiceUserAccident, getNewOutsiderAccident, getNewOtherIncidentReport, getNewSpecialIncidentReportAllowance, getNewSpecialIncidentReportLicense, ISearchCriteria } from '../api/FetchFuHongListStats';


export default function useGeneralStats(permission): [any[], Date, Date,string[], Dispatch<SetStateAction<Date>>, Dispatch<SetStateAction<Date>>, Dispatch<SetStateAction<string[]>>] {
    const [data, setData] = useState<any[]>([]);
    //const [startDate, setStartDate] = useState(new Date(new Date().setFullYear(new Date().getFullYear() - 2)));
    const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(),0,1));
    const [endDate, setEndDate] = useState(new Date());
    const [serviceUnits, setServiceUnits] = useState<string[]>([]);

    const initialState = async () => {
        
        const searchCriteria: ISearchCriteria = { startDate, endDate, serviceUnits };
        const serviceUserAccident = await getNewServiceUserAccident(searchCriteria);
        const outsiderAccident = await getNewOutsiderAccident(searchCriteria);
        const otherIncident = await getNewOtherIncidentReport(searchCriteria);
        const allowance = await getNewSpecialIncidentReportAllowance(searchCriteria);
        const license = await getNewSpecialIncidentReportLicense(searchCriteria);
        let result = [...serviceUserAccident, ...outsiderAccident, ...otherIncident, ...allowance, ...license].sort((a, b) => {
            let aTime = new Date(a.AccidentTime || a.IncidentTime).getTime();
            let bTime = new Date(b.AccidentTime || b.IncidentTime).getTime();
            return aTime - bTime;
        });
        
        let allDate = [];
        for (let r of result) {
            let add = false;
            if (permission.indexOf('All') >= 0) {
                add = true;
            } else {
                for (let p of permission) {
                    if (r.CaseNumber.indexOf('SUI') >=0) {
                        if (r.ServiceUserUnit == p) {
                            add = true;
                        }
                    } else {
                        if (r.ServiceUnit == p) {
                            add = true;
                        }
                    }
                    
                }
            }
            if (add) {
                allDate.push(r);
            }
        }
        setData(allDate);
    }


    useEffect(() => {
        initialState()
    }, [startDate, endDate, serviceUnits])


    return [data, startDate, endDate, serviceUnits, setStartDate, setEndDate, setServiceUnits]
}
