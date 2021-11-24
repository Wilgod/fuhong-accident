// return service director

import { useState, useEffect } from "react";
import { getDepartmentByShortName } from "../api/FetchUser";


export default function useDepartmentMangers() {
    const [departments, setDepartments] = useState<any[]>([]);
    const [hrDepartment, setHrDepartment] = useState<string>(""); //key

    useEffect(() => {
        if (hrDepartment) {
            getDepartmentByShortName(hrDepartment).then((res) => {
                setDepartments(res);
            }).catch(console.error);
        }
    }, [hrDepartment])

    return { departments, setHrDepartment };
}
