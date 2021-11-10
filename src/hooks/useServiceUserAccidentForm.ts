import { useState, useEffect } from "react";
import { getOutsiderAccident, getServiceUserAccident } from "../api/FetchFuHongList";


export default function useFetchAllForms() {
    const [result, setResult] = useState([]);
    useEffect(() => {
        const initial = async () => {
            const serviceUserAccidentData = await getServiceUserAccident();
            const outsiderAccidentData = await getOutsiderAccident();
            setResult([...serviceUserAccidentData, ...outsiderAccidentData]);
        }
        initial();
    }, [])

    return [result];
}
