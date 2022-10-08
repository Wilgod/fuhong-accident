

import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { getLog } from "../api/LogHelper";

export default function useLog(permission): [any[], string, Dispatch<SetStateAction<string>>, Dispatch<SetStateAction<Date>>, Dispatch<SetStateAction<Date>>, Dispatch<SetStateAction<string[]>>, Dispatch<SetStateAction<string>>, Dispatch<SetStateAction<string[]>>] {
    const [data, setData] = useState<any[]>([]);
    const [searchText, setSearchText] = useState("");
    const [startDate, setStartDate] = useState(new Date(new Date().setFullYear(new Date().getFullYear() - 3)));
    const [endDate, setEndDate] = useState(new Date());
    const [serviceUnits, setServiceUnits] = useState<string[]>([]);
    const [status, setStatus] = useState("");
    const [formType, setFormType] = useState<string[]>([]);

    useEffect(() => {
        getLog({
            searchText,
            endDate,
            formType,
            serviceUnits,
            startDate,
            status
        }).then((res) => {
            debugger
            let add = false;
            let allDate = [];
            for (let r of res) {
                if (permission.indexOf('All') >= 0) {
                    add = true;
                } else {
                    for (let p of permission) {
                        if (r.ServiceUnit == p) {
                            add = true;
                        }
                    }
                }
                if (add) {
                    allDate.push(r);
                }
            }
            
            setData(allDate);
        }).catch(console.error);
    }, [startDate, endDate, serviceUnits, status, formType])

    return [data, searchText, setSearchText, setStartDate, setEndDate, setServiceUnits, setStatus, setFormType];
}