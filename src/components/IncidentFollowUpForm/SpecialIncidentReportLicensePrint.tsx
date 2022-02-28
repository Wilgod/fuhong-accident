import * as React from 'react'
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { Role } from '../../utils/RoleParser';
import useUserInfoAD from '../../hooks/useUserInfoAD';
import useUserInfo from '../../hooks/useUserInfo';
import { IUser } from '../../interface/IUser';
import useSharePointGroup from '../../hooks/useSharePointGroup';
import styles from './SpecialIncidentReportLicensePrint.module.scss';
interface ISpecialIncidentReportLicensePrint {
    context: WebPartContext;
    formSubmittedHandler(): void;
    currentUserRole: Role;
    formData: any;
    formTwentySixData:any;
    formTwentySixDataSelected: any;
    siteCollectionUrl:String;
    index:number;
}

interface ISpecialIncidentReportLicenseStates {
    responsibleName: string;
    insuranceCaseNo: string;
    incidentTime:string;
    caseNumber:string;
    homesName: string;
    homesManagerName: string;
    homesManagerTel: string;
    unusalIncident: string;
    unusalIncideintGeneral: "";
    unusalIncideintIncident: "";
    police: boolean;
    policeReportNumber: string;
    policeDatetime: Date;
    policeInvestigate: boolean;
    policeInvestigateDate: Date;
    residentMissing: string;
    residentMissingReason: string;
    missingPoliceDate: Date;
    missingPoliceReportNo: string;
    found: boolean;
    foundDate: Date;
    notYetFoundDayCount: number;
    medicalRecords: string;
    ra_body: boolean;
    ra_mental: boolean;
    ra_negligent: boolean;
    ra_embezzleProperty: boolean;
    ra_abandoned: boolean;
    ra_sexualAssault: boolean;
    ra_other: boolean;
    ra_otherDescription: string;
    abuser: string;
    abuserDescription: string;
    referSocialWorker: boolean;
    referDate: Date;
    referServiceUnit: string;
    abuser_police: boolean;
    abuser_policeDate: Date;
    abuser_policeCaseNo: string;
    conflict: string;
    conflictDescription: string;
    conflict_policeDate: Date;
    conflict_policeCaseNo: string;
    medicalIncident: string;
    mi_description: string;
    otherIncident: string;
    other: boolean;
    otherDescription: string;
    residentName: string;
    residentAge: number;
    residentGender: string;
    residentRoomNo: string;
    reporterName:string;
    reporterJobTitle:string;
    reporterDate:Date;
    guardian: boolean;
    guardianName: string;
    guardianRelation: string;

    guardianDate: Date;
    guardianReason: string;
    guardianStaffName:string;
    guardianStaffJobTitle:string;
    affectedName: string;
    affectedIdCardNo: string;
    affectedGender: string
    affectedAge: number;
    affectedMedicalRecord: string;
    affectedDetail: string;
    affectedFollowUp: string;

}

