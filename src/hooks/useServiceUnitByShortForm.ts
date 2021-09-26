import { useState, useEffect } from "react";
import { getServiceUnitByShortForm } from "../api/FetchFuHongList";


export default function useServiceUnitByShortForm() {
    const [serviceUnit, setServiceUnit] = useState(null);
    const [shortForm, setShortForm] = useState(null);

    useEffect(() => {
        if (shortForm) {
            getServiceUnitByShortForm(shortForm).then((res) => {
                if (res.length > 0) {
                    setServiceUnit(res[0]);
                }
            }).catch(console.error);
        }
    }, [shortForm, setServiceUnit])

    return [serviceUnit, setShortForm];
}