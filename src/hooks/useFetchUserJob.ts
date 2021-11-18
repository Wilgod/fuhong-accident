import { useState, useEffect } from "react";
import { getOtherIncidentReport, getOtherIncidentReportBySPId, getOutsiderAccident, getOutsiderAccidentBySPId, getServiceUserAccident, getServiceUserAccidentBySPId, getSpecialIncidentReportAllowance, getSpecialIncidentReportAllowanceBySPId, getSpecialIncidentReportLicenseBySPId } from "../api/FetchFuHongList";


export default function useFetchUserJob(spId: number) {
    const [result, setResult] = useState([]);

    const initial = async () => {
        // const serviceUserAccidentData = await getServiceUserAccident();
        // const outsiderAccidentData = await getOutsiderAccident();
        // const otherIncidentData = await getOtherIncidentReport();
        // const specialIncidentReportLicense = await getSpecialIncidentReportLicense();
        // const specialIncidentReportAllowance = await getSpecialIncidentReportAllowance();
        // let result = [...serviceUserAccidentData, ...outsiderAccidentData, ...otherIncidentData, ...specialIncidentReportLicense, ...specialIncidentReportAllowance].sort((a, b) => {
        //     return new Date(b.Created).getTime() - new Date(a.Modified).getTime()
        // });
        const serviceUserAccidentData = await getServiceUserAccidentBySPId(spId);
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
