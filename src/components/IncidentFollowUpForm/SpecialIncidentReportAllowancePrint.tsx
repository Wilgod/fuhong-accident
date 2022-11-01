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
import * as moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as fontawesome from '@fortawesome/free-solid-svg-icons';
import './SpecialIncidentReport.css';
interface ISpecialIncidentReportAllowancePrint {
    context: WebPartContext;
    formSubmittedHandler(): void;
    currentUserRole: Role;
    formData: any;
    formTwentySixData:any;
    formTwentySixDataSelected: any;
    siteCollectionUrl:string;
    index:number;
    backToForm:any;
}

interface ISpecialIncidentReportAllowanceStates {
    toDepartment:string;
    responsibleName: string;
    insuranceCaseNo: string;
    incidentTime:string;
    incidentLocation:string;
    incidentCategory:string;
    absuseDetailsStatus:string;
    absuseDetailsPerson:string;
    absuseDetailsReason:string;
    abusive_body: boolean,
    abusive_mental: boolean,
    abusive_negligent: boolean,
    abusive_sexual: boolean,
    abusive_other:boolean,
    abusiveDescription:string,
    mediaReports:boolean,
    incidentDescription:string,

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

export default function SpecialIncidentReportLicensePrint({ index, context, formSubmittedHandler, currentUserRole, formData, formTwentySixData, formTwentySixDataSelected,siteCollectionUrl, backToForm}: ISpecialIncidentReportAllowancePrint) {
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
    const [sdName, setSdName] = useState("");
    const [sdJobTitle, setSdJobTitle] = useState("");
    const [notifyStaff, setNotifyStaff, notifyStaffPicker] = useUserInfoAD();
    const [spNotifyStaff, setNotifyStaffEmail] = useSharePointGroup();
    const [loadReporter, setLoadReporter] = useState(false);
    const [loadSdInfo, setLoadSdInfo] = useState(false);

    let followUpActions = null;
    let formTwentySixDataPrint = null;
    debugger
    if (formTwentySixData != null && formTwentySixData.length > 0) {
        debugger
        formTwentySixDataPrint = formTwentySixData.filter(item => {return item.Id == formTwentySixDataSelected});
        if (Array.isArray(formTwentySixDataPrint) && formTwentySixDataPrint[0].FollowUpActions != null) {
            followUpActions = JSON.parse(formTwentySixDataPrint[0].FollowUpActions);
        }
    }

    const [form, setForm] = useState<ISpecialIncidentReportAllowanceStates>({
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
        absuseDetailsReason:"",
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
            loadData()
        } else {
            setReporter([{ secondaryText: CURRENT_USER.email, id: CURRENT_USER.id }]);
            setLoadReporter(true);
            setLoadSdInfo(true);
        }
    }, [formData]);

    
    const loadData = async () => {
        console.log(formData)
        if (formData) {

            setIncidentTime(new Date(formData.IncidentTime));
            setReportDate(new Date(formData.Created));
            if (formData.Reporter) {
                setReporter([{ secondaryText: formData.Reporter.EMail, id: formData.Reporter.Id }]);
            }
            if (formData.SD) {
                setSDEmail([{ secondaryText: formData.SD.EMail, id: formData.SD.Id }]);
                setLoadSdInfo(false)
            }
            
            /*if (formData.GuardianStaff) {
                setNotifyStaff([formData.GuardianStaff]);
            }*/
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
                absuseDetailsReason:formData.AbsuseDetailsReason,
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
        console.log("reporter");
        if (reporter) {
            getUserInfoByEmailInUserInfoAD(siteCollectionUrl,reporter.mail).then((userInfosRes) => {
                
                if (Array.isArray(userInfosRes) && userInfosRes.length > 0) {
                    setReporterName(userInfosRes[0].Name);
                    setReporterJobTitle(userInfosRes[0].hr_jobcode);
                    setLoadReporter(true);
                }


            }).catch((err) => {
                console.error('getUserInfoByEmailInUserInfoAD error')
                console.error(err)
            });
            
        }
    }, [reporter])

