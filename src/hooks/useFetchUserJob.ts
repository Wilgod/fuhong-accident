import { useState, useEffect } from "react";
import { getOtherIncidentReportBySPId, getOutsiderAccidentBySPId, getServiceUserAccidentBySPId, getSpecialIncidentReportAllowanceBySPId, getSpecialIncidentReportLicenseBySPId } from "../api/FetchFuHongList";


export default function useFetchUserJob(spId: number,permissionList:any[]) {
    const [result, setResult] = useState([]);

    const initial = async () => {

        const serviceUserAccidentData = await getServiceUserAccidentBySPId(spId,permissionList);
        const outsiderAccidentData = await getOutsiderAccidentBySPId(spId);
        const otherIncidentData = await getOtherIncidentReportBySPId(spId);
        const specialIncidentReportLicense = await getSpecialIncidentReportLicenseBySPId(spId);
        const specialIncidentReportAllowance = await getSpecialIncidentReportAllowanceBySPId(spId);
        let result = [...serviceUserAccidentData, ...outsiderAccidentData, ...otherIncidentData, ...specialIncidentReportLicense, ...specialIncidentReportAllowance].sort((a, b) => {
            return new Date(b.Created).getTime() - new Date(a.Modified).getTime()
        });
        setResult(result);
    }

    useEffect(() => {
        initial();
    }, [])

    return [result];
}
