import { useState, useEffect } from "react";
import { getAllIncidentFollowUpFormWithClosed, getAllAccidentFollowUpForm, getAllAccidentReportForm, getAllOtherIncidentReportWithClosed, getAllOutsiderAccidentWithClosed, getAllServiceUserAccidentWithClosed, getAllSpecialIncidentReportAllowanceWithClosed, getAllSpecialIncidentReportLicenseWithClosed } from "../api/FetchFuHongList";
import { getAllServiceUnit } from "../api/FetchUser";
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

export default function useFetchAllForms(spId: number, serviceUnitList:any,screenType:string, searchCriteria: ISearchCriteria, siteCollectionUrl:string) {
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
        let key = null;
        let serviceUserUnitList = await getAllServiceUnit(siteCollectionUrl);
        if (searchCriteria.keyword != null && searchCriteria.keyword != '') {
            key = decodeURI(searchCriteria.keyword).toLocaleLowerCase().trim();
        }
        if (searchFormTypesAll || searchCriteria.formTypes.indexOf("SUI") > -1 || searchCriteria.formTypes.indexOf("PUI") > -1) {
            accidentReportForm = await getAllAccidentReportForm();
            accidentFollowUpForm = await getAllAccidentFollowUpForm();
        }
        if (searchFormTypesAll || searchCriteria.formTypes.indexOf("SIH") > -1 || searchCriteria.formTypes.indexOf("SID") > -1 || searchCriteria.formTypes.indexOf("OIN") > -1) {
            incidentFollowUpForm = await getAllIncidentFollowUpFormWithClosed();
        }
        if (searchFormTypesAll || searchCriteria.formTypes.indexOf("SUI") > -1) {
            debugger
            //const serviceUserAccidentData = await getServiceUserAccident(spId, searchCriteria);
            serviceUserAccidentData = await getAllServiceUserAccidentWithClosed();
            console.log('serviceUserUnitList',serviceUserUnitList);
            for (let ser of serviceUserAccidentData) {
                let unit = serviceUserUnitList.filter(item => {return item.location == ser.ServiceLocation})
                if (unit.length > 0) {
                    ser['UnitCN'] = unit[0].su_name_tc
                } else {
                    ser['UnitCN'] = '';
                }
            }
            let filterServiceUserAccidentData = serviceUserAccidentData;
            if (key != null && key != '') {
                filterServiceUserAccidentData = serviceUserAccidentData.filter(item=> {return (item.ServiceUserNameCN != null && item.ServiceUserNameCN.toLocaleLowerCase().trim() == key) ||
                    (item.ServiceUserNameEN != null && item.ServiceUserNameEN.toLocaleLowerCase().trim() == key)  || 
                    (item.ServiceUserAge != null && item.ServiceUserAge == key) || 
                    (item.ServiceUserGender != null && item.ServiceUserGender.toLocaleLowerCase().trim() == key) || 
                    (item.CaseNumber != null && item.CaseNumber.toLocaleLowerCase().trim() == key) || 
                    (item.InsuranceCaseNo != null && item.InsuranceCaseNo.toLocaleLowerCase().trim() == key) ||
                    (item.UnitCN != null && item.UnitCN.toLocaleLowerCase().trim() == key) ||
                    (item.HKID != null && item.HKID.toLocaleLowerCase().trim() == key) ||
                    (item.ServiceUserUnit != null && item.ServiceUserUnit.toLocaleLowerCase().trim() == key) ||
                    (item.ServiceLocation != null && item.ServiceLocation.toLocaleLowerCase().trim() == key) })
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
            for (let out of outsiderAccidentData) {
                let unit = serviceUserUnitList.filter(item => {return item.location == out.ServiceLocation})
                if (unit.length > 0) {
                    out['UnitCN'] = unit[0].su_name_tc
                } else {
                    out['UnitCN'] = '';
                }
            }
            let filterOutsiderAccidentData = outsiderAccidentData;
            if (key != null && key != '') {
                filterOutsiderAccidentData = outsiderAccidentData.filter(item=> {return (item.ServiceUserNameTC != null && item.ServiceUserNameTC.toLocaleLowerCase().trim() == key) || 
                    (item.ServiceUserNameEN != null && item.ServiceUserNameEN.toLocaleLowerCase().trim() == key)  || 
                    item.ServiceUserAge == key || 
                    (item.ServiceUserGender != null && item.ServiceUserGender.toLocaleLowerCase().trim() == key) || 
                    (item.CaseNumber != null && item.CaseNumber.toLocaleLowerCase().trim() == key) || 
                    (item.UnitCN != null && item.UnitCN.toLocaleLowerCase().trim() == key) ||
                    (item.InsuranceCaseNo != null && item.InsuranceCaseNo.toLocaleLowerCase().trim() == key)})
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
            if (key != null && key != '') {
                filterSpecialIncidentReportLicense = specialIncidentReportLicense.filter(item=> {return (item.ResponsibleName != null && item.ResponsibleName.toLocaleLowerCase().trim() == key) || 
                    (item.HomesManagerName != null && item.HomesManagerName.toLocaleLowerCase().trim() == key)  || 
                    (item.GuardianName != null && item.GuardianName.toLocaleLowerCase().trim() == key) || 
                    (item.GuardianRelation != null && item.GuardianRelation.toLocaleLowerCase().trim() == key) || 
                    (item.CaseNumber != null && item.CaseNumber.toLocaleLowerCase().trim() == key) || 
                    (item.InsuranceCaseNo != null && item.InsuranceCaseNo.toLocaleLowerCase().trim() == key) ||
                    (item.HomesName != null && item.HomesName.toLocaleLowerCase().trim() == key) ||
                    (item.AffectedName != null && item.AffectedName.toLocaleLowerCase().trim() == key) ||
                    (item.AffectedIdCardNo != null && item.AffectedIdCardNo.toLocaleLowerCase().trim() == key) })
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
            for (let spec of specialIncidentReportAllowance) {
                let unit = serviceUserUnitList.filter(item => {return item.location == spec.ServiceLocation})
                if (unit.length > 0) {
                    spec['UnitCN'] = unit[0].su_name_tc
                } else {
                    spec['UnitCN'] = '';
                }
            }
            let filterSpecialIncidentReporAllowance = specialIncidentReportAllowance;
            if (key != null && key != '') {
                filterSpecialIncidentReporAllowance = specialIncidentReportAllowance.filter(item=> {return (item.IncidentLocation != null && item.IncidentLocation.toLocaleLowerCase().trim() == key) || 
                    (item.GuardianDescription != null && item.GuardianDescription.toLocaleLowerCase().trim() == key)  || 
                    (item.GuardianName != null && item.GuardianName.toLocaleLowerCase().trim() == key) || 
                    (item.GuardianRelation != null && item.GuardianRelation.toLocaleLowerCase().trim() == key) || 
                    (item.CaseNumber != null && item.CaseNumber.toLocaleLowerCase().trim() == key) ||
                    (item.OrgSUName != null && item.OrgSUName.toLocaleLowerCase().trim() == key) ||
                    (item.UnitCN != null && item.UnitCN.toLocaleLowerCase().trim() == key) ||
                    (item.InsuranceCaseNo != null && item.InsuranceCaseNo.toLocaleLowerCase().trim() == key)})
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
            for (let other of otherIncidentData) {
                let unit = serviceUserUnitList.filter(item => {return item.location == other.ServiceLocation})
                if (unit.length > 0) {
                    other['UnitCN'] = unit[0].su_name_tc
                } else {
                    other['UnitCN'] = '';
                }
            }
            let filterOtherIncidentData = otherIncidentData;
            if (key != null && key != '') {
                filterOtherIncidentData = otherIncidentData.filter(item=> {return (item.IncidentLocation != null && item.IncidentLocation.toLocaleLowerCase().trim() == key) || 
                    (item.GuardianDescription != null && item.GuardianDescription.toLocaleLowerCase().trim() == key)  || 
                    (item.GuardianName != null && item.GuardianName.toLocaleLowerCase().trim() == key) || 
                    (item.GuardianRelation != null && item.GuardianRelation.toLocaleLowerCase().trim() == key) || 
                    (item.CaseNumber != null && item.CaseNumber.toLocaleLowerCase().trim() == key) || 
                    (item.UnitCN != null && item.UnitCN.toLocaleLowerCase().trim() == key) ||
                    (item.InsuranceCaseNo != null && item.InsuranceCaseNo.toLocaleLowerCase().trim() == key)})
            }
            for (let item of filterOtherIncidentData) {
                let unit = serviceUnitList.filter(o => {return o.su_Eng_name_display == item.ServiceLocation});
                if (item.Id== 127) {
                    debugger
                }
                item['ServiceLocationTC'] = unit.length > 0 ? unit[0].su_name_tc : '';
                if (item.ServiceLocation == 'HO') {
                    let unit1 = serviceUnitList.filter(o => {return o.su_Eng_name_display == item.ServiceUnit});
                    item['ServiceLocationTC'] = unit1.length > 0 ? unit1[0].su_name_tc : '';
                }
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
        if (Array.isArray(searchCriteria.serviceUnits) && searchCriteria.serviceUnits.indexOf("ALL") >= 0 && screenType != "cms") {
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