export default function SpecialIncidentReportLicensePrint({ index, context, formSubmittedHandler, currentUserRole, formData, formTwentySixData, formTwentySixDataSelected,siteCollectionUrl}: ISpecialIncidentReportLicensePrint) {
    const CURRENT_USER: IUser = {
        email: context.pageContext.legacyPageContext.userEmail,
        name: context.pageContext.legacyPageContext.userDisplayName,
        id: context.pageContext.legacyPageContext.userId,
    }
    const [reporter, setReporter, reporterPickerInfo] = useUserInfoAD();
    const [userInfo, setCurrentUserEmail, spUserInfo] = useUserInfo(siteCollectionUrl);
    const [incidentTime, setIncidentTime] = useState(new Date());
    const [reportDate, setReportDate] = useState(new Date());
    const [notifyStaff, setNotifyStaff, notifyStaffPicker] = useUserInfoAD();
    const [spNotifyStaff, setNotifyStaffEmail] = useSharePointGroup();

    let followUpActions = null;
    let formTwentySixDataPrint = null;
    if (formTwentySixData != null) {
        formTwentySixDataPrint = formTwentySixData.filter(item => {return item.Id == formTwentySixDataSelected});
        if (Array.isArray(formTwentySixDataPrint) && formTwentySixDataPrint[0].FollowUpActions != null) {
            followUpActions = JSON.parse(formTwentySixDataPrint[0].FollowUpActions);
        }
    }

    const [form, setForm] = useState<ISpecialIncidentReportLicenseStates>({
        abuser: "",
        abuserDescription: "",
        abuser_police: undefined,
        abuser_policeCaseNo: "",
        abuser_policeDate: new Date(),
        affectedAge: 0,
        affectedDetail: "",
        affectedFollowUp: "",
        affectedGender: "",
        affectedIdCardNo: "",
        affectedMedicalRecord: "",
        affectedName: "",
        conflict: "",
        conflictDescription: "",
        conflict_policeCaseNo: "",
        conflict_policeDate: new Date(),
        caseNumber:"",
        found: undefined,
        foundDate: new Date(),
        notYetFoundDayCount: 0,
        medicalRecords: "",
        ra_body: false,
        ra_mental: false,
        ra_negligent: false,
        ra_embezzleProperty: false,
        ra_abandoned: false,
        ra_sexualAssault: false,
        ra_other: false,
        ra_otherDescription: "",
        guardian: undefined,
        guardianName: "",
        guardianRelation: "",
        guardianDate: new Date(),
        guardianReason: "",
        guardianStaffName: "",
        guardianStaffJobTitle:"",
        homesManagerName: "",
        homesName: "",
        homesManagerTel: "",
        insuranceCaseNo: "",
        incidentTime:"",
        medicalIncident: "",
        mi_description: "",
        missingPoliceDate: new Date(),
        missingPoliceReportNo: "",
        other: undefined,
        otherDescription: "",
        otherIncident: "",
        police: undefined,
        policeDatetime: new Date(),
        policeInvestigate: undefined,
        policeInvestigateDate: new Date(),
        policeReportNumber: "",
        referDate: new Date(),
        referServiceUnit: "",
        referSocialWorker: undefined,
        residentAge: 0,
        residentGender: "",
        residentMissing: "",
        residentMissingReason: "",
        residentName: "",
        residentRoomNo: "",
        responsibleName: "",
        reporterName:"",
        reporterDate: new Date(),
        reporterJobTitle:"",
        unusalIncideintGeneral: "",
        unusalIncideintIncident: "",
        unusalIncident: ""
    });

    useEffect(() => {
        if (formData) {
            loadData();
        } else {
            setReporter([{ secondaryText: CURRENT_USER.email, id: CURRENT_USER.id }]);
        }
    }, [formData]);

    const loadData = async () => {
        console.log(formData)
        if (formData) {

            setIncidentTime(new Date(formData.IncidentTime));
            /*setFormStatus(formData.Status);
            setFormStage(formData.Stage);

            setSmComment(formData.SMComment);
            if (formData.SMDate) {
                setSmDate(new Date(formData.SMDate));
            }

            setSdComment(formData.SDComment);
            if (formData.SDDate) {
                setSdDate(new Date(formData.SDDate));
            }*/

            if (formData.Author) {
                setReporter([{ secondaryText: formData.Author.EMail, id: formData.Author.Id }]);
            }

            /*if (formData.SM) {
                setSMEmail(formData.SM.EMail)
            }

            if (formData.SD) {
                setSDEmail(formData.SD.EMail)
            }

            if (formData.ServiceUnit) {
                setServiceUnit(formData.ServiceUnit);
            }*/

            setReportDate(new Date(formData.Created));
            if (formData.GuardianStaff) {
                setNotifyStaff([formData.GuardianStaff]);
                debugger
            }
            debugger
            setForm({
                ...form,
                abuser: formData.Abuser,
                abuserDescription: formData.AbuserDescription,
                abuser_police: formData.Abuser_Police,
                abuser_policeCaseNo: formData.Abuser_PoliceCaseNo,
                abuser_policeDate: formData.Abuser_PoliceDate ? new Date(formData.Abuser_PoliceDate) : new Date(),
                affectedAge: formData.AffectedAge,
                affectedDetail: formData.AffectedDetail,
                affectedFollowUp: formData.AffectedFollowUp,
                affectedGender: formData.AffectedGender,
                affectedIdCardNo: formData.AffectedIdCardNo,
                affectedMedicalRecord: formData.AffectedMedicalRecord,
                affectedName: formData.AffectedName,
                conflict: formData.Conflict,
                conflictDescription: formData.ConflictDescription,
                conflict_policeCaseNo: formData.Conflict_PoliceCaseNo,
                conflict_policeDate: formData.Conflict_PoliceDate ? new Date(formData.Conflict_PoliceDate) : new Date(),
                caseNumber:formData.CaseNumber,
                found: formData.Found,
                foundDate: formData.FoundDate ? new Date(formData.FoundDate) : new Date(),
                guardian: formData.Guardian,
                guardianName: formData.GuardianName,
                guardianRelation: formData.GuardianRelation,
                guardianDate: formData.GuarrdianDate ? new Date(formData.GuarrdianDate) : new Date(),
                guardianReason: formData.GuardianReason,
                insuranceCaseNo: formData.InsuranceCaseNo,
                incidentTime:formData.IncidentTime,
                homesManagerName: formData.HomesManagerName,
                homesManagerTel: formData.HomesManagerTel,
                homesName: formData.HomesName,
                medicalIncident: formData.MedicalIncident,
                medicalRecords: formData.MedicalRecords,
                mi_description: formData.MI_Description,
                missingPoliceDate: formData.MissingPoliceDate ? new Date(formData.MissingPoliceDate) : new Date(),
                missingPoliceReportNo: formData.MissingPoliceReportNo,
                notYetFoundDayCount: formData.NotYetFoundDayCount,
                other: formData.Other,
                otherDescription: formData.OtherDescription,
                otherIncident: formData.OtherIncident,
                police: formData.Police,
                policeDatetime: formData.PoliceDatetime ? new Date(formData.PoliceDatetime) : new Date(),
                policeInvestigate: formData.PoliceInvestigate,
                policeInvestigateDate: formData.PoliceInvestigateDate ? new Date(formData.PoliceInvestigateDate) : new Date(),
                policeReportNumber: formData.PoliceReportNumber,
                ra_abandoned: formData.RA_Abandoned,
                ra_body: formData.RA_Body,
                ra_embezzleProperty: formData.RA_EmbezzleProperty,
                ra_mental: formData.RA_Mental,
                ra_negligent: formData.RA_Negligent,
                ra_other: formData.RA_Other,
                ra_otherDescription: formData.RA_OtherDescription,
                ra_sexualAssault: formData.RA_SexualAssault,
                referDate: formData.ReferDate ? new Date(formData.ReferDate) : new Date(),
                referServiceUnit: formData.ReferServiceUnit,
                referSocialWorker: formData.ReferSocialWorker,
                residentAge: formData.ResidentAge,
                residentGender: formData.ResidentGender,
                residentMissing: formData.ResidentMissing,
                residentMissingReason: formData.ResidentMissingReason,
                residentName: formData.ResidentName,
                residentRoomNo: formData.ResidentRoomNo,
                responsibleName: formData.ResponsibleName,
                reporterDate:formData.Created,
                unusalIncideintGeneral: formData.UnusalIncideintGeneral,
                unusalIncideintIncident: formData.UnusalIncideintIncident,
                unusalIncident: formData.UnusalIncident
            })

        
        }
    }
    useEffect(() => {
        setCurrentUserEmail(CURRENT_USER.email);
    }, [])

    useEffect(() => {
        if (notifyStaff && notifyStaff.mail) {
            setNotifyStaffEmail(notifyStaff.mail)
        }
    }, [notifyStaff])

    useEffect(() => {
        if (spNotifyStaff) {
            setForm({ ...form, 
                guardianStaffName: spNotifyStaff.Title,
                guardianStaffJobTitle: spNotifyStaff.jobTitle
            });
        }
    }, [spNotifyStaff])

    useEffect(() => {
        if (reporter) {
            debugger
            setForm({ ...form, 
                reporterName: reporter.displayName,
                reporterJobTitle: reporter.jobTitle
            });
        }
    }, [reporter])

    console.log('index :', index);
    return (
        <>
            <style media="print">
				{`@page {
                    size: auto;
                    margin: 10 0;
                }`}
			</style>
            <div style={{color:'black'}}>
                {index == 0 &&
                    <div>
                        <div className="form-row mb-3">
                        <div className={`col-12 font-weight-bold ${styles.header}`}>
                            殘疾人士院舍特別事故報告
                        </div>
                        <div className={`col-12 ${styles.header}`}>
                        ［須在事件發生後的3個曆日（包括公眾假期）內提交］
                        </div>
                    </div>
                    <div className="form-row mb-3">
                        <div className={`col-12`}>
                            注意：請在合適方格內加上「」號，並連同附頁／載有相關資料的自訂報告一併呈交
                        </div>
                    </div>
                    <div className="form-row mb-3" style={{fontSize:'18px'}}>
                        <div className={`col-12`} style={{fontWeight:'bold'}}>
                        致：	社會福利署殘疾人士院舍牌照事務處
                        </div>
                        <div className={`col-12`} style={{paddingLeft:'40px', fontWeight:'bold'}}>
                        （傳真：2153 0071／查詢電話：2891 6379）
                        </div>
                        <div className={`col-12`} style={{paddingLeft:'40px'}}>
                        ［經辦人:<span className={styles.underline}>{form.responsibleName}</span>  （負責督察姓名）］
                        </div>
                        
                    </div>
                    <div className="form-row mb-3" style={{fontSize:'18px'}}>
                        <div className={`col-12`}>
                            <div className="form-row">
                                <div className={`col-2`}>
                                殘疾人士院舍名稱
                                </div>
                                <div className={`col ${styles.underlineDiv}`}>
                                {form.homesName}
                                </div>
                            </div>
                        </div>
                        <div className={`col-12`}>
                            <table>
                                <tr>
                                    <td style={{width:'150px'}}>
                                        殘疾人士院舍主管姓名 : 
                                    </td>
                                    <td style={{width:'250px'}}>
                                        <div className={`${styles.underlineDiv}`}>
                                        {form.homesManagerName}
                                        </div>
                                    </td>
                                    <td style={{width:'100px'}}>
                                        聯絡電話 : 
                                    </td>
                                    <td style={{width:'250px'}}>
                                        <div className={`${styles.underlineDiv}`}>
                                        {form.homesManagerTel}
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div className={`col-12`}>
                            <div className="form-row">
                            <div className={`col-2`}>
                                事故發生日期 : 
                                </div>
                                <div className={`col ${styles.underlineDiv}`}>
                                {new Date(form.incidentTime).getFullYear() + `-` +(`0`+(new Date(form.incidentTime).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(form.incidentTime).getDate()).slice(-2)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="form-row mb-3" style={{fontSize:'18px'}}>
                        <div className={`col-12`}>特別事故類別</div>
                    </div>
                    <div className={`form-row ${styles.box}`}>
                        <div className={`col-12`}>
                        (1)	住客不尋常死亡／事故導致住客嚴重受傷或死亡
                        </div>
                        <div className={`col-12`}>
                            <div className="form-row mb-3" style={{marginLeft:'30px'}}>
                                <div className={`col-12`}>
                                    {form.unusalIncident == "UNUSAL_INCIDENT_GENERAL" && <span>&#9745;</span>}
                                    {form.unusalIncident != "UNUSAL_INCIDENT_GENERAL" && <span>&#9744;</span>}
                                    在院舍內發生事故及送院後死亡
                                </div>
                                <div className={`col-12`}>
                                    {form.unusalIncident == "UNUSAL_INCIDENT_SUICIDE" && <span>&#9745;</span>}
                                    {form.unusalIncident != "UNUSAL_INCIDENT_SUICIDE" && <span>&#9744;</span>}
                                    在院舍內自殺及送院後死亡
                                </div>
                                <div className={`col-12`}>
                                    <table>
                                        <tr>
                                            <td style={{width:'280px'}}>
                                            {form.unusalIncident == "UNUSAL_INCIDENT_OTHER" && <span>&#9745;</span>}
                                            {form.unusalIncident != "UNUSAL_INCIDENT_OTHER" && <span>&#9744;</span>}
                                            其他不尋常死亡／事故，請說明 :
                                            </td>
                                            <td className={`${styles.underlineTable}`}>
                                            {form.unusalIncideintIncident != null ? form.unusalIncideintIncident : ''}
                                            </td>
                                        </tr>
                                    </table>
                                
                                    
                                </div>
                            </div>
                        </div>
                        <div className={`col-12`}>
                            (a) 
                            <span style={{marginLeft:'16px'}}>
                                {!form.abuser_police && <span>&#9745;</span>}
                                {form.abuser_police && <span>&#9744;</span>}
                                沒有 / 
                                {form.abuser_police && <span>&#9745;</span>}
                                {!form.abuser_police && <span>&#9744;</span>}
                                已報警求助
                            </span>
                        </div>
                        <div className={`col-12`}>
                            <table>
                                <tr>
                                    <td style={{width:'215px'}}>
                                        <span style={{marginLeft:'36px'}}>
                                        報警日期及報案編號 : 
                                        </span>
                                    </td>
                                    <td className={`${styles.underlineTable}`}>
                                    {form.policeReportNumber != null ? form.policeReportNumber : ''}
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div className={`col-12`}>
                            <table>
                                <tr>
                                    <td style={{width:'345px'}}>
                                        (b)
                                        <span style={{marginLeft:'16px'}}>
                                            如適用，警方到院舍調查日期及時間 :
                                        </span>
                                    </td>
                                    <td className={`${styles.underlineTable}`}>
                                    {form.policeDatetime != null && new Date(form.policeDatetime).getFullYear() + `-` +(`0`+(new Date(form.policeDatetime).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(form.policeDatetime).getDate()).slice(-2)}
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div className={`form-row ${styles.box}`} style={{borderTop:'unset'}}>
                        <div className={`col-12`}>
                        (2)	住客失蹤以致需要報警求助
                        </div>
                        <div className={`col-12`}>
                            <div className="form-row mb-3" style={{marginLeft:'30px'}}>
                                <div className={`col-12`}>
                                    {form.residentMissing == "RESIDENT_MISSING_INSIDE" && <span>&#9745;</span>}
                                    {form.residentMissing != "RESIDENT_MISSING_INSIDE" && <span>&#9744;</span>}
                                    住客擅自／在員工不知情下離開院舍
                                </div>
                                <div className={`col-12`}>
                                    {form.residentMissing == "RESIDENT_MISSING_OUTSIDE" && <span>&#9745;</span>}
                                    {form.residentMissing != "RESIDENT_MISSING_OUTSIDE" && <span>&#9744;</span>}
                                    院外活動期間失蹤
                                </div>
                                <div className={`col-12`} style={{padding:'0 40px'}}>
                                    {form.residentMissingReason == "RESIDENT_MISSING_REASON_VACATION" && <span>&#9745;</span>}
                                    {form.residentMissingReason != "RESIDENT_MISSING_REASON_VACATION" && <span>&#9744;</span>}
                                    回家度假期間  / &nbsp;&nbsp;
                                    {form.residentMissingReason == "RESIDENT_MISSING_REASON_VOLUNTARILY" && <span>&#9745;</span>}
                                    {form.residentMissingReason != "RESIDENT_MISSING_REASON_VOLUNTARILY" && <span>&#9744;</span>}
                                    自行外出活動  / &nbsp;&nbsp;
                                    {form.residentMissingReason == "RESIDENT_MISSING_REASON_HOME_OUT" && <span>&#9745;</span>}
                                    {form.residentMissingReason != "RESIDENT_MISSING_REASON_HOME_OUT" && <span>&#9744;</span>}
                                    院舍外出活動
                                </div>
                            </div>
                        </div>
                        <div className={`col-12`}>
                            <table>
                                <tr>
                                    <td style={{width:'215px'}}>
                                        <span style={{marginLeft:'36px'}}>
                                        報警日期及報案編號 : 
                                        </span>
                                    </td>
                                    <td className={`${styles.underlineTable}`}>
                                    {form.missingPoliceReportNo != null ? form.missingPoliceReportNo : ''}
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div className={`col-12`}>
                            <table>
                                <tr>
                                    <td style={{width:'215px'}}>
                                        (a)
                                        <span style={{marginLeft:'16px'}}>
                                            {!form.found && <span>&#9745;</span>}
                                            {form.found && <span>&#9744;</span>}
                                            已尋回（尋回日期
                                        </span>
                                    </td>
                                    <td className={`${styles.underlineTable}`}>
                                        {form.foundDate != null && new Date(form.foundDate).getFullYear() + `-` +(`0`+(new Date(form.foundDate).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(form.foundDate).getDate()).slice(-2)})
                                    </td>
                                </tr>
                            </table>
                            <table>
                                <tr>
                                    <td>
                                        <span style={{marginLeft:'36px'}}>
                                            {form.found && <span>&#9745;</span>}
                                            {!form.found && <span>&#9744;</span>}
                                            仍未尋回（由失蹤日計起至呈報日，已失蹤 <span className={`${styles.underline}`}>{form.notYetFoundDayCount != null ? form.notYetFoundDayCount : ''}</span>日）
                                        </span>
                                    </td>
                                </tr>
                            </table>
                            <table>
                                <tr>
                                    <td style={{width:'250px'}}>
                                        (b)
                                        <span style={{marginLeft:'16px'}}>
                                            {!form.found && <span>&#9745;</span>}
                                            {form.found && <span>&#9744;</span>}
                                            失蹤住客病歷（請註明 : 
                                        </span>
                                    </td>
                                    <td className={`${styles.underlineTable}`}>
                                        {form.medicalRecords != null ? form.medicalRecords : ''})
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div className={`form-row ${styles.box}`} style={{borderTop:'unset'}}>
                        <div className={`col-12`}>
                        (3)	院舍內證實／懷疑有住客受虐待／被侵犯私隱
                        </div>
                        <div className={`col-12`}>
                            <div className="form-row mb-3" style={{marginLeft:'30px'}}>
                                <div className={`col-12`}>
                                    {form.ra_body && <span>&#9745;</span>}
                                    {!form.ra_body && <span>&#9744;</span>}
                                    身體虐待 &nbsp;&nbsp;
                                    {form.ra_mental && <span>&#9745;</span>}
                                    {!form.ra_mental && <span>&#9744;</span>}
                                    精神虐待 &nbsp;&nbsp;
                                    {form.ra_negligent && <span>&#9745;</span>}
                                    {!form.ra_negligent && <span>&#9744;</span>}
                                    疏忽照顧 &nbsp;&nbsp;
                                </div>
                                <div className={`col-12`}>
                                    {form.ra_embezzleProperty && <span>&#9745;</span>}
                                    {!form.ra_embezzleProperty && <span>&#9744;</span>}
                                    侵吞財產 &nbsp;&nbsp;
                                    {form.ra_abandoned && <span>&#9745;</span>}
                                    {!form.ra_abandoned && <span>&#9744;</span>}
                                    遺棄 &nbsp;&nbsp;
                                    {form.ra_sexualAssault && <span>&#9745;</span>}
                                    {!form.ra_sexualAssault && <span>&#9744;</span>}
                                    非禮／性侵犯 &nbsp;&nbsp;
                                </div>
                                <div className={`col-12`}>
                                    <table>
                                        <tr>
                                            <td style={{width:'145px'}}>
                                                <span>
                                                {form.ra_other && <span>&#9745;</span>}
                                                {!form.ra_other && <span>&#9744;</span>}
                                                其他（請註明 : 
                                                </span>
                                            </td>
                                            <td className={`${styles.underlineTable}`}>
                                            {form.ra_otherDescription != null ? form.ra_otherDescription : ''})
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className={`col-12`}>
                            <table>
                                <tr>
                                    <td style={{width:'215px'}}>
                                        (a)
                                        <span style={{marginLeft:'16px'}}>
                                            施虐者／懷疑施虐者的身份
                                        </span>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div className={`col-12`}  style={{marginLeft:'36px'}}>
                            {form.abuser == "ABUSER_STAFF" && <span>&#9745;</span>}
                            {form.abuser != "ABUSER_STAFF" && <span>&#9744;</span>}
                            員工 &nbsp;&nbsp;
                            {form.abuser == "ABUSER_TENANT" && <span>&#9745;</span>}
                            {form.abuser != "ABUSER_TENANT" && <span>&#9744;</span>}
                            住客 &nbsp;&nbsp;
                            {form.abuser == "ABUSER_GUEST" && <span>&#9745;</span>}
                            {form.abuser != "ABUSER_GUEST" && <span>&#9744;</span>}
                            訪客 &nbsp;&nbsp;
                        </div>
                        <div className={`col-12`} >
                            <table >
                                <tr>
                                    <td style={{width:'180px'}}>
                                        <span style={{marginLeft:'36px'}}>
                                        {form.abuser == "ABUSER_OTHER" && <span>&#9745;</span>}
                                        {form.abuser != "ABUSER_OTHER" && <span>&#9744;</span>}
                                        其他（請註明 : 
                                        </span>
                                    </td>
                                    <td className={`${styles.underlineTable}`}>
                                    {form.abuserDescription != null ? form.abuserDescription : ''})
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div className={`col-12`}>
                            <table>
                                <tr>
                                    <td style={{width:'215px'}}>
                                        (b)
                                        <span style={{marginLeft:'16px'}}>
                                            {!form.referSocialWorker && <span>&#9745;</span>}
                                            {form.referSocialWorker && <span>&#9744;</span>}
                                            沒有 / &nbsp;&nbsp;
                                            {form.referSocialWorker && <span>&#9745;</span>}
                                            {!form.referSocialWorker && <span>&#9744;</span>}
                                            已轉介社工 &nbsp;&nbsp;
                                        </span>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div className={`col-12`}>
                            <table>
                                <tr>
                                    <td style={{width:'215px'}}>
                                        <span style={{marginLeft:'36px'}}>
                                        轉介日期及服務單位 : 
                                        </span>
                                    </td>
                                    <td className={`${styles.underlineTable}`}>
                                    {form.referServiceUnit != null ? form.referServiceUnit : ''}
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div className={`col-12`}>
                            <table>
                                <tr>
                                    <td style={{width:'215px'}}>
                                        (c)
                                        <span style={{marginLeft:'16px'}}>
                                            {!form.abuser_police && <span>&#9745;</span>}
                                            {form.abuser_police && <span>&#9744;</span>}
                                            沒有 / &nbsp;&nbsp;
                                            {form.abuser_police && <span>&#9745;</span>}
                                            {!form.abuser_police && <span>&#9744;</span>}
                                            已報警求助 &nbsp;&nbsp;
                                        </span>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div className={`col-12`}>
                            <table>
                                <tr>
                                    <td style={{width:'215px'}}>
                                        <span style={{marginLeft:'36px'}}>
                                        報警日期及報案編號 : 
                                        </span>
                                    </td>
                                    <td className={`${styles.underlineTable}`}>
                                    {form.abuser_policeCaseNo != null ? form.abuser_policeCaseNo : ''}
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div className={`${styles.pagebreak}`} ></div>
                    <div className={`form-row ${styles.box}`} style={{marginTop:'20px'}}>
                        <div className={`col-12`}>
                        (4)	院舍內有爭執事件以致需要報警求助
                        </div>
                        <div className={`col-12`}  style={{marginLeft:'36px'}}>
                            {form.conflict == "DISPUTE_POLICE_TENANT_AND_TENANT" && <span>&#9745;</span>}
                            {form.conflict != "DISPUTE_POLICE_TENANT_AND_TENANT" && <span>&#9744;</span>}
                            住客與住客 &nbsp;&nbsp;
                            {form.conflict == "DISPUTE_POLICE_TENANT_AND_STAFF" && <span>&#9745;</span>}
                            {form.conflict != "DISPUTE_POLICE_TENANT_AND_STAFF" && <span>&#9744;</span>}
                            住客與員工 &nbsp;&nbsp;
                            {form.conflict == "DISPUTE_POLICE_TENANT_AND_GUEST" && <span>&#9745;</span>}
                            {form.conflict != "DISPUTE_POLICE_TENANT_AND_GUEST" && <span>&#9744;</span>}
                            住客與訪客 &nbsp;&nbsp;
                            {form.conflict == "DISPUTE_POLICE_STAFF_AND_STAFF" && <span>&#9745;</span>}
                            {form.conflict != "DISPUTE_POLICE_STAFF_AND_STAFF" && <span>&#9744;</span>}
                            員工與員工 &nbsp;&nbsp;
                        </div>
                        <div className={`col-12`}  style={{marginLeft:'36px'}}>
                            {form.conflict == "DISPUTE_POLICE_STAFF_AND_GUEST" && <span>&#9745;</span>}
                            {form.conflict != "DISPUTE_POLICE_STAFF_AND_GUEST" && <span>&#9744;</span>}
                            員工與訪客 &nbsp;&nbsp;
                            {form.conflict == "DISPUTE_POLICE_GUEST_AND_GUEST" && <span>&#9745;</span>}
                            {form.conflict != "DISPUTE_POLICE_GUEST_AND_GUEST" && <span>&#9744;</span>}
                            訪客與訪客 &nbsp;&nbsp;
                            {form.conflict == "DISPUTE_POLICE_OTHER" && <span>&#9745;</span>}
                            {form.conflict != "DISPUTE_POLICE_OTHER" && <span>&#9744;</span>}
                            其他（請註明 : <span className={`${styles.underline}`}>{form.conflictDescription != null ? form.conflictDescription : ''}</span>)

                        </div>
                        <div className={`col-12`}>
                            <table>
                                <tr>
                                    <td style={{width:'215px'}}>
                                        <span style={{marginLeft:'36px'}}>
                                        報警日期及報案編號 : 
                                        </span>
                                    </td>
                                    <td className={`${styles.underlineTable}`}>
                                    {form.conflict_policeCaseNo != null ? form.conflict_policeCaseNo : ''}
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div className={`form-row ${styles.box}`} style={{borderTop:'unset'}}>
                        <div className={`col-12`}>
                        (5)	嚴重醫療／藥物事故（須同時提交「藥物風險管理報告」）
                        </div>
                        <div className={`col-12`}>
                            <div className="form-row mb-3" style={{marginLeft:'30px'}}>
                                <div className={`col-12`}>
                                    {form.medicalIncident == "SERIOUS_MEDICAL_INCIDENT_MISTAKE" && <span>&#9745;</span>}
                                    {form.medicalIncident != "SERIOUS_MEDICAL_INCIDENT_MISTAKE" && <span>&#9744;</span>}
                                    住客誤服藥物引致入院接受檢查或治療
                                </div>
                                <div className={`col-12`}>
                                    {form.medicalIncident == "SERIOUS_MEDICAL_INCIDENT_OVER_OR_MISSED" && <span>&#9745;</span>}
                                    {form.medicalIncident != "SERIOUS_MEDICAL_INCIDENT_OVER_OR_MISSED" && <span>&#9744;</span>}
                                    住客漏服或多服藥物引致入院接受檢查或治療
                                </div>
                                <div className={`col-12`}>
                                    {form.medicalIncident == "SERIOUS_MEDICAL_INCIDENT_COUNTER_DRUG" && <span>&#9745;</span>}
                                    {form.medicalIncident != "SERIOUS_MEDICAL_INCIDENT_COUNTER_DRUG" && <span>&#9744;</span>}
                                    住客服用成藥或非處方藥物引致入院接受檢查或治療
                                </div>
                                <div className={`col-12`}>
                                    {form.medicalIncident == "SERIOUS_MEDICAL_INCIDENT_OTHER" && <span>&#9745;</span>}
                                    {form.medicalIncident != "SERIOUS_MEDICAL_INCIDENT_OTHER" && <span>&#9744;</span>}
                                    其他（請註明 : <span className={`${styles.underline}`}>{form.mi_description != null ? form.mi_description : ''}</span>)
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`form-row ${styles.box}`} style={{borderTop:'unset'}}>
                        <div className={`col-12`}>
                        (6)	其他重大特別事故以致影響院舍日常運作
                        </div>
                        <div className={`col-12`}  style={{marginLeft:'36px'}}>
                            {form.otherIncident == "OTHER_INCIDENT_POWER_SUPPLY" && <span>&#9745;</span>}
                            {form.otherIncident != "OTHER_INCIDENT_POWER_SUPPLY" && <span>&#9744;</span>}
                            停止電力供應 &nbsp;&nbsp;
                            {form.otherIncident == "OTHER_INCIDENT_BUILDING" && <span>&#9745;</span>}
                            {form.otherIncident != "OTHER_INCIDENT_BUILDING" && <span>&#9744;</span>}
                            樓宇破損或結構問題 &nbsp;&nbsp;
                            {form.otherIncident == "OTHER_INCIDENT_FIRE" && <span>&#9745;</span>}
                            {form.otherIncident != "OTHER_INCIDENT_FIRE" && <span>&#9744;</span>}
                            火警 &nbsp;&nbsp;
                        </div>
                        <div className={`col-12`}  style={{marginLeft:'36px'}}>
                            {form.otherIncident == "OTHER_INCIDENT_WATER_SUPPLY" && <span>&#9745;</span>}
                            {form.otherIncident != "OTHER_INCIDENT_WATER_SUPPLY" && <span>&#9744;</span>}
                            停止食水供應 &nbsp;&nbsp;
                            {form.otherIncident == "OTHER_INCIDENT_OTHER" && <span>&#9745;</span>}
                            {form.otherIncident != "OTHER_INCIDENT_OTHER" && <span>&#9744;</span>}
                            水浸／山泥傾瀉／其他天災意外 &nbsp;&nbsp;
                        </div>
                    </div>
                    <div className={`form-row ${styles.box}`} style={{borderTop:'unset'}}>
                        <div className={`col-12`}>
                        (7)	其他
                        </div>
                        <div className={`col-12`}>
                            <table>
                                <tr>
                                    <td style={{width:'180px'}}>
                                        <span style={{marginLeft:'36px'}}>
                                        {form.other && <span>&#9745;</span>}
                                        {!form.other && <span>&#9744;</span>}
                                        其他（請註明 : 
                                        </span>
                                    </td>
                                    <td className={`${styles.underlineTable}`}>
                                    {form.otherDescription != null ? form.otherDescription : ''})
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div className="form-row mb-3" style={{fontSize:'18px'}}>
                        <div className={`col-12`}>住客及家屬情況</div>
                    </div>
                    <div className={`form-row ${styles.box}`}>
                        <div className={`col-12`}>
                            <table>
                                <tr>
                                    <td>
                                        住客姓名
                                    </td>
                                    <td className={`${styles.underlineTable}`}  style={{width:'100px'}}>
                                    {form.residentName != null ? form.residentName : ''}
                                    </td>
                                    <td>
                                    年齡
                                    </td>
                                    <td className={`${styles.underlineTable}`}  style={{width:'100px'}}>
                                    {form.residentGender != null ? form.residentGender : ''}
                                    </td>
                                    <td>
                                    性別
                                    </td>
                                    <td className={`${styles.underlineTable}`}  style={{width:'100px'}}>
                                    {form.residentAge != null ? form.residentAge : ''}
                                    </td>
                                    <td>
                                    房及／或床號
                                    </td>
                                    <td className={`${styles.underlineTable}`}  style={{width:'100px'}}>
                                    {form.residentRoomNo != null ? form.residentRoomNo : ''}
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div className={`col-12`}>
                            <div className="form-row mb-3">
                                <div className={`col-12`}>
                                    {form.guardian && <span>&#9745;</span>}
                                    {!form.guardian && <span>&#9744;</span>}
                                    已通知住客監護人／保證人／家人／親屬
                                </div>
                                <div className={`col-12`}>
                                    <table>
                                        <tr>
                                            <td>
                                            姓名
                                            </td>
                                            <td className={`${styles.underlineTable}`}>
                                            {form.guardianName != null ? form.guardianName : ''})
                                            </td>
                                            <td>
                                            及關係
                                            </td>
                                            <td className={`${styles.underlineTable}`}>
                                            {form.guardianRelation != null ? form.guardianRelation : ''})
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                <div className={`col-12`}>
                                    <table>
                                        <tr>
                                            <td>
                                            日期及時間
                                            </td>
                                            <td className={`${styles.underlineTable}`}>
                                            {form.guardianDate != null ? new Date(form.guardianDate).getFullYear() + `-` +(`0`+(new Date(form.guardianDate).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(form.guardianDate).getDate()).slice(-2) : ''})
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                <div className={`col-12`}>
                                    <table>
                                        <tr>
                                            <td>
                                            負責通知的員工姓名
                                            </td>
                                            <td className={`${styles.underlineTable}`}>
                                            {form.guardianStaffName != null ?form.guardianStaffName : ''})
                                            </td>
                                            <td>
                                            及職位
                                            </td>
                                            <td className={`${styles.underlineTable}`}>
                                            {form.guardianStaffJobTitle != null ?form.guardianStaffJobTitle : ''})
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                <div className={`col-12`}>
                                    {!form.guardian && <span>&#9745;</span>}
                                    {form.guardian && <span>&#9744;</span>}
                                    沒有通知住客監護人／保證人／家人／親屬
                                </div>
                                <div className={`col-12`}>
                                    <table>
                                        <tr>
                                            <td>
                                            原因
                                            </td>
                                            <td className={`${styles.underlineTable}`}>
                                            {form.guardianReason != null ?form.guardianReason : ''})
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-row mb-3" style={{fontSize:'18px', marginTop:'30px'}}>
                        <div className={`col-12`}>
                            <table>
                                <tr>
                                    <td style={{width:'100px'}}>
                                    填報人簽署 : 
                                    </td>
                                    <td style={{width:'300px'}}>
                                        <div className={`${styles.underlineDiv}`}>

                                        </div>
                                    </td>
                                    <td style={{width:'100px'}}>
                                    填報人職位 : 
                                    </td>
                                    <td style={{width:'300px'}}>
                                        <div className={`${styles.underlineDiv}`}>
                                        {form.reporterJobTitle}
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{width:'100px'}}>
                                    填報人姓名 : 
                                    </td>
                                    <td style={{width:'300px'}}>
                                        <div className={`${styles.underlineDiv}`}>
                                        {form.reporterName}
                                        </div>
                                    </td>
                                    <td style={{width:'100px'}}>
                                    填報日期 : 
                                    </td>
                                    <td style={{width:'300px'}}>
                                        <div className={`${styles.underlineDiv}`}>
                                        {form.reporterDate != null && new Date(form.reporterDate).getFullYear() + `-` +(`0`+(new Date(form.reporterDate).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(form.reporterDate).getDate()).slice(-2)}
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div className={`${styles.pagebreak}`} ></div>
                    <div className="form-row mb-3">
                        <div className={`col-12 font-weight-bold ${styles.header}`}>
                        殘疾人士院舍特別事故報告（附頁）
                        </div>
                        <div className={`col-12 ${styles.header}`}>
                        （此附頁／載有相關資料的自訂報告須連同首兩頁的表格一併呈交）
                        </div>
                    </div>
                    <div className={`form-row mb-3 ${styles.box}`} style={{fontSize:'18px'}}>
                        <div className={`col-12`}>
                            <div className="form-row">
                                <div className={`col-2`}>
                                殘疾人士院舍名稱
                                </div>
                                <div className={`col ${styles.underlineDiv}`}>
                                {form.homesName}
                                </div>
                            </div>
                        </div>
                        <div className={`col-12`}>
                            <table>
                                <tr>
                                    <td style={{width:'130px'}}>
                                    事故發生日期 : 
                                    </td>
                                    <td style={{width:'250px'}}>
                                        <div className={`${styles.underlineDiv}`}>
                                        {new Date(form.incidentTime).getFullYear() + `-` +(`0`+(new Date(form.incidentTime).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(form.incidentTime).getDate()).slice(-2)}
                                        </div>
                                    </td>
                                    <td style={{width:'130px'}}>
                                    事故發生時間 : 
                                    </td>
                                    <td style={{width:'250px'}}>
                                        <div className={`${styles.underlineDiv}`}>
                                        {new Date(form.incidentTime).getHours() + `-` +(`0`+new Date(form.incidentTime).getMinutes()).slice(-2)}
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{width:'130px'}}>
                                    受影響住客姓名 : 
                                    </td>
                                    <td style={{width:'250px'}}>
                                        <div className={`${styles.underlineDiv}`}>
                                        {form.affectedName}
                                        </div>
                                    </td>
                                    <td style={{width:'130px'}}>
                                    身份證號碼 : 
                                    </td>
                                    <td style={{width:'250px'}}>
                                        <div className={`${styles.underlineDiv}`}>
                                        {form.affectedIdCardNo}
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div className={`col-12`}>
                            <div className="form-row">
                                <div className={`col-2`}>
                                住客病歷 : 
                                </div>
                                <div className={`col ${styles.underlineDiv}`}>
                                {form.affectedMedicalRecord}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-row" style={{fontSize:'18px'}}>
                        <div className={`col-12`}>特別事故詳情／發生經過</div>
                    </div>
                    <div className={`form-row mb-3 ${styles.box}`} style={{fontSize:'18px'}}>
                        <div className={`col-12`}>
                            {form.affectedDetail != null && form.affectedDetail}
                        </div>
                    </div>

                    <div className="form-row" style={{fontSize:'18px'}}>
                        <div className={`col-12`}>院舍跟進行動／預防事故再次發生的建議或措施</div>
                    </div>
                    <div className={`form-row mb-3 ${styles.box}`} style={{fontSize:'18px'}}>
                        <div className={`col-12`}>
                            {form.affectedFollowUp != null && form.affectedFollowUp}
                        </div>
                    </div>
                    <div className="form-row mb-3" style={{fontSize:'18px', marginTop:'30px'}}>
                        <div className={`col-12`}>
                            <table>
                                <tr>
                                    <td style={{width:'100px'}}>
                                    填報人簽署 : 
                                    </td>
                                    <td style={{width:'300px'}}>
                                        <div className={`${styles.underlineDiv}`}>

                                        </div>
                                    </td>
                                    <td style={{width:'100px'}}>
                                    填報人職位 : 
                                    </td>
                                    <td style={{width:'300px'}}>
                                        <div className={`${styles.underlineDiv}`}>
                                        {form.reporterJobTitle}
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{width:'100px'}}>
                                    填報人姓名 : 
                                    </td>
                                    <td style={{width:'300px'}}>
                                        <div className={`${styles.underlineDiv}`}>
                                        {form.reporterName}
                                        </div>
                                    </td>
                                    <td style={{width:'100px'}}>
                                    填報日期 : 
                                    </td>
                                    <td style={{width:'300px'}}>
                                        <div className={`${styles.underlineDiv}`}>
                                        {form.reporterDate != null && new Date(form.reporterDate).getFullYear() + `-` +(`0`+(new Date(form.reporterDate).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(form.reporterDate).getDate()).slice(-2)}
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>

                    </div>
                }
                {index == 1 &&
                <div>
                    <div className="form-row mb-3">
                        <div style={{position:'absolute', width:'160px'}}>
                            <img src={require('./image/fuhongLogo.png')} style={{ width: '100%' }} />
                        </div>
                        <div className={`col-12 font-weight-bold`} style={{textAlign:'right', fontSize:'15px'}}>
                            保險公司備案編號: {form.insuranceCaseNo != null ? <span style={{borderBottom:'1px solid'}}>{form.insuranceCaseNo}</span> : '____________'}
                        </div>
                        <div className={`col-12 font-weight-bold ${styles.header}`}>
                            事故跟進 / 結束報告
                        </div>
                    </div>
                    <div className="form-row mb-3" style={{fontSize:'18px'}}>
                        <div className={`col-12`}>
                            事故性質&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <span>&#9745;</span>
                            特別事故 (牌照事務處)&nbsp;&nbsp;&nbsp;&nbsp;
                            <span>&#9744;</span>
                            特別事故 (津貼科)&nbsp;&nbsp;&nbsp;&nbsp;
                            <span>&#9744;</span>
                            其他事故
                        </div>
                        <div className={`col-12`}>
                            <table>
                                <tr>
                                    <td>單位名稱</td>
                                    <td style={{borderBottom:'1px solid'}}>{form.homesName}</td>
                                </tr>
                                <tr>
                                    <td>事故發生日期及時間</td>
                                    <td style={{borderBottom:'1px solid'}}>{new Date(form.incidentTime).getFullYear() + `-` +(`0`+(new Date(form.incidentTime).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(form.incidentTime).getDate()).slice(-2) + ` `+ new Date(form.incidentTime).getHours() + `-` +(`0`+new Date(form.incidentTime).getMinutes()).slice(-2)}
                                    </td>
                                </tr>
                                <tr>
                                    <td>檔案編號</td>
                                    <td style={{borderBottom:'1px solid'}}>{form.caseNumber}</td>
                                </tr>
                            </table>
                            
                            
                        </div>
                    </div>
                    <div className="form-row mb-3" style={{fontSize:'18px'}}>
                        <div className={`col-12 mb-2 ${styles.tableBorder}`}>
                            <table >
                                <tr>
                                    <td colSpan={3} style={{textAlign:'center'}}>事故跟進行動表</td>
                                </tr>
                                <tr>
                                    <td>事故報告的跟進措施</td>
                                    <td>執行時段</td>
                                    <td>備註</td>
                                </tr>
                                {followUpActions != null && followUpActions.map(function(item, i){
                                    return (<tr>
                                    <td>{item.action}</td>
                                    <td>{new Date(item.date).getFullYear() + `-` +(`0`+(new Date(item.date).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(item.date).getDate()).slice(-2)}</td>
                                    <td>{item.remark}</td>
                                    </tr>)
                                    })
                                }
                            </table>
                        </div>
                    </div>
                    <div className="form-row mb-3" style={{fontSize:'18px'}}>
                        <div className={`col-12`}>
                            {formTwentySixDataPrint != null && formTwentySixDataPrint[0].IncidentFollowUpContinue && <span>&#9745;</span>}
                            {formTwentySixDataPrint != null && !formTwentySixDataPrint[0].IncidentFollowUpContinue && <span>&#9744;</span>}
                            事故跟進繼續 &nbsp;&nbsp;
                            {formTwentySixDataPrint != null && !formTwentySixDataPrint[0].IncidentFollowUpContinue && <span>&#9745;</span>}
                            {formTwentySixDataPrint != null && formTwentySixDataPrint[0].IncidentFollowUpContinue && <span>&#9744;</span>}
                            事故跟進結束
                        </div>
                    </div>
                    <div className="form-row" style={{fontSize:'18px'}}>
                        <div className={`col-12`}>
                            <table style={{width:'870px',margin:'40px 0 20px'}}>
                                <tr>
                                    <td  style={{width:'250px'}}>
                                    高級服務經理/服務經理姓名
                                    </td>
                                    <td style={{width:'200px',borderBottom:'1px solid'}}>
                                    {formTwentySixDataPrint != null && formTwentySixDataPrint[0].SM.Title}
                                    </td>
                                    <td  style={{width:'200px'}}>
                                    日期
                                    </td>
                                    <td style={{width:'200px',borderBottom:'1px solid'}}>
                                    {formTwentySixDataPrint != null && new Date(formTwentySixDataPrint[0].SMDate).getFullYear() + `-` +(`0`+(new Date(formTwentySixDataPrint[0].SMDate).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(formTwentySixDataPrint[0].SMDate).getDate()).slice(-2)}
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div className={`col-12`}>
                            評語
                        </div>
                        <div className={`col-12`}>
                            <table>
                                <tr>
                                    <td style={{borderBottom:'1px solid'}}>
                                    {formTwentySixDataPrint != null && formTwentySixDataPrint[0].SMComment != null ? formTwentySixDataPrint[0].SMComment : ''}
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div className={`col-12`}>
                            <table style={{width:'870px',margin:'40px 0 20px'}}>
                                <tr>
                                    <td  style={{width:'250px'}}>
                                    服務總監姓名
                                    </td>
                                    <td style={{width:'200px',borderBottom:'1px solid'}}>
                                    {formTwentySixDataPrint != null && formTwentySixDataPrint[0].SD.Title}
                                    </td>
                                    <td  style={{width:'200px'}}>
                                    日期
                                    </td>
                                    <td style={{width:'200px',borderBottom:'1px solid'}}>
                                    {formTwentySixDataPrint != null && new Date(formTwentySixDataPrint[0].SDDate).getFullYear() + `-` +(`0`+(new Date(formTwentySixDataPrint[0].SDDate).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(formTwentySixDataPrint[0].SDDate).getDate()).slice(-2)}
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
                }
            </div>
        </>
    );
}