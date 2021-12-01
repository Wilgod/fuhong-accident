import { useState, useEffect } from "react";
import { getOtherIncidentReport, getOutsiderAccident, getServiceUserAccident, getSpecialIncidentReportAllowance, getSpecialIncidentReportLicense } from "../api/FetchFuHongList";

export interface ISearchCriteria {
    startDate: Date;
    endDate: Date;
    keyword: string;
    serviceUnits: string[];
    formTypes: string[];
    formStatus: string;
    expired: boolean;
}

export default function useFetchAllForms(spId: number, searchCriteria: ISearchCriteria) {
    const [result, setResult] = useState([]);
    console.log(searchCriteria);
    const initial = async () => {
        let result = [];
        // let searchFormTypesAll = true;
        let searchFormTypesAll = searchCriteria.formTypes.indexOf("ALL") > -1; // Form Types


        if (searchFormTypesAll || searchCriteria.formTypes.indexOf("SUI") > -1) {
            const serviceUserAccidentData = await getServiceUserAccident(spId, searchCriteria);
            result = result.concat(serviceUserAccidentData);
        }

        if (searchFormTypesAll || searchCriteria.formTypes.indexOf("PUI") > -1) {
            const outsiderAccidentData = await getOutsiderAccident(spId, searchCriteria);
            result = result.concat(outsiderAccidentData);
        }

        if (searchFormTypesAll || searchCriteria.formTypes.indexOf("SIH") > -1) {
            const specialIncidentReportLicense = await getSpecialIncidentReportLicense(spId, searchCriteria);
            result = result.concat(specialIncidentReportLicense);
        }

        if (searchFormTypesAll || searchCriteria.formTypes.indexOf("SID") > -1) {
            const specialIncidentReportAllowance = await getSpecialIncidentReportAllowance(spId, searchCriteria);
            result = result.concat(specialIncidentReportAllowance);
        }

        if (searchFormTypesAll || searchCriteria.formTypes.indexOf("OIN") > -1) {
            const otherIncidentData = await getOtherIncidentReport(spId, searchCriteria);
            result = result.concat(otherIncidentData);
        }

        result = result.sort((a, b) => {
            return new Date(b.Created).getTime() - new Date(a.Modified).getTime()
        });
        
        setResult(result);
    }

    useEffect(() => {
        initial();
    }, [searchCriteria.formTypes, searchCriteria.formStatus, searchCriteria.keyword, searchCriteria.serviceUnits, searchCriteria.startDate, searchCriteria.endDate])

    return [result];
}
