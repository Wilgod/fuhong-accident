// return service director

import { useState, useEffect } from "react";
import { getServiceUnits } from "../api/FetchFuHongList";


export default function useServiceUnit() {
    const [serviceUnitList, setServiceUnitList] = useState<any[]>([]);
    //const [serviceUnit, setServiceUnit] = useState<string>("");
    const [serviceUnit, setServiceUnit] = useState(null);
    useEffect(() => {
        getServiceUnits().then(setServiceUnitList).catch(console.error);
    }, [])

    return [serviceUnitList, serviceUnit, setServiceUnit];
}
