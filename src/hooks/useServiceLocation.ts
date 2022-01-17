import { useState, useEffect } from "react";
import { getAllServiceUnit } from "../api/FetchUser";

export function locationFilterParser(serviceUnit: any[]) {
    let result = [];
    const s = new Set();
    if (Array.isArray(serviceUnit)) {
        serviceUnit.forEach((item) => {
            if (item.location) {
                s.add(item.location);
            }
        })
    }

    s.forEach((item) => {
        result.push(item);
    })

    return result.sort((a, b) => a.localeCompare(b));
}

export default function useServiceLocation(siteCollectionUrl) {
    const [serviceLocations, setServiceLocation] = useState<any[]>([]);

    useEffect(() => {
        getAllServiceUnit(siteCollectionUrl).then((data) => {
            const result = locationFilterParser(data);
            setServiceLocation(result);
        }).catch(console.error);
    }, []);

    return [serviceLocations];
}