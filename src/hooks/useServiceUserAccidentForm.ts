import { useState, useEffect } from "react";
import { getOtherIncidentReport, getOutsiderAccident, getServiceUserAccident, getSpecialIncidentReportAllowance, getSpecialIncidentReportLicense } from "../api/FetchFuHongList";


export default function useFetchAllForms() {
    const [result, setResult] = useState([]);
    useEffect(() => {
        const initial = async () => {
            const serviceUserAccidentData = await getServiceUserAccident();
            const outsiderAccidentData = await getOutsiderAccident();
            const otherIncidentData = await getOtherIncidentReport();
            const specialIncidentReportLicense = await getSpecialIncidentReportLicense();
            const specialIncidentReportAllowance = await getSpecialIncidentReportAllowance();
            let result = [...serviceUserAccidentData, ...outsiderAccidentData, ...otherIncidentData, ...specialIncidentReportLicense, ...specialIncidentReportAllowance].sort((a, b) => {
                return new Date(b.Created).getTime() - new Date(a.Modified).getTime()
            });
            setResult(result);
        }
        initial();
    }, [])

    return [result];
}
