// return service director

import { useState, useEffect } from "react";
import { getSeniorPhysiotherapistByGraph } from "../api/FetchUser";


export default function useSPT() {
    const [seniorPhysiotherapistList, setSeniorPhysiotherapistList] = useState<any[]>([]);

    useEffect(() => {
        getSeniorPhysiotherapistByGraph().then(setSeniorPhysiotherapistList).catch(console.error);
    }, [])

    return [seniorPhysiotherapistList];
}
