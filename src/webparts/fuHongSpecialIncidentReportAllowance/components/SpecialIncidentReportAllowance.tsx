import * as React from 'react'
import { useState, useEffect } from 'react'
import DatePicker from "react-datepicker";
import Header from "../../../components/Header/Header";
import "react-datepicker/dist/react-datepicker.css";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { WebPartContext } from '@microsoft/sp-webpart-base';
import AutosizeTextarea from "../../../components/AutosizeTextarea/AutosizeTextarea";
import { createIncidentFollowUpForm, createSpecialIncidentReportAllowance, updateSpecialIncidentReportAllowance } from '../../../api/PostFuHongList';
import { IAccidentCategoryAbuseDetails, IErrorFields, ISpecialIncidentReportAllowanceProps, ISpecialIncidentReportAllowanceStates } from './ISpecialIncidentReportAllowance';
import { getUserInfoByEmailInUserInfoAD } from '../../../api/FetchUser';
import useUserInfo from '../../../hooks/useUserInfo';
import useDepartmentMangers from '../../../hooks/useDepartmentManagers';
import { IUser } from '../../../interface/IUser';
import { formInitial, adminUpdateInsuranceNumber, pendingSdApprove, pendingSmApprove, formInitBySm } from "../permissionConfig";
import useServiceUnit from '../../../hooks/useServiceUnits';
import useUserInfoAD from '../../../hooks/useUserInfoAD';
import { caseNumberFactory } from '../../../utils/CaseNumberParser';
import { FormFlow } from '../../../api/FetchFuHongList';
import { addBusinessDays } from '../../../utils/DateUtils';


const footNoteOne = "指在服務單位內及／或在其他地方提供服務時所發生的特別事故";
const footNoteTwo = "包括寄養家庭的寄養家長及兒童之家的家舍家長及其家庭成員";

