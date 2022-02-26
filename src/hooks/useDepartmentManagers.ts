// return service director

import { useState, useEffect } from "react";
import { getDepartmentByShortName, getDepartmentBySuEngNameDisplay } from "../api/FetchUser";


export default function useDepartmentMangers(siteCollectionUrl) {
    const [departments, setDepartments] = useState<any[]>([]);
    const [hrDepartment, setHrDepartment] = useState<string>(""); //key
    useEffect(() => {
        if (hrDepartment) {
            //getDepartmentByShortName(hrDepartment).then((res) => {
            getDepartmentBySuEngNameDisplay(hrDepartment,siteCollectionUrl).then((res) => {
                setDepartments(res);
            }).catch(console.error);
        }
    }, [hrDepartment])

    return { departments, setHrDepartment };
}
