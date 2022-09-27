import { useState, useEffect } from "react";
import { getOtherIncidentReportBySPId, getOutsiderAccidentBySPId, getServiceUserAccidentBySPId, getSpecialIncidentReportAllowanceBySPId, getSpecialIncidentReportLicenseBySPId } from "../api/FetchFuHongList";
import {getAllServiceUserAccident, getAllAccidentReportForm,  getAllAccidentFollowUpForm,getAllIncidentFollowUpForm,getAllSMSDMapping} from '../api/FetchFuHongList';
export default function useFetchUserJob(spId: number,permissionList:any[], siteCollectionUrl:any) {
    const [result, setResult] = useState([]);

    const initial = async () => {

        //const serviceUserAccidentData = await getServiceUserAccidentBySPId(spId,permissionList);
        let allServiceUserAccident = await getAllServiceUserAccident();
        let allAccidentReportForm = await getAllAccidentReportForm();
        let allAccidentFollowUpForm = await getAllAccidentFollowUpForm();
        let allIncidentFollowUpForm = await getAllIncidentFollowUpForm();
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
                if (sa.ReporterId === spId) {
                    serviceUserAccidentData.push(sa);
                }
            } else {
                let admin = permissionList.filter(p => {return p == 'All'});
                if (admin.length > 0) {
                    //serviceUserAccidentData.push(sa);
                } else {
                    /*let permission = permissionList.filter(p => {return p == sa.ServiceUserUnit});
                    if (permission.length > 0) {
                        serviceUserAccidentData.push(sa);
                    } else */
                    
                }
                if (sa['CaseNumber'] == 'SUI-2223COATC009') {
                    debugger
                }
                if (sa['Stage'] == '1') {
                    if (sa.Status === "PENDING_SM_APPROVE" && sa['SMId'] == spId) {
                        serviceUserAccidentData.push(sa);
                    } else if (sa.Status === "PENDING_SPT_APPROVE" && (sa['SPTId'] == spId || sa['SDId'] == spId)) {
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
        const allOutsiderAccidentData = await getOutsiderAccidentBySPId(spId);
        let outsiderAccidentData = [];
        for (let oa of allOutsiderAccidentData) {
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
            if (oa.Status === "DRAFT") {
                if (oa.ReporterId === spId) {
                    serviceUserAccidentData.push(oa);
                }
            } else {
                let admin = permissionList.filter(p => {return p == 'All'});
                if (admin.length > 0) {
                    //serviceUserAccidentData.push(sa);
                } else {
                    /*let permission = permissionList.filter(p => {return p == oa.ServiceUserUnit});
                    if (permission.length > 0) {
                        serviceUserAccidentData.push(oa);
                    } else */
                       
                }
                if (oa['Stage'] == '1') {
                    if (oa.Status === "PENDING_SM_APPROVE" && oa['SMId'] == spId) {
                        outsiderAccidentData.push(oa);
                    } else if (oa.Status === "PENDING_SPT_APPROVE" && (oa['SPTId'] == spId || oa['SDId'] == spId)) {
                        outsiderAccidentData.push(oa);
                    }
                } else if (oa['Stage'] == '2') {
                    if (oa.Status === "PENDING_INVESTIGATE" && oa['InvestigatorId'] == spId) {
                        outsiderAccidentData.push(oa);
                    } else if (oa.Status === "PENDING_SPT_APPROVE" && getARF.length > 0 && (getARF[0]['SMId'] == spId || getARF[0]['SPTId'] == spId)) {
                        outsiderAccidentData.push(oa);
                    }  
                } else if (oa['Stage'] == '3') {
                    if (oa.Status === "PENDING_SM_FILL_IN" && getARF.length > 0 && getAFUF[getAFUF.length -1]['SMId'] == spId) {
                        outsiderAccidentData.push(oa);
                    } else if (oa.Status === "PENDING_SD_APPROVE" && getARF.length > 0 && (getAFUF[getAFUF.length -1]['SDId'] == spId || getAFUF[getAFUF.length -1]['SPTId'] == spId)) {
                        outsiderAccidentData.push(oa);
                    }
                } 
            }
        }
        const allOtherIncidentData = await getOtherIncidentReportBySPId(spId);
        let otherIncidentData = [];
        for (let oid of allOtherIncidentData) {
            let location = allSMSDMapping.filter(item => {return item.su_Eng_name_display == oid.ServiceUnit });
            let getIFF = allIncidentFollowUpForm.filter(item => {return item.CaseNumber == oid.CaseNumber && item.ParentFormId == oid.ID});
            if (oid.Status === "PENDING_SM_FILL_IN") {
                oid['StatusTC'] = '尚待服務經理填表';
            } else if (oid.Status === "PENDING_SM_APPROVE") {
                oid['StatusTC'] = '尚待服務經理批核';
            } else if (oid.Status === "PENDING_SD_APPROVE") {
                oid['StatusTC'] = '尚待服務總監批核';
            }
            if (oid['Stage'] == '1') {
                oid['Form'] = '其他事故呈報表';
                oid['CurrentSM'] = oid['SM'];
                oid['CurrentSD'] = oid['SD'];
            } else if (oid['Stage'] == '2') {
                oid['Form'] = '事故跟進/結束報告';
                oid['CurrentSM'] = getIFF.length > 0 ? getIFF[0]['SM'] : null;
                oid['CurrentSD'] = getIFF.length > 0 ? getIFF[0]['SD'] : null;

            }
            if (oid['Stage'] == '1') {
                if (oid.Status === "PENDING_SM_APPROVE" && oid['SMId'] == spId) {
                    otherIncidentData.push(oid);
                } else if (oid.Status === "PENDING_SD_APPROVE" && (oid['SDId'] == spId || oid['SDId'] == spId)) {
                    otherIncidentData.push(oid);
                }
            } else if (oid['Stage'] == '2') {
                if (oid.Status === "PENDING_SM_FILL_IN" && getIFF.length > 0 && getIFF[0]['SMId'] == spId) {
                    otherIncidentData.push(oid);
                }  else if (oid.Status === "PENDING_SD_APPROVE" && (oid['SDId'] == spId || oid['SDId'] == spId)) {
                    otherIncidentData.push(oid);
                } 
            }
            oid['ServiceLocationTC'] = location.length > 0 ? location[0].su_name_tc : "";
            
        }
        const allSpecialIncidentReportLicense = await getSpecialIncidentReportLicenseBySPId(spId);
        let specialIncidentReportLicense = [];
        for (let sirl of allSpecialIncidentReportLicense) {
            let location = allSMSDMapping.filter(item => {return item.su_Eng_name_display == sirl.ServiceUnit });
            let getIFF = allIncidentFollowUpForm.filter(item => {return item.CaseNumber == sirl.CaseNumber && item.ParentFormId == sirl.ID});
            sirl['ServiceUserNameCN'] = sirl['ResponsibleName']
            sirl['ServiceLocationTC'] = location.length > 0 ? location[0].su_name_tc : "";
            if (sirl.Status === "PENDING_SM_FILL_IN") {
                sirl['StatusTC'] = '尚待服務經理填表';
            } else if (sirl.Status === "PENDING_SM_APPROVE") {
                sirl['StatusTC'] = '尚待服務經理批核';
            } else if (sirl.Status === "PENDING_SD_APPROVE") {
                sirl['StatusTC'] = '尚待服務總監批核';
            }
            if (sirl['Stage'] == '1') {
                sirl['Form'] = '特別事故報告(牌照事務處)';
                sirl['CurrentSM'] = sirl['SM'];
                sirl['CurrentSD'] = sirl['SD'];
            } else if (sirl['Stage'] == '2') {
                sirl['Form'] = '事故跟進/結束報告';
                sirl['CurrentSM'] = getIFF.length > 0 ? getIFF[0]['SM'] : null;
                sirl['CurrentSD'] = getIFF.length > 0 ? getIFF[0]['SD'] : null;

            }
            if (sirl['Stage'] == '1') {
                if (sirl.Status === "PENDING_SM_APPROVE" && sirl['SMId'] == spId) {
                    specialIncidentReportLicense.push(sirl);
                } else if (sirl.Status === "PENDING_SD_APPROVE" && (sirl['SDId'] == spId || sirl['SDId'] == spId)) {
                    specialIncidentReportLicense.push(sirl);
                }
            } else if (sirl['Stage'] == '2') {
                if (sirl.Status === "PENDING_SM_FILL_IN" && getIFF.length > 0 && getIFF[0]['SMId'] == spId) {
                    specialIncidentReportLicense.push(sirl);
                }  else if (sirl.Status === "PENDING_SD_APPROVE" && (sirl['SDId'] == spId || sirl['SDId'] == spId)) {
                    specialIncidentReportLicense.push(sirl);
                } 
            }
            
        }
        const allSpecialIncidentReportAllowance = await getSpecialIncidentReportAllowanceBySPId(spId);
        let specialIncidentReportAllowance = [];
        for (let sira of allSpecialIncidentReportAllowance) {
            let location = allSMSDMapping.filter(item => {return item.su_Eng_name_display == sira.ServiceUnit });
            let getIFF = allIncidentFollowUpForm.filter(item => {return item.CaseNumber == sira.CaseNumber && item.ParentFormId == sira.ID});
            sira['ServiceLocationTC'] = location.length > 0 ? location[0].su_name_tc : "";
            if (sira.Status === "PENDING_SM_FILL_IN") {
                sira['StatusTC'] = '尚待服務經理填表';
            } else if (sira.Status === "PENDING_SM_APPROVE") {
                sira['StatusTC'] = '尚待服務經理批核';
            } else if (sira.Status === "PENDING_SD_APPROVE") {
                sira['StatusTC'] = '尚待服務總監批核';
            }
            if (sira['Stage'] == '1') {
                sira['Form'] = '特別事故報告(牌照事務處)';
                sira['CurrentSM'] = sira['SM'];
                sira['CurrentSD'] = sira['SD'];
            } else if (sira['Stage'] == '2') {
                sira['Form'] = '事故跟進/結束報告';
                sira['CurrentSM'] = getIFF.length > 0 ? getIFF[0]['SM'] : null;
                sira['CurrentSD'] = getIFF.length > 0 ? getIFF[0]['SD'] : null;

            }
            if (sira['Stage'] == '1') {
                if (sira.Status === "PENDING_SM_APPROVE" && sira['SMId'] == spId) {
                    specialIncidentReportAllowance.push(sira);
                } else if (sira.Status === "PENDING_SD_APPROVE" && (sira['SDId'] == spId || sira['SDId'] == spId)) {
                    specialIncidentReportAllowance.push(sira);
                }
            } else if (sira['Stage'] == '2') {
                if (sira.Status === "PENDING_SM_FILL_IN" && getIFF.length > 0 && getIFF[0]['SMId'] == spId) {
                    specialIncidentReportAllowance.push(sira);
                }  else if (sira.Status === "PENDING_SD_APPROVE" && (sira['SDId'] == spId || sira['SDId'] == spId)) {
                    specialIncidentReportAllowance.push(sira);
                } 
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