export default function SpecialIncidentReportAllowance({ context, styles, formSubmittedHandler, currentUserRole, formData }: ISpecialIncidentReportAllowanceProps) {
    const [isPrintMode, setPrintMode] = useState(false);
    const [serviceUnitList, serviceUnit, setServiceUnit] = useServiceUnit();
    const [reporter, setReporter, reporterPickerInfo] = useUserInfoAD(); // 填報人姓名
    const [formStage, setFormStage] = useState("");
    const [formStatus, setFormStatus] = useState("");
    const [error, setError] = useState<IErrorFields>()
    const [serviceLocation, setServiceLocation] = useState("");
    const [form, setForm] = useState<ISpecialIncidentReportAllowanceStates>({
        toDepartment: "",
        incidentLocation: "",
        incidentDescription: "",
        mediaReports: undefined,
        serviceUserGenderOne: "",
        serviceUserGenderTwo: "",
        serviceUserGenderThree: "",
        serviceUserAgeOne: 0,
        serviceUserAgeTwo: 0,
        serviceUserAgeThree: 0,
        staffGenderOne: "",
        staffGenderTwo: "",
        staffGenderThree: "",
        staffPositionOne: "",
        staffPositionTwo: "",
        staffPositionThree: "",
        police: undefined,
        policeReportNumber: "",
        policeDescription: "",
        guardian: undefined,
        guardianDescription: "",
        guardianRelationship: "",
        guardianStaff: "",
        medicalArrangement: undefined,
        medicalArrangmentDetail: "",
        carePlan: undefined,
        carePlanYesDescription: "",
        carePlanNoDescription: "",
        needResponse: undefined,
        needResponseDetail: "",
        immediateFollowUp: "",
        followUpPlan: "",
        accidentCategory: "",
        abusive_body: false,
        abusive_mental: false,
        abusive_negligent: false,
        abusive_other: false,
        abusive_sexual: false,
        abusiveDescription: ""
    });

    const [reportOrg, setReportOrg] = useState("");//機構名稱
    const [reportPhone, setReportPhone] = useState(""); //聯絡電話
    const [suTcName, setSuTcName] = useState("");//單位名稱
    const [reportAddress, setReportAddress] = useState(""); //單位地址

    const [accidentCategoryAbuseDetails, setAccidentCategoryAbuseDetails] = useState<IAccidentCategoryAbuseDetails>({
        status: "",
        person: ""
    });
    const [reporterPhone, setReporterPhone] = useState("");
    const [incidentTime, setIncidentTime] = useState(new Date());
    const [reportDate, setReportDate] = useState(new Date());
    const [date, setDate] = useState(new Date());
    const [smDate, setSmDate] = useState(new Date());
    const [sdDate, setSdDate] = useState(new Date());
    const [smComment, setSmComment] = useState("");
    const [sdComment, setSdComment] = useState("");
    const [sdPhoneNo, setSdPhoneNo] = useState("");
    const [userInfo, setCurrentUserEmail, spUserInfo] = useUserInfo();
    const [sdInfo, setSDEmail, spSdInfo] = useUserInfo();
    const [smInfo, setSMEmail, spSmInfo] = useUserInfo();

    const { departments, setHrDepartment } = useDepartmentMangers();

    const [policeDatetime, setPoliceDatetime] = useState(new Date());
    const [guardianDatetime, setGuardianDatetime] = useState(new Date());

    const CURRENT_USER: IUser = {
        email: context.pageContext.legacyPageContext.userEmail,
        name: context.pageContext.legacyPageContext.userDisplayName,
        id: context.pageContext.legacyPageContext.userId,
    }

    const radioButtonHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setForm({ ...form, [name]: value });
    }

    const inputFieldHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setForm({ ...form, [name]: value });
    }

    const accidentCategoryAbuseDetailsRadioButtonHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setAccidentCategoryAbuseDetails({ ...accidentCategoryAbuseDetails, [name]: value });
    }

    const selectionHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setForm({ ...form, [name]: value });
    }

    const checkboxHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        const arr = form[name];
        if (Array.isArray(arr)) {
            if (arr.indexOf(value) > -1) {
                const result = arr.filter((item) => item !== value);
                setForm({ ...form, [name]: result });
            } else {
                setForm({ ...form, [name]: [...arr, value] });
            }
        }
    }

    const accidentCategoryHandler = () => {
        if (form.accidentCategory !== "ACCIDENT_CATEGORY_ABUSE") {
            setAccidentCategoryAbuseDetails({ status: "", person: "" });
        }
    }

    const accidentCategoryAbuseHandler = () => {
        const { status, person } = accidentCategoryAbuseDetails;
        if (status || person) setForm({ ...form, accidentCategory: "ACCIDENT_CATEGORY_ABUSE" })
    }

    const dataFactory = () => {
        let body = {};
        let error = {};

        body["OrgName"] = reportOrg;
        body["OrgPhone"] = reportPhone;
        body["OrgAddress"] = reportAddress;
        body["OrgSUName"] = suTcName;


        //致部門
        body["ToDepartment"] = form.toDepartment;

        //事故發生日期和時間
        body["IncidentTime"] = incidentTime.toISOString();


        //事故發生地點
        if (form.incidentLocation) {
            body["IncidentLocation"] = form.incidentLocation;
        } else {
            error["IncidentLocation"] = true;
        }

        body["IncidentCategory"] = form.accidentCategory;

        body["Abusive_Body"] = form.abusive_body;
        body["Abusive_Sexual"] = form.abusive_sexual;
        body["Abusive_Mental"] = form.abusive_mental;
        body["Abusive_Negligent"] = form.abusive_negligent;
        body["Abusive_Other"] = form.abusive_other;
        if (form.abusive_other) {
            body["AbusiveDescription"] = form.abusiveDescription;
        }

        if (form.accidentCategory === "ACCIDENT_CATEGORY_ABUSE") {
            body["AbsuseDetailsStatus"] = accidentCategoryAbuseDetails.status;
            body["AbsuseDetailsPerson"] = accidentCategoryAbuseDetails.person;
        }

        //事故被傳媒報導
        body["MediaReports"] = form.mediaReports;
        if (form.mediaReports) {
            // if (form.mediaReportsDescription) {
            //     body["MediaReportsDescription"] = form.mediaReportsDescription;
            // } else {
            //     error["MediaReportsDescription"] = true;
            // }
        } else if (form.mediaReports === undefined) {
            error["MediaReports"] = true;
        }

        body["IncidentDescription"] = form.incidentDescription


        //(a) 服務使用者 (一)
        if (form.serviceUserGenderOne) {
            body["ServiceUserGenderOne"] = form.serviceUserGenderOne
        } else {
            error["ServiceUserGenderOne"] = true;
        }

        if (form.serviceUserAgeOne) {
            body["ServiceUserAgeOne"] = form.serviceUserAgeOne;
        } else {
            error["ServiceUserAgeOne"] = true;
        }

        //(b) 服務使用者 (二，如有)
        body["ServiceUserGenderTwo"] = form.serviceUserGenderTwo;
        body["ServiceUserAgeTwo"] = form.serviceUserAgeTwo;

        //(c) 服務使用者 (三，如有)
        body["ServiceUserGenderThree"] = form.serviceUserGenderThree;
        body["ServiceUserAgeThree"] = form.serviceUserAgeThree;

        //(a) 職員 ( 一 )*
        if (form.staffGenderOne) {
            body["StaffGenderOne"] = form.staffGenderOne;
        } else {
            error["StaffGenderOne"] = true;
        }

        if (form.staffPositionOne) {
            body["StaffPositionOne"] = form.staffPositionOne;
        } else {
            error["StaffPositionOne"] = true;
        }

        //(b) 職員 ( 二，如有 )
        body["StaffGenderTwo"] = form.staffGenderTwo;
        body["StaffPositionTwo"] = form.staffPositionTwo;
        //(c) 職員 ( 三，如有 )
        body["StaffGenderThree"] = form.staffGenderThree;
        body["StaffPositionThree"] = form.staffPositionThree;

        //報警處理
        body["Police"] = form.police;
        if (form.police === true) {
            body["PoliceDatetime"] = policeDatetime.toISOString();
            if (form.policeReportNumber) {
                body["PoliceReportNumber"] = form.policeReportNumber;
            } else {
                error["PoliceReportNumber"] = true;
            }
        } else if (form.police === false) {
            if (form.policeDescription) {
                body["PoliceDescription"] = form.policeDescription;
            } else {
                error["PoliceDescription"] = true;
            }
        } else if (form.police === undefined) {
            error["Police"] = true;
        }

        //通知家人 / 親屬 / 監護人 / 保證人
        body["Guardian"] = form.guardian;
        if (form.guardian === true) {
            body["GuardianDatetime"] = guardianDatetime.toISOString();

            if (form.guardianRelationship) {
                body["GuardianRelationship"] = form.guardianRelationship;
            } else {
                error["GuardianRelationship"] = true;
            }

            if (form.guardianStaff) {
                body["GuardianStaff"] = form.guardianStaff;
            } else {
                error["GuardianStaff"] = true;
            }

        } else if (form.guardian === false) {
            body["GuardianDescription"] = form.guardianDescription;
        } else if (form.guardian === undefined) {
            error["form.guardian"] = true;
        }

        //醫療安排
        body["MedicalArrangement"] = form.medicalArrangement;
        if (form.medicalArrangement === true) {
            if (form.medicalArrangmentDetail) {
                body["MedicalArrangmentDetail"] = form.medicalArrangmentDetail;
            } else {
                error["MedicalArrangmentDetail"] = true;
            }
        } else if (form.medicalArrangement === undefined) {
            error["MedicalArrangement"] = true;
        }

        //舉行專業個案會議 / 為有關服務使用者訂定照顧計劃
        body["CarePlan"] = form.carePlan;
        if (form.carePlan === true) {
            if (form.carePlanYesDescription) {
                body["CarePlanYesDescription"] = form.carePlanYesDescription;
            } else {
                error["CarePlanYesDescription"] = true;
            }
        } else if (form.carePlan === false) {
            if (form.carePlanNoDescription) {
                body["CarePlanNoDescription"] = form.carePlanNoDescription;
            } else {
                error["CarePlanNoDescription"] = true;
            }
        } else if (form.carePlan === undefined) {
            error["CarePlan"] = true;
        }

        //需要回應外界團體(如：關注組、區議會、立法會等)的關注／查詢
        body["NeedResponse"] = form.needResponse;
        if (form.needResponse === true) {
            body["NeedResponseDetail"] = form.needResponseDetail;
        } else if (form.needResponse === undefined) {
            error["NeedResponse"] = true;
        }

        //已作出即時的跟進行動，包括保護其他服務使用者的措施 (如適用)
        body["ImmediateFollowUp"] = form.immediateFollowUp;

        //跟進計劃
        if (form.followUpPlan) {
            body["FollowUpPlan"] = form.followUpPlan;
        } else {
            error['FollowUpPlan'] = true;
        }

        body["ReporterPhone"] = reporterPhone;



        return [body, error];
    }

    const loadData = () => {
        console.log("loadData", formData);
        if (formData) {
            setFormStatus(formData.Status);
            setFormStage(formData.Stage);
            setIncidentTime(new Date(formData.IncidentTime));

            if (formData.ServiceUnit) {
                setServiceUnit(formData.ServiceUnit);
            }
            setSmComment(formData.SMComment);
            if (formData.SMDate) {
                setSmDate(new Date(formData.SMDate));
            }

            if (formData.SM) {
                setSMEmail(formData.SM.EMail);
            }

            setSdComment(formData.SDComment)
            if (formData.SDDate) {
                setSdDate(new Date(formData.SDDate));
            }

            if (formData.SD) {
                setSDEmail(formData.SD.EMail);
            }

            if (formData.ServiceUnit) {
                setServiceUnit(formData.ServiceUnit);
            }

            if (formData.Author) {
                setReporter([{ secondaryText: formData.Author.EMail, id: formData.Author.Id }]);
            }

            if (formData.GuardianDatetime) {
                setGuardianDatetime(new Date(formData.GuardianDatetime));
            }

            setAccidentCategoryAbuseDetails({ person: formData.AbsuseDetailsPerson, status: formData.AbsuseDetailsStatus });

            setReporterPhone(formData.ReporterPhone);

            setForm({
                abusiveDescription: formData.AbusiveDescription,
                abusive_body: formData.Abusive_Body,
                abusive_mental: formData.Abusive_Mental,
                abusive_negligent: formData.Abusive_Negligent,
                abusive_sexual: formData.Abusive_Sexual,
                abusive_other: formData.Abusive_Other,
                accidentCategory: formData.IncidentCategory,
                carePlan: formData.CarePlan,
                carePlanNoDescription: formData.CarePlanNoDescription,
                carePlanYesDescription: formData.CarePlanYesDescription,
                followUpPlan: formData.FollowUpPlan,
                guardian: formData.Guardian,
                guardianDescription: formData.GuardianDescription,
                guardianRelationship: formData.GuardianRelationship,
                guardianStaff: formData.GuardianStaff,
                immediateFollowUp: formData.ImmediateFollowUp,
                incidentDescription: formData.IncidentDescription,
                incidentLocation: formData.IncidentLocation,
                mediaReports: formData.MediaReports,
                medicalArrangement: formData.MedicalArrangement,
                medicalArrangmentDetail: formData.MedicalArrangmentDetail,
                needResponse: formData.NeedResponse,
                needResponseDetail: formData.NeedResponseDetail,
                police: formData.Police,
                policeDescription: formData.PoliceDescription,
                policeReportNumber: formData.PoliceReportNumber,
                serviceUserAgeOne: formData.ServiceUserAgeOne,
                serviceUserAgeTwo: formData.ServiceUserAgeTwo,
                serviceUserAgeThree: formData.ServiceUserAgeThree,
                serviceUserGenderOne: formData.ServiceUserGenderOne,
                serviceUserGenderTwo: formData.ServiceUserGenderTwo,
                serviceUserGenderThree: formData.ServiceUserGenderThree,
                staffGenderOne: formData.StaffGenderOne,
                staffGenderTwo: formData.StaffGenderTwo,
                staffGenderThree: formData.StaffGenderThree,
                staffPositionOne: formData.StaffPositionOne,
                staffPositionTwo: formData.StaffPositionTwo,
                staffPositionThree: formData.StaffPositionThree,
                toDepartment: formData.ToDepartment
            })
            if (formData.OrgName) setReportOrg(formData.OrgName);
            if (formData.OrgPhone) setReportPhone(formData.OrgPhone);
            if (formData.OrgAddress) setReportAddress(formData.OrgAddress);
            if (formData.OrgSUName) setSuTcName(formData.OrgSUName);

        }
    }

    const submitHandler = (event) => {
        event.preventDefault();
        const [body, error] = dataFactory()
        console.log(body);
        console.log(error);
        if (formStatus === "SM_VOID") {
            updateSpecialIncidentReportAllowance(formData.Id, {
                ...body,
                "Status": "PENDING_SM_APPROVE",
                
            }).then(res => {
                console.log(res)
                formSubmittedHandler();
            }).catch(console.error);
        } else {
            caseNumberFactory(FormFlow.SPECIAL_INCIDENT_ALLOWANCE, serviceLocation).then((caseNumber: string) => {
                console.log(caseNumber)
                let extraBody = {
                    "NextDeadline": addBusinessDays(new Date(), 3).toISOString(),
                    "CaseNumber": caseNumber,
                    "Status": "PENDING_SM_APPROVE",
                    "Stage": "1",
                    "SDId": spSdInfo.Id,
                    "SMId": spSmInfo.Id,
                    "ServiceUnit": serviceUnit,
                    "ServiceLocation": serviceLocation
                }

                if (CURRENT_USER.email === spSmInfo.Email) {
                    extraBody["Status"] = "PENDING_SD_APPROVE";
                    extraBody["SMDate"] = new Date().toISOString();
                    extraBody["SMComment"] = smComment;
                }

                if (formStatus === "DRAFT") {
                    updateSpecialIncidentReportAllowance(formData.Id, {
                        ...body,
                        ...extraBody
                    }).then(res => {
                        console.log(res)
                        formSubmittedHandler();
                    }).catch(console.error);
                } else {
                    createSpecialIncidentReportAllowance({
                        ...body,
                        ...extraBody
                    }).then(res => {
                        console.log(res)
                        formSubmittedHandler();
                    }).catch(console.error);
                }
            }).catch(console.error);
        }


    }

    const draftHandler = (event) => {
        event.preventDefault();
        const [body] = dataFactory()
        console.log(body);
        if (formStatus === "DRAFT") {
            updateSpecialIncidentReportAllowance(formData.Id, {
                ...body,
                "ServiceUnit": serviceUnit,
                "Title": "SID"
            }).then(res => {
                console.log(res)
                formSubmittedHandler();
            }).catch(console.error);
        } else {
            createSpecialIncidentReportAllowance({
                ...body,
                "Status": "DRAFT",
                "ServiceUnit": serviceUnit,
                "Title": "SID"
            }).then(res => {
                console.log(res)
                formSubmittedHandler();
            }).catch(console.error);
        }
    }


    const cancelHandler = () => {
        //implement 
        const path = context.pageContext.site.absoluteUrl + `/accident-and-incident/SitePages/Home.aspx`;
        window.open(path, "_self");
    }

    // const adminSubmitHanlder = (event) => {
    //     event.preventDefault();
    //     updateSpecialIncidentReportAllowance(formData.Id, {
    //         "InsuranceCaseNo": form.insuranceCaseNo
    //     }).then(res => {
    //         console.log(res);
    //         formSubmittedHandler();
    //     }).catch(console.error);
    // }

    const smApproveHandler = (event) => {
        event.preventDefault();
        const [body, error] = dataFactory();
        if (confirm("確認批准 ?")) {

            updateSpecialIncidentReportAllowance(formData.Id, {
                ...body,
                "Status": "PENDING_SD_APPROVE",
                "SMDate": new Date().toISOString(),
                "SMComment": smComment
            }).then((res) => {
                console.log(res);
                formSubmittedHandler();
            }).catch(console.error);
        }

    }

    const smRejectHandler = (event) => {
        event.preventDefault();
        if (spSmInfo.Email === formData.Author.EMail) return;
        const [body, error] = dataFactory();
        if (confirm("確認拒絕 ?")) {

            updateSpecialIncidentReportAllowance(formData.Id, {
                ...body,
                "Status": "SM_VOID"
            }).then((res) => {
                console.log(res);
                formSubmittedHandler();
            }).catch(console.error);

        }
    }

    const smSubmitHandler = (event) => {
        event.preventDefault();
        const [body] = dataFactory();

        updateSpecialIncidentReportAllowance(formData.Id, {
            ...body,
            "SMComment": smComment,
            "SMDate": new Date().toISOString(),
        }).then((res) => {
            console.log(res);
            formSubmittedHandler();
        }).catch(console.error);

    }

    const sdApproveHandler = (event) => {
        event.preventDefault();
        if (confirm("確認批准 ?")) {

            createIncidentFollowUpForm({
                "ParentFormId": formData.Id,
                "CaseNumber": formData.CaseNumber,
                "SMId": formData.SMId,
                "SDId": formData.SDId,
                "Title": "事故跟主/結束報告 - 1"
            }).then((incidentFollowUpRes) => {
                updateSpecialIncidentReportAllowance(formData.Id, {
                    "NextDeadline": addBusinessDays(new Date(), 28).toISOString(),
                    "SDDate": new Date().toISOString(),
                    "SDComment": sdComment,
                    "Stage": "2",
                    "Status": "PENDING_SM_FILL_IN",
                    "FollowUpFormsId": {
                        "results": [incidentFollowUpRes.data.Id]
                    },
                    "SDPhone": sdPhoneNo
                }).then((res) => {
                    console.log(res);
                    formSubmittedHandler();
                }).catch(console.error);
            }).catch(console.error);
        }
    }

    const sdRejectHandler = (event) => {
        event.preventDefault();
        if (confirm("確認拒絕 ?")) {
            updateSpecialIncidentReportAllowance(formData.Id, {
                "SMDate": new Date().toISOString(),
                "SMComment": smComment,
                "SDPhone": sdPhoneNo,
                "Status": "PENDING_SM_APPROVE"
            }).then((res) => {
                console.log(res);
                formSubmittedHandler();
            }).catch(console.error);
        }
    }

    useEffect(() => {
        setCurrentUserEmail(CURRENT_USER.email);
    }, [])

    useEffect(() => {
        accidentCategoryHandler()
    }, [form.accidentCategory])

    useEffect(() => {
        accidentCategoryAbuseHandler()
    }, [accidentCategoryAbuseDetails.status, accidentCategoryAbuseDetails.person])

    // Get current User info in ad
    useEffect(() => {

        if (formData) {
            loadData();
        } else {
            setReporter([{ secondaryText: CURRENT_USER.email, id: CURRENT_USER.id }]);
        }
    }, [formData]);


    useEffect(() => {
        if (reporter && reporter.mobilePhone) {
            setReporterPhone(reporter.mobilePhone || "");
        }
    }, [reporter])

    // Find SD && SM
    useEffect(() => {
        if (formInitial(currentUserRole, formStatus)) {
            if (CURRENT_USER.email === "FHS.portal.dev@fuhong.hk") {
                setHrDepartment("CHH");
                setServiceUnit("CHH");
                return;
            }

            if (userInfo && userInfo.hr_deptid) {
                setHrDepartment(userInfo.hr_deptid);
                setServiceUnit(userInfo.hr_deptid);
                setServiceLocation(userInfo.hr_location);
            }
        }
    }, [userInfo]);


    // Get SD & SM
    useEffect(() => {
        if (formInitial(currentUserRole, formStatus)) {
            if (Array.isArray(departments) && departments.length) {
                const dept = departments[0];
                if (dept && dept.hr_deptmgr && dept.hr_deptmgr !== "[empty]") {
                    setSMEmail(dept.hr_deptmgr);
                }

                if (dept && dept.hr_sd && dept.hr_sd !== "[empty]") {
                    setSDEmail(dept.hr_sd);
                }

                if (dept && dept.su_name_tc) {
                    setSuTcName(dept.su_name_tc);
                    setReportAddress(dept.su_name_tc);
                }
                setReportOrg("扶康會");

                if (dept && dept.su_phone) {
                    setReportPhone(dept.su_phone);
                }

            }
        }
    }, [departments]);

    useEffect(() => {
        if (sdInfo && sdInfo.phone) {
            setSdPhoneNo(sdInfo.phone);
        }
    }, [sdInfo]);


    return (
        <>
            <div className="mb-3">
                <Header displayName="殘疾人士院舍特別事故報告" />
            </div>
            <div className="container-fluid px-4">
                <section className="mb-4">
                    {/* <div className="row">
                        <div className="col-12 font-weight-bold">
                            <h5>報告資料</h5>
                        </div>
                    </div> */}
                    <div className="row my-3">
                        <div className="col-12 fontweight-bold">
                            <span className={`font-weight-bold`} style={{ fontSize: 15, cursor: "help" }} title={footNoteOne}>( 特別事故<sup>1</sup> 發生後三個工作天內提交社會福利署津貼組及相關服務科 )</span>
                        </div>
                    </div>

                    <hr className="my-3" />

                    <div className="form-row row">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>致部門</label>
                        <div className="col">
                            <select className="form-control" name={"toDepartment"} onChange={selectionHandler} value={form.toDepartment}
                                disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)}>
                                <option value="">請選擇部門</option>
                                <option value="ALLOWANCE_SECTION">津貼科</option>
                                <option value="ELDERLY_SERVICES_DIVISION">安老服務科</option>
                                <option value="FAMILY_AND_CHILD_WELFARE_DIVISION">家庭及兒童福利科</option>
                                <option value="REHABILITATION_AND_MEDICAL_SOCIAL_SERVICES_DIVISION">康復及醫務社會服務科</option>
                                <option value="YOUTH_AND_PROBATION_SERVICES_BRANCH_PROBATION_SERVICE_GROUP">青年及感化服務科 - 感化服務組</option>
                                <option value="YOUTH_AND_PROBATION_SERVICES_DIVISION_YOUTH_AFFAIRS_SECTION">青年及感化服務科 - 青年事務組</option>
                            </select>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-1">
                            致:
                        </div>
                        <div className="col" >
                            <div className="form-row" style={{ textDecoration: `${form.toDepartment === "ALLOWANCE_SECTION" || !form.toDepartment ? "none" : "line-through"}` }}>
                                <div className="col-auto mr-auto">
                                    津貼科
                                </div>
                                <div className="col-auto">
                                    (傳真: 2575 5632)
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row" style={{ textDecoration: `${form.toDepartment === "ELDERLY_SERVICES_DIVISION" || !form.toDepartment ? "none" : "line-through"}` }}>
                        <div className="offset-1 col-auto mr-auto">
                            <div>安老服務科</div>
                        </div>
                        <div className="col-auto">
                            <div>(傳真: 2832 2936)</div>
                        </div>
                    </div>
                    <div className="row" style={{ textDecoration: `${form.toDepartment === "FAMILY_AND_CHILD_WELFARE_DIVISION" || !form.toDepartment ? "none" : "line-through"}` }}>
                        <div className="offset-1 col-auto mr-auto">
                            <div>家庭及兒童福利科</div>
                        </div>
                        <div className="col-auto">
                            <div>(傳真: 2833 5840)</div>
                        </div>
                    </div>
                    <div className="row" style={{ textDecoration: `${form.toDepartment === "REHABILITATION_AND_MEDICAL_SOCIAL_SERVICES_DIVISION" || !form.toDepartment ? "none" : "line-through"}` }}>
                        <div className="offset-1 col-auto mr-auto">
                            <div>康復及醫務社會服務科</div>
                        </div>
                        <div className="col-auto">
                            <div>(傳真: 2893 6983)</div>
                        </div>
                    </div>
                    <div className="row" >
                        <div className="offset-1 col-auto mr-auto">
                            <div style={{ textDecoration: `${form.toDepartment === "YOUTH_AND_PROBATION_SERVICES_BRANCH_PROBATION_SERVICE_GROUP" || form.toDepartment === "YOUTH_AND_PROBATION_SERVICES_DIVISION_YOUTH_AFFAIRS_SECTION" || !form.toDepartment ? "none" : "line-through"}` }}>青年及感化服務科</div>
                        </div>
                    </div>
                    <div className="row" style={{ textDecoration: `${form.toDepartment === "YOUTH_AND_PROBATION_SERVICES_BRANCH_PROBATION_SERVICE_GROUP" || !form.toDepartment ? "none" : "line-through"}` }}>
                        <div className="offset-2 col-auto mr-auto">
                            <div>感化服務組</div>
                        </div>
                        <div className="col-auto">
                            <div>(傳真: 2833 5861)</div>
                        </div>
                    </div>
                    <div className="row" style={{ textDecoration: `${form.toDepartment === "YOUTH_AND_PROBATION_SERVICES_DIVISION_YOUTH_AFFAIRS_SECTION" || !form.toDepartment ? "none" : "line-through"}` }}>
                        <div className="offset-2 col-auto mr-auto">
                            <div>青年事務組</div>
                        </div>
                        <div className="col-auto">
                            <div>(傳真: 2838 7021)</div>
                        </div>
                    </div>

                    <hr className="my-3" />
                </section>

                <section className="mb-5">
                    <div className="form-row mb-3">
                        <div className="col-12 font-weight-bold">
                            <h5>報告單位資料</h5>
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/* 事故性質 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>機構名稱</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" value={reportOrg} onChange={(event) => setReportOrg(event.target.value)}
                                disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                        </div>
                        {/* 單位名稱 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>單位名稱</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" value={suTcName} onChange={(event) => setSuTcName(event.target.value)}
                                disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/* 聯絡電話 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>聯絡電話</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" value={reportPhone} onChange={(event) => setReportPhone(event.target.value)}
                                disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                        </div>
                        {/* 負責職員姓名 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>負責職員姓名</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" readOnly value={reporter && reporter.displayName || ""} />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/* 單位地址 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>單位地址</label>
                        <div className="col">
                            <input type="text" className="form-control" value={reportAddress} onChange={(event) => setReportAddress(event.target.value)}
                                disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                        </div>
                    </div>
                </section>

                <section className="mb-5">
                    <div className="form-row mb-3">
                        <div className="col-12 font-weight-bold">
                            <h5>特別事故資料</h5>
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>事故發生日期和時間</label>
                        <div className="col-12 col-md-4">
                            <DatePicker
                                className="form-control"
                                selected={incidentTime}
                                onChange={(date) => setIncidentTime(date)}
                                showTimeSelect
                                timeFormat="p"
                                timeIntervals={15}
                                dateFormat="yyyy/MM/dd h:mm aa"
                                readOnly={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)}
                            />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>事故發生地點</label>
                        <div className="col">
                            <input type="text" className="form-control" name="incidentLocation" value={form.incidentLocation} onChange={inputFieldHandler}
                                disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>事故類別</label>
                        <div className="col">
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="accidentCategory" id="accident-category-unusual-death" value="ACCIDENT_CATEGORY_UNUSUAL_DEATH" onChange={radioButtonHandler}
                                    disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="accident-category-unusual-death">服務使用者不尋常死亡／嚴重受傷導致死亡</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="accidentCategory" id="accident-category-missing" value="ACCIDENT_CATEGORY_MISSING" onChange={radioButtonHandler}
                                    disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="accident-category-missing">服務使用者失踪而需要報警求助</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="accidentCategory" id="accident-category-abuse" value="ACCIDENT_CATEGORY_ABUSE" onChange={radioButtonHandler} checked={form.accidentCategory === "ACCIDENT_CATEGORY_ABUSE"}
                                    disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="accident-category-abuse" >
                                    已
                                    <span className="pl-4">
                                        <input className="form-check-input" type="radio" name="status" id="accident-category-status-establish" value="ACCIDENT_CATEGORY_STATUS_ESTABLISH" onChange={accidentCategoryAbuseDetailsRadioButtonHandler} checked={accidentCategoryAbuseDetails.status === "ACCIDENT_CATEGORY_STATUS_ESTABLISH"}
                                            disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                                        <label className={`form-check-label ${styles.labelColor}`} htmlFor="accident-category-status-establish" style={{ textDecoration: `${accidentCategoryAbuseDetails.status === "ACCIDENT_CATEGORY_STATUS_ESTABLISH" || !accidentCategoryAbuseDetails.status ? "none" : "line-through"}` }}>確立</label>
                                    </span>
                                    ／
                                    <span className="pl-4">
                                        <input className="form-check-input" type="radio" name="status" id="accident-category-status-doubt" value="ACCIDENT_CATEGORY_STATUS_DOUBT" onChange={accidentCategoryAbuseDetailsRadioButtonHandler} checked={accidentCategoryAbuseDetails.status === "ACCIDENT_CATEGORY_STATUS_DOUBT"}
                                            disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                                        <label className={`form-check-label ${styles.labelColor}`} htmlFor="accident-category-status-doubt" style={{ textDecoration: `${accidentCategoryAbuseDetails.status === "ACCIDENT_CATEGORY_STATUS_DOUBT" || !accidentCategoryAbuseDetails.status ? "none" : "line-through"}` }}>懷疑</label>
                                    </span>
                                    &nbsp;

                                    有服務使用者被
                                    <span className="pl-4">
                                        <input className="form-check-input" type="radio" name="person" id="accident-category-person-staff" value="ACCIDENT_CATEGORY_PERSON_STAFF" onChange={accidentCategoryAbuseDetailsRadioButtonHandler} checked={accidentCategoryAbuseDetails.person === "ACCIDENT_CATEGORY_PERSON_STAFF"}
                                            disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                                        <label className={`form-check-label ${styles.labelColor}`} htmlFor="accident-category-person-staff">
                                            <span style={{ cursor: "help", textDecoration: `${accidentCategoryAbuseDetails.person === "ACCIDENT_CATEGORY_PERSON_STAFF" || !accidentCategoryAbuseDetails.person ? "none" : "line-through"}` }} title={footNoteTwo}>職員<sup>2</sup></span>
                                        </label>
                                    </span>

                                    ／
                                    <span className="pl-4">
                                        <input className="form-check-input" type="radio" name="person" id="accident-category-person-other" value="ACCIDENT_CATEGORY_PERSON_OTHER" onChange={accidentCategoryAbuseDetailsRadioButtonHandler} checked={accidentCategoryAbuseDetails.person === "ACCIDENT_CATEGORY_PERSON_OTHER"}
                                            disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                                        <label className={`form-check-label ${styles.labelColor}`} htmlFor="accident-category-person-other" style={{ textDecoration: `${accidentCategoryAbuseDetails.person === "ACCIDENT_CATEGORY_PERSON_OTHER" || !accidentCategoryAbuseDetails.person ? "none" : "line-through"}` }}>其他服務使用者</label>
                                    </span>

                                    &nbsp;
                                    虐待
                                </label>
                            </div>
                            {
                                form.accidentCategory === "ACCIDENT_CATEGORY_ABUSE" &&
                                <div className="px-4">
                                    <div className="row ">
                                        <label className={`col-12 col-form-label ${styles.fieldTitle} pt-xl-0`}>虐待性質</label>
                                        <div className="col">
                                            <div className="form-check form-check-inline mr-3">
                                                <input className="form-check-input" type="checkbox" name="abusiveNature" id="abusive-nature-body" value="ABUSIVE_NATURE_BODY" checked={form.abusive_body === true} onClick={() => setForm({ ...form, abusive_body: !form.abusive_body })}
                                                    disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="abusive-nature-body">身體虐待</label>
                                            </div>
                                            <div className="form-check form-check-inline mr-3">
                                                <input className="form-check-input" type="checkbox" name="abusiveNature" id="abusive-nature-sexual-assault" value="ABUSIVE_NATURE_SEXUAL_ASSAULT" checked={form.abusive_sexual} onClick={() => setForm({ ...form, abusive_sexual: !form.abusive_sexual })}
                                                    disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="abusive-nature-sexual-assault">性侵犯</label>
                                            </div>
                                            <div className="form-check form-check-inline mr-3">
                                                <input className="form-check-input" type="checkbox" name="abusiveNature" id="abusive-nature-mental" value="ABUSIVE_NATURE_MENTAL" checked={form.abusive_mental} onClick={() => setForm({ ...form, abusive_mental: !form.abusive_mental })}
                                                    disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="abusive-nature-mental">精神虐待</label>
                                            </div>
                                            <div className="form-check form-check-inline mr-3">
                                                <input className="form-check-input" type="checkbox" name="abusiveNature" id="abusive-nature-negligent-care" value="ABUSIVE_NATURE_NEGLIGENT_CARE" checked={form.abusive_negligent} onClick={() => setForm({ ...form, abusive_negligent: !form.abusive_negligent })}
                                                    disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="abusive-nature-negligent-care">疏忽照顧</label>
                                            </div>
                                            <div className="form-check mb-2">
                                                <input className="form-check-input" type="checkbox" name="abusiveNature" id="abusive-nature-other" value="ABUSIVE_NATURE_OTHER" checked={form.abusive_other} onClick={() => setForm({ ...form, abusive_other: !form.abusive_other })}
                                                    disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="abusive-nature-other">其他 (請註明)</label>
                                            </div>
                                            {
                                                form.abusive_other &&
                                                <AutosizeTextarea className="form-control" placeholder="請註明" value={form.abusiveDescription} name="abusiveDescription" onChange={inputFieldHandler}
                                                    disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                                            }
                                        </div>
                                    </div>
                                </div>
                            }
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="accidentCategory" id="accident-category-conflict" value="ACCIDENT_CATEGORY_CONFLICT" onChange={radioButtonHandler}
                                    disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="accident-category-conflict">爭執以致有人身體受傷而需要報警求助</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="accidentCategory" id="accident-category-other" value="ACCIDENT_CATEGORY_OTHER" onChange={radioButtonHandler}
                                    disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="accident-category-other">其他嚴重事故以致影響服務單位的日常運作超過24小時／引起傳媒關注</label>
                            </div>

                        </div>
                    </div>

                    <div className="form-row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>事故被傳媒報導</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" id="media-reported-true" onClick={() => setForm({ ...form, mediaReports: true })} checked={form.mediaReports === true}
                                    disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="media-reported-true">是</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" id="media-reported-false" onClick={() => setForm({ ...form, mediaReports: false })} checked={form.mediaReports === false}
                                    disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="media-reported-false">否</label>
                            </div>
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>特別事故描述</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" name="incidentDescription" value={form.incidentDescription} onChange={inputFieldHandler}
                                disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                        </div>
                    </div>
                </section>

                <section className="mb-5">
                    <div className="form-row mb-3">
                        <div className="col-12 font-weight-bold">
                            <h5>有關服務使用者的資料 (如適用)</h5>
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        <div className={`col-12 ${styles.fieldTitle} ${styles.staffFieldLabel} mb-1`}>(a) 服務使用者 (一)<sup style={{ color: "red" }}>*</sup></div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>性別</label>
                        <div className="col-12 col-md-4">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" id="serviceUserGenderMale1" onChange={() => setForm({ ...form, serviceUserGenderOne: "male" })} checked={form.serviceUserGenderOne === "male"}
                                    disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="serviceUserGenderMale1">男</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" id="serviceUserGenderFemale1" onChange={() => setForm({ ...form, serviceUserGenderOne: "female" })} checked={form.serviceUserGenderOne === "female"}
                                    disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="serviceUserGenderFemale1">女</label>
                            </div>
                        </div>
                        <label className={`col-12 col-md-1 col-form-label ${styles.fieldTitle} pt-xl-0`}>年齡</label>
                        <div className="col-12 col-md-5">
                            <input type="number" className="form-control" min={0} value={form.serviceUserAgeOne} onChange={(event) => setForm({ ...form, serviceUserAgeOne: +event.target.value })}
                                disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        <div className={`col-12 ${styles.fieldTitle} ${styles.staffFieldLabel} mb-1`}>(b) 服務使用者 (二，如有)</div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`} >性別</label>
                        <div className="col-12 col-md-4">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="serviceUsers2" id="serviceUserGenderMale2" value="SERVICE_USER_GENDER_MALE_2" onChange={() => setForm({ ...form, serviceUserGenderTwo: "male" })} checked={form.serviceUserGenderTwo === "male"}
                                    disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="serviceUserGenderMale2">男</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="serviceUsers2" id="serviceUserGenderFemale2" value="SERVICE_USER_GENDER_FEMALE_2" onChange={() => setForm({ ...form, serviceUserGenderTwo: "female" })} checked={form.serviceUserGenderTwo === "female"}
                                    disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="serviceUserGenderFemale2">女</label>
                            </div>
                        </div>
                        <label className={`col-12 col-md-1 col-form-label ${styles.fieldTitle} pt-xl-0`}>年齡</label>
                        <div className="col-12 col-md-5">
                            <input type="number" className="form-control" min={0} value={form.serviceUserAgeTwo} onChange={(event) => setForm({ ...form, serviceUserAgeTwo: +event.target.value })}
                                disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        <div className={`col-12 ${styles.fieldTitle} ${styles.staffFieldLabel} mb-1`}>(c) 服務使用者 (三，如有)</div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`} >性別</label>
                        <div className="col-12 col-md-4">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="serviceUsers3" id="serviceUserGenderMale3" value="SERVICE_USER_GENDER_MALE_3" onChange={() => setForm({ ...form, serviceUserGenderThree: "male" })} checked={form.serviceUserGenderThree === "male"}
                                    disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="serviceUserGenderMale3">男</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="serviceUsers3" id="serviceUserGenderFemale3" value="SERVICE_USER_GENDER_MALE_3" onChange={() => setForm({ ...form, serviceUserGenderThree: "female" })} checked={form.serviceUserGenderThree === "female"}
                                    disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="serviceUserGenderFemale3">女</label>
                            </div>
                        </div>
                        <label className={`col-12 col-md-1 col-form-label ${styles.fieldTitle} pt-xl-0`}>年齡</label>
                        <div className="col-12 col-md-5">
                            <input type="number" className="form-control" min={0} value={form.serviceUserAgeThree} onChange={(event) => setForm({ ...form, serviceUserAgeThree: +event.target.value })}
                                disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                        </div>
                    </div>
                </section>

                <section className="mb-5">
                    <div className="form-row mb-3">
                        <div className="col-12 font-weight-bold">
                            <h5><span style={{ cursor: "help" }} title={footNoteTwo}>有關職員<sup>2</sup></span>的資料 (如適用)</h5>
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        <div className={`col-12 ${styles.fieldTitle} ${styles.staffFieldLabel} mb-1`}>(a) 職員 ( 一 )<sup style={{ color: "red" }}>*</sup></div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`} >性別</label>
                        <div className="col-12 col-md-4">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="staffGender1" id="staffGenderMale1" value="STAFF_GENDER_MALE_1" onChange={() => setForm({ ...form, staffGenderOne: "male" })} checked={form.staffGenderOne === "male"}
                                    disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="staffGenderMale1">男</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="staffGender1" id="staffGenderFemale1" value="STAFF_GENDER_FEMALE_1" onChange={() => setForm({ ...form, staffGenderOne: "female" })} checked={form.staffGenderOne === "female"}
                                    disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="staffGenderFemale1">女</label>
                            </div>
                        </div>
                        <label className={`col-12 col-md-1 col-form-label ${styles.fieldTitle} pt-xl-0`}>職位</label>
                        <div className="col-12 col-md-5">
                            <input type="text" className="form-control" name="staffPositionOne" value={form.staffPositionOne} onChange={inputFieldHandler}
                                disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        <div className={`col-12 ${styles.fieldTitle} ${styles.staffFieldLabel} mb-1`}>(b) 職員 ( 二，如有 )</div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>性別</label>
                        <div className="col-12 col-md-4">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="staffGender2" id="staffGenderMale2" value="STAFF_GENDER_MALE_2" onChange={() => setForm({ ...form, staffGenderTwo: "male" })} checked={form.staffGenderTwo === "male"}
                                    disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="staffGenderMale2">男</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="staffGender2" id="staffGenderFemale2" value="STAFF_GENDER_FEMALE_2" onChange={() => setForm({ ...form, staffGenderTwo: "female" })} checked={form.staffGenderTwo === "female"}
                                    disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="staffGenderFemale2">女</label>
                            </div>
                        </div>
                        <label className={`col-12 col-md-1 col-form-label ${styles.fieldTitle} pt-xl-0`}>職位</label>
                        <div className="col-12 col-md-5">
                            <input type="text" className="form-control" name="staffPositionTwo" value={form.staffPositionTwo} onChange={inputFieldHandler}
                                disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        <div className={`col-12 ${styles.fieldTitle} ${styles.staffFieldLabel} mb-1`}>(c) 職員 ( 三，如有 )</div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>性別</label>
                        <div className="col-12 col-md-4">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="staffGender3" id="staffGenderMale3" value="SERVICE_USER_GENDER_MALE_3" onChange={() => setForm({ ...form, staffGenderThree: "male" })} checked={form.staffGenderThree === "male"}
                                    disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="staffGenderMale3">男</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="staffGender3" id="staffGenderFemale3" value="SERVICE_USER_GENDER_MALE_3" onChange={() => setForm({ ...form, staffGenderThree: "female" })} checked={form.staffGenderThree === "female"}
                                    disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="staffGenderFemale3">女</label>
                            </div>
                        </div>
                        <label className={`col-12 col-md-1 col-form-label ${styles.fieldTitle} pt-xl-0`}>職位</label>
                        <div className="col-12 col-md-5">
                            <input type="text" className="form-control" name="staffPositionThree" value={form.staffPositionThree} onChange={inputFieldHandler}
                                disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                        </div>
                    </div>
                </section>

                <section className="mb-5">
                    <div className="form-row mb-3">
                        <div className="col-12 font-weight-bold">
                            <h5>跟進行動</h5>
                        </div>
                    </div>
                    <div className="form-row mb-4">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>報警處理</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="police" id="police-true" onClick={() => setForm({ ...form, police: true })} checked={form.police === true}
                                    disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="police-true">有</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="police" id="police-false" onClick={() => setForm({ ...form, police: false })} checked={form.police === false}
                                    disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="police-false">沒有 {isPrintMode && <span>(請註明)</span>}</label>
                            </div>
                            {
                                form.police === true &&
                                <>
                                    <div>
                                        <label className="form-label">報警日期和時間</label>
                                        <DatePicker
                                            className="form-control"
                                            selected={policeDatetime}
                                            onChange={(date) => setPoliceDatetime(date)}
                                            showTimeSelect
                                            timeFormat="p"
                                            timeIntervals={15}
                                            dateFormat="yyyy/MM/dd h:mm aa"
                                            readOnly={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)}
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">報案編號</label>
                                        <input type="text" className="form-control" name="policeReportNumber" value={form.policeReportNumber} onChange={inputFieldHandler}
                                            disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                                    </div>
                                </>
                            }
                            {
                                form.police === false &&
                                <AutosizeTextarea className="form-control" placeholder="請註明" name="policeDescription" value={form.policeDescription} onChange={inputFieldHandler}
                                    disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                            }
                        </div>
                    </div>
                    <div className="form-row mb-4">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>通知家人 / 親屬 / 監護人 / 保證人</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="notifyFamily" id="notify-family-true" value="NOTIFY_FAMILY_TRUE" checked={form.guardian === true} onClick={() => setForm({ ...form, guardian: true })}
                                    disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="notify-family-true">有</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="notifyFamily" id="notify-family-false" value="NOTIFY_FAMILY_FALSE" checked={form.guardian === false} onClick={() => setForm({ ...form, guardian: false })}
                                    disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="notify-family-false">沒有 {isPrintMode && <span>(請註明)</span>}</label>
                            </div>
                            {
                                form.guardian === true &&
                                <>
                                    <div>
                                        <label className="form-label">通知日期和時間</label>
                                        <DatePicker
                                            className="form-control"
                                            selected={guardianDatetime}
                                            onChange={(date) => setGuardianDatetime(date)}
                                            showTimeSelect
                                            timeFormat="p"
                                            timeIntervals={15}
                                            dateFormat="yyyy/MM/dd h:mm aa"
                                            readOnly={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)}
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">與服務使用者的關係</label>
                                        <input type="text" className="form-control" name="guardianRelationship" value={form.guardianRelationship} onChange={inputFieldHandler}
                                            disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                                    </div>
                                    <div>
                                        <label className="form-label">負責職員姓名</label>
                                        <input type="text" className="form-control" name="guardianStaff" value={form.guardianStaff} onChange={inputFieldHandler}
                                            disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                                    </div>
                                </>
                            }
                            {form.guardian === false &&
                                <div>
                                    <AutosizeTextarea className="form-control" placeholder="請註明" name="guardianDescription" value={form.guardianDescription} onChange={inputFieldHandler}
                                        disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                                </div>
                            }
                        </div>
                    </div>

                    <div className="form-row mb-4">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>醫療安排</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="medical" id="medical-true" value="MEDICAL_TRUE" checked={form.medicalArrangement === true} onClick={() => setForm({ ...form, medicalArrangement: true })}
                                    disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="medical-true">有 {isPrintMode && <span>(請註明)</span>}</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="medical" id="medical-false" value="MEDICAL_FALSE" checked={form.medicalArrangement === false} onClick={() => setForm({ ...form, medicalArrangement: false })}
                                    disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="medical-false">沒有</label>
                            </div>
                            {
                                form.medicalArrangement === true &&
                                <div>
                                    <AutosizeTextarea className="form-control" placeholder="請註明" name="medicalArrangmentDetail" value={form.medicalArrangmentDetail} onChange={inputFieldHandler}
                                        disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                                </div>
                            }
                        </div>
                    </div>

                    <div className="form-row mb-4">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>舉行多專業個案會議 / 為有關服務使用者訂定照顧計劃</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="meeting" id="meeting-true" value="MEETING_TRUE" onChange={() => setForm({ ...form, carePlan: true })} checked={form.carePlan === true}
                                    disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="meeting-true">有</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="meeting" id="meeting-false" value="MEETING_FALSE" onChange={() => setForm({ ...form, carePlan: false })} checked={form.carePlan === false}
                                    disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="meeting-false">沒有</label>
                            </div>
                            {
                                form.carePlan === true &&
                                <div>
                                    <AutosizeTextarea className="form-control" placeholder="請註明，包括時間" name="carePlanYesDescription" value={form.carePlanYesDescription} onChange={inputFieldHandler}
                                        disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                                </div>
                            }
                            {
                                form.carePlan === false &&
                                <div>
                                    <AutosizeTextarea className="form-control" placeholder="請註明" name="carePlanNoDescription" value={form.carePlanNoDescription} onChange={inputFieldHandler}
                                        disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                                </div>
                            }
                        </div>
                    </div>

                    <div className="form-row mb-4">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>需要回應外界團體(如：關注組、區議會、立法會等)的關注／查詢</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="response" id="response-true" value="RESPONSE_TRUE" onClick={() => setForm({ ...form, needResponse: true })} checked={form.needResponse === true}
                                    disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="response-true">有</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="response" id="response-false" value="RESPONSE_FALSE" onClick={() => setForm({ ...form, needResponse: false })} checked={form.needResponse === false}
                                    disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="response-false">沒有</label>
                            </div>
                            {
                                form.needResponse === true &&
                                <div>
                                    <AutosizeTextarea className="form-control" placeholder="請註明" name="needResponseDetail" value={form.needResponseDetail} onChange={inputFieldHandler}
                                        disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                                </div>
                            }
                        </div>
                    </div>

                    <div className="form-row mb-4">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>已作出即時的跟進行動，包括保護其他服務使用者的措施 (如適用)</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" name="immediateFollowUp" value={form.immediateFollowUp} onChange={inputFieldHandler}
                                disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                        </div>
                    </div>

                    <div className="form-row mb-4">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>跟進計劃</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" name="followUpPlan" value={form.followUpPlan} onChange={inputFieldHandler}
                                disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                        </div>
                    </div>
                </section>

                <hr className="my-4" />

                <section className="mb-5">
                    <div className="row mb-0 mb-md-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>擬備人員</label>
                        {/* <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div> */}

                    </div>
                    <div className="row mb-0 mb-md-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>姓名</label>
                        <div className="col-12 col-md-4">
                            {/* <PeoplePicker
                                context={context}
                                titleText=""
                                showtooltip={false}
                                personSelectionLimit={1}
                                ensureUser={true}
                                isRequired={false}
                                selectedItems={(e) => { console }}
                                showHiddenInUI={false} /> */}
                            <input className="form-control" value={reporter && reporter.displayName || ""} disabled />
                        </div>
                        <label className={`col-12 col-md-1 col-form-label ${styles.fieldTitle} pt-xl-0`}>職位</label>
                        <div className="col-12 col-md-5">
                            <input type="text" className="form-control" value={reporter && (reporter.jobTitle || "")} disabled={true} />
                        </div>

                    </div>
                    <div className="row mb-0 mb-md-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>電話</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" value={reporterPhone} onChange={(event) => { setReporterPhone(event.target.value) }}
                                disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus)} />
                        </div>
                        <label className={`col-12 col-md-1 col-form-label ${styles.fieldTitle} pt-xl-0`}>日期</label>
                        <div className="col-12 col-md-5">
                            <DatePicker
                                className="form-control"
                                selected={reportDate}
                                onChange={(date) => setReportDate(date)}
                                dateFormat="yyyy/MM/dd"
                                readOnly
                            />
                        </div>
                    </div>
                    {/* <div className="row">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>評語</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" />
                        </div>
                    </div> */}
                </section>

                <hr className="my-4" />

                <section className="mb-4">
                    <div className="form-row mb-2">
                        <div className="col-12 font-weight-bold mb-2">
                            <span className={styles.fieldTitle}>[此欄由高級服務經理/服務經理填寫]</span>
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/* 高級服務經理/服務經理姓名 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>高級服務經理/<span className="d-sm-inline d-md-block">服務經理姓名</span></label>
                        <div className="col-12 col-md-4">
                            {/* <PeoplePicker
                                context={context}
                                titleText=""
                                showtooltip={false}
                                personSelectionLimit={1}
                                ensureUser={true}
                                isRequired={false}
                                selectedItems={(e) => { console }}
                                showHiddenInUI={false} /> */}
                            <input type="text" className="form-control" value={`${smInfo && smInfo.Lastname || ""} ${smInfo && smInfo.Firstname || ""}`.trim() || `${smInfo && smInfo.Name || ""}`} disabled={true} />
                        </div>
                        <label className={`col-12 col-md-1 col-form-label ${styles.fieldTitle}`}>日期</label>
                        <div className="col-12 col-md-5">
                            <DatePicker className="form-control" dateFormat="yyyy/MM/dd" selected={smDate} onChange={(date) => setSmDate(date)} readOnly />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>高級服務經理/<br />服務經理評語</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" value={smComment} onChange={(event) => setSmComment(event.target.value)}
                                disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitBySm(CURRENT_USER.email, spSmInfo ? spSmInfo.Email : "", formStatus)} />
                        </div>
                    </div>
                    {
                        pendingSmApprove(currentUserRole, formStatus, formStage) &&
                        <div className="form-row mb-2">
                            <div className="col-12">
                                <div className="d-flex justify-content-center">
                                    <button className="btn btn-warning mr-3" onClick={smApproveHandler}>批准</button>
                                    <button className="btn btn-danger mr-3" onClick={smRejectHandler}>拒絕</button>
                                </div>
                            </div>
                        </div>
                    }
                </section>

                <hr className="my-4" />

                <section className="mb-5">
                    <div className="row mb-2">
                        <div className="col-12 font-weight-bold mb-2">
                            <span className={styles.fieldTitle}>[此欄由服務總監填寫]</span>
                        </div>
                    </div>
                    <div className="row mb-0 mb-md-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>批簽人員</label>
                        {/* <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div> */}
                    </div>
                    <div className="row mb-0 mb-md-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>姓名</label>
                        <div className="col-12 col-md-4">
                            {/* <PeoplePicker
                                context={context}
                                titleText=""
                                showtooltip={false}
                                personSelectionLimit={1}
                                ensureUser={true}
                                isRequired={false}
                                selectedItems={(e) => { console.log }}
                                showHiddenInUI={false} /> */}
                            <input type="text" className="form-control" value={`${sdInfo && sdInfo.Lastname || ""} ${sdInfo && sdInfo.Firstname || ""} `.trim() || `${sdInfo && sdInfo.Name || ""}`} disabled={true} />
                        </div>
                        <label className={`col-12 col-md-1 col-form-label ${styles.fieldTitle} pt-xl-0`}>職位</label>
                        <div className="col-12 col-md-5">
                            <input type="text" className="form-control" value={sdInfo && sdInfo.Title || ""} disabled />
                        </div>
                    </div>
                    <div className="row mb-0 mb-md-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>電話</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" value={sdPhoneNo} onChange={(event) => setSdPhoneNo(event.target.value)} disabled={!pendingSdApprove(currentUserRole, formStatus, formStage)} />
                        </div>
                        <label className={`col-12 col-md-1 col-form-label ${styles.fieldTitle} pt-xl-0`}>日期</label>
                        <div className="col-12 col-md-5">
                            <DatePicker
                                className="form-control"
                                selected={sdDate}
                                onChange={(date) => setSdDate(date)}
                                dateFormat="yyyy/MM/dd"
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="row mb-0 mb-md-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>服務總監評語</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" value={sdComment} onChange={(event) => setSdComment(event.target.value)}
                                disabled={!pendingSdApprove(currentUserRole, formStatus, formStage)} />
                        </div>
                    </div>
                    {
                        pendingSdApprove(currentUserRole, formStatus, formStage) &&
                        <div className="row my-2">
                            <div className="col-12">
                                <div className="d-flex justify-content-center">
                                    <button className="btn btn-warning mr-3" onClick={sdApproveHandler}>批准</button>
                                    <button className="btn btn-danger mr-3" onClick={sdRejectHandler}>拒絕</button>
                                </div>
                            </div>
                        </div>
                    }
                </section>

                <hr className="my-4" />

                <section className="py-3">
                    <div className="d-flex justify-content-center" style={{ gap: 10 }}>
                        {
                            formInitial(currentUserRole, formStatus) &&
                            <button className="btn btn-warning" onClick={submitHandler}>提交</button>
                        }
                        {
                            pendingSmApprove(currentUserRole, formStatus, formStage) &&
                            <button className="btn btn-warning" onClick={smSubmitHandler}>儲存</button>
                        }
                        {
                            formInitial(currentUserRole, formStatus) && formStatus !== "SM_VOID" &&
                            <button className="btn btn-success" onClick={draftHandler}>草稿</button>
                        }

                        <button className="btn btn-secondary" onClick={cancelHandler}>取消</button>
                    </div>
                </section>
                {
                    isPrintMode &&
                    <>
                        <hr className="my-4" />
                        <div>
                            <ol>
                                <li>{footNoteOne}</li>
                                <li>{footNoteTwo}</li>
                            </ol>
                        </div>
                    </>
                }

            </div>
        </>
    )
}
