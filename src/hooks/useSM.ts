// return service director

import { useState, useEffect } from "react";
import { getServiceManagersByGraph } from "../api/FetchUser";


export default function useSM() {
    const [serviceManagerList, setServiceManagerList] = useState<any[]>([]);
   

    useEffect(() => {
        getServiceManagersByGraph().then(setServiceManagerList).catch(console.error);
    }, [])

    return [serviceManagerList];
}
