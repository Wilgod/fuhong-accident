import { useState, useEffect } from "react";
import { getOtherIncidentReportBySPId, getOutsiderAccidentBySPId, getServiceUserAccidentBySPId, getSpecialIncidentReportAllowanceBySPId, getSpecialIncidentReportLicenseBySPId } from "../api/FetchFuHongList";
import {getAllServiceUserAccident, getAllAccidentReportForm,  getAllAccidentFollowUpForm} from '../api/FetchFuHongList';

export default function useFetchUserJob(spId: number,permissionList:any[]) {
    const [result, setResult] = useState([]);

    const initial = async () => {

        //const serviceUserAccidentData = await getServiceUserAccidentBySPId(spId,permissionList);
        let allServiceUserAccident = await getAllServiceUserAccident();
        let allAccidentReportForm = await getAllAccidentReportForm();
        let allAccidentFollowUpForm = await getAllAccidentFollowUpForm();
        let serviceUserAccidentData = [];
        for (let sa of allServiceUserAccident) {
            let getARF = allAccidentReportForm.filter(item => {return item.CaseNumber == sa.CaseNumber && item.ParentFormId == sa.ID});
            let getAFUF = allAccidentFollowUpForm.filter(item => {return item.CaseNumber == sa.CaseNumber && item.ParentFormId == sa.ID});
            sa['AccidentReportForm'] = getARF;
            sa['AccidentFollowUpForm'] = getAFUF;
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
                sa['Form'] = '意外跟進/結束表(三)';
                sa['CurrentSM'] = getAFUF.length > 0 ? getAFUF[getAFUF.length -1]['SM'] : null;
                sa['CurrentSD'] = getAFUF.length > 0 ? getAFUF[getAFUF.length -1]['SD'] : null;
                sa['CurrentSPT'] = getAFUF.length > 0 ? getAFUF[getAFUF.length -1]['SPT'] : null;
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
            oa['AccidentReportForm'] = getARF;
            oa['AccidentFollowUpForm'] = getAFUF;
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
                oa['Form'] = '意外跟進/結束表(三)';
                oa['CurrentSM'] = getAFUF.length > 0 ? getAFUF[getAFUF.length -1]['SM'] : null;
                oa['CurrentSD'] = getAFUF.length > 0 ? getAFUF[getAFUF.length -1]['SD'] : null;
                oa['CurrentSPT'] = getAFUF.length > 0 ? getAFUF[getAFUF.length -1]['SPT'] : null;
            }
            oa['ServiceUserNameCN'] = oa['ServiceUserNameTC']
        }
        const otherIncidentData = await getOtherIncidentReportBySPId(spId);
        const specialIncidentReportLicense = await getSpecialIncidentReportLicenseBySPId(spId);
        for (let sirl of specialIncidentReportLicense) {
            sirl['ServiceUserNameCN'] = sirl['ResponsibleName']
            
        }
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
