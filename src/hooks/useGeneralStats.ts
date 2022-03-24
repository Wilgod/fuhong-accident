import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { getNewServiceUserAccident, getNewOutsiderAccident, getNewOtherIncidentReport, getNewSpecialIncidentReportAllowance, getNewSpecialIncidentReportLicense, ISearchCriteria } from '../api/FetchFuHongListStats';


export default function useGeneralStats(): [any[], Date, Date,string[], Dispatch<SetStateAction<Date>>, Dispatch<SetStateAction<Date>>, Dispatch<SetStateAction<string[]>>] {
    const [data, setData] = useState<any[]>([]);
    //const [startDate, setStartDate] = useState(new Date(new Date().setFullYear(new Date().getFullYear() - 2)));
    const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(),0,1));
    const [endDate, setEndDate] = useState(new Date());
    const [serviceUnits, setServiceUnits] = useState<string[]>([]);

    const initialState = async () => {
        debugger
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
        setData(result);
    }


    useEffect(() => {
        initialState()
    }, [startDate, endDate, serviceUnits])


    return [data, startDate, endDate, serviceUnits, setStartDate, setEndDate, setServiceUnits]
}
