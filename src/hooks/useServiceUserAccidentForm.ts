import { useState, useEffect } from "react";
import { getServiceUserAccident } from "../api/FetchFuHongList";


export default function useFetchAllForms() {
    const [result, setResult] = useState([]);
    useEffect(() => {
        const initial = async () => {
            const serviceUserAccidentData = await getServiceUserAccident();
            setResult(serviceUserAccidentData);
        }
        initial();
    }, [])

    return [result];
}
