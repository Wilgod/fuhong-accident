// return service director

import { useState, useEffect } from "react";
import { getSeniorPhysiotherapistByGraph } from "../api/FetchUser";


export default function useSPT(siteCollectionUrl) {
    const [seniorPhysiotherapistList, setSeniorPhysiotherapistList] = useState<any[]>([]);

    useEffect(() => {
        getSeniorPhysiotherapistByGraph(siteCollectionUrl).then(setSeniorPhysiotherapistList).catch(console.error);
    }, [])

    return [seniorPhysiotherapistList];
}
