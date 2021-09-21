// return service director

import { useState, useEffect } from "react";
import { getServiceUnits } from "../api/FetchFuHongList";


export default function useServiceUnit() {
    const [serviceUnitList, setServiceUnitList] = useState<any[]>([]);
    //const [serviceUnit, setServiceUnit] = useState<string>("Fuck");
    const [s, ss] = useState(null);
    useEffect(() => {
        getServiceUnits().then(setServiceUnitList).catch(console.error);
    }, [])

    return [serviceUnitList, s, ss];
}
