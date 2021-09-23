// return service director

import { useState, useEffect } from "react";
import { getSeniorPhysiotherapistByGraph, getServiceDirectorsByGraph } from "../api/FetchUser";


export default function useSD() {
    const [serviceDirecotrList, setServiceDirectorList] = useState<any[]>([]);

    useEffect(() => {
        getServiceDirectorsByGraph().then(setServiceDirectorList).catch(console.error);
    }, [])

    return [serviceDirecotrList];
}
