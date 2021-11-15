import { useState, useEffect } from "react";
import { getOtherIncidentReport, getOutsiderAccident, getServiceUserAccident } from "../api/FetchFuHongList";


export default function useFetchAllForms() {
    const [result, setResult] = useState([]);
    useEffect(() => {
        const initial = async () => {
            const serviceUserAccidentData = await getServiceUserAccident();
            const outsiderAccidentData = await getOutsiderAccident();
            const otherIncidentData = await getOtherIncidentReport();
            setResult([...serviceUserAccidentData, ...outsiderAccidentData, ...otherIncidentData]);
        }
        initial();
    }, [])

    return [result];
}