    useEffect(() => {
        console.log("sdInfo",sdInfo);
        if (sdInfo) {
            getUserInfoByEmailInUserInfoAD(siteCollectionUrl,sdInfo.mail).then((userInfosRes) => {
                
                if (Array.isArray(userInfosRes) && userInfosRes.length > 0) {
                    setSdName(sdInfo.displayName);
                    setSdJobTitle(userInfosRes[0].hr_jobcode);
                    setLoadSdInfo(true);
                }


            }).catch((err) => {
                console.error('getUserInfoByEmailInUserInfoAD error')
                console.error(err)
            });
        } else {
            setLoadSdInfo(true);
        }
        
    }, [sdInfo])

    useEffect(() => {
        if (loadSdInfo && loadReporter) {
            setTimeout(
                windowPrint
            ,500)
            
        }
    }, [loadSdInfo, loadReporter])

    //console.log('form.sdDate :', form.sdDate);

    //console.log('formData:', formData);
    
    const windowPrint = async () => {
        window.print()
    }
    return (
        <>
            <style media="print">
				{`@page {
                    size: auto;
                    margin: 10 0;
                }`}
			</style>
            <div style={{color:'black'}}>
                <div className={`notPrintable`}>
                    <span onClick={() => backToForm()} style={{cursor:'pointer'}}><FontAwesomeIcon icon={fontawesome["faChevronLeft"]} color="black" size="2x"/><span style={{fontSize:'20px', verticalAlign:'bottom'}}>返回前頁</span></span>
                </div>
                {index == 0 &&
                    <div>
                        <div className="form-row mb-3">
                        <div className={`col-12 font-weight-bold ${styles.header}`}>
                            特別事故報告
                        </div>
                        <div className={`col-12 ${styles.header}`}>
                        (特別事故發生後三個工作天內提交社會福利署津貼組及相關服務科)
                        </div>
                    </div>
                    <div className="form-row mb-3">
                        <div className={`col-12`}>
                            注意：請在合適方格內加上「&#10003;」號，並連同附頁／載有相關資料的自訂報告一併呈交
                        </div>
                    </div>
                    <div className="form-row mb-3" style={{fontSize:'18px'}}>
                        <div className={`col-12`}>
                            <table style={{width:'800'}}>
                                <tr>
                                    <td style={{width:"100px"}}>致 :</td>
                                    <td className={form.toDepartment != 'ALLOWANCE_SECTION' && styles.deleteLine} style={{width:"200px"}}>津貼科</td>
                                    <td className={form.toDepartment != 'ALLOWANCE_SECTION' && styles.deleteLine} style={{textAlign:"right",width:"500px"}}>(傳真: 2575 5632)</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td className={form.toDepartment != 'ELDERLY_SERVICES_DIVISION' && styles.deleteLine} style={{width:"200px"}}>*安老服務科</td>
                                    <td className={form.toDepartment != 'ELDERLY_SERVICES_DIVISION' && styles.deleteLine} style={{textAlign:"right",width:"500px"}}>*(傳真: 2832 2936)</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td className={form.toDepartment != 'FAMILY_AND_CHILD_WELFARE_DIVISION' && styles.deleteLine} style={{width:"200px"}}>*家庭及兒童福利科</td>
                                    <td className={form.toDepartment != 'FAMILY_AND_CHILD_WELFARE_DIVISION' && styles.deleteLine} style={{textAlign:"right",width:"500px"}}>*(傳真: 2833 5840)</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td className={form.toDepartment != 'REHABILITATION_AND_MEDICAL_SOCIAL_SERVICES_DIVISION' && styles.deleteLine} style={{width:"200px"}}>*康復及醫務社會服務科</td>
                                    <td className={form.toDepartment != 'REHABILITATION_AND_MEDICAL_SOCIAL_SERVICES_DIVISION' && styles.deleteLine} style={{textAlign:"right",width:"500px"}}>*(傳真: 2893 6983)</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td className={form.toDepartment != 'YOUTH_AND_PROBATION_SERVICES_BRANCH_PROBATION_SERVICE_GROUP' && styles.deleteLine} style={{textAlign:"right",width:"500px"}}>*感化服務組	*(傳真: 2833 5861)</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td className={form.toDepartment != 'YOUTH_AND_PROBATION_SERVICES_DIVISION_YOUTH_AFFAIRS_SECTION' && styles.deleteLine} style={{textAlign:"right",width:"500px"}}>*青年事務組	*(傳真: 2838 7021)</td>
                                </tr>
                            </table>
                        </div>
                        
                    </div>
                    <div className="form-row mb-3" style={{fontSize:'18px'}}>
                        <div className={`col-12`} style={{fontWeight:'bold'}}>
                        報告單位資料
                        </div>
                        <div className={`col-12`}>
                            <table style={{width:'780px'}}>
                                <tr>
                                    <td style={{width:'200px'}}>機構名稱 : </td>
                                    <td style={{borderBottom:'1px solid', width:'580px'}}>{form.orgName}</td>
                                </tr>
                                <tr>
                                    <td>單位名稱 : </td>
                                    <td style={{borderBottom:'1px solid'}}>{form.orgSUName}</td>
                                </tr>
                                <tr>
                                    <td>單位地址 : </td>
                                    <td style={{borderBottom:'1px solid'}}>{form.orgAddress}</td>
                                </tr>
                                <tr>
                                    <td>負責職員姓名 : </td>
                                    <td style={{borderBottom:'1px solid'}}>{reporterName}</td>
                                </tr>
                                <tr>
                                    <td>聯絡電話 : </td>
                                    <td style={{borderBottom:'1px solid'}}>{form.orgPhone}</td>
                                </tr>
                            </table>
                        </div>
                        <div className={`col-12`} style={{fontWeight:'bold', fontSize:'20px', marginTop:'20px'}}>
                        特別事故資料
                        </div>
                        <div className={`col-12`}>
                            <table style={{width:'780px'}}>
                                <tr>
                                    <td style={{width:'200px'}}>(a)事故發生日期 :</td>
                                    <td style={{borderBottom:'1px solid', width:'580px'}}>{form.incidentTime != null ? new Date(form.incidentTime).getFullYear() + `-` +(`0`+(new Date(form.incidentTime).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(form.incidentTime).getDate()).slice(-2):''}
                                    </td>
                                </tr>
                                <tr>
                                    <td>(b)事故發生時間	:</td>
                                    <td style={{borderBottom:'1px solid'}}>
                                        {form.incidentTime != null ? moment(form.incidentTime).format("YYYY-MM-DD hh:mm"):''}
                                        {/*form.incidentTime != null ? (`0`+new Date(form.incidentTime).getHours()).slice(-2) + `:` + (`0`+new Date(form.incidentTime).getMinutes()).slice(-2):''*/}
                                    </td>
                                </tr>
                                <tr>
                                    <td>(c)事故發生地點	:</td>
                                    <td style={{borderBottom:'1px solid'}}>{form.incidentLocation}</td>
                                </tr>
                                <tr>
                                    <td>(d)事故類別	:</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>
                                        <div>
                                            {form.incidentCategory == "ACCIDENT_CATEGORY_UNUSUAL_DEATH" && <span>&#9745;</span>}
                                            {form.incidentCategory != "ACCIDENT_CATEGORY_UNUSUAL_DEATH" && <span>&#9744;</span>}
                                            服務使用者不尋常死亡／嚴重受傷
                                        </div>
                                        <div>
                                            {form.incidentCategory == "ACCIDENT_CATEGORY_MISSING" && <span>&#9745;</span>}
                                            {form.incidentCategory != "ACCIDENT_CATEGORY_MISSING" && <span>&#9744;</span>}
                                            服務使用者失踪以致需要報警求助
                                        </div>
                                        <div>
                                            {form.incidentCategory == "ACCIDENT_CATEGORY_ABUSE" && <span>&#9745;</span>}
                                            {form.incidentCategory != "ACCIDENT_CATEGORY_ABUSE" && <span>&#9744;</span>}
                                            *已
                                            {form.absuseDetailsStatus == "ACCIDENT_CATEGORY_STATUS_ESTABLISH" && <span>確立</span>}
                                            {form.absuseDetailsStatus == "ACCIDENT_CATEGORY_STATUS_DOUBT" && <span>懷疑</span>}
                                            有服務使用者被
                                            {form.absuseDetailsPerson == "ACCIDENT_CATEGORY_PERSON_STAFF" && <span>職員</span>}
                                            {form.absuseDetailsPerson == "ACCIDENT_CATEGORY_PERSON_STAFF" && <span>其他服務使用者</span>}
                                            {form.absuseDetailsReason == "ACCIDENT_CATEGORY_REASON_ABUSE" && <span>虐待</span>}
                                            {form.absuseDetailsReason == "ACCIDENT_CATEGORY_REASON_VIOLATED" && <span>侵犯</span>}
                                            虐待
                                        </div>
                                        <div style={{paddingLeft:'30px'}}>
                                            <div style={{marginTop:'10px'}}>
                                                <span style={{borderBottom:'1px solid'}}>虐待性質 : </span>
                                            </div>
                                            <div>
                                            {form.abusive_body && <span>&#9745;</span>}
                                            {!form.abusive_body && <span>&#9744;</span>}
                                                身體虐待
                                            </div>
                                            <div>
                                            {form.abusive_sexual && <span>&#9745;</span>}
                                            {!form.abusive_sexual && <span>&#9744;</span>}
                                                性侵犯
                                            </div>
                                            <div>
                                            {form.abusive_mental && <span>&#9745;</span>}
                                            {!form.abusive_mental && <span>&#9744;</span>}
                                                精神虐待
                                            </div>
                                            <div>
                                            {form.abusive_negligent && <span>&#9745;</span>}
                                            {!form.abusive_negligent && <span>&#9744;</span>}
                                                疏忽照顧
                                            </div>
                                            <div>
                                            {form.abusive_other && <span>&#9745;</span>}
                                            {!form.abusive_other && <span>&#9744;</span>}
                                                其他(請註明 : {form.abusiveDescription != null ? <span style={{borderBottom:'1px solid',display: 'inline-block', width:'200px'}}>{form.abusiveDescription}</span> : '__________________'})
                                            </div>
                                        </div>
                                        <div style={{marginTop:'20px'}}>
                                            {form.incidentCategory == "ACCIDENT_CATEGORY_CONFLICT" && <span>&#9745;</span>}
                                            {form.incidentCategory != "ACCIDENT_CATEGORY_CONFLICT" && <span>&#9744;</span>}
                                            爭執以致有人身體受傷而需要報警求助
                                        </div>
                                        <div>
                                            {form.incidentCategory == "ACCIDENT_CATEGORY_OTHER" && <span>&#9745;</span>}
                                            {form.incidentCategory != "ACCIDENT_CATEGORY_OTHER" && <span>&#9744;</span>}
                                            其他嚴重事故以致影響服務單位的日常運作超過24小時
                                        </div>
                                        <div>
                                            {form.incidentCategory == "ACCIDENT_CATEGORY_MEDIA" && <span>&#9745;</span>}
                                            {form.incidentCategory != "ACCIDENT_CATEGORY_MEDIA" && <span>&#9744;</span>}
                                            可能引起公眾或傳媒關注的事故
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>(e))事故被傳媒報導 :</td>
                                    <td>{formData != null && formData.mediaReports != null && formData.mediaReports&& <span>&#9745;</span>}
                                        {formData != null && formData.mediaReports != null && !formData.mediaReports && <span>&#9744;</span>}
                                        是&nbsp;&nbsp;
                                        {formData != null && formData.mediaReports != null && !formData.mediaReports&& <span>&#9745;</span>}
                                        {formData != null && formData.mediaReports != null && formData.mediaReports && <span>&#9744;</span>}
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
                        <div className={`col-12`} style={{fontWeight:'bold', fontSize:'20px', marginTop:'20px'}}>
                            有關服務使用者的資料 (如適用)
                        </div>
                        <div className={`col-12`}>
                            <table style={{width:'780px'}}>
                                <tr>
                                    <td style={{width:'250px'}}>(a)	服務使用者(第一位)</td>
                                    <td style={{width:'70px'}}>性別</td>
                                    <td style={{borderBottom:'1px solid', width:'200px'}}>
                                        {form.serviceUserGenderOne == 'male' && '男'}
                                        {form.serviceUserGenderOne == 'female' && '女'}
                                    </td>
                                    <td style={{width:'70px'}}>&nbsp;&nbsp;年齡</td>
                                    <td style={{borderBottom:'1px solid', width:'200px'}}>{form.serviceUserAgeOne}</td>
                                </tr>
                                <tr>
                                    <td>(b)	服務使用者(第二位，如有)</td>
                                    <td>性別</td>
                                    <td style={{borderBottom:'1px solid'}}>
                                        {form.serviceUserGenderTwo == 'male' && '男'}
                                        {form.serviceUserGenderTwo == 'female' && '女'}
                                    </td>
                                    <td>&nbsp;&nbsp;年齡</td>
                                    <td style={{borderBottom:'1px solid'}}>{form.serviceUserAgeTwo}</td>
                                </tr>
                                <tr>
                                    <td>(c)	服務使用者(第三位，如有)</td>
                                    <td>性別</td>
                                    <td style={{borderBottom:'1px solid'}}>
                                        {form.serviceUserGenderThree == 'male' && '男'}
                                        {form.serviceUserGenderThree == 'female' && '女'}
                                    </td>
                                    <td>&nbsp;&nbsp;年齡</td>
                                    <td style={{borderBottom:'1px solid'}}>{form.serviceUserAgeThree}</td>
                                </tr>
                            </table>
                        </div>
                        <div className={`col-12`} style={{fontWeight:'bold', fontSize:'20px', marginTop:'20px'}}>
                        有關職員的資料 (如適用)
                        </div>
                        <div className={`col-12`}>
                            <table style={{width:'780px'}}>
                                <tr>
                                    <td style={{width:'250px'}}>(a)	職員(第一位)</td>
                                    <td style={{width:'70px'}}>性別</td>
                                    <td style={{borderBottom:'1px solid', width:'200px'}}>
                                        {form.staffGenderOne == 'male' && '男'}
                                        {form.staffGenderOne == 'female' && '女'}
                                    </td>
                                    <td style={{width:'70px'}}>&nbsp;&nbsp;職位</td>
                                    <td style={{borderBottom:'1px solid', width:'200px'}}>{form.staffPositionOne}</td>
                                </tr>
                                <tr>
                                    <td>(b)	服務使用者(第二位，如有)</td>
                                    <td>性別</td>
                                    <td style={{borderBottom:'1px solid'}}>
                                        {form.staffGenderTwo == 'male' && '男'}
                                        {form.staffGenderTwo == 'female' && '女'}
                                    </td>
                                    <td>&nbsp;&nbsp;職位</td>
                                    <td style={{borderBottom:'1px solid'}}>{form.staffPositionTwo}</td>
                                </tr>
                                <tr>
                                    <td>(c)	服務使用者(第三位，如有)</td>
                                    <td>性別</td>
                                    <td style={{borderBottom:'1px solid'}}>
                                        {form.staffGenderThree == 'male' && '男'}
                                        {form.staffGenderThree == 'female' && '女'}
                                    </td>
                                    <td>&nbsp;&nbsp;職位</td>
                                    <td style={{borderBottom:'1px solid'}}>{form.staffPositionThree}</td>
                                </tr>
                            </table>
                        </div>
                        <div className={`col-12`} style={{fontWeight:'bold', fontSize:'20px', marginTop:'20px'}}>
                            跟進行動
                        </div>
                        <div className={`col-12`}>
                            <table style={{width:'780px'}}>
                                <tr>
                                    <td colSpan={4}>(a) 報警處理</td>
                                </tr>
                                <tr>
                                    <td style={{width:'50px'}}></td>
                                    <td style={{width:'80px'}}>
                                        {form.police&& <span>&#9745;</span>}
                                        {!form.police && <span>&#9744;</span>}
                                        有
                                    </td>
                                    <td style={{width:'150px'}}>報警日期和時間:</td>
                                    <td style={{borderBottom:'1px solid',width:'500px'}}>
                                        {form.policeDatetime != null ? moment(form.policeDatetime).format("YYYY-MM-DD hh:mm"):''}
                                        {/*form.policeDatetime !=null && new Date(form.policeDatetime).getFullYear() + `-` +(`0`+(new Date(form.policeDatetime).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(form.policeDatetime).getDate()).slice(-2) + ` ` + (`0`+new Date(form.policeDatetime).getHours()).slice(-2) + `:` + + (`0`+new Date(form.policeDatetime).getMinutes()).slice(-2)*/}
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td>
                                        報案編號
                                    </td>
                                    <td style={{borderBottom:'1px solid'}}>
                                    {form.policeReportNumber != null ? form.policeReportNumber: ''}
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>
                                    {!form.police&& <span>&#9745;</span>}
                                    {form.police && <span>&#9744;</span>}
                                        沒有
                                    </td>
                                    <td>
                                        備註
                                    </td>
                                    <td style={{borderBottom:'1px solid'}}>
                                    {form.policeDescription != null ? form.policeDescription: ''}
                                    </td>
                                </tr>
                            </table>
                            <table style={{width:'780px'}}>
                                <tr>
                                    <td colSpan={4}>(b) 通知家人／親屬／監護人／保證人</td>
                                </tr>
                                <tr>
                                    <td style={{width:'50px'}}></td>
                                    <td style={{width:'80px'}}>
                                        {form.guardian&& <span>&#9745;</span>}
                                        {!form.guardian && <span>&#9744;</span>}
                                        有
                                    </td>
                                    <td style={{width:'170px'}}>
                                    通知日期和時間:
                                    </td>
                                    <td style={{borderBottom:'1px solid'}}>
                                    {form.guardianDatetime != null ? moment(form.guardianDatetime).format("YYYY-MM-DD hh:mm"):''}
                                    {/*form.guardianDatetime !=null && new Date(form.guardianDatetime).getFullYear() + `-` +(`0`+(new Date(form.guardianDatetime).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(form.guardianDatetime).getDate()).slice(-2) + ` ` + (`0`+new Date(form.guardianDatetime).getHours()).slice(-2) + `:` + + (`0`+new Date(form.guardianDatetime).getMinutes()).slice(-2)*/}
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td>
                                        與服務使用者的關係:
                                    </td>
                                    <td style={{borderBottom:'1px solid'}}>
                                        {form.guardianRelationship != null ? form.guardianRelationship: ''}
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td>
                                        負責職員姓名:
                                    </td>
                                    <td style={{borderBottom:'1px solid'}}>
                                    {form.guardianStaff != null ? form.guardianStaff: ''}
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>
                                        {!form.guardian&& <span>&#9745;</span>}
                                        {form.guardian && <span>&#9744;</span>}
                                        沒有
                                    </td>
                                    <td >
                                    備註:
                                    </td>
                                    <td style={{borderBottom:'1px solid'}}>
                                    {form.guardianDescription != null ? form.guardianDescription: ''}
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={4}>(c) 醫療安排</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td >
                                        {form.medicalArrangement&& <span>&#9745;</span>}
                                        {!form.medicalArrangement && <span>&#9744;</span>}
                                        有
                                    </td>
                                    <td>
                                    請註明:
                                    </td>
                                    <td style={{borderBottom:'1px solid'}}>
                                    {form.medicalArrangmentDetail != null ? form.medicalArrangmentDetail: ''}
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td >
                                        {!form.medicalArrangement&& <span>&#9745;</span>}
                                        {form.medicalArrangement && <span>&#9744;</span>}
                                        沒有&nbsp;&nbsp;
                                    </td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td colSpan={4}>(d) 舉行多專業個案會議／為有關服務使用者訂定照顧計劃</td>
                                </tr>
                                <tr>
                                    <td><div style={{width:'50px'}}></div></td>
                                    <td >
                                        {form.carePlan&& <span>&#9745;</span>}
                                        {!form.carePlan && <span>&#9744;</span>}
                                        有
                                    </td>
                                    <td>請註明,包括日期:</td>
                                    <td style={{borderBottom:'1px solid'}}>{form.carePlanYesDescription != null ? form.carePlanYesDescription: ''}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td >
                                        {!form.carePlan&& <span>&#9745;</span>}
                                        {form.carePlan && <span>&#9744;</span>}
                                        沒有
                                    </td>
                                    <td>備註:</td>
                                    <td style={{borderBottom:'1px solid'}}>{form.carePlanNoDescription != null ? form.carePlanNoDescription: ''}</td>
                                </tr>
                                <tr>
                                    <td colSpan={4}>(e) 需要回應外界團體(如：關注組、區議會、立法會等)的關注／查詢</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td >
                                        {form.needResponse&& <span>&#9745;</span>}
                                        {!form.needResponse && <span>&#9744;</span>}
                                        有
                                    </td>
                                    <td>請註明:</td>
                                    <td style={{borderBottom:'1px solid'}}>{form.needResponseDetail != null ? form.needResponseDetail: ''}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td >
                                        {!form.needResponse&& <span>&#9745;</span>}
                                        {form.needResponse && <span>&#9744;</span>}
                                        沒有
                                    </td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td colSpan={4}>(f)) 已作出即時的跟進行動，包括保護其他服務使用者的措施 (如適用)</td>
                                </tr>
                                <tr>
                                    <td colSpan={4} style={{borderBottom:'1px solid'}}>&nbsp;&nbsp;{form.immediateFollowUp != null ? form.immediateFollowUp: ''}</td>
                                </tr>
                                <tr>
                                    <td colSpan={4}>(g)	跟進計劃</td>
                                </tr>
                                <tr>
                                    <td colSpan={4} style={{borderBottom:'1px solid'}}>&nbsp;&nbsp;{form.followUpPlan != null ? form.followUpPlan: ''}</td>
                                </tr>
                            </table>
                        </div>
                    </div>



                    <div className="form-row mb-3" style={{fontSize:'18px', marginTop:'30px'}}>
                        <div className={`col-12`}>
                            <table style={{width:'780px'}}>
                                <tr>
                                    <td style={{width:'140px'}}>
                                    填報人姓名 : 
                                    </td>
                                    <td style={{width:'250px', verticalAlign:'bottom',borderBottom:'1px solid'}}>
                                        {reporterName}
                                    </td>
                                    <td style={{width:'140px'}}>
                                    &nbsp;&nbsp;批簽人姓名 : 
                                    </td>
                                    <td style={{width:'250px', verticalAlign:'bottom',borderBottom:'1px solid'}}>
                                    {sdName}
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{width:'140px'}}>
                                    填報人職位 : 
                                    </td>
                                    <td style={{width:'250px', verticalAlign:'bottom',borderBottom:'1px solid'}}>
                                    {reporterJobTitle}
                                    </td>
                                    <td style={{width:'140px'}}>
                                    &nbsp;&nbsp;批簽人職位 : 
                                    </td>
                                    <td style={{width:'250px', verticalAlign:'bottom',borderBottom:'1px solid'}}>
                                    {sdJobTitle}
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{width:'140px'}}>
                                    日期 : 
                                    </td>
                                    <td style={{width:'250px', verticalAlign:'bottom',borderBottom:'1px solid'}}>
                                    {form.reporterDate != null && new Date(form.reporterDate).getFullYear() + `-` +(`0`+(new Date(form.reporterDate).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(form.reporterDate).getDate()).slice(-2)}
                                    </td>
                                    <td style={{width:'140px'}}>
                                    &nbsp;&nbsp;日期 : 
                                    </td>
                                    <td style={{width:'250px', verticalAlign:'bottom',borderBottom:'1px solid'}}>
                                        {form.sdDate != null && new Date(form.sdDate).getFullYear() + `-` +(`0`+(new Date(form.sdDate).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(form.sdDate).getDate()).slice(-2)}
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
                            <table style={{width:'360px', float:'right'}}>
                                <tr>
                                    <td style={{width:'160px',fontSize:'18px'}}>保險公司備案編號: </td>
                                    <td style={{borderBottom:'1px solid', width:'200px'}}>{form.insuranceCaseNo != null ? form.insuranceCaseNo : ''}</td>
                                </tr>
                            </table>
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
                            <table style={{width:'780px'}}>
                                <tr>
                                    <td style={{width:'200px'}}>單位名稱</td>
                                    <td style={{borderBottom:'1px solid', width:'550px'}}>{form.orgSUName}</td>
                                </tr>
                                <tr>
                                    <td>事故發生日期及時間</td>
                                    <td style={{borderBottom:'1px solid'}}>
                                        {form.incidentTime != null ? moment(form.incidentTime).format("YYYY-MM-DD hh:mm"):''}
                                        {/*new Date(form.incidentTime).getFullYear() + `-` +(`0`+(new Date(form.incidentTime).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(form.incidentTime).getDate()).slice(-2) + ` `+ new Date(form.incidentTime).getHours() + `-` +(`0`+new Date(form.incidentTime).getMinutes()).slice(-2)*/}
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
                            <table style={{width:'780px',margin:'40px 0 20px'}}>
                                <tr>
                                    <td style={{width:'240px'}}>
                                    高級服務經理/服務經理姓名
                                    </td>
                                    <td style={{width:'220px',borderBottom:'1px solid'}}>
                                    {formTwentySixDataPrint != null && formTwentySixDataPrint[0].SM.Title}
                                    </td>
                                    <td  style={{width:'100px', textAlign:'right'}}>
                                    日期&nbsp;&nbsp;
                                    </td>
                                    <td style={{width:'220px',borderBottom:'1px solid'}}>
                                    {formTwentySixDataPrint != null && formTwentySixDataPrint[0].SMDate != null && new Date(formTwentySixDataPrint[0].SMDate).getFullYear() + `-` +(`0`+(new Date(formTwentySixDataPrint[0].SMDate).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(formTwentySixDataPrint[0].SMDate).getDate()).slice(-2)}
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div className={`col-12`}>
                            評語
                        </div>
                        <div className={`col-12`}>
                            <table style={{width:'780px'}}>
                                <tr>
                                    <td style={{borderBottom:'1px solid'}}>
                                    &nbsp;&nbsp;{formTwentySixDataPrint != null && formTwentySixDataPrint[0].SMComment != null ? formTwentySixDataPrint[0].SMComment : ''}
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div className={`col-12`}>
                            <table style={{width:'780px',margin:'40px 0 20px'}}>
                                <tr>
                                    <td  style={{width:'240px'}}>
                                    服務總監姓名
                                    </td>
                                    <td style={{width:'220px',borderBottom:'1px solid'}}>
                                    {formTwentySixDataPrint != null && formTwentySixDataPrint[0].SD.Title}
                                    </td>
                                    <td  style={{width:'100px', textAlign:'right'}}>
                                    日期&nbsp;&nbsp;
                                    </td>
                                    <td style={{width:'220px',borderBottom:'1px solid'}}>
                                    {formTwentySixDataPrint != null && formTwentySixDataPrint[0].SDDate != null  && new Date(formTwentySixDataPrint[0].SDDate).getFullYear() + `-` +(`0`+(new Date(formTwentySixDataPrint[0].SDDate).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(formTwentySixDataPrint[0].SDDate).getDate()).slice(-2)}
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