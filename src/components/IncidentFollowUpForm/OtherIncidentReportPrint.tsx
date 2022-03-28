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
import { getUserInfoByEmailInUserInfoAD } from '../../api/FetchUser';
interface IOtherIncidentReportPrint {
    context: WebPartContext;
    formSubmittedHandler(): void;
    currentUserRole: Role;
    formData: any;
    formTwentySixData:any;
    formTwentySixDataSelected: any;
    siteCollectionUrl:string;
    index:number;
}

interface IOtherIncidentReportPrintStates {
    toDepartment:string;
    responsibleName: string;
    insuranceCaseNo: string;
    incidentTime:string;
    incidentLocation:string;
    incidentCategory:string;
    absuseDetailsStatus:string;
    absuseDetailsPerson:string;
    abusive_body: boolean,
    abusive_mental: boolean,
    abusive_negligent: boolean,
    abusive_sexual: boolean,
    abusive_other:boolean,
    abusiveDescription:string,
    mediaReports:boolean,
    incidentDescription:string,
    serviceLocation:string,
    serviceUserGenderOne:string,
    serviceUserGenderTwo:string,
    serviceUserGenderThree:string,
    serviceUserAgeOne:number,
    serviceUserAgeTwo:number,
    serviceUserAgeThree:number,
    staffGenderOne:string,
    staffGenderTwo:string,
    staffGenderThree:string,
    staffPositionOne:string,
    staffPositionTwo:string,
    staffPositionThree:string,
    caseNumber:string;
    orgName: string;
    orgSUName:string;
    orgAddress: string;
    orgPhone:string;
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
    policeDescription:string;
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
    guardianRelationship:string;
    guardianStaff:string;
    guardianDate: Date;
    guardianDatetime:Date;
    guardianReason: string;
    guardianStaffName:string;
    guardianStaffJobTitle:string;
    guardianDescription:string;
    immediateFollowUp:string;
    followUpPlan:string;
    medicalArrangement:string;
    medicalArrangmentDetail:string;
    carePlan:boolean;
    carePlanYesDescription:string;
    carePlanNoDescription:string;
    needResponse:boolean;
    needResponseDetail:string;
    affectedName: string;
    affectedIdCardNo: string;
    affectedGender: string
    affectedAge: number;
    affectedMedicalRecord: string;
    affectedDetail: string;
    affectedFollowUp: string;
    sdDate:Date;
    sdName:string;
    sdJobTitle:string;

}

export default function OtherIncidentReportPrint({ index, context, formSubmittedHandler, currentUserRole, formData, formTwentySixData, formTwentySixDataSelected,siteCollectionUrl}: IOtherIncidentReportPrint) {
    const CURRENT_USER: IUser = {
        email: context.pageContext.legacyPageContext.userEmail,
        name: context.pageContext.legacyPageContext.userDisplayName,
        id: context.pageContext.legacyPageContext.userId,
    }
    const [reporter, setReporter, reporterPickerInfo] = useUserInfoAD();
    const [sdInfo, setSDEmail, spSdInfo] = useUserInfoAD();
    const [userInfo, setCurrentUserEmail, spUserInfo] = useUserInfo(siteCollectionUrl);
    const [incidentTime, setIncidentTime] = useState(new Date());
    const [reportDate, setReportDate] = useState(new Date());
    const [reporterName, setReporterName] = useState("");
    const [reporterJobTitle, setReporterJobTitle] = useState("");
    const [sdJobTitle, setSdJobTitle] = useState("");
    const [sdName, setSdName] = useState("");
    
    const [notifyStaff, setNotifyStaff, notifyStaffPicker] = useUserInfoAD();
    const [spNotifyStaff, setNotifyStaffEmail] = useSharePointGroup();
    
    let followUpActions = null;
    let formTwentySixDataPrint = null;
    debugger
    if (formTwentySixData != null && formTwentySixData.length > 0) {
        formTwentySixDataPrint = formTwentySixData.filter(item => {return item.Id == formTwentySixDataSelected});
        debugger
        if (Array.isArray(formTwentySixDataPrint) && formTwentySixDataPrint[0].FollowUpActions != null) {
            followUpActions = JSON.parse(formTwentySixDataPrint[0].FollowUpActions);
        }
    }

    const [form, setForm] = useState<IOtherIncidentReportPrintStates>({
        toDepartment:"",
        abuser: "",
        abuserDescription: "",
        abuser_police: undefined,
        abuser_policeCaseNo: "",
        abuser_policeDate: new Date(),
        abusive_body: false,
        abusive_mental: false,
        abusive_negligent: false,
        abusive_sexual: false,
        abusive_other:false,
        abusiveDescription:"",
        mediaReports:false,
        incidentDescription:"",
        serviceLocation:"",
        serviceUserGenderOne:"",
        serviceUserGenderTwo:"",
        serviceUserGenderThree:"",
        serviceUserAgeOne:null,
        serviceUserAgeTwo:null,
        serviceUserAgeThree:null,
        staffGenderOne:"",
        staffGenderTwo:"",
        staffGenderThree:"",
        staffPositionOne:"",
        staffPositionTwo:"",
        staffPositionThree:"",

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
        guardianRelationship:"",
        guardianRelation: "",
        guardianDate: null,
        guardianDatetime:null,
        guardianReason: "",
        guardianStaff:"",
        guardianStaffName: "",
        guardianStaffJobTitle:"",
        guardianDescription:"",
        medicalArrangement:"",
        medicalArrangmentDetail:"",
        carePlan:undefined,
        carePlanYesDescription:"",
        carePlanNoDescription:"",
        needResponse:undefined,
        needResponseDetail:"",
        homesManagerName: "",
        immediateFollowUp:"",
        followUpPlan:"",
        orgName: "",
        orgSUName:"",
        orgAddress: "",
        orgPhone:"",
        homesManagerTel: "",
        insuranceCaseNo: "",
        incidentTime:"",
        incidentLocation:"",
        incidentCategory:"",
        absuseDetailsStatus:"",
        absuseDetailsPerson:"",
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
        policeDescription:"",
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
        unusalIncident: "",
        sdDate:null,
        sdName:"",
        sdJobTitle:""
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
            if (formData.Author) {
                setReporter([{ secondaryText: formData.Author.EMail, id: formData.Author.Id }]);
            }
            if (formData.SD) {
                setSDEmail([{ secondaryText: formData.SD.EMail, id: formData.SD.Id }]);
            }
            setReportDate(new Date(formData.Created));
            if (formData.GuardianStaff) {
                setNotifyStaff([formData.GuardianStaff]);
            }
            debugger
            setForm({
                ...form,
                toDepartment:formData.ToDepartment,
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
                abusive_body: formData.Abusive_Body,
                abusive_mental: formData.Abusive_Mental,
                abusive_negligent: formData.Abusive_Negligent,
                abusive_sexual: formData.Abusive_Sexual,
                abusive_other: formData.Abusive_Other,
                mediaReports:formData.MediaReports,
                abusiveDescription:formData.AbusiveDescription,
                incidentDescription:formData.IncidentDescription,
                serviceLocation:formData.ServiceLocation,
                serviceUserGenderOne:formData.ServiceUserGenderOne,
                serviceUserGenderTwo:formData.ServiceUserGenderTwo,
                serviceUserGenderThree:formData.ServiceUserGenderThree,
                serviceUserAgeOne:formData.ServiceUserAgeOne,
                serviceUserAgeTwo:formData.ServiceUserAgeTwo,
                serviceUserAgeThree:formData.ServiceUserAgeThree,
                staffGenderOne:formData.StaffGenderOne,
                staffGenderTwo:formData.StaffGenderTwo,
                staffGenderThree:formData.StaffGenderThree,
                staffPositionOne:formData.StaffPositionOne,
                staffPositionTwo:formData.StaffPositionTwo,
                staffPositionThree:formData.StaffPositionThree,

                conflict: formData.Conflict,
                conflictDescription: formData.ConflictDescription,
                conflict_policeCaseNo: formData.Conflict_PoliceCaseNo,
                conflict_policeDate: formData.Conflict_PoliceDate ? new Date(formData.Conflict_PoliceDate) : null,
                caseNumber:formData.CaseNumber,
                found: formData.Found,
                foundDate: formData.FoundDate ? new Date(formData.FoundDate) : null,
                guardian: formData.Guardian,
                guardianStaff:formData.GuardianStaff,
                guardianName: formData.GuardianName,
                guardianRelationship:formData.GuardianRelationship,
                guardianRelation: formData.GuardianRelation,
                guardianDate: formData.GuarrdianDate ? new Date(formData.GuarrdianDate) : null,
                guardianDatetime: formData.GuarrdianDatetime ? new Date(formData.GuarrdianDatetime) : null,
                guardianReason: formData.GuardianReason,
                guardianDescription:formData.GuardianDescription,
                medicalArrangement:formData.MedicalArrangement,
                medicalArrangmentDetail:formData.MedicalArrangmentDetail,
                carePlan:formData.CarePlan,
                carePlanYesDescription:formData.CarePlanYesDescription,
                carePlanNoDescription:formData.CarePlanNoDescription,
                needResponse:formData.NeedResponse,
                needResponseDetail:formData.NeedResponseDetail,
                immediateFollowUp:formData.immediateFollowUp,
                followUpPlan:formData.followUpPlan,
                insuranceCaseNo: formData.InsuranceCaseNo,
                incidentTime:formData.IncidentTime,
                incidentLocation:formData.IncidentLocation,
                incidentCategory:formData.IncidentCategory,
                absuseDetailsStatus:formData.AbsuseDetailsStatus,
                absuseDetailsPerson:formData.AbsuseDetailsPerson,
                homesManagerName: formData.HomesManagerName,
                homesManagerTel: formData.HomesManagerTel,
                orgName: formData.OrgName,
                orgSUName: formData.OrgSUName,
                orgPhone:formData.OrgPhone,
                orgAddress:formData.OrgAddress,
                medicalIncident: formData.MedicalIncident,
                medicalRecords: formData.MedicalRecords,
                mi_description: formData.MI_Description,
                missingPoliceDate: formData.MissingPoliceDate ? new Date(formData.MissingPoliceDate) : null,
                missingPoliceReportNo: formData.MissingPoliceReportNo,
                notYetFoundDayCount: formData.NotYetFoundDayCount,
                other: formData.Other,
                otherDescription: formData.OtherDescription,
                otherIncident: formData.OtherIncident,
                police: formData.Police,
                policeDatetime: formData.PoliceDatetime ? new Date(formData.PoliceDatetime) : null,
                policeInvestigate: formData.PoliceInvestigate,
                policeInvestigateDate: formData.PoliceInvestigateDate ? new Date(formData.PoliceInvestigateDate) : null,
                policeReportNumber: formData.PoliceReportNumber,
                policeDescription:formData.PoliceDescription,
                ra_abandoned: formData.RA_Abandoned,
                ra_body: formData.RA_Body,
                ra_embezzleProperty: formData.RA_EmbezzleProperty,
                ra_mental: formData.RA_Mental,
                ra_negligent: formData.RA_Negligent,
                ra_other: formData.RA_Other,
                ra_otherDescription: formData.RA_OtherDescription,
                ra_sexualAssault: formData.RA_SexualAssault,
                referDate: formData.ReferDate ? new Date(formData.ReferDate) : null,
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
                unusalIncident: formData.UnusalIncident,
                sdDate: formData.SDDate ? new Date(formData.SDDate) : null
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
            getUserInfoByEmailInUserInfoAD(siteCollectionUrl,reporter.mail).then((userInfosRes) => {
                
                if (Array.isArray(userInfosRes) && userInfosRes.length > 0) {
                    setReporterName(userInfosRes[0].Name);
                    setReporterJobTitle(userInfosRes[0].hr_jobcode);
                }
            }).catch((err) => {
                console.error('getUserInfoByEmailInUserInfoAD error')
                console.error(err)
            });
            /*setForm({ ...form, 
                reporterName: reporter.displayName,
                reporterJobTitle: reporter.jobTitle
            });*/
        }
    }, [reporter])

    useEffect(() => {
        if (sdInfo) {
            getUserInfoByEmailInUserInfoAD(siteCollectionUrl,sdInfo.mail).then((userInfosRes) => {
                
                if (Array.isArray(userInfosRes) && userInfosRes.length > 0) {
                    setSdJobTitle(userInfosRes[0].hr_jobcode);
                    setSdName(sdInfo.displayName);
                }
            }).catch((err) => {
                console.error('getUserInfoByEmailInUserInfoAD error')
                console.error(err)
            });
        }
    }, [sdInfo])
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
                        其他事故呈報表
                        </div>
                        <div className={`col-12 ${styles.header}`}>
                        服務單位 <span>{form.serviceLocation}</span>
                        </div>
                    </div>

                    <div className="form-row mb-3" style={{fontSize:'18px'}}>
                        <div className={`col-12`} style={{fontWeight:'bold', fontSize:'20px'}}>
                        事故資料
                        </div>
                        <div className={`col-12`}>
                            <table>
                                <tr>
                                    <td>(a)事故發生日期 :</td>
                                    <td style={{borderBottom:'1px solid'}}>{form.incidentTime != null ? new Date(form.incidentTime).getFullYear() + `-` +(`0`+(new Date(form.incidentTime).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(form.incidentTime).getDate()).slice(-2):''}
                                    </td>
                                </tr>
                                <tr>
                                    <td>(b)事故發生時間	:</td>
                                    <td style={{borderBottom:'1px solid'}}>{form.incidentTime != null ? (`0`+new Date(form.incidentTime).getHours()).slice(-2) + `:` + (`0`+new Date(form.incidentTime).getMinutes()).slice(-2):''}</td>
                                </tr>
                                <tr>
                                    <td>(c)事故發生地點	:</td>
                                    <td style={{borderBottom:'1px solid'}}>{form.incidentLocation}</td>
                                </tr>
                                <tr>
                                    <td>(e))事故被傳媒報導 :</td>
                                    <td>{formData.mediaReports&& <span>&#9745;</span>}
                                        {!formData.mediaReports && <span>&#9744;</span>}
                                        是&nbsp;&nbsp;
                                        {!formData.mediaReports&& <span>&#9745;</span>}
                                        {formData.mediaReports && <span>&#9744;</span>}
                                        否&nbsp;&nbsp;
                                    </td>

                                </tr>
                                <tr>
                                    <td>(f)特別事故的描述:</td>
                                    <td style={{borderBottom:'1px solid'}}>
                                    {form.incidentDescription != null ? form.incidentDescription:"" }
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div className={`col-12`} style={{fontWeight:'bold', fontSize:'20px'}}>
                            有關服務使用者的資料 (如適用)
                        </div>
                        <div className={`col-12`}>
                            <table >
                                <tr>
                                    <td>(a)	服務使用者(第一位)</td>
                                    <td>性別</td>
                                    <td style={{borderBottom:'1px solid', width:'100px'}}>
                                        {form.serviceUserGenderOne == 'male' && '男'}
                                        {form.serviceUserGenderOne == 'female' && '女'}
                                    </td>
                                    <td>&nbsp;&nbsp;年齡</td>
                                    <td style={{borderBottom:'1px solid', width:'100px'}}>{form.serviceUserAgeOne}</td>
                                </tr>
                                <tr>
                                    <td>(b)	服務使用者(第二位，如有)</td>
                                    <td>性別</td>
                                    <td style={{borderBottom:'1px solid', width:'100px'}}>
                                        {form.serviceUserGenderTwo == 'male' && '男'}
                                        {form.serviceUserGenderTwo == 'female' && '女'}
                                    </td>
                                    <td>&nbsp;&nbsp;年齡</td>
                                    <td style={{borderBottom:'1px solid', width:'100px'}}>{form.serviceUserAgeTwo}</td>
                                </tr>
                                <tr>
                                    <td>(c)	服務使用者(第三位，如有)</td>
                                    <td>性別</td>
                                    <td style={{borderBottom:'1px solid', width:'100px'}}>
                                        {form.serviceUserGenderThree == 'male' && '男'}
                                        {form.serviceUserGenderThree == 'female' && '女'}
                                    </td>
                                    <td>&nbsp;&nbsp;年齡</td>
                                    <td style={{borderBottom:'1px solid', width:'100px'}}>{form.serviceUserAgeThree}</td>
                                </tr>
                            </table>
                        </div>
                        <div className={`col-12`} style={{fontWeight:'bold', fontSize:'20px'}}>
                        有關職員的資料 (如適用)
                        </div>
                        <div className={`col-12`}>
                            <table >
                                <tr>
                                    <td>(a)	職員(第一位)</td>
                                    <td>性別</td>
                                    <td style={{borderBottom:'1px solid', width:'100px'}}>
                                        {form.staffGenderOne == 'male' && '男'}
                                        {form.staffGenderOne == 'female' && '女'}
                                    </td>
                                    <td>&nbsp;&nbsp;職位</td>
                                    <td style={{borderBottom:'1px solid', width:'100px'}}>{form.staffPositionOne}</td>
                                </tr>
                                <tr>
                                    <td>(b)	服務使用者(第二位，如有)</td>
                                    <td>性別</td>
                                    <td style={{borderBottom:'1px solid', width:'100px'}}>
                                        {form.staffGenderTwo == 'male' && '男'}
                                        {form.staffGenderTwo == 'female' && '女'}
                                    </td>
                                    <td>&nbsp;&nbsp;職位</td>
                                    <td style={{borderBottom:'1px solid', width:'100px'}}>{form.staffPositionTwo}</td>
                                </tr>
                                <tr>
                                    <td>(c)	服務使用者(第三位，如有)</td>
                                    <td>性別</td>
                                    <td style={{borderBottom:'1px solid', width:'100px'}}>
                                        {form.staffGenderThree == 'male' && '男'}
                                        {form.staffGenderThree == 'female' && '女'}
                                    </td>
                                    <td>&nbsp;&nbsp;職位</td>
                                    <td style={{borderBottom:'1px solid', width:'100px'}}>{form.staffPositionThree}</td>
                                </tr>
                            </table>
                        </div>
                        <div className={`col-12`} style={{fontWeight:'bold', fontSize:'20px'}}>
                            跟進行動
                        </div>
                        <div className={`col-12`}>
                            <table >
                                <tr>
                                    <td colSpan={2}>(a) 報警處理</td>
                                </tr>
                                <tr>
                                    <td><div style={{width:'50px'}}></div></td>
                                    <td >
                                        {form.police&& <span>&#9745;</span>}
                                        {!form.police && <span>&#9744;</span>}
                                        有&nbsp;&nbsp;(報警日期和時間:
                                            <span style={{borderBottom:'1px solid',display: 'inline-block', width:'150px'}}>
                                            {form.policeDatetime !=null && new Date(form.policeDatetime).getFullYear() + `-` +(`0`+(new Date(form.policeDatetime).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(form.policeDatetime).getDate()).slice(-2) + ` ` + (`0`+new Date(form.policeDatetime).getHours()).slice(-2) + `:` + + (`0`+new Date(form.policeDatetime).getMinutes()).slice(-2)}
                                            </span>
                                    </td>
                                    
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>
                                        <div style={{paddingLeft:'45px'}}>(報案編號:
                                            <span style={{borderBottom:'1px solid',display: 'inline-block', width:'150px'}}>
                                            {form.policeReportNumber != null ? form.policeReportNumber: ''})
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td >
                                        {!form.police&& <span>&#9745;</span>}
                                        {form.police && <span>&#9744;</span>}
                                        沒有&nbsp;&nbsp;(備註
                                            <span style={{borderBottom:'1px solid',display: 'inline-block', width:'200px'}}>
                                            {form.policeDescription != null ? form.policeDescription: ''})
                                            </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={2}>(b) 通知家人／親屬／監護人／保證人</td>
                                </tr>
                                <tr>
                                    <td><div style={{width:'50px'}}></div></td>
                                    <td >
                                        {form.guardian&& <span>&#9745;</span>}
                                        {!form.guardian && <span>&#9744;</span>}
                                        有&nbsp;&nbsp;(通知日期和時間:
                                            <span style={{borderBottom:'1px solid',display: 'inline-block', width:'200px'}}>
                                            {form.guardianDatetime !=null && new Date(form.guardianDatetime).getFullYear() + `-` +(`0`+(new Date(form.guardianDatetime).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(form.guardianDatetime).getDate()).slice(-2) + ` ` + (`0`+new Date(form.guardianDatetime).getHours()).slice(-2) + `:` + + (`0`+new Date(form.guardianDatetime).getMinutes()).slice(-2)}
                                            </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>
                                        <div style={{paddingLeft:'44px'}}>(與服務使用者的關係:
                                            <span style={{borderBottom:'1px solid',display: 'inline-block', width:'200px'}}>
                                            {form.guardianRelationship != null ? form.guardianRelationship: ''})
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>
                                        <div style={{paddingLeft:'44px'}}>(負責職員姓名:
                                            <span style={{borderBottom:'1px solid',display: 'inline-block', width:'150px'}}>
                                            {form.guardianStaff != null ? form.guardianStaff: ''})
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td >
                                        {!form.guardian&& <span>&#9745;</span>}
                                        {form.guardian && <span>&#9744;</span>}
                                        沒有&nbsp;&nbsp;(備註:
                                            <span style={{borderBottom:'1px solid',display: 'inline-block', width:'150px'}}>
                                            {form.guardianDescription != null ? form.guardianDescription: ''})
                                            </span>
                                    </td>
                                </tr>

                                <tr>
                                    <td colSpan={2}>(c) 醫療安排</td>
                                </tr>
                                <tr>
                                    <td><div style={{width:'50px'}}></div></td>
                                    <td >
                                        {form.medicalArrangement&& <span>&#9745;</span>}
                                        {!form.medicalArrangement && <span>&#9744;</span>}
                                        有&nbsp;&nbsp;(請註明:
                                            <span style={{borderBottom:'1px solid',display: 'inline-block', width:'150px'}}>
                                            {form.medicalArrangmentDetail != null ? form.medicalArrangmentDetail: ''})</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td >
                                        {!form.medicalArrangement&& <span>&#9745;</span>}
                                        {form.medicalArrangement && <span>&#9744;</span>}
                                        沒有&nbsp;&nbsp;
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={2}>(d) 舉行多專業個案會議／為有關服務使用者訂定照顧計劃</td>
                                </tr>
                                <tr>
                                    <td><div style={{width:'50px'}}></div></td>
                                    <td >
                                        {form.carePlan&& <span>&#9745;</span>}
                                        {!form.carePlan && <span>&#9744;</span>}
                                        有&nbsp;&nbsp;(請註明,包括日期:
                                            <span style={{borderBottom:'1px solid',display: 'inline-block', width:'150px'}}>
                                            {form.carePlanYesDescription != null ? form.carePlanYesDescription: ''})</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td >
                                        {!form.carePlan&& <span>&#9745;</span>}
                                        {form.carePlan && <span>&#9744;</span>}
                                        沒有&nbsp;&nbsp;(備註:
                                            <span style={{borderBottom:'1px solid',display: 'inline-block', width:'150px'}}>
                                            {form.carePlanNoDescription != null ? form.carePlanNoDescription: ''})
                                            </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={2}>(e) 需要回應外界團體(如：關注組、區議會、立法會等)的關注／查詢</td>
                                </tr>
                                <tr>
                                    <td><div style={{width:'50px'}}></div></td>
                                    <td >
                                        {form.needResponse&& <span>&#9745;</span>}
                                        {!form.needResponse && <span>&#9744;</span>}
                                        有&nbsp;&nbsp;(請註明:
                                            <span style={{borderBottom:'1px solid',display: 'inline-block', width:'150px'}}>
                                            {form.needResponseDetail != null ? form.needResponseDetail: ''})</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td >
                                        {!form.needResponse&& <span>&#9745;</span>}
                                        {form.needResponse && <span>&#9744;</span>}
                                        沒有&nbsp;&nbsp;
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={2}>(f)) 已作出即時的跟進行動，包括保護其他服務使用者的措施 (如適用)</td>
                                </tr>
                                <tr>
                                    <td colSpan={2} style={{borderBottom:'1px solid'}}>{form.immediateFollowUp != null ? form.immediateFollowUp: <span>&nbsp;&nbsp;</span>}</td>
                                </tr>
                                <tr>
                                    <td colSpan={2}>(g)	跟進計劃</td>
                                </tr>
                                <tr>
                                    <td colSpan={2} style={{borderBottom:'1px solid'}}>{form.followUpPlan != null ? form.followUpPlan:  <span>&nbsp;&nbsp;</span>}</td>
                                </tr>
                            </table>
                        </div>
                    </div>



                    <div className="form-row mb-3" style={{fontSize:'18px', marginTop:'30px'}}>
                        <div className={`col-12`}>
                            <table>
                                <tr>
                                    <td style={{width:'100px'}}>
                                    填報人姓名 : 
                                    </td>
                                    <td style={{width:'300px', verticalAlign:'bottom'}}>
                                        <div className={`${styles.underlineDiv}`}>
                                        {reporterName}
                                        </div>
                                    </td>
                                    <td style={{width:'100px'}}>
                                    批簽人姓名 : 
                                    </td>
                                    <td style={{width:'300px', verticalAlign:'bottom'}}>
                                        <div className={`${styles.underlineDiv}`}>
                                        {sdName}
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{width:'100px'}}>
                                    填報人職位 : 
                                    </td>
                                    <td style={{width:'300px', verticalAlign:'bottom'}}>
                                        <div className={`${styles.underlineDiv}`}>
                                        {reporterJobTitle}
                                        </div>
                                    </td>
                                    <td style={{width:'100px'}}>
                                    批簽人職位 : 
                                    </td>
                                    <td style={{width:'300px', verticalAlign:'bottom'}}>
                                        <div className={`${styles.underlineDiv}`}>
                                        {sdJobTitle}
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{width:'100px'}}>
                                    日期 : 
                                    </td>
                                    <td style={{width:'300px', verticalAlign:'bottom'}}>
                                        <div className={`${styles.underlineDiv}`}>
                                        {form.reporterDate != null && new Date(form.reporterDate).getFullYear() + `-` +(`0`+(new Date(form.reporterDate).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(form.reporterDate).getDate()).slice(-2)}
                                        </div>
                                    </td>
                                    <td style={{width:'100px'}}>
                                    日期 : 
                                    </td>
                                    <td style={{width:'300px', verticalAlign:'bottom'}}>
                                        <div className={`${styles.underlineDiv}`}>
                                        {form.sdDate != null && new Date(form.sdDate).getFullYear() + `-` +(`0`+(new Date(form.sdDate).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(form.sdDate).getDate()).slice(-2)}
                                    </div>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div className={`${styles.pagebreak}`} ></div>
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
                                    <td style={{borderBottom:'1px solid'}}>{form.serviceLocation}</td>
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
                                    {formTwentySixDataPrint != null && formTwentySixDataPrint[0].SDDate != null && new Date(formTwentySixDataPrint[0].SDDate).getFullYear() + `-` +(`0`+(new Date(formTwentySixDataPrint[0].SDDate).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(formTwentySixDataPrint[0].SDDate).getDate()).slice(-2)}
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