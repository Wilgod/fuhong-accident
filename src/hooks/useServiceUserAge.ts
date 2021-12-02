import { getServiceUserAccidentAge } from "../api/FetchFuHongListStats";
import { useEffect, useState } from 'react';
// Stats


export function useServiceUserAge() {
    const [data, setData] = useState([]);

    useEffect(() => {
        getServiceUserAccidentAge().then((res) => {
            console.log(res);
            setData(res);
        }).catch(console.error)
    }, []);

    return data
}