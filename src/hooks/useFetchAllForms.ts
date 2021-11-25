import { useState, useEffect } from "react";
import { getOtherIncidentReport, getOutsiderAccident, getServiceUserAccident, getSpecialIncidentReportAllowance, getSpecialIncidentReportLicense } from "../api/FetchFuHongList";

interface ISearchCriteria {
    startDate: Date;
    endDate: Date;
    serviceUnits: string[];
    formTypes: string[];
    formStatus: string;
    expired: boolean;
}

export default function useFetchAllForms(spId: number, searchCriteria: ISearchCriteria) {
    const [result, setResult] = useState([]);

    const initial = async () => {
        let result = [];
        let searchFormTypesAll = true;
        // let searchFormTypesAll = searchCriteria.formTypes.indexOf("ALL") > -1;
        if (searchFormTypesAll) {
            const serviceUserAccidentData = await getServiceUserAccident(spId);
            result.concat(serviceUserAccidentData);
            [...result, ...serviceUserAccidentData]
        }
        if (searchFormTypesAll) {
            const outsiderAccidentData = await getOutsiderAccident(spId);
            // result.concat(outsiderAccidentData);
        }
        if (searchFormTypesAll) {
            const otherIncidentData = await getOtherIncidentReport(spId);
            // result.concat(otherIncidentData);
        }
        if (searchFormTypesAll) {
            const specialIncidentReportLicense = await getSpecialIncidentReportLicense(spId);
            // result.concat(specialIncidentReportLicense);
        }
        if (searchFormTypesAll) {
            const specialIncidentReportAllowance = await getSpecialIncidentReportAllowance(spId);
            // result.concat(specialIncidentReportAllowance);
        }
        result = result.sort((a, b) => {
            return new Date(b.Created).getTime() - new Date(a.Modified).getTime()
        });
        setResult(result);
    }

    useEffect(() => {
        initial();
    }, [])

    return [result];
}
