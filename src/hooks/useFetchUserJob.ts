import { useState, useEffect } from "react";
import { getOtherIncidentReportBySPId, getOutsiderAccidentBySPId, getServiceUserAccidentBySPId, getSpecialIncidentReportAllowanceBySPId, getSpecialIncidentReportLicenseBySPId } from "../api/FetchFuHongList";
import {getAllServiceUserAccident, getAllAccidentReportForm,  getAllAccidentFollowUpForm,getAllSMSDMapping} from '../api/FetchFuHongList';
export default function useFetchUserJob(spId: number,permissionList:any[], siteCollectionUrl:any) {
    const [result, setResult] = useState([]);

    const initial = async () => {

        //const serviceUserAccidentData = await getServiceUserAccidentBySPId(spId,permissionList);
        let allServiceUserAccident = await getAllServiceUserAccident();
        let allAccidentReportForm = await getAllAccidentReportForm();
        let allAccidentFollowUpForm = await getAllAccidentFollowUpForm();
        let allSMSDMapping = await getAllSMSDMapping(siteCollectionUrl);
        debugger
        let serviceUserAccidentData = [];
        for (let sa of allServiceUserAccident) {
            let getARF = allAccidentReportForm.filter(item => {return item.CaseNumber == sa.CaseNumber && item.ParentFormId == sa.ID});
            let getAFUF = allAccidentFollowUpForm.filter(item => {return item.CaseNumber == sa.CaseNumber && item.ParentFormId == sa.ID});
            let location = allSMSDMapping.filter(item => {return item.su_Eng_name_display == sa.ServiceUserUnit });
            sa['AccidentReportForm'] = getARF;
            sa['AccidentFollowUpForm'] = getAFUF;
            sa['ServiceLocationTC'] = location.length > 0 ? location[0].su_name_tc : "";
            if (sa['Stage'] == '1') {
                sa['Form'] = '服務使用者意外填報表(一)';
                sa['CurrentSM'] = sa['SM'];
                sa['CurrentSD'] = sa['SD'];
                sa['CurrentSPT'] = sa['SPT'];
                sa['CurrentInvestigator'] = sa['Investigator'];
            } else if (sa['Stage'] == '2') {
                sa['Form'] = '服務使用者意外報告(二)';
                sa['CurrentSM'] = getARF.length > 0 ? getARF[0]['SM'] : null;
                sa['CurrentSD'] = getARF.length > 0 ? getARF[0]['SD'] : null;
                sa['CurrentSPT'] = getARF.length > 0 ? getARF[0]['SPT'] : null;
                sa['CurrentInvestigator'] = sa['Investigator'];
            } else if (sa['Stage'] == '3') {
                sa['Form'] = '事故跟進/結束報告(三)';
                sa['CurrentSM'] = getAFUF.length > 0 ? getAFUF[getAFUF.length -1]['SM'] : null;
                sa['CurrentSD'] = getAFUF.length > 0 ? getAFUF[getAFUF.length -1]['SD'] : null;
                sa['CurrentSPT'] = getAFUF.length > 0 ? getAFUF[getAFUF.length -1]['SPT'] : null;
            }
            if (sa.Status === "PENDING_SM_FILL_IN") {
                sa['StatusTC'] = '尚待服務經理填表';
            } else if (sa.Status === "PENDING_SM_APPROVE") {
                sa['StatusTC'] = '尚待服務經理批核';
            } else if (sa.Status === "PENDING_SD_APPROVE") {
                sa['StatusTC'] = '尚待服務總監批核';
            } else if (sa.Status === "PENDING_SPT_APPROVE") {
                sa['StatusTC'] = '尚待高級物理治療師批核';
            } else if (sa.Status === "PENDING_INVESTIGATE") {
                sa['StatusTC'] = '尚待調查員填表';
            }
            if (sa.Status === "DRAFT") {
                if (sa.AuthorId === spId) {
                    serviceUserAccidentData.push(sa);
                }
            } else {
                let admin = permissionList.filter(p => {return p == 'All'});
                if (admin.length > 0) {
                    serviceUserAccidentData.push(sa);
                } else {
                    let permission = permissionList.filter(p => {return p == sa.ServiceUserUnit});
                    if (permission.length > 0) {
                        serviceUserAccidentData.push(sa);
                    } else if (sa['Stage'] == '1') {
                        if (sa.Status === "PENDING_SM_APPROVE" && sa['SMId'] == spId) {
                            serviceUserAccidentData.push(sa);
                        } else if (sa.Status === "PENDING_SPT_APPROVE" && (sa['SPTId'].Id == spId || sa['SDId'] == spId)) {
                            serviceUserAccidentData.push(sa);
                        }
                    } else if (sa['Stage'] == '2') {
                        if (sa.Status === "PENDING_INVESTIGATE" && sa['InvestigatorId'] == spId) {
                            serviceUserAccidentData.push(sa);
                        } else if (sa.Status === "PENDING_SPT_APPROVE" && getARF.length > 0 && (getARF[0]['SMId'] == spId || getARF[0]['SPTId'] == spId)) {
                            serviceUserAccidentData.push(sa);
                        }  
                    } else if (sa['Stage'] == '3') {
                        if (sa.Status === "PENDING_SM_FILL_IN" && getARF.length > 0 && getAFUF[getAFUF.length -1]['SMId'] == spId) {
                            serviceUserAccidentData.push(sa);
                        } else if (sa.Status === "PENDING_SD_APPROVE" && getARF.length > 0 && (getAFUF[getAFUF.length -1]['SDId'] == spId || getAFUF[getAFUF.length -1]['SPTId'] == spId)) {
                            serviceUserAccidentData.push(sa);
                        }
                    }    
                }
            }
        }
        const outsiderAccidentData = await getOutsiderAccidentBySPId(spId);
        for (let oa of outsiderAccidentData) {
            let getARF = allAccidentReportForm.filter(item => {return item.CaseNumber == oa.CaseNumber && item.ParentFormId == oa.ID});
            let getAFUF = allAccidentFollowUpForm.filter(item => {return item.CaseNumber == oa.CaseNumber && item.ParentFormId == oa.ID});
            let location = allSMSDMapping.filter(item => {return item.su_Eng_name_display == oa.ServiceUnit });
            oa['AccidentReportForm'] = getARF;
            oa['AccidentFollowUpForm'] = getAFUF;
            oa['ServiceLocationTC'] = location.length > 0 ? location[0].su_name_tc : "";
            if (oa.Status === "PENDING_SM_FILL_IN") {
                oa['StatusTC'] = '尚待服務經理填表';
            } else if (oa.Status === "PENDING_SM_APPROVE") {
                oa['StatusTC'] = '尚待服務經理批核';
            } else if (oa.Status === "PENDING_SD_APPROVE") {
                oa['StatusTC'] = '尚待服務總監批核';
            } else if (oa.Status === "PENDING_SPT_APPROVE") {
                oa['StatusTC'] = '尚待高級物理治療師批核';
            } else if (oa.Status === "PENDING_INVESTIGATE") {
                oa['StatusTC'] = '尚待調查員填表';
            }
            if (oa['Stage'] == '1') {
                oa['Form'] = '外界人士意外填報表(一)';
                oa['CurrentSM'] = oa['SM'];
                oa['CurrentSD'] = oa['SD'];
                oa['CurrentSPT'] = oa['SPT'];
                oa['CurrentInvestigator'] = oa['Investigator'];
            } else if (oa['Stage'] == '2') {
                oa['Form'] = '外界人士意外報告(二)';
                oa['CurrentSM'] = getARF.length > 0 ? getARF[0]['SM'] : null;
                oa['CurrentSD'] = getARF.length > 0 ? getARF[0]['SD'] : null;
                oa['CurrentSPT'] = getARF.length > 0 ? getARF[0]['SPT'] : null;
                oa['CurrentInvestigator'] = oa['Investigator'];
            } else if (oa['Stage'] == '3') {
                oa['Form'] = '事故跟進/結束報告(三)';
                oa['CurrentSM'] = getAFUF.length > 0 ? getAFUF[getAFUF.length -1]['SM'] : null;
                oa['CurrentSD'] = getAFUF.length > 0 ? getAFUF[getAFUF.length -1]['SD'] : null;
                oa['CurrentSPT'] = getAFUF.length > 0 ? getAFUF[getAFUF.length -1]['SPT'] : null;
            }
            oa['ServiceUserNameCN'] = oa['ServiceUserNameTC']
        }
        const otherIncidentData = await getOtherIncidentReportBySPId(spId);
        for (let oid of otherIncidentData) {
            let location = allSMSDMapping.filter(item => {return item.su_Eng_name_display == oid.ServiceUnit });
            if (oid.Status === "PENDING_SM_FILL_IN") {
                oid['StatusTC'] = '尚待服務經理填表';
            } else if (oid.Status === "PENDING_SM_APPROVE") {
                oid['StatusTC'] = '尚待服務經理批核';
            } else if (oid.Status === "PENDING_SD_APPROVE") {
                oid['StatusTC'] = '尚待服務總監批核';
            } else if (oid.Status === "PENDING_SPT_APPROVE") {
                oid['StatusTC'] = '尚待高級物理治療師批核';
            } else if (oid.Status === "PENDING_INVESTIGATE") {
                oid['StatusTC'] = '尚待調查員填表';
            }
            oid['ServiceLocationTC'] = location.length > 0 ? location[0].su_name_tc : "";
            
        }
        const specialIncidentReportLicense = await getSpecialIncidentReportLicenseBySPId(spId);
        for (let sirl of specialIncidentReportLicense) {
            let location = allSMSDMapping.filter(item => {return item.su_Eng_name_display == sirl.ServiceUnit });
            sirl['ServiceUserNameCN'] = sirl['ResponsibleName']
            sirl['ServiceLocationTC'] = location.length > 0 ? location[0].su_name_tc : "";
            if (sirl.Status === "PENDING_SM_FILL_IN") {
                sirl['StatusTC'] = '尚待服務經理填表';
            } else if (sirl.Status === "PENDING_SM_APPROVE") {
                sirl['StatusTC'] = '尚待服務經理批核';
            } else if (sirl.Status === "PENDING_SD_APPROVE") {
                sirl['StatusTC'] = '尚待服務總監批核';
            } else if (sirl.Status === "PENDING_SPT_APPROVE") {
                sirl['StatusTC'] = '尚待高級物理治療師批核';
            } else if (sirl.Status === "PENDING_INVESTIGATE") {
                sirl['StatusTC'] = '尚待調查員填表';
            }
            
        }
        const specialIncidentReportAllowance = await getSpecialIncidentReportAllowanceBySPId(spId);
        for (let sira of specialIncidentReportAllowance) {
            let location = allSMSDMapping.filter(item => {return item.su_Eng_name_display == sira.ServiceUnit });
            sira['ServiceLocationTC'] = location.length > 0 ? location[0].su_name_tc : "";
            if (sira.Status === "PENDING_SM_FILL_IN") {
                sira['StatusTC'] = '尚待服務經理填表';
            } else if (sira.Status === "PENDING_SM_APPROVE") {
                sira['StatusTC'] = '尚待服務經理批核';
            } else if (sira.Status === "PENDING_SD_APPROVE") {
                sira['StatusTC'] = '尚待服務總監批核';
            } else if (sira.Status === "PENDING_SPT_APPROVE") {
                sira['StatusTC'] = '尚待高級物理治療師批核';
            } else if (sira.Status === "PENDING_INVESTIGATE") {
                sira['StatusTC'] = '尚待調查員填表';
            }
            
        }
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
