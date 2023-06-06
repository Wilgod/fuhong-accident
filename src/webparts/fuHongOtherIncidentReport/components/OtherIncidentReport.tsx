import * as React from 'react'
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { WebPartContext } from '@microsoft/sp-webpart-base';
import Header from "../../../components/Header/Header";
import AutosizeTextarea from "../../../components/AutosizeTextarea/AutosizeTextarea";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import useServiceUnit from '../../../hooks/useServiceUnits';
import { getUserInfoByEmailInUserInfoAD, getAllServiceUnit } from '../../../api/FetchUser';
import { IErrorFields, IOtherIncidentReportProps, IOtherIncidentReportStates } from './IFuHongOtherIncidentReport';
import { createIncidentFollowUpForm, createOtherIncidentReport, updateOtherIncidentReport, deleteOtherIncidentReport } from '../../../api/PostFuHongList';
import useUserInfoAD from '../../../hooks/useUserInfoAD';
import { IUser } from '../../../interface/IUser';
import useUserInfo from '../../../hooks/useUserInfo';
import useDepartmentMangers from '../../../hooks/useDepartmentManagers';
import { Role } from '../../../utils/RoleParser';
import { adminUpdateInsuranceNumber, formInitBySm, formInitial, pendingSdApprove, pendingSmApprove } from '../permissionConfig';
import { caseNumberFactory } from '../../../utils/CaseNumberParser';
import { FormFlow, getInsuranceEMailRecords } from '../../../api/FetchFuHongList';
import { addBusinessDays, addMonths, addDays } from '../../../utils/DateUtils';
import { notifyOtherIncident, notifyIncidentReject } from '../../../api/Notification';
import { postLog } from '../../../api/LogHelper';
import useServiceUnit2 from '../../../hooks/useServiceUser2';

