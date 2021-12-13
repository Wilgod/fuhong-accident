import { useState, useEffect } from "react";
import { getAllServiceUnit } from "../api/FetchUser";

export function locationFilterParser(serviceUnit: any[]) {
    console.log(serviceUnit);
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

export default function useServiceLocation() {
    const [serviceLocations, setServiceLocation] = useState<any[]>([]);

    useEffect(() => {
        getAllServiceUnit().then((data) => {
            const result = locationFilterParser(data);
            setServiceLocation(result);
        }).catch(console.error);
    }, []);

    return [serviceLocations];
}