import { useState, useEffect } from "react";
import { getAllIncidentFollowUpFormWithClosed, getAllAccidentFollowUpForm, getAllAccidentReportForm, getAllOtherIncidentReportWithClosed, getAllOutsiderAccidentWithClosed, getAllServiceUserAccidentWithClosed, getAllSpecialIncidentReportAllowanceWithClosed, getAllSpecialIncidentReportLicenseWithClosed } from "../api/FetchFuHongList";

export interface ISearchCriteria {
    startDate: Date;
    endDate: Date;
    keyword: string;
    serviceUnits: string[];
    formTypes: string[];
    formStatus: string;
    expired: boolean;
    adminPermissionBoolean:boolean;
    permissionList:any;
}

export default function useFetchAllForms(spId: number, serviceUnitList:any, searchCriteria: ISearchCriteria) {
    const [result, setResult] = useState([]);
   
    const initial = async () => {
        let result = [];
        let accidentReportForm = [];
        let accidentFollowUpForm = [];
        let serviceUserAccidentData = [];
        let outsiderAccidentData = [];
        let incidentFollowUpForm = [];
        let specialIncidentReportLicense = [];
        let specialIncidentReportAllowance = [];
        let otherIncidentData = [];
        let searchFormTypesAll = searchCriteria.formTypes.indexOf("ALL") > -1; // Form Types
        debugger
        if (searchFormTypesAll || searchCriteria.formTypes.indexOf("SUI") > -1 || searchCriteria.formTypes.indexOf("PUI") > -1) {
            accidentReportForm = await getAllAccidentReportForm();
            accidentFollowUpForm = await getAllAccidentFollowUpForm();
        }
        if (searchFormTypesAll || searchCriteria.formTypes.indexOf("SIH") > -1 || searchCriteria.formTypes.indexOf("SID") > -1 || searchCriteria.formTypes.indexOf("OIN") > -1) {
            incidentFollowUpForm = await getAllIncidentFollowUpFormWithClosed();
        }
        if (searchFormTypesAll || searchCriteria.formTypes.indexOf("SUI") > -1) {
            //const serviceUserAccidentData = await getServiceUserAccident(spId, searchCriteria);
            serviceUserAccidentData = await getAllServiceUserAccidentWithClosed();
            let filterServiceUserAccidentData = serviceUserAccidentData;
            if (searchCriteria.keyword != null && searchCriteria.keyword != '') {
                filterServiceUserAccidentData = serviceUserAccidentData.filter(item=> {return item.ServiceUserNameCN == searchCriteria.keyword || item.ServiceUserNameEN == searchCriteria.keyword  || 
                    item.ServiceUserAge == searchCriteria.keyword || item.ServiceUserGender == searchCriteria.keyword})
            }
            for (let item of filterServiceUserAccidentData) {
                let unit = serviceUnitList.filter(o => {return o.su_Eng_name_display == item.ServiceUserUnit});
                item['ServiceLocationTC'] = unit.length > 0 ? unit[0].su_name_tc : '';
                item['ReportForm'] = [];
                item['FollowUpForm'] = [];
                if (item['Status'] === "PENDING_SM_FILL_IN") {
                    item['StatusTC'] = '尚待服務經理填表';
                } else if (item['Status'] === "PENDING_SM_APPROVE") {
                    item['StatusTC'] = '尚待服務經理批核';
                } else if (item['Status'] === "PENDING_SD_APPROVE") {
                    item['StatusTC'] = '尚待服務總監批核';
                } else if (item['Status'] === "PENDING_SPT_APPROVE") {
                    item['StatusTC'] = '尚待高級物理治療師批核';
                } else if (item['Status'] === "PENDING_INVESTIGATE") {
                    item['StatusTC'] = '尚待調查員填表';
                } else if (item['Status'] === "CLOSED") {
                    item['StatusTC'] = '完結';
                }
                if (item.AccidentReportFormId != null) {
                    let reportForm = accidentReportForm.filter(o => {return o.Id == item.AccidentReportFormId});
                    if (reportForm.length > 0) {
                        item['ReportForm'].push(reportForm[0]);
                    }
                }
                if (item.AccidentFollowUpFormId != null) {
                    for (let followup of item.AccidentFollowUpFormId) {
                        let followupForm = accidentFollowUpForm.filter(o => {return o.Id == followup});
                        if (followupForm.length > 0) {
                            item['FollowUpForm'].push(followupForm[0]);
                        }
                        
                    }
                }
            }
            result = result.concat(filterServiceUserAccidentData);
        }

        if (searchFormTypesAll || searchCriteria.formTypes.indexOf("PUI") > -1) {
            outsiderAccidentData = await getAllOutsiderAccidentWithClosed();
            let filterOutsiderAccidentData = outsiderAccidentData;
            if (searchCriteria.keyword != null && searchCriteria.keyword != '') {
                filterOutsiderAccidentData = outsiderAccidentData.filter(item=> {return item.ServiceUserNameTC == searchCriteria.keyword || item.ServiceUserNameEN == searchCriteria.keyword  || 
                    item.ServiceUserAge == searchCriteria.keyword || item.ServiceUserGender == searchCriteria.keyword})
            }
            
            for (let item of filterOutsiderAccidentData) {
                let unit = serviceUnitList.filter(o => {return o.su_Eng_name_display == item.ServiceLocation});
                item['ServiceLocationTC'] = unit.length > 0 ? unit[0].su_name_tc : '';
                item['ReportForm'] = [];
                item['FollowUpForm'] = [];
                if (item['Status'] === "PENDING_SM_FILL_IN") {
                    item['StatusTC'] = '尚待服務經理填表';
                } else if (item['Status'] === "PENDING_SM_APPROVE") {
                    item['StatusTC'] = '尚待服務經理批核';
                } else if (item['Status'] === "PENDING_SD_APPROVE") {
                    item['StatusTC'] = '尚待服務總監批核';
                } else if (item['Status'] === "PENDING_SPT_APPROVE") {
                    item['StatusTC'] = '尚待高級物理治療師批核';
                } else if (item['Status'] === "PENDING_INVESTIGATE") {
                    item['StatusTC'] = '尚待調查員填表';
                } else if (item['Status'] === "CLOSED") {
                    item['StatusTC'] = '完結';
                }
                if (item.AccidentReportFormId != null) {
                    let reportForm = accidentReportForm.filter(o => {return o.Id == item.AccidentReportFormId});
                    if (reportForm.length > 0) {
                        item['ReportForm'].push(reportForm[0]);
                    }
                }
                if (item.AccidentFollowUpFormId != null) {
                    
                    for (let followup of item.AccidentFollowUpFormId) {
                        let followupForm = accidentFollowUpForm.filter(o => {return o.Id == followup});
                        if (followupForm.length > 0) {
                            item['FollowUpForm'].push(followupForm[0]);
                        }
                        
                    }
                }
            }
            result = result.concat(filterOutsiderAccidentData);
        }
        



        if (searchFormTypesAll || searchCriteria.formTypes.indexOf("SIH") > -1) {
            specialIncidentReportLicense = await getAllSpecialIncidentReportLicenseWithClosed();

            let filterSpecialIncidentReportLicense = specialIncidentReportLicense;
            if (searchCriteria.keyword != null && searchCriteria.keyword != '') {
                filterSpecialIncidentReportLicense = specialIncidentReportLicense.filter(item=> {return item.ResponsibleName == searchCriteria.keyword || item.HomesManagerName == searchCriteria.keyword  || 
                    item.GuardianName == searchCriteria.keyword || item.GuardianRelation == searchCriteria.keyword})
            }
            for (let item of filterSpecialIncidentReportLicense) {
                let unit = serviceUnitList.filter(o => {return o.su_Eng_name_display == item.ServiceLocation});
                item['ServiceLocationTC'] = unit.length > 0 ? unit[0].su_name_tc : '';
                item['IncidentFollowUpForms'] = [];
                if (item['Status'] === "PENDING_SM_FILL_IN") {
                    item['StatusTC'] = '尚待服務經理填表';
                } else if (item['Status'] === "PENDING_SM_APPROVE") {
                    item['StatusTC'] = '尚待服務經理批核';
                } else if (item['Status'] === "PENDING_SD_APPROVE") {
                    item['StatusTC'] = '尚待服務總監批核';
                } else if (item['Status'] === "PENDING_SPT_APPROVE") {
                    item['StatusTC'] = '尚待高級物理治療師批核';
                } else if (item['Status'] === "PENDING_INVESTIGATE") {
                    item['StatusTC'] = '尚待調查員填表';
                } else if (item['Status'] === "CLOSED") {
                    item['StatusTC'] = '完結';
                }
                if (item.FollowUpFormsId != null) {
                    for (let followup of item.FollowUpFormsId) {
                        let followupForm = incidentFollowUpForm.filter(o => {return o.Id == followup});
                        if (followupForm.length > 0) {
                            item['IncidentFollowUpForms'].push(followupForm[0]);
                        }
                        
                    }
                }
            }
            result = result.concat(filterSpecialIncidentReportLicense);
        }

        if (searchFormTypesAll || searchCriteria.formTypes.indexOf("SID") > -1) {
            specialIncidentReportAllowance = await getAllSpecialIncidentReportAllowanceWithClosed();

            let filterSpecialIncidentReporAllowance = specialIncidentReportAllowance;
            if (searchCriteria.keyword != null && searchCriteria.keyword != '') {
                filterSpecialIncidentReporAllowance = specialIncidentReportAllowance.filter(item=> {return item.IncidentLocation == searchCriteria.keyword || item.GuardianDescription == searchCriteria.keyword  || 
                    item.GuardianName == searchCriteria.keyword || item.GuardianRelation == searchCriteria.keyword})
            }

            for (let item of filterSpecialIncidentReporAllowance) {
                let unit = serviceUnitList.filter(o => {return o.su_Eng_name_display == item.ServiceLocation});
                item['ServiceLocationTC'] = unit.length > 0 ? unit[0].su_name_tc : '';
                item['IncidentFollowUpForms'] = [];
                if (item['Status'] === "PENDING_SM_FILL_IN") {
                    item['StatusTC'] = '尚待服務經理填表';
                } else if (item['Status'] === "PENDING_SM_APPROVE") {
                    item['StatusTC'] = '尚待服務經理批核';
                } else if (item['Status'] === "PENDING_SD_APPROVE") {
                    item['StatusTC'] = '尚待服務總監批核';
                } else if (item['Status'] === "PENDING_SPT_APPROVE") {
                    item['StatusTC'] = '尚待高級物理治療師批核';
                } else if (item['Status'] === "PENDING_INVESTIGATE") {
                    item['StatusTC'] = '尚待調查員填表';
                } else if (item['Status'] === "CLOSED") {
                    item['StatusTC'] = '完結';
                }
                if (item.FollowUpFormsId != null) {
                    for (let followup of item.FollowUpFormsId) {
                        let followupForm = incidentFollowUpForm.filter(o => {return o.Id == followup});
                        if (followupForm.length > 0) {
                            item['IncidentFollowUpForms'].push(followupForm[0]);
                        }
                        
                    }
                }
            }
            result = result.concat(filterSpecialIncidentReporAllowance);
        }

        if (searchFormTypesAll || searchCriteria.formTypes.indexOf("OIN") > -1) {
            otherIncidentData = await getAllOtherIncidentReportWithClosed();

            let filterOtherIncidentData = otherIncidentData;
            if (searchCriteria.keyword != null && searchCriteria.keyword != '') {
                filterOtherIncidentData = otherIncidentData.filter(item=> {return item.IncidentLocation == searchCriteria.keyword || item.GuardianDescription == searchCriteria.keyword  || 
                    item.GuardianName == searchCriteria.keyword || item.GuardianRelation == searchCriteria.keyword})
            }
            for (let item of filterOtherIncidentData) {
                let unit = serviceUnitList.filter(o => {return o.su_Eng_name_display == item.ServiceLocation});
                if (item.Id== 252) {
                }
                item['ServiceLocationTC'] = unit.length > 0 ? unit[0].su_name_tc : '';
                item['IncidentFollowUpForms'] = [];
                if (item['Status'] === "PENDING_SM_FILL_IN") {
                    item['StatusTC'] = '尚待服務經理填表';
                } else if (item['Status'] === "PENDING_SM_APPROVE") {
                    item['StatusTC'] = '尚待服務經理批核';
                } else if (item['Status'] === "PENDING_SD_APPROVE") {
                    item['StatusTC'] = '尚待服務總監批核';
                } else if (item['Status'] === "PENDING_SPT_APPROVE") {
                    item['StatusTC'] = '尚待高級物理治療師批核';
                } else if (item['Status'] === "PENDING_INVESTIGATE") {
                    item['StatusTC'] = '尚待調查員填表';
                } else if (item['Status'] === "CLOSED") {
                    item['StatusTC'] = '完結';
                }
                if (item.FollowUpFormsId != null) {
                    for (let followup of item.FollowUpFormsId) {
                        let followupForm = incidentFollowUpForm.filter(o => {return o.Id == followup});
                        if (followupForm.length > 0) {
                            item['IncidentFollowUpForms'].push(followupForm[0]);
                        }
                        
                    }
                }
            }
            result = result.concat(filterOtherIncidentData);
        }
        let filterResult = result.filter(item => {
            const d = new Date(item.AccidentTime || item.IncidentTime);
            return (d.getTime() <= searchCriteria.endDate.getTime() && d.getTime() >= searchCriteria.startDate.getTime())
        })
        ;
        if (Array.isArray(searchCriteria.serviceUnits) && searchCriteria.serviceUnits.indexOf("ALL") === -1) {
            filterResult = filterResult.filter(item => {
                return searchCriteria.serviceUnits.indexOf(item.ServiceLocation) >= 0
            })
        }
        if (Array.isArray(searchCriteria.serviceUnits) && searchCriteria.serviceUnits.indexOf("ALL") >= 0) {
            let filterServiceUnitResult = [];
            if (searchCriteria.permissionList.indexOf('All') < 0) {
                for (let p of searchCriteria.permissionList) {
                    let rs = filterResult.filter(item => {return item.ServiceLocation.indexOf(p) >= 0})
                    for (let r of rs) {
                        filterServiceUnitResult.push(r);
                    }
                }
                filterResult = filterServiceUnitResult;
    
            }
            
        }
        if (searchCriteria.formStatus != 'ALL') {
            filterResult = filterResult.filter(item => {
                if (searchCriteria.formStatus == 'Apply') {
                    return item.Stage == "1"
                } else if (searchCriteria.formStatus == 'Confirm') {
                    return item.Stage == "2" || item.Stage == "3"
                }
                /*if (searchCriteria.formStatus == 'Stage 1 - PENDING SM') {
                    return item.Stage == "1" && item.Status == "PENDING_SM_APPROVE"
                } else if (searchCriteria.formStatus == 'Stage 1 - PENDING SPT') {
                    return item.Stage == "1" && item.Status == "PENDING_SPT_APPROVE"
                } else if (searchCriteria.formStatus == 'Stage 2 - PENDING INVESTIGATOR') {
                    return item.Stage == "2" && item.Status == "PENDING_INVESTIGATE"
                } else if (searchCriteria.formStatus == 'Stage 2 - PENDING SPT') {
                    return item.Stage == "2" && item.Status == "PENDING_SPT_APPROVE"
                } else if (searchCriteria.formStatus == 'Stage 2 - PENDING SM') {
                    return item.Stage == "2" && item.Status == "PENDING_SM_FILL_IN"
                } else if (searchCriteria.formStatus == 'Stage 2 - PENDING SD') {
                    return item.Stage == "2" && item.Status == "PENDING_SD_APPROVE"
                } else if (searchCriteria.formStatus == 'Stage 3 - PENDING SM') {
                    return item.Stage == "3" && item.Status == "PENDING_SM_FILL_IN"
                } else if (searchCriteria.formStatus == 'Stage 3 - PENDING SD') {
                    return item.Stage == "3" && item.Status == "PENDING_SD_APPROVE"
                } else if (searchCriteria.formStatus == 'CLOSED'){
                    return item.Status == "CLOSED"
                }*/
                
            })
        }
        filterResult = filterResult.sort((a, b) => {
            return new Date(b.Created).getTime() - new Date(a.Modified).getTime()
        });
        
        
        setResult(filterResult);
    }

    useEffect(() => {
        initial();
    }, [searchCriteria.formTypes, searchCriteria.formStatus, searchCriteria.keyword, searchCriteria.serviceUnits, searchCriteria.startDate, searchCriteria.endDate])

    return [result];
}