import { sp } from "@pnp/sp";
import { Web } from "@pnp/sp/webs"
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { IItem } from "@pnp/sp/items";
import { IItemAddResult } from "@pnp/sp/items";
import { Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as fontawesome from '@fortawesome/free-solid-svg-icons';
export default function OtherIncidentReport({ context, styles, formSubmittedHandler, currentUserRole, formData, isPrintMode, siteCollectionUrl, workflow, print, permissionList }: IOtherIncidentReportProps) {
    const [formStatus, setFormStatus] = useState("");
    const [formStage, setFormStage] = useState("");
    const [formId, setFormId] = useState(null);
    const [form, setForm] = useState<IOtherIncidentReportStates>({
        insuranceCaseNo: "",
        incidentLocation: "",
        mediaReports: undefined,
        mediaReportsDescription: "",
        incidentDescription: "",
        guardian: undefined,
        police: undefined,
        policeDescription: "",
        medicalArrangement: undefined,
        carePlan: undefined,
        needResponse: undefined,
        carePlanNoDescription: "",
        carePlanYesDescription: "",
        followUpPlan: "",
        guardianDescription: "",
        guardianRelationship: "",
        guardianStaff: "",
        immediateFollowUp: "",
        medicalArrangmentDetail: "",
        needResponseDetail: "",
        policeReportNumber: "",
        serviceUserAgeOne: null,
        serviceUserAgeThree: null,
        serviceUserAgeTwo: null,
        serviceUserGenderOne: "",
        serviceUserGenderThree: "",
        serviceUserGenderTwo: "",
        staffGenderOne: "",
        staffGenderThree: "",
        staffGenderTwo: "",
        staffPositionOne: "",
        staffPositionThree: "",
        staffPositionTwo: "",
        preparationStaffPhone: ""
    });

    const [incidentTime, setIncidentTime] = useState(null);
    const [policeDatetime, setPoliceDatetime] = useState(null);
    const [guardianDatetime, setGuardianDatetime] = useState(null);
    //IncidentTime
    //const [serviceUnitList, serviceUnit, setServiceUnit] = useServiceUnit();
    const [serviceUnit, setServiceUnit] = useState("");
    const [serviceUserUnitList, setServiceUserUnitList] = useState([]);
    const [serviceUnitTC, setServiceUnitTC] = useState("");

    const [reporter, setReporter, reporterPickerInfo] = useUserInfoAD(); // 填報人姓名
    const [reporterJobTitle, setReporterJobTitle] = useState("");
    const [serviceLocation, setServiceLocation] = useState("");
    const [submitDate, setSubmitDate] = useState(null);
    const [smDate, setSmDate] = useState(null);
    const [sdDate, setSdDate] = useState(null);
    const [sdPhone, setSdPhone] = useState("");
    const [sdComment, setSdComment] = useState("");
    const [smComment, setSmComment] = useState("");
    const [error, setError] = useState<IErrorFields>();
    const [userInfo, setCurrentUserEmail, spUserInfo] = useUserInfo(siteCollectionUrl);
    const [sdInfo, setSDEmail, spSdInfo] = useUserInfo(siteCollectionUrl);
    const [smInfo, setSMEmail, spSmInfo] = useUserInfo(siteCollectionUrl);
    const [sdJobTitle, setSdJobTitle] = useState("");
    const { departments, setHrDepartment } = useDepartmentMangers(siteCollectionUrl);
    const [openModel, setOpenModel] = useState(false);
    const [file, setFile] = useState(null);
    const [uploadButton, setUploadButton] = useState(true);
    const [filename, setFilename] = useState("Choose file");
    const [emailTo, setEmailTo] = useState("");
    const [emailBody, setEmailBody] = useState("");
    const [emailCc, setEmailCc] = useState("");
    const [sendInsuranceEmail, setSendInsuranceEmail] = useState(true);
    console.log(sdInfo);
    const radioButtonHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setForm({ ...form, [name]: value });
    }

    const CURRENT_USER: IUser = {
        email: context.pageContext.legacyPageContext.userEmail,
        name: context.pageContext.legacyPageContext.userDisplayName,
        id: context.pageContext.legacyPageContext.userId,
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

    const selectionHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setForm({ ...form, [name]: value });
    }

    const inputFieldHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setForm({ ...form, [name]: value });
    }

    const dataFactory = () => {
        let body = {};
        let error = {};



        //服務單位
        if (serviceUnit) {
            body["ServiceUnit"] = serviceUnit;
        } else {
            error["ServiceUnit"] = true;
        }

        //事故發生日期和時間
        if (incidentTime) {
            body["IncidentTime"] = incidentTime.toISOString();
        } else {
            error["IncidentTime"] = true;
        }


        //事故發生地點
        if (form.incidentLocation) {
            body["IncidentLocation"] = form.incidentLocation;
        } else {
            error["IncidentLocation"] = true;
        }

        if (form.incidentDescription) {
            body["IncidentDescription"] = form.incidentDescription;
        } else {
            error["IncidentDescription"] = true;
        }

        //事故被傳媒報導
        body["MediaReports"] = form.mediaReports;
        if (form.mediaReports) {
            if (form.mediaReportsDescription) {
                body["MediaReportsDescription"] = form.mediaReportsDescription;
            } else {
                error["MediaReportsDescription"] = true;
            }
        } else if (form.mediaReports === undefined) {
            error["MediaReports"] = true;
        }

        //(a) 服務使用者 (一)
        if (form.serviceUserGenderOne) {
            body["ServiceUserGenderOne"] = form.serviceUserGenderOne
        }

        if (form.serviceUserAgeOne) {
            body["ServiceUserAgeOne"] = form.serviceUserAgeOne;
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
        }

        if (form.staffPositionOne) {
            body["StaffPositionOne"] = form.staffPositionOne;
        }

        //(b) 職員 ( 二，如有 )
        body["StaffGenderTwo"] = form.staffGenderTwo;
        body["StaffPositionTwo"] = form.staffPositionTwo;
        //(c) 職員 ( 三，如有 )
        body["StaffGenderThree"] = form.staffGenderThree;
        body["StaffPositionThree"] = form.staffPositionThree;

        //報警處理
        body["Police"] = form.police;
        body["ServiceLocation"] = serviceLocation;
        if (form.police === true) {
            if (policeDatetime) {
                body["PoliceDatetime"] = policeDatetime.toISOString();
            } else {
                error["PoliceDatetime"] = true;
            }

            if (form.policeReportNumber) {
                body["PoliceReportNumber"] = form.policeReportNumber;
            } else {
                error["PoliceReportNumber"] = true;
            }
        } else if (form.police === false) {
            if (form.policeDescription) {
                body["PoliceDescription"] = form.policeDescription;
            }
        } else if (form.police === undefined) {
            error["Police"] = true;
        }

        //通知家人 / 親屬 / 監護人 / 保證人
        body["Guardian"] = form.guardian;
        if (form.guardian === true) {

            if (guardianDatetime) {
                body["GuardianDatetime"] = guardianDatetime.toISOString();
            } else {
                error["GuardianDatetime"] = true;
            }
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
            error["Guardian"] = true;
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

        //擬備人員
        body["PreparationStaffPhone"] = form.preparationStaffPhone;

        body["SMId"] = spSmInfo.Id;

        body["SDId"] = spSdInfo.Id;

        console.log(body);
        return [body, error]
    }

    const submitHandler = (event) => {
        event.preventDefault();
        const [body, error] = dataFactory();
        body["ReporterId"] = CURRENT_USER.id;
        body["SubmitDate"] = new Date().toISOString();
        console.log(body);
        console.log(error);
        if (Object.keys(error).length > 0) {
            setError(error);
            alert("提交錯誤");
        } else {
            if (formStatus === "SM_VOID") {
                updateOtherIncidentReport(formData.Id, {
                    ...body,
                    "Status": "PENDING_SM_APPROVE",
                    "SubmitDate": new Date().toISOString(),
                    "PreparationStaffId": CURRENT_USER.id,
                }).then((updateOtherIncidentReportRes) => {
                    console.log(updateOtherIncidentReportRes)

                    postLog({
                        AccidentTime: incidentTime.toISOString(),
                        Action: "提交至服務經理",
                        CaseNumber: formData.CaseNumber,
                        FormType: "OIN",
                        RecordId: formData.Id,
                        ServiceUnit: serviceLocation,
                        Report: "其他事故呈報表"
                    })

                    formSubmittedHandler();
                }).catch(console.error);
            } else {
                caseNumberFactory(FormFlow.OTHER_INCIDENT, serviceLocation).then((caseNumber) => {
                    console.log(caseNumber)
                    const extraBody = {
                        "Status": "PENDING_SM_APPROVE",
                        "Stage": "1",
                        "NextDeadline": addBusinessDays(new Date(), 3).toISOString(),
                        "CaseNumber": caseNumber,
                        //"PreparationDate": new Date().toISOString(),
                        "PreparationStaffId": CURRENT_USER.id,
                        "Title": "OIN",
                        "ServiceLocation": serviceLocation
                    }

                    if (CURRENT_USER.email === spSmInfo.Email) {
                        extraBody["Status"] = "PENDING_SD_APPROVE";
                        extraBody["SMDate"] = new Date().toISOString();
                        extraBody["SMComment"] = smComment
                    }

                    if (formStatus === "DRAFT") {
                        updateOtherIncidentReport(formData.Id, {
                            ...body,
                            ...extraBody
                        }).then((updateOtherIncidentReportRes) => {
                            console.log(updateOtherIncidentReportRes)
                            if (extraBody["Status"] === "PENDING_SD_APPROVE") {
                                notifyOtherIncident(context, formData.Id, 1, workflow);

                                postLog({
                                    AccidentTime: incidentTime.toISOString(),
                                    Action: "提交",
                                    CaseNumber: caseNumber,
                                    FormType: "OIN",
                                    RecordId: formData.Id,
                                    ServiceUnit: serviceLocation,
                                    Report: "其他事故呈報表"
                                })
                            } else {
                                postLog({
                                    AccidentTime: incidentTime.toISOString(),
                                    Action: "提交",
                                    CaseNumber: formData.CaseNumber,
                                    FormType: "OIN",
                                    RecordId: formData.Id,
                                    ServiceUnit: serviceLocation,
                                    Report: "其他事故呈報表"
                                })
                            }
                            formSubmittedHandler();
                        }).catch(console.error);
                    } else {
                        createOtherIncidentReport({
                            ...body,
                            ...extraBody
                        }).then(createOtherIncidentReportRes => {
                            console.log(createOtherIncidentReportRes)
                            if (extraBody["Status"] === "PENDING_SM_APPROVE") {
                                notifyOtherIncident(context, createOtherIncidentReportRes.data.Id, 1, workflow);

                                postLog({
                                    AccidentTime: incidentTime.toISOString(),
                                    Action: "提交",
                                    CaseNumber: caseNumber,
                                    FormType: "OIN",
                                    RecordId: createOtherIncidentReportRes.data.Id,
                                    ServiceUnit: serviceLocation,
                                    Report: "其他事故呈報表"
                                })
                            } else {
                                notifyOtherIncident(context, createOtherIncidentReportRes.data.Id, 1, workflow);
                                postLog({
                                    AccidentTime: incidentTime.toISOString(),
                                    Action: "提交",
                                    CaseNumber: caseNumber,
                                    FormType: "OIN",
                                    RecordId: createOtherIncidentReportRes.data.Id,
                                    ServiceUnit: serviceLocation,
                                    Report: "其他事故呈報表"
                                })
                            }
                            formSubmittedHandler();
                        }).catch(console.error);
                    }
                });
            }
        }

    }

    const draftHandler = (event) => {
        event.preventDefault();
        const [body] = dataFactory();
        if (formStatus === "DRAFT") {
            updateOtherIncidentReport(formData.Id, {
                ...body,
                "Title": "OIN",
                "Status": "DRAFT"
            }).then((updateOtherIncidentReportRes) => {
                console.log(updateOtherIncidentReportRes);
                formSubmittedHandler();
            }).catch(console.error);
        } else {
            createOtherIncidentReport({
                ...body,
                "Title": "OIN",
                "Status": "DRAFT"
            }).then(res => {
                console.log(res)
                formSubmittedHandler();
            }).catch(console.error);
        }
    }

    const deleteHandler = () => {
        deleteOtherIncidentReport(formData.Id).then(async (res) => {
            postLog({
                AccidentTime: incidentTime.toISOString(),
                Action: "刪除",
                CaseNumber: formData.CaseNumber,
                FormType: "OIN",
                RecordId: formData.Id,
                ServiceUnit: serviceLocation,
                Report: "其他事故呈報表"
            }).catch(console.error);

            formSubmittedHandler();
        }).catch(console.error);
    }

    const cancelHandler = () => {
        //implement 
        const path = context.pageContext.site.absoluteUrl + `/accident-and-incident/SitePages/Home.aspx`;
        window.open(path, "_self");
    }

    // Save
    const sdSubmitHandler = (event) => {
        event.preventDefault();

        const [body, error] = dataFactory();
        updateOtherIncidentReport(formData.Id, {
            ...body,
            "SDComment": sdComment,
            "SDDate": new Date().toISOString(),
            "SDPhone": sdPhone,
            "NextDeadline": addMonths(new Date(), 1).toISOString(),
        }).then((res) => {
            console.log(res);

            postLog({
                AccidentTime: incidentTime.toISOString(),
                Action: "提交至服務經理",
                CaseNumber: formData.CaseNumber,
                FormType: "OIN",
                RecordId: formData.Id,
                ServiceUnit: serviceLocation,
                Report: "其他事故呈報表"
            })

            formSubmittedHandler();
        });
    }

    const sdApproveHandler = (event) => {
        event.preventDefault();

        if (confirm("確認批准 ?")) {
            const [body, error] = dataFactory();
            createIncidentFollowUpForm({
                "ParentFormId": formData.Id,
                "CaseNumber": formData.CaseNumber,
                "SMId": formData.SMId,
                "SDId": formData.SDId,
                "Title": "事故跟進/結束報告 - 第1篇"
            }).then((incidentFollowUpRes) => {

                updateOtherIncidentReport(formData.Id, {
                    ...body,
                    "NextDeadline": addMonths(new Date(), 1).toISOString(),
                    "ReminderDate": addDays(new Date(), 21).toISOString(),
                    "SDComment": sdComment,
                    "SDDate": new Date().toISOString(),
                    "Stage": "2",
                    "Status": "PENDING_SM_FILL_IN",
                    "SDPhone": sdPhone,
                    "FollowUpFormsId": {
                        "results": [incidentFollowUpRes.data.Id]
                    }
                }).then((otherIncidentReportRes) => {
                    console.log(otherIncidentReportRes);

                    postLog({
                        AccidentTime: incidentTime.toISOString(),
                        Action: "批准",
                        CaseNumber: formData.CaseNumber,
                        FormType: "OIN",
                        RecordId: formData.Id,
                        ServiceUnit: serviceLocation,
                        Report: "其他事故呈報表"
                    })

                    notifyOtherIncident(context, formData.Id, 2, workflow);
                    formSubmittedHandler();
                });
            }).catch(console.error);
        }
    }
    // void , return to last step
    const sdRejectHandler = (event) => {
        event.preventDefault();
        console.log("sdRejectHandler")
        if (confirm("確認拒絕 ?")) {
            const [body, error] = dataFactory();
            updateOtherIncidentReport(formData.Id, {
                ...body,
                "SMComment": smComment,
                "SMDate": new Date().toISOString(),
                "Status": "PENDING_SM_APPROVE"
            }).then((res) => {
                notifyIncidentReject(context, formData.Id, 1, workflow);
                postLog({
                    AccidentTime: incidentTime.toISOString(),
                    Action: "拒絕",
                    CaseNumber: formData.CaseNumber,
                    FormType: "OIN",
                    RecordId: formData.Id,
                    ServiceUnit: serviceLocation,
                    Report: "其他事故呈報表"
                })

                formSubmittedHandler();
            }).catch(console.error);
        }
    }


    //Amend form information only
    const smSubmitHadnler = (event) => {
        event.preventDefault();
        console.log("smSumbitHadnler")
        const [body, error] = dataFactory();
        updateOtherIncidentReport(formData.Id, {
            ...body,
            "SMComment": smComment,
            "SMDate": new Date().toISOString(),
        }).then(res => {
            console.log(res);

            postLog({
                AccidentTime: incidentTime.toISOString(),
                Action: "批准",
                CaseNumber: formData.CaseNumber,
                FormType: "OIN",
                RecordId: formData.Id,
                ServiceUnit: serviceLocation,
                Report: "其他事故呈報表"
            })

            formSubmittedHandler();
        }).catch(console.error);
    }


    const smApproveHandler = (event) => {
        event.preventDefault();

        if (confirm("確認批准 ?")) {

            const [body, error] = dataFactory();
            updateOtherIncidentReport(formData.Id, {
                ...body,
                "Status": "PENDING_SD_APPROVE",
                "SMDate": new Date().toISOString(),
                "SMComment": smComment
            }).then(res => {
                console.log(res);
                notifyOtherIncident(context, formData.Id, 1, workflow);
                postLog({
                    AccidentTime: incidentTime.toISOString(),
                    Action: "批准",
                    CaseNumber: formData.CaseNumber,
                    FormType: "OIN",
                    RecordId: formData.Id,
                    ServiceUnit: serviceLocation,
                    Report: "其他事故呈報表"
                })

                formSubmittedHandler();
            }).catch(console.error);
        }
    }

    const smRejectHandler = (event) => {
        event.preventDefault();
        if (spSmInfo.Email === formData.Reporter.EMail) return;
        if (confirm("確認拒絕 ?")) {

            const [body, error] = dataFactory();
            updateOtherIncidentReport(formData.Id, {
                ...body,
                "Status": "SM_VOID"
            }).then((res) => {
                notifyIncidentReject(context, formData.Id, 1, workflow);
                postLog({
                    AccidentTime: incidentTime.toISOString(),
                    Action: "拒絕",
                    CaseNumber: formData.CaseNumber,
                    FormType: "OIN",
                    RecordId: formData.Id,
                    ServiceUnit: serviceLocation,
                    Report: "其他事故呈報表"
                })

                formSubmittedHandler();
            }).catch(console.error);
        }
    }

    // fill in the insurance number
    const adminSubmitHandler = (event) => {
        event.preventDefault();
        getInsuranceEMailRecords(formData.CaseNumber, "OIN", formData.Id).then((res1) => {
            if (res1.length > 0) {
                updateOtherIncidentReport(formData.Id, {
                    "InsuranceCaseNo": form.insuranceCaseNo
                }).then(res => {
                    console.log(res);

                    postLog({
                        AccidentTime: incidentTime.toISOString(),
                        Action: "更新",
                        CaseNumber: formData.CaseNumber,
                        FormType: "OIN",
                        RecordId: formData.Id,
                        ServiceUnit: serviceLocation,
                        Report: "其他事故呈報表"
                    })

                    formSubmittedHandler();
                }).catch(console.error);
            } else {
                alert('請先發送EMail');
            }
        });

    }

    async function send() {
        let values: any = {};
        let emailBodyHtml = emailBody.replace(/\n/g, '<br/>');
        values['Title'] = "-";
        values['ServiceUnit'] = serviceLocation;
        values['RecordId'] = formData.Id;
        values['CaseNumber'] = formData.CaseNumber;
        values['FormType'] = "OIN";
        values['AccidentTime'] = incidentTime.toISOString();
        values['EmailTo'] = emailTo;
        values['EmailCC'] = emailCc;
        values['EmailBody'] = emailBodyHtml;
        const addItem: IItemAddResult = await Web(context.pageContext.web.absoluteUrl).lists.getByTitle("Insurance EMail Records").items.add(values);
        const item: IItem = sp.web.lists.getByTitle("Insurance EMail Records").items.getById(addItem.data.Id);
        await item.attachmentFiles.add(encodeURIComponent(filename), file);
        setOpenModel(false);
    }

    const incomingfile = (event) => {
        const filename = event.target.files[0].name;
        setFilename(filename);
        setFile(event.target.files[0]);
        setUploadButton(false);
    }

    async function getInsuranceRecord(formData) {
        const LIST_NAME = "Insurance EMail Records";
        const result = await Web(context.pageContext.web.absoluteUrl).lists.getByTitle(LIST_NAME).items.filter(`FormType eq 'OIN' and RecordId eq '` + formData.Id + `'`).get();
        if (result.length > 0) {
            setSendInsuranceEmail(false);
        }

    }

    const loadData = async (data: any) => {
        if (data) {
            setIncidentTime(new Date(data.IncidentTime));
            setFormId(data.Id);
            setFormStatus(data.Status);
            setFormStage(data.Stage);
            setPoliceDatetime(new Date(data.PoliceDatetime));
            setGuardianDatetime(new Date(data.GuardianDatetime));
            setSmComment(data.SMComment);
            if (data.SMDate) {
                setSmDate(new Date(data.SMDate));
            }

            setSdComment(data.SDComment);
            if (data.SDDate) {
                setSdDate(new Date(data.SDDate));
            }

            if (data.Reporter) {
                setReporter([{ secondaryText: data.Reporter.EMail, id: data.Reporter.Id }]);
            }

            if (data.SubmitDate) {
                setSubmitDate(new Date(data.SubmitDate));
            }

            if (data.SM) {
                setSMEmail(data.SM.EMail);
            }
            console.log(data);
            if (data.SD) {
                console.log(data.SD.EMail)
                setSDEmail(data.SD.EMail);
            }

            if (data.ServiceUnit) {
                setServiceUnit(data.ServiceUnit);
                let ser = serviceUserUnitList.filter(o => { return o.su_Eng_name_display == data.ServiceUnit });
                if (ser.length > 0) {
                    setServiceUnitTC(ser[0].su_name_tc);

                }
                debugger
            }

            if (data.SDPhone) {
                setSdPhone(data.SDPhone);
            }

            setServiceLocation(data.ServiceLocation);
            setForm({
                insuranceCaseNo: data.InsuranceCaseNo,
                carePlan: data.CarePlan,
                carePlanNoDescription: data.CarePlanNoDescription,
                carePlanYesDescription: data.CarePlanYesDescription,
                followUpPlan: data.FollowUpPlan,
                guardian: data.Guardian,
                guardianDescription: data.GuardianDescription,
                guardianRelationship: data.GuardianRelationship,
                guardianStaff: data.GuardianStaff,
                immediateFollowUp: data.ImmediateFollowUp || "",
                incidentDescription: data.IncidentDescription || "",
                incidentLocation: data.IncidentLocation,
                mediaReports: data.MediaReports,
                mediaReportsDescription: data.MediaReportsDescription,
                medicalArrangement: data.MedicalArrangement,
                medicalArrangmentDetail: data.MedicalArrangmentDetail,
                needResponse: data.NeedResponse,
                needResponseDetail: data.NeedResponseDetail,
                police: data.Police,
                policeDescription: data.PoliceDescription,
                policeReportNumber: data.PoliceReportNumber,
                preparationStaffPhone: data.PreparationStaffPhone,
                serviceUserAgeOne: data.ServiceUserAgeOne,
                serviceUserAgeTwo: data.ServiceUserAgeTwo,
                serviceUserAgeThree: data.ServiceUserAgeThree,
                serviceUserGenderOne: data.ServiceUserGenderOne,
                serviceUserGenderTwo: data.ServiceUserGenderTwo,
                serviceUserGenderThree: data.ServiceUserGenderThree,
                staffGenderOne: data.StaffGenderOne,
                staffGenderTwo: data.StaffGenderTwo,
                staffGenderThree: data.StaffGenderThree,
                staffPositionOne: data.StaffPositionOne,
                staffPositionTwo: data.StaffPositionTwo,
                staffPositionThree: data.StaffPositionThree
            });
        }
    }

    async function getInsuranceEMailSetting() {
        try {
            const LIST_NAME = "Insurance Email Setting";
            const result = await Web(context.pageContext.web.absoluteUrl).lists.getByTitle(LIST_NAME).items.getAll();
            for (let r of result) {
                if (r.Title == 'To') {
                    setEmailTo(r.Email);
                }
                if (r.Title == 'Email Body') {
                    setEmailBody(r.Body);
                }
                if (r.Title == 'CC') {
                    setEmailCc(r.Email);
                }

            }
            return result;
        } catch (err) {
            console.error(err);
            throw new Error("get Orphan error");
        }
    }

    const emailToChangeHandler = (event) => {
        const value = event.target.value;
        setEmailTo(value)
    }

    const emailBodyChangeHandler = (event) => {
        const value = event.target.value;
        setEmailBody(value)
    }

    const changeServiceUserUnit = (event) => {
        let value = event.target.value;
        //setServiceUnitTC(value);
        setServiceUnit(value);
        debugger
        setServiceLocation(value);
        

    }


    useEffect(() => {
        if (formData && Array.isArray(serviceUserUnitList) && serviceUserUnitList.length > 0 && serviceLocation != '') {
            loadData(formData);
            getInsuranceRecord(formData);
        } else {
            setReporter([{ secondaryText: CURRENT_USER.email, id: CURRENT_USER.id }]);
        }
    }, [formData, serviceUserUnitList, serviceLocation]);

    useEffect(() => {
        if (reporter) {
            getUserInfoByEmailInUserInfoAD(siteCollectionUrl, reporter.mail).then((userInfosRes) => {

                if (Array.isArray(userInfosRes) && userInfosRes.length > 0) {
                    setReporterJobTitle(userInfosRes[0].hr_jobcode);
                }


            }).catch((err) => {
                console.error('getUserInfoByEmailInUserInfoAD error')
                console.error(err)
            });
        }
    }, [reporter])
    useEffect(() => {
        if (sdInfo) {
            getUserInfoByEmailInUserInfoAD(siteCollectionUrl, sdInfo.Email).then((userInfosRes) => {

                if (Array.isArray(userInfosRes) && userInfosRes.length > 0) {
                    debugger
                    setSdJobTitle(userInfosRes[0].hr_jobcode);
                }


            }).catch((err) => {
                console.error('getUserInfoByEmailInUserInfoAD error')
                console.error(err)
            });
        }
    }, [sdInfo])
    // Get current User info in ad
    useEffect(() => {
        getAllServiceUnit(siteCollectionUrl).then((userUnitList) => {
            if (permissionList.indexOf('All') >= 0) {
                setServiceUserUnitList(userUnitList);
            } else {
                console.log('permissionList', permissionList);
                console.log('userUnitList', userUnitList);
                let filterList = [];
                for (let unit of userUnitList) {
                    let filterP = permissionList.filter(item => { return item == unit.su_Eng_name_display });
                    if (filterP.length > 0) {
                        filterList.push(unit);
                    }
                }
                debugger
                setServiceUserUnitList(filterList);
            }



        }).catch(console.error);
        setCurrentUserEmail(CURRENT_USER.email);
        getInsuranceEMailSetting();
    }, []);

    // Find SD && SM
    useEffect(() => {
        if (formInitial(currentUserRole, formStatus) && Array.isArray(serviceUserUnitList) && serviceUserUnitList.length > 0) {
            /*if (CURRENT_USER.email === "FHS.portal.dev@fuhong.hk") {
                setHrDepartment("CHH");
                setServiceUnit("CHH");
                return;
            }*/

            if (userInfo && userInfo.hr_deptid) {
                debugger
                setHrDepartment(userInfo.hr_deptid);
                setServiceUnit(userInfo.hr_deptid);
                let ser = serviceUserUnitList.filter(o => { return o.su_Eng_name_display == userInfo.hr_deptid });
                if (ser.length > 0) {
                    setServiceUnitTC(ser[0].su_name_tc);

                }
                setServiceLocation(userInfo.hr_location);
            }
        }
    }, [userInfo, serviceUserUnitList]);

    // Get SD & SM
    useEffect(() => {
        if (formInitial(currentUserRole, formStatus)) {
            if (Array.isArray(departments) && departments.length) {
                const dept = departments[0];
                console.log(dept);
                if (dept && dept.hr_deptmgr && dept.hr_deptmgr !== "[empty]") {
                    console.log("hi");
                    setSMEmail(dept.hr_deptmgr);
                }

                if (dept && dept.hr_sd && dept.hr_sd !== "[empty]") {
                    debugger
                    setSDEmail(dept.hr_sd);
                }
            }
        }
    }, [departments]);


    useEffect(() => {
        setHrDepartment(serviceUnit)
    }, [serviceUnit]);

    console.log('serviceUnit', serviceUnit);
    console.log('permissionList', permissionList);
    console.log('serviceUserUnitList', serviceUserUnitList);
    return (
        <>
            {isPrintMode && <Header displayName="其他事故呈報表" />}

            <div className="container-fluid px-4 pt-4">
                <section className="mb-5">
                    {/* <div className="row">
                        <div className="col-12 font-weight-bold">
                            <h5>檔案編號</h5>
                        </div>
                    </div> */}

                    <div className="form-row mb-2">
                        {/* 服務單位 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>服務單位</label>
                        <div className="col-12 col-md-4">
                            <select className={`custom-select ${(error && error['ServiceUserUnit']) ? "is-invalid" : ""}`} value={serviceUnit} onChange={(event) => { changeServiceUserUnit(event) }}//setPatientServiceUnit(event.target.value)
                                disabled={(!pendingSmApprove(context, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus))}
                            >
                                <option value={""} ></option>
                                {serviceUnit != "" && permissionList.indexOf('All') >= 0 &&
                                    serviceUserUnitList.map((item) => {
                                        console.log('serviceUnit1234', serviceUnit);
                                        if (serviceUnit == 'JFP') {
                                            console.log('serviceUnit', serviceUnit);
                                            debugger
                                        }
                                        return <option value={item.su_Eng_name_display} selected={serviceUnit != '' && item.su_Eng_name_display == serviceUnit}>{item.su_name_tc}</option>
                                    })
                                }
                                {serviceUnit == "" && permissionList.indexOf('All') >= 0 &&
                                    serviceUserUnitList.map((item) => {
                                        console.log('serviceUnit1234', serviceUnit);

                                        return <option value={item.su_Eng_name_display} selected={serviceUnit != '' && item.su_Eng_name_display == serviceUnit}>{item.su_name_tc}</option>
                                    })
                                }
                                {serviceUnit != "" && permissionList.indexOf('All') < 0 &&
                                    permissionList.map((item) => {
                                        let ser = serviceUserUnitList.filter(o => { return o.su_Eng_name_display == item });

                                        if (ser.length > 0) {
                                            return <option value={ser[0].su_Eng_name_display} selected={serviceUnit != '' && item.su_Eng_name_display == serviceUnit}>{ser[0].su_name_tc}</option>
                                        }

                                    })
                                }
                                {serviceUnit == "" && permissionList.indexOf('All') < 0 &&
                                    permissionList.map((item) => {
                                        let ser = serviceUserUnitList.filter(o => { return o.su_Eng_name_display == item });

                                        if (ser.length > 0) {
                                            return <option value={ser[0].su_Eng_name_display} selected={serviceUnit != '' && item.su_Eng_name_display == serviceUnit}>{ser[0].su_name_tc}</option>
                                        }

                                    })
                                }
                            </select>
                            {/*<input type="text" className={`form-control  ${(error && error['ServiceUnit']) ? "is-invalid" : ""}`} value={serviceUnitTC || ""} disabled />*/}

                        </div>

                        {/* 保險公司備案編號 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>保險公司備案編號</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" name="insuranceCaseNo" value={form.insuranceCaseNo} onChange={inputFieldHandler} disabled={!adminUpdateInsuranceNumber(currentUserRole, formStatus)} />
                        </div>
                    </div>
                </section>

                <section className="mb-5">
                    <div className="form-row mb-2">
                        <div className="col-12 font-weight-bold">
                            <h5>事故資料</h5>
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        {/* 事故發生日期 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>事故發生日期和時間</label>
                        <div className="col-12 col-md-4">
                            <DatePicker
                                className={`form-control ${(error && error['IncidentTime']) ? "is-invalid" : ""}`}
                                selected={incidentTime}
                                onChange={(date) => setIncidentTime(date)}
                                showTimeSelect
                                timeFormat="p"
                                timeIntervals={15}
                                dateFormat="yyyy/MM/dd h:mm aa"
                                readOnly={!formInitial(currentUserRole, formStatus) && !pendingSmApprove(context, formStatus, formStage, smInfo) && !pendingSdApprove(context, formStatus, formStage, sdInfo)}
                            />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/* 事故發生地點 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>事故發生地點</label>
                        <div className="col">
                            <input type="text" className={`form-control ${(error && error['IncidentLocation']) ? "is-invalid" : ""}`} name="incidentLocation" value={form.incidentLocation} onChange={inputFieldHandler} disabled={!formInitial(currentUserRole, formStatus) && !pendingSmApprove(context, formStatus, formStage, smInfo) && !pendingSdApprove(context, formStatus, formStage, sdInfo)} />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>事故被傳媒報導</label>
                        <div className={`col ${(error && error['MediaReports']) ? styles.divInvalid : ""}`}>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="reportedByNews" id="reportedByNews_true" onChange={() => setForm({ ...form, mediaReports: true })} checked={form.mediaReports === true} disabled={!formInitial(currentUserRole, formStatus) && !pendingSmApprove(context, formStatus, formStage, smInfo) && !pendingSdApprove(context, formStatus, formStage, sdInfo)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="reportedByNews_true">是</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="reportedByNews" id="reportedByNews_false" onChange={() => setForm({ ...form, mediaReports: false })} checked={form.mediaReports === false} disabled={!formInitial(currentUserRole, formStatus) && !pendingSmApprove(context, formStatus, formStage, smInfo) && !pendingSdApprove(context, formStatus, formStage, sdInfo)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="reportedByNews_false">否</label>
                            </div>
                            {
                                form.mediaReports === true &&
                                <AutosizeTextarea className={`form-control ${(error && error['MediaReportsDescription']) ? "is-invalid" : ""}`} placeholder="請註明" name="mediaReportsDescription" value={form.mediaReportsDescription} onChange={inputFieldHandler} disabled={!formInitial(currentUserRole, formStatus) && !pendingSmApprove(context, formStatus, formStage, smInfo) && !pendingSdApprove(context, formStatus, formStage, sdInfo)} />
                            }
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>事故的描述</label>
                        <div className="col">
                            <AutosizeTextarea className={`form-control ${(error && error['IncidentDescription']) ? "is-invalid" : ""}`} name="incidentDescription" value={form.incidentDescription} onChange={inputFieldHandler} disabled={!formInitial(currentUserRole, formStatus) && !pendingSmApprove(context, formStatus, formStage, smInfo) && !pendingSdApprove(context, formStatus, formStage, sdInfo)} />
                        </div>
                    </div>
                </section>

                <section className="mb-5">
                    <div className="form-row mb-2">
                        <div className="col-12 font-weight-bold mb-2">
                            <h5>有關服務使用者的資料 (如適用)</h5>
                        </div>
                    </div>
                    <div className={`form-row mb-2`}>
                        <div className={`col-12 ${styles.fieldTitle} ${styles.staffFieldLabel}`}>(a) 服務使用者 (一)</div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>性別</label>
                        <div className={`col-12 col-md-4 d-flex align-items-center`}>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="serviceUsers1" id="serviceUserGenderMale1" onChange={() => setForm({ ...form, serviceUserGenderOne: "male" })} checked={form.serviceUserGenderOne === "male"} disabled={!formInitial(currentUserRole, formStatus) && !pendingSmApprove(context, formStatus, formStage, smInfo) && !pendingSdApprove(context, formStatus, formStage, sdInfo)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="serviceUserGenderMale1">男</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="serviceUsers1" id="serviceUserGenderFemale1" onChange={() => setForm({ ...form, serviceUserGenderOne: "female" })} checked={form.serviceUserGenderOne === "female"} disabled={!formInitial(currentUserRole, formStatus) && !pendingSmApprove(context, formStatus, formStage, smInfo) && !pendingSdApprove(context, formStatus, formStage, sdInfo)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="serviceUserGenderFemale1">女</label>
                            </div>
                        </div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>年齡</label>
                        <div className="col-12 col-md-4">
                            <input type="number" className={`form-control`} min={0} value={form.serviceUserAgeOne} onChange={(event) => setForm({ ...form, serviceUserAgeOne: +event.target.value })} disabled={!formInitial(currentUserRole, formStatus) && !pendingSmApprove(context, formStatus, formStage, smInfo) && !pendingSdApprove(context, formStatus, formStage, sdInfo)} />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        <div className={`col-12 ${styles.fieldTitle}  ${styles.staffFieldLabel}`}>(b) 服務使用者 (二，如有)</div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`} >性別</label>
                        <div className="col-12 col-md-4 d-flex align-items-center">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="serviceUsers2" id="serviceUserGenderMale2" value="SERVICE_USER_GENDER_MALE_2" onChange={() => setForm({ ...form, serviceUserGenderTwo: "male" })} checked={form.serviceUserGenderTwo === "male"} disabled={!formInitial(currentUserRole, formStatus) && !pendingSmApprove(context, formStatus, formStage, smInfo) && !pendingSdApprove(context, formStatus, formStage, sdInfo)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="serviceUserGenderMale2">男</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="serviceUsers2" id="serviceUserGenderFemale2" value="SERVICE_USER_GENDER_FEMALE_2" onChange={() => setForm({ ...form, serviceUserGenderTwo: "female" })} checked={form.serviceUserGenderTwo === "female"} disabled={!formInitial(currentUserRole, formStatus) && !pendingSmApprove(context, formStatus, formStage, smInfo) && !pendingSdApprove(context, formStatus, formStage, sdInfo)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="serviceUserGenderFemale2">女</label>
                            </div>
                        </div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>年齡</label>
                        <div className="col-12 col-md-4">
                            <input type="number" className="form-control" min={0} value={form.serviceUserAgeTwo} onChange={(event) => setForm({ ...form, serviceUserAgeTwo: +event.target.value })} disabled={!formInitial(currentUserRole, formStatus) && !pendingSmApprove(context, formStatus, formStage, smInfo) && !pendingSdApprove(context, formStatus, formStage, sdInfo)} />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        <div className={`col-12 ${styles.fieldTitle}  ${styles.staffFieldLabel}`}>(c) 服務使用者 (三，如有)</div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`} >性別</label>
                        <div className="col-12 col-md-4 d-flex align-items-center">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="serviceUsers3" id="serviceUserGenderMale3" value="SERVICE_USER_GENDER_MALE_3" onChange={() => setForm({ ...form, serviceUserGenderThree: "male" })} checked={form.serviceUserGenderThree === "male"} disabled={!formInitial(currentUserRole, formStatus) && !pendingSmApprove(context, formStatus, formStage, smInfo) && !pendingSdApprove(context, formStatus, formStage, sdInfo)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="serviceUserGenderMale3">男</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="serviceUsers3" id="serviceUserGenderFemale3" value="SERVICE_USER_GENDER_MALE_3" onChange={() => setForm({ ...form, serviceUserGenderThree: "female" })} checked={form.serviceUserGenderThree === "female"} disabled={!formInitial(currentUserRole, formStatus) && !pendingSmApprove(context, formStatus, formStage, smInfo) && !pendingSdApprove(context, formStatus, formStage, sdInfo)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="serviceUserGenderFemale3">女</label>
                            </div>
                        </div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>年齡</label>
                        <div className="col-12 col-md-4">
                            <input type="number" className="form-control" min={0} value={form.serviceUserAgeThree} onChange={(event) => setForm({ ...form, serviceUserAgeThree: +event.target.value })} disabled={!formInitial(currentUserRole, formStatus) && !pendingSmApprove(context, formStatus, formStage, smInfo) && !pendingSdApprove(context, formStatus, formStage, sdInfo)} />
                        </div>
                    </div>
                </section>

                <section className="mb-4">
                    <div className="form-row mb-2">
                        <div className="col-12 font-weight-bold mb-2">
                            <h5>有關職員的資料 (如適用)</h5>
                        </div>
                    </div>
                    <div className="form-row row mb-2">
                        <div className={`col-12 ${styles.fieldTitle} ${styles.staffFieldLabel}`}>(a) 職員 ( 一 )</div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`} >性別</label>
                        <div className={`col-12 col-md-4 d-flex align-items-center`}>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="staffGender1" id="staffGenderMale1" value="SERVICE_USER_GENDER_MALE_3" onChange={() => setForm({ ...form, staffGenderOne: "male" })} checked={form.staffGenderOne === "male"} disabled={!formInitial(currentUserRole, formStatus) && !pendingSmApprove(context, formStatus, formStage, smInfo) && !pendingSdApprove(context, formStatus, formStage, sdInfo)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="staffGenderMale1">男</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="staffGender1" id="staffGenderFemale1" value="SERVICE_USER_GENDER_MALE_3" onChange={() => setForm({ ...form, staffGenderOne: "female" })} checked={form.staffGenderOne === "female"} disabled={!formInitial(currentUserRole, formStatus) && !pendingSmApprove(context, formStatus, formStage, smInfo) && !pendingSdApprove(context, formStatus, formStage, sdInfo)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="staffGenderFemale1">女</label>
                            </div>
                        </div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>職位</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className={`form-control`} name="staffPositionOne" value={form.staffPositionOne} onChange={inputFieldHandler} disabled={!formInitial(currentUserRole, formStatus) && !pendingSmApprove(context, formStatus, formStage, smInfo) && !pendingSdApprove(context, formStatus, formStage, sdInfo)} />
                        </div>
                    </div>
                    <div className="form-row row mb-2">
                        <div className={`col-12 ${styles.fieldTitle}  ${styles.staffFieldLabel}`}>(b) 職員 ( 二，如有 )</div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`} >性別</label>
                        <div className="col-12 col-md-4 d-flex align-items-center">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="staffGender2" id="staffGenderMale2" onChange={() => setForm({ ...form, staffGenderTwo: "male" })} checked={form.staffGenderTwo === "male"} disabled={!formInitial(currentUserRole, formStatus) && !pendingSmApprove(context, formStatus, formStage, smInfo) && !pendingSdApprove(context, formStatus, formStage, sdInfo)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="staffGenderMale2">男</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="staffGender2" id="staffGenderFemale2" onChange={() => setForm({ ...form, staffGenderTwo: "female" })} checked={form.staffGenderTwo === "female"} disabled={!formInitial(currentUserRole, formStatus) && !pendingSmApprove(context, formStatus, formStage, smInfo) && !pendingSdApprove(context, formStatus, formStage, sdInfo)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="staffGenderFemale2">女</label>
                            </div>
                        </div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>職位</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" name="staffPositionTwo" value={form.staffPositionTwo} onChange={inputFieldHandler} disabled={!formInitial(currentUserRole, formStatus) && !pendingSmApprove(context, formStatus, formStage, smInfo) && !pendingSdApprove(context, formStatus, formStage, sdInfo)} />
                        </div>
                    </div>
                    <div className="form-row row mb-2">
                        <div className={`col-12 ${styles.fieldTitle}  ${styles.staffFieldLabel}`}>(c) 職員 ( 三，如有 )</div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>性別</label>
                        <div className="col-12 col-md-4 d-flex align-items-center">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="staffGender3" id="staffGenderMale3" onChange={() => setForm({ ...form, staffGenderThree: "male" })} checked={form.staffGenderThree === "male"} disabled={!formInitial(currentUserRole, formStatus) && !pendingSmApprove(context, formStatus, formStage, smInfo) && !pendingSdApprove(context, formStatus, formStage, sdInfo)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="staffGenderMale3">男</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="staffGender3" id="staffGenderFemale3" onChange={() => setForm({ ...form, staffGenderThree: "female" })} checked={form.staffGenderThree === "female"} disabled={!formInitial(currentUserRole, formStatus) && !pendingSmApprove(context, formStatus, formStage, smInfo) && !pendingSdApprove(context, formStatus, formStage, sdInfo)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="staffGenderFemale3">女</label>
                            </div>
                        </div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>職位</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" name="staffPositionThree" value={form.staffPositionThree} onChange={inputFieldHandler} disabled={!formInitial(currentUserRole, formStatus) && !pendingSmApprove(context, formStatus, formStage, smInfo) && !pendingSdApprove(context, formStatus, formStage, sdInfo)} />
                        </div>
                    </div>
                </section>

                <section className="mb-4">
                    <div className="form-row mb-2">
                        <div className="col-12 font-weight-bold mb-2">
                            <h5>跟進行動</h5>
                        </div>
                    </div>
                    <div className="form-row row mb-4">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>報警處理</label>
                        <div className={`col ${(error && error['Police']) ? styles.divInvalid : ""}`}>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="police" id="police-true" onClick={() => setForm({ ...form, police: true })} checked={form.police === true} disabled={!formInitial(currentUserRole, formStatus) && !pendingSmApprove(context, formStatus, formStage, smInfo) && !pendingSdApprove(context, formStatus, formStage, sdInfo)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="police-true">有</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="police" id="police-false" onClick={() => setForm({ ...form, police: false })} checked={form.police === false} disabled={!formInitial(currentUserRole, formStatus) && !pendingSmApprove(context, formStatus, formStage, smInfo) && !pendingSdApprove(context, formStatus, formStage, sdInfo)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="police-false">沒有</label>
                            </div>
                            {
                                form.police === true &&
                                <>
                                    <div>
                                        <label className="form-label">報警日期和時間</label>
                                        <DatePicker
                                            className={`form-control ${(error && error['PoliceDatetime']) ? "is-invalid" : ""}`}
                                            selected={policeDatetime}
                                            onChange={(date) => setPoliceDatetime(date)}
                                            showTimeSelect
                                            timeFormat="p"
                                            timeIntervals={15}
                                            dateFormat="yyyy/MM/dd h:mm aa"
                                            readOnly={!formInitial(currentUserRole, formStatus) && !pendingSmApprove(context, formStatus, formStage, smInfo) && !pendingSdApprove(context, formStatus, formStage, sdInfo)}
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">報案編號</label>
                                        <input type="text" className={`form-control ${(error && error['PoliceReportNumber']) ? "is-invalid" : ""}`} name="policeReportNumber" value={form.policeReportNumber} onChange={inputFieldHandler} disabled={!formInitial(currentUserRole, formStatus) && !pendingSmApprove(context, formStatus, formStage, smInfo) && !pendingSdApprove(context, formStatus, formStage, sdInfo)} />
                                    </div>
                                </>
                            }
                            {
                                form.police === false &&
                                <AutosizeTextarea className={`form-control`} placeholder="請註明" name="policeDescription" value={form.policeDescription} onChange={inputFieldHandler} disabled={!formInitial(currentUserRole, formStatus) && !pendingSmApprove(context, formStatus, formStage, smInfo) && !pendingSdApprove(context, formStatus, formStage, sdInfo)} />
                            }
                        </div>
                    </div>

                    <div className="form-row row mb-4">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>通知家人 / 親屬 / 監護人 / 保證人</label>
                        <div className={`col ${(error && error['Guardian']) ? styles.divInvalid : ""}`}>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="notifyFamily" id="notify-family-true" value="NOTIFY_FAMILY_TRUE" checked={form.guardian === true} onClick={() => setForm({ ...form, guardian: true })} disabled={!formInitial(currentUserRole, formStatus) && !pendingSmApprove(context, formStatus, formStage, smInfo) && !pendingSdApprove(context, formStatus, formStage, sdInfo)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="notify-family-true">有</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="notifyFamily" id="notify-family-false" value="NOTIFY_FAMILY_FALSE" checked={form.guardian === false} onClick={() => setForm({ ...form, guardian: false })} disabled={!formInitial(currentUserRole, formStatus) && !pendingSmApprove(context, formStatus, formStage, smInfo) && !pendingSdApprove(context, formStatus, formStage, sdInfo)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="notify-family-false">沒有</label>
                            </div>
                            {
                                form.guardian === true &&
                                <>
                                    <div>
                                        <label className="form-label">通知日期和時間</label>
                                        <DatePicker
                                            className={`form-control ${(error && error['GuardianDatetime']) ? "is-invalid" : ""}`}
                                            selected={guardianDatetime}
                                            onChange={(date) => setGuardianDatetime(date)}
                                            showTimeSelect
                                            timeFormat="p"
                                            timeIntervals={15}
                                            dateFormat="yyyy/MM/dd h:mm aa"
                                            readOnly={!formInitial(currentUserRole, formStatus) && !pendingSmApprove(context, formStatus, formStage, smInfo) && !pendingSdApprove(context, formStatus, formStage, sdInfo)}
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">與服務使用者的關係</label>
                                        <input type="text" className={`form-control ${(error && error['GuardianRelationship']) ? "is-invalid" : ""}`} name="guardianRelationship" value={form.guardianRelationship} onChange={inputFieldHandler} disabled={!formInitial(currentUserRole, formStatus) && !pendingSmApprove(context, formStatus, formStage, smInfo) && !pendingSdApprove(context, formStatus, formStage, sdInfo)} />
                                    </div>
                                    <div>
                                        <label className="form-label">負責職員姓名</label>
                                        <input type="text" className={`form-control ${(error && error['GuardianStaff']) ? "is-invalid" : ""}`} name="guardianStaff" value={form.guardianStaff} onChange={inputFieldHandler} disabled={!formInitial(currentUserRole, formStatus) && !pendingSmApprove(context, formStatus, formStage, smInfo) && !pendingSdApprove(context, formStatus, formStage, sdInfo)} />
                                    </div>
                                </>
                            }
                            {form.guardian === false &&
                                <div>
                                    <AutosizeTextarea className="form-control" placeholder="請註明" name="guardianDescription" value={form.guardianDescription} onChange={inputFieldHandler} disabled={!formInitial(currentUserRole, formStatus) && !pendingSmApprove(context, formStatus, formStage, smInfo) && !pendingSdApprove(context, formStatus, formStage, sdInfo)} />
                                </div>
                            }
                        </div>
                    </div>

                    <div className="form-row row mb-4">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>醫療安排</label>
                        <div className={`col ${(error && error['MedicalArrangement']) ? styles.divInvalid : ""}`}>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="medical" id="medical-true" checked={form.medicalArrangement === true} onClick={() => setForm({ ...form, medicalArrangement: true })} disabled={!formInitial(currentUserRole, formStatus) && !pendingSmApprove(context, formStatus, formStage, smInfo) && !pendingSdApprove(context, formStatus, formStage, sdInfo)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="medical-true">有</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="medical" id="medical-false" checked={form.medicalArrangement === false} onClick={() => setForm({ ...form, medicalArrangement: false })} disabled={!formInitial(currentUserRole, formStatus) && !pendingSmApprove(context, formStatus, formStage, smInfo) && !pendingSdApprove(context, formStatus, formStage, sdInfo)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="medical-false">沒有</label>
                            </div>
                            {
                                form.medicalArrangement === true &&
                                <div>
                                    <AutosizeTextarea className={`form-control ${(error && error['MedicalArrangmentDetail']) ? "is-invalid" : ""}`} placeholder="請註明" name="medicalArrangmentDetail" value={form.medicalArrangmentDetail} onChange={inputFieldHandler} disabled={!formInitial(currentUserRole, formStatus) && !pendingSmApprove(context, formStatus, formStage, smInfo) && !pendingSdApprove(context, formStatus, formStage, sdInfo)} />
                                </div>
                            }
                        </div>
                    </div>

                    <div className="form-row row mb-4">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>舉行專業個案會議 / 為有關服務使用者訂定照顧計劃</label>
                        <div className={`col ${(error && error['CarePlan']) ? styles.divInvalid : ""}`}>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="meeting" id="meeting-true" onChange={() => setForm({ ...form, carePlan: true })} checked={form.carePlan === true} disabled={!formInitial(currentUserRole, formStatus) && !pendingSmApprove(context, formStatus, formStage, smInfo) && !pendingSdApprove(context, formStatus, formStage, sdInfo)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="meeting-true">有</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="meeting" id="meeting-false" onChange={() => setForm({ ...form, carePlan: false })} checked={form.carePlan === false} disabled={!formInitial(currentUserRole, formStatus) && !pendingSmApprove(context, formStatus, formStage, smInfo) && !pendingSdApprove(context, formStatus, formStage, sdInfo)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="meeting-false">沒有</label>
                            </div>
                            {
                                form.carePlan === true &&
                                <div>
                                    <AutosizeTextarea className={`form-control ${(error && error['CarePlanYesDescription']) ? "is-invalid" : ""}`} placeholder="請註明，包括日期" name="carePlanYesDescription" value={form.carePlanYesDescription} onChange={inputFieldHandler} disabled={!formInitial(currentUserRole, formStatus) && !pendingSmApprove(context, formStatus, formStage, smInfo) && !pendingSdApprove(context, formStatus, formStage, sdInfo)} />
                                </div>
                            }
                            {
                                form.carePlan === false &&
                                <div>
                                    <AutosizeTextarea className={`form-control`} placeholder="請註明" name="carePlanNoDescription" value={form.carePlanNoDescription} onChange={inputFieldHandler} disabled={!formInitial(currentUserRole, formStatus) && !pendingSmApprove(context, formStatus, formStage, smInfo) && !pendingSdApprove(context, formStatus, formStage, sdInfo)} />
                                </div>
                            }
                        </div>
                    </div>

                    <div className="form-row row mb-4">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>需要回應外界團體(如：關注組、區議會、立法會等)的關注／查詢</label>
                        <div className={`col ${(error && error['NeedResponse']) ? styles.divInvalid : ""}`}>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="response" id="response-true" value="RESPONSE_TRUE" onClick={() => setForm({ ...form, needResponse: true })} checked={form.needResponse === true} disabled={!formInitial(currentUserRole, formStatus) && !pendingSmApprove(context, formStatus, formStage, smInfo) && !pendingSdApprove(context, formStatus, formStage, sdInfo)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="response-true">是</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="response" id="response-false" value="RESPONSE_FALSE" onClick={() => setForm({ ...form, needResponse: false })} checked={form.needResponse === false} disabled={!formInitial(currentUserRole, formStatus) && !pendingSmApprove(context, formStatus, formStage, smInfo) && !pendingSdApprove(context, formStatus, formStage, sdInfo)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="response-false">否</label>
                            </div>
                            {
                                form.needResponse === true &&
                                <div>
                                    <AutosizeTextarea className={`form-control ${(error && error['NeedResponseDetail']) ? "is-invalid" : ""}`} placeholder="請註明" name="needResponseDetail" value={form.needResponseDetail} onChange={inputFieldHandler} disabled={!formInitial(currentUserRole, formStatus) && !pendingSmApprove(context, formStatus, formStage, smInfo) && !pendingSdApprove(context, formStatus, formStage, sdInfo)} />
                                </div>
                            }
                        </div>
                    </div>

                    <div className="form-row row mb-4">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>已作出即時的跟進行動，包括保護其他服務使用者的措施 (如適用)</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" name="immediateFollowUp" value={form.immediateFollowUp} onChange={inputFieldHandler} disabled={!formInitial(currentUserRole, formStatus) && !pendingSmApprove(context, formStatus, formStage, smInfo) && !pendingSdApprove(context, formStatus, formStage, sdInfo)} />
                        </div>
                    </div>

                    <div className="form-row row mb-4">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>跟進計劃</label>
                        <div className="col">
                            <AutosizeTextarea className={`form-control ${(error && error['FollowUpPlan']) ? "is-invalid" : ""}`} name="followUpPlan" value={form.followUpPlan} onChange={inputFieldHandler} disabled={!formInitial(currentUserRole, formStatus) && !pendingSmApprove(context, formStatus, formStage, smInfo) && !pendingSdApprove(context, formStatus, formStage, sdInfo)} />
                        </div>
                    </div>
                </section>


                <hr className="my-4" />

                <section className="mb-4">
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
                                selectedItems={setReporter}
                                showHiddenInUI={false}
                                defaultSelectedUsers={
                                    reporter && [reporter.mail]
                                } /> */}
                            <input className="form-control" value={reporter && reporter.displayName || ""} disabled />
                        </div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>職位</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" value={reporter && (reporterJobTitle || "")} disabled={true} />
                        </div>

                    </div>
                    <div className="row mb-0 mb-md-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>電話</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" name="preparationStaffPhone" placeholder={reporter && reporter.mobilePhone || ""} value={form.preparationStaffPhone} onChange={inputFieldHandler} disabled={!formInitial(currentUserRole, formStatus)} />
                        </div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>日期</label>
                        <div className="col-12 col-md-4">
                            <DatePicker
                                className="form-control"
                                onChange={(date) => setSubmitDate(date)}
                                selected={submitDate}
                                dateFormat="yyyy/MM/dd"
                                readOnly={true}
                            />
                        </div>
                    </div>
                </section>

                <hr className="my-4" />

                <section className="mb-4">
                    <div className="form-row mb-2">
                        <div className="col-12 font-weight-bold mb-2">
                            <span className={`${styles.fieldTitle} ${styles.fillIn}`}>[此欄由高級服務經理/服務經理填寫]</span>
                        </div>
                    </div>
                    <div className="form-row row mb-2">
                        {/* 高級服務經理/服務經理姓名 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>高級服務經理/<span className="d-sm-inline d-md-block">服務經理姓名</span></label>
                        <div className="col-12 col-md-4">
                            {/*<input type="text" className="form-control" value={`${smInfo && smInfo.Lastname || ""} ${smInfo && smInfo.Firstname || ""}`.trim() || `${smInfo && smInfo.Name || ""}`} disabled={true} />*/}
                            {
                                formInitial(currentUserRole, formStatus) && Array.isArray(departments) && departments.length > 0 && departments[0].override === true ?
                                    <select className={`custom-select`} value={smInfo && smInfo.Email} onChange={(event => setSMEmail(event.target.value))}
                                        disabled={!pendingSmApprove(context, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus)}>
                                        <option value={departments[0].hr_deptmgr}>{departments[0].hr_deptmgr}</option>
                                        <option value={departments[0].new_deptmgr}>{departments[0].new_deptmgr}</option>
                                    </select>
                                    :
                                    <input type="text" className="form-control" value={`${smInfo && smInfo.Lastname || ""} ${smInfo && smInfo.Firstname || ""}`.trim() || `${smInfo && smInfo.Name || ""}`} disabled={true} />
                            }
                        </div>
                        <label className={`col-12 col-md-1 col-form-label ${styles.fieldTitle} pt-xl-0`}>日期</label>
                        <div className="col-12 col-md-5">
                            <DatePicker className="form-control" dateFormat="yyyy/MM/dd" selected={smDate} onChange={(date) => setSmDate(date)} readOnly />
                        </div>
                    </div>
                    <div className="form-row row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>高級服務經理/<span className="d-sm-inline d-md-block">服務經理評語</span></label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" value={smComment} onChange={(event) => setSmComment(event.target.value)}
                                disabled={!pendingSmApprove(context, formStatus, formStage, smInfo) && !formInitBySm(CURRENT_USER.email, spSmInfo ? spSmInfo.Email : "", formStatus)} />
                        </div>
                    </div>
                    {
                        pendingSmApprove(context, formStatus, formStage, smInfo) &&
                        <div className="form-row row mb-2">
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

                <section className="mb-4">
                    <div className="row mb-2">
                        <div className="col-12 font-weight-bold mb-2">
                            <span className={`${styles.fieldTitle} ${styles.fillIn}`}>[此欄由服務總監填寫]</span>
                        </div>
                    </div>
                    <div className="row mb-0 mb-md-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>批簽人員</label>
                        {/* <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div> */}

                    </div>
                    <div className="row mb-0 mb-md-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>姓名</label>
                        <div className="col-12 col-md-4">
                            {/*<input type="text" className="form-control" value={`${sdInfo && sdInfo.Lastname || ""} ${sdInfo && sdInfo.Firstname || ""} `.trim() || `${sdInfo && sdInfo.Name || ""}`} disabled />*/}
                            {
                                formInitial(currentUserRole, formStatus) && Array.isArray(departments) && departments.length > 0 && departments[0].override === true ?
                                    <select className={`custom-select`} value={sdInfo && sdInfo.Email} onChange={(event => setSDEmail(event.target.value))}
                                        disabled={!pendingSmApprove(context, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus)}
                                    >
                                        <option value={departments[0].hr_sd}>{departments[0].hr_sd}</option>
                                        <option value={departments[0].new_sd}>{departments[0].new_sd}</option>
                                    </select>
                                    :
                                    <input type="text" className="form-control" value={`${sdInfo && sdInfo.Lastname || ""} ${sdInfo && sdInfo.Firstname || ""} `.trim() || `${sdInfo && sdInfo.Name || ""}`} disabled={true} />
                            }
                        </div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>職位</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" disabled value={sdInfo && sdJobTitle || ""} />
                        </div>
                    </div>
                    <div className="row mb-0 mb-md-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>電話</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" placeholder={sdInfo && sdInfo.Phone} value={sdPhone} onChange={event => setSdPhone(event.target.value)} disabled={!pendingSdApprove(context, formStatus, formStage, sdInfo)} />
                        </div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>日期</label>
                        <div className="col-12 col-md-4">
                            <DatePicker
                                className="form-control"
                                selected={sdDate}
                                dateFormat="yyyy/MM/dd"
                                readOnly={true}
                            />
                        </div>
                    </div>
                    <div className="row mb-0 mb-md-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>服務總監評語</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" value={sdComment} onChange={(event) => setSdComment(event.target.value)} disabled={!pendingSdApprove(context, formStatus, formStage, sdInfo)} />
                        </div>
                    </div>
                    {
                        pendingSdApprove(context, formStatus, formStage, sdInfo) &&
                        <div className="row justify-content-center my-2">
                            <div className="col-md-2 col-4">
                                <button className="btn btn-warning w-100" onClick={sdApproveHandler}>批准</button>
                            </div>
                            <div className="col-md-2 col-4">
                                <button className="btn btn-danger w-100" onClick={sdRejectHandler}>拒絕</button>
                            </div>
                        </div>
                    }
                </section>

                <hr className="my-4" />
                <section className="py-3">
                    <div className="row">
                        {
                            formInitial(currentUserRole, formStatus) &&
                            <div className='col-md-2 col-4 mb-2'>
                                <button className="btn btn-warning w-100" onClick={submitHandler}>提交</button>
                            </div>
                        }
                        {
                            adminUpdateInsuranceNumber(currentUserRole, formStatus) &&
                            <div className='col-md-2 col-4 mb-2'>
                                <button className="btn btn-warning w-100" onClick={adminSubmitHandler}>儲存</button>
                            </div>
                        }
                        {
                            pendingSdApprove(context, formStatus, formStage, sdInfo) &&
                            <div className='col-md-2 col-4 mb-2'>
                                <button className="btn btn-warning w-100" onClick={sdSubmitHandler}>儲存</button>
                            </div>
                        }
                        {
                            pendingSmApprove(context, formStatus, formStage, smInfo) &&
                            <div className='col-md-2 col-4 mb-2'>
                                <button className="btn btn-warning w-100" onClick={smSubmitHadnler}>儲存</button>
                            </div>
                        }
                        {
                            formInitial(currentUserRole, formStatus) && formStatus !== "SM_VOID" &&
                            <div className='col-md-2 col-4 mb-2'>
                                <button className="btn btn-success w-100" onClick={draftHandler}>草稿</button>
                            </div>
                        }
                        {
                            formInitial(currentUserRole, formStatus) &&
                            <div className='col-md-2 col-4 mb-2'>
                                <button className="btn btn-danger w-100" onClick={deleteHandler}>刪除</button>
                            </div>
                        }
                        <div className='col-md-2 col-4 mb-2'>
                            <button className="btn btn-secondary w-100" onClick={cancelHandler}>取消</button>
                        </div>
                        <div className='col-md-2 col-4 mb-2'>
                            <button className="btn btn-warning w-100" onClick={() => print()}>打印</button>
                        </div>
                        {formStage == '2' && adminUpdateInsuranceNumber(currentUserRole, formStatus) && sendInsuranceEmail &&
                            <>
                                <div className='col-md-2 col-4 mb-2'>
                                    <button className="btn btn-secondary w-100" onClick={() => setOpenModel(true)}>發送保險</button>
                                </div>
                            </>
                        }
                        {formStage == '2' && adminUpdateInsuranceNumber(currentUserRole, formStatus) && !sendInsuranceEmail &&
                            <>
                                <div className='col-md-2 col-4 mb-2'>
                                    <button className="btn btn-secondary w-100" disabled>發送保險(已發送)</button>
                                </div>
                            </>
                        }
                    </div>
                </section>
                {openModel &&

                    <Modal dialogClassName="formModal" show={openModel} size="lg" backdrop="static">
                        <Modal.Header>
                            <div style={{ height: '15px' }}>
                                <FontAwesomeIcon icon={fontawesome["faTimes"]} size="2x" style={{ float: 'right', cursor: 'pointer', position: 'absolute', top: '10px', right: '10px' }} onClick={() => setOpenModel(false)} />
                            </div>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="row" style={{ padding: '15px' }}>
                                <div className="col-12" >
                                    <input type="file" onChange={incomingfile} className="custom-file-input" />
                                    <label className="custom-file-label">{filename}</label>
                                </div>
                                <div className="col-12" style={{ padding: '0', margin: '10px 0' }}>
                                    <input type="text" onChange={emailToChangeHandler} className={`form-control`} value={emailTo} />
                                </div>
                                <div className="col-12" style={{ padding: '0', margin: '10px 0' }}>
                                    <textarea className={`form-control`} style={{ minHeight: '400px' }} value={emailBody} id="emailBody" onChange={emailBodyChangeHandler} />
                                </div>
                                <div className="col-12" style={{ padding: '0', margin: '10px 0' }}>
                                    <button className="btn btn-warning mr-3" disabled={uploadButton} onClick={() => send()}>發送</button>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>

                }
            </div >
        </>
    )
}

