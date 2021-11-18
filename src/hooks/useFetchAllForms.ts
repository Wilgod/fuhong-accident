import { useState, useEffect } from "react";
import { getOtherIncidentReport, getOutsiderAccident, getServiceUserAccident, getSpecialIncidentReportAllowance, getSpecialIncidentReportLicense } from "../api/FetchFuHongList";


export default function useFetchAllForms(spId: number) {
    const [result, setResult] = useState([]);

    const initial = async () => {
        const serviceUserAccidentData = await getServiceUserAccident(spId);
        const outsiderAccidentData = await getOutsiderAccident(spId);
        const otherIncidentData = await getOtherIncidentReport(spId);
        const specialIncidentReportLicense = await getSpecialIncidentReportLicense(spId);
        const specialIncidentReportAllowance = await getSpecialIncidentReportAllowance(spId);
        let result = [...serviceUserAccidentData, ...outsiderAccidentData, ...otherIncidentData, ...specialIncidentReportLicense, ...specialIncidentReportAllowance].sort((a, b) => {
            return new Date(b.Created).getTime() - new Date(a.Modified).getTime()
        });
        setResult(result);
    }

    useEffect(() => {
        initial();
    }, [])

    return [result];
}
