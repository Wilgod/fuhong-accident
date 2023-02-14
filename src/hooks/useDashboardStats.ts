import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { getDashboardServiceUserAccident, getDashboardOutsiderAccident, getDashboardOtherIncidentReport, getDashboardSpecialIncidentReportAllowance, getDashboardSpecialIncidentReportLicense, ISearchCriteria } from '../api/FetchFuHongListStats';


export default function useDashboardStats(permission): [any[], Date, Date,string[], Dispatch<SetStateAction<Date>>, Dispatch<SetStateAction<Date>>, Dispatch<SetStateAction<string[]>>] {
    const [data, setData] = useState<any[]>([]);
    //const [startDate, setStartDate] = useState(new Date(new Date().setFullYear(new Date().getFullYear() - 2)));
    let startDate1 = new Date();
    startDate1 = new Date(startDate1.setDate(1));
    startDate1 = new Date(startDate1.setMonth(startDate1.getMonth() + 1));
    startDate1 = new Date(startDate1.setFullYear(startDate1.getFullYear() - 1));
    let endDate1 = new Date();
    endDate1 = new Date(endDate1.setDate(1));
    endDate1 = new Date(endDate1.setMonth(endDate1.getMonth() + 1));
    endDate1 = new Date(endDate1.setDate(0));




    const [startDate, setStartDate] = useState(startDate1);
    const [endDate, setEndDate] = useState(endDate1);
    const [serviceUnits, setServiceUnits] = useState<string[]>([]);

    const initialState = async () => {
        
        //;
        const searchCriteria: ISearchCriteria = { startDate, endDate, serviceUnits };
        const serviceUserAccident = await getDashboardServiceUserAccident(searchCriteria, startDate, endDate);
        const outsiderAccident = await getDashboardOutsiderAccident(searchCriteria, startDate, endDate);
        const otherIncident = await getDashboardOtherIncidentReport(searchCriteria, startDate, endDate);
        const allowance = await getDashboardSpecialIncidentReportAllowance(searchCriteria, startDate, endDate);
        const license = await getDashboardSpecialIncidentReportLicense(searchCriteria, startDate, endDate);
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
