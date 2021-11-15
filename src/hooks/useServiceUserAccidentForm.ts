import { useState, useEffect } from "react";
import { getOtherIncidentReport, getOutsiderAccident, getServiceUserAccident, getSpecialIncidentReportLicense } from "../api/FetchFuHongList";


export default function useFetchAllForms() {
    const [result, setResult] = useState([]);
    useEffect(() => {
        const initial = async () => {
            const serviceUserAccidentData = await getServiceUserAccident();
            const outsiderAccidentData = await getOutsiderAccident();
            const otherIncidentData = await getOtherIncidentReport();
            const specialIncidentReportLicense = await getSpecialIncidentReportLicense();
            setResult([...serviceUserAccidentData, ...outsiderAccidentData, ...otherIncidentData, ...specialIncidentReportLicense]);
        }
        initial();
    }, [])

    return [result];
}
