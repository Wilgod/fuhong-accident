import { useEffect, useState } from 'react';
import { getNewServiceUserAccident, getNewOutsiderAccident, getNewOtherIncidentReport, getNewSpecialIncidentReportAllowance, getNewSpecialIncidentReportLicense, ISearchCriteria } from '../api/FetchFuHongListStats';

export default function useGeneralStats(): [number, number] {
    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState(new Date(new Date().setFullYear(new Date().getFullYear() - 3)));
    const [endDate, setEndDate] = useState(new Date());
    const [serviceUnits, setServiceUnits] = useState<string[]>([]);

    const initialState = async () => {
        const searchCriteria: ISearchCriteria = { startDate, endDate, serviceUnits };
        const serviceUserAccident = await getNewServiceUserAccident(searchCriteria);
        const outsiderAccident = await getNewOutsiderAccident(searchCriteria);
        const otherIncident = await getNewOtherIncidentReport(searchCriteria);
        const allowance = await getNewSpecialIncidentReportAllowance(searchCriteria);
        const license = await getNewSpecialIncidentReportLicense(searchCriteria);


        let result = [...serviceUserAccident, ...outsiderAccident, ...otherIncident, ...allowance, ...license];
        return result.sort((a, b) => {
            let aTime = new Date(a.AccidentTime || a.IncidentTime).getTime();
            let bTime = new Date(b.AccidentTime || b.IncidentTime).getTime();
            return aTime - bTime;
        });
    }


    useEffect(() => {

    }, [startDate, endDate, serviceUnits])

    let a: [number, number, number] = [1, 2, 3]
    return [1, 2]
}
