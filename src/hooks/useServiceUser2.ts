//getAllServiceUnit

import { useState, useEffect } from "react";
import { getAllServiceUnit } from "../api/FetchUser";

export default function useServiceUnit2(siteCollectionUrl) {
    const [serviceUnitList, setServiceUnitList] = useState<any[]>([]);
    const [serviceUnit, setServiceUnit] = useState(null);
    useEffect(() => {
        getAllServiceUnit(siteCollectionUrl).then(setServiceUnitList).catch(console.error);
    }, []);

    return [serviceUnitList, serviceUnit, setServiceUnit];
}