import { useState, useEffect } from "react";
import { getAllServiceUnit } from "../api/FetchUser";

export function locationFilterParser(serviceUnit: any[]) {
    let result = [];
    const s = new Set();
    if (Array.isArray(serviceUnit)) {
        serviceUnit.forEach((item) => {
            if (item.location) {
                s.add({"su_Eng_name_display" : item.su_Eng_name_display, "su_name_tc": item.su_name_tc});
            }
        })
    }

    s.forEach((item) => {
        result.push(item);
    })
    return result
    //return result.sort((a, b) => a.localeCompare(b));
}

export default function useServiceLocation(siteCollectionUrl) {
    const [serviceLocations, setServiceLocation] = useState<any[]>([]);

    useEffect(() => {
        getAllServiceUnit(siteCollectionUrl).then((data) => {
            debugger
            const result = locationFilterParser(data);
            setServiceLocation(result);
        }).catch(console.error);
    }, []);

    return [serviceLocations];
}