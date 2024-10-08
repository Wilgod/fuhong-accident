import * as React from 'react'
import { useState, useEffect } from 'react'
import { WebPartContext } from '@microsoft/sp-webpart-base';
import Header from "../Header/Header";
import DatePicker from "react-datepicker";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import * as moment from 'moment';
import AutosizeTextarea from "../AutosizeTextarea/AutosizeTextarea";
import { createIncidentFollowUpForm, updateIncidentFollowUpForm, updateOtherIncidentReport, updateSpecialIncidentReportAllowance, updateSpecialIncidentReportLicense } from '../../api/PostFuHongList';
import { Role } from '../../utils/RoleParser';
import useUserInfo from '../../hooks/useUserInfo';
import { getAllIncidentFollowUpFormByCaseNumber, getAllIncidentFollowUpFormByParentId } from '../../api/FetchFuHongList';
import { initialForm, pendingSdApprove, pendingSmFillIn } from './permissionConfig';
import { addBusinessDays, addMonths, addDays } from '../../utils/DateUtils';
import { faPager } from '@fortawesome/free-solid-svg-icons';
import { notifySpecialIncidentAllowance, notifyOtherIncident, notifySpecialIncidentLicense, notifyIncidentReject } from '../../api/Notification';
import { postLog } from '../../api/LogHelper';
import { getUserInfoByEmailInUserInfoAD } from '../../api/FetchUser';
import { getQueryParameterString } from '../../utils/UrlQueryHelper';
interface UserInfo {
	id: string;
	email: string;
	name: string;
}
interface IIncidentFollowUpFormProps {
    context: WebPartContext;
    styles: any;
    formType: string;
    formSubmittedHandler(): void;
    currentUserRole: Role;
    parentFormData: any;
    isPrintMode: any;
    siteCollectionUrl: string;
    permissionList: any;
    formTwentySixData: any;
    workflow: string;
    changeFormTwentySixDataSelected: any;
    print: any;
    serviceUnitList: any;
}

interface IIncidentFollowUpFormStates {
    incidentFollowUpContinue: boolean;
}

export interface IFollowUpAction {
    action: string;
    date: string;
    remark: string;
}

const formTypeParser = (formType: string, additonalString: string) => {
    switch (formType) {
        case "OTHER_INCIDENT": return "其他事故" + additonalString;
        case "SPECIAL_INCIDENT_REPORT_LICENSE": return "特別事故(牌照事務處)" + additonalString;
        case "SPECIAL_INCIDENT_REPORT_ALLOWANCE": return "特別事故(津貼科)" + additonalString;
        default: return "";
    }
}
interface IErrorFields {

}
export default function IncidentFollowUpForm({ context, styles, formType, formSubmittedHandler, currentUserRole, parentFormData, isPrintMode, siteCollectionUrl, permissionList, formTwentySixData, workflow, changeFormTwentySixDataSelected, serviceUnitList, print }: IIncidentFollowUpFormProps) {
    const type: string = getQueryParameterString("type");
    const [form, setForm] = useState<IIncidentFollowUpFormStates>({
        incidentFollowUpContinue: undefined,
    });
    const [incidentDatetime, setIncidentDatetime] = useState(null);
    const [insuranceCaseNo, setInsuranceCaseNo] = useState("");
    const [caseNo, setCaseNo] = useState("");
    const [smDate, setSmDate] = useState(null);
    const [sdDate, setSdDate] = useState(null);
    const [sdComment, setSdComment] = useState("");
    const [sdInfo, setSDEmail, spSdInfo] = useUserInfo(siteCollectionUrl);
    const [smInfo, setSMEmail, spSmInfo] = useUserInfo(siteCollectionUrl);

    const [formStatus, setFormStatus] = useState("");
    const [formStage, setFormStage] = useState("");
    const [completed, setCompleted] = useState(false);
    const [incidentFollowUpFormList, setIncidentFollowUpFormList] = useState([]);
    const [accidentSMbackup, setAccidentSMbackup] = useState("");
    const [canSaveDraft, setCanSaveDraft] = useState(false);
    const [selectedIncidentFollowUpFormId, setSelectedIncidentFollowUpFormId] = useState<number>(null);
    const [error, setError] = useState<IErrorFields>({});
    const [followUpActions, setFollowUpActions] = useState<IFollowUpAction[]>([{
        action: "",
        date: new Date().toISOString(),
        remark: ""
    }]);

    const CURRENT_USER: UserInfo = {
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
        setForm({ ...form, [name]: value })
    }

    const dataFactory = () => {
        let body = {};
        let error1 = {};
        let msg = "";
        body["FollowUpActions"] = JSON.stringify(followUpActions);
        let emptyFollowUpActions = followUpActions.filter((item) => item.action == '');
        for (let i = 0; i < emptyFollowUpActions.length; i++) {
            error1["FollowUpActions" + i] = true;
            msg += "請填寫意外報告的跟進措施\n";
        }
        // //跟進措施
        // if (form.followUpMeasures) {
        //     body["FollowUpMeasures"] = form.followUpMeasures;
        // } else {
        //     error["FollowUpMeasures"] = true;
        // }

        // //執行時段
        // if (form.executionPeriod) {
        //     body["ExecutionPeriod"] = form.executionPeriod;
        // } else {
        //     error["ExecutionPeriod"] = true;
        // }

        //備註
        // body["Remark"] = form.remark;

        //事故跟進
        body["IncidentFollowUpContinue"] = form.incidentFollowUpContinue;
        if (form.incidentFollowUpContinue === undefined) {
            error1["IncidentFollowUpContinue"] = true;
            msg += "請填寫意外跟進\n";
        }

        return [body, error1, msg];
    }
    console.log(selectedIncidentFollowUpFormId)

    const draftHandler = (event) => {
        event.preventDefault();
        const [body] = dataFactory()
        updateIncidentFollowUpForm(selectedIncidentFollowUpFormId, {
            ...body,
            "Status": "DRAFT"
        }).then((res) => {
            console.log(res);
            formSubmittedHandler();
        }).catch(console.error);
    }

    const cancelHandler = () => {
        //implement 
        const path = context.pageContext.site.absoluteUrl + `/accident-and-incident/SitePages/Home.aspx`;
        window.open(path, "_self");
    }

    const backToCMS =(e) => {
        const path = context.pageContext.site.absoluteUrl + `/accident-and-incident/SitePages/Home.aspx?navScreen=cms&keyword=`+parentFormData.AffectedIdCardNo+`&type=cms`;
        window.open(path, "_self");
    }
    const smSubmitHandler = (event) => {
        event.preventDefault();

        let [body, error, msg] = dataFactory();
        if (Object.keys(error).length > 0) {
            setError(error);
            alert(msg);
        } else {
            if (form.incidentFollowUpContinue) {
                updateIncidentFollowUpForm(selectedIncidentFollowUpFormId, {
                    ...body,
                    "SMDate": new Date().toISOString(),
                    //"Completed": true
                }).then((updateIncidentFollowUpFormRes) => {
                    if (formType === "OTHER_INCIDENT") {
                        updateOtherIncidentReport(parentFormData.Id, {
                            Status: "PENDING_SD_APPROVE"
                        }).then((updateOtherIncidentReportRes) => {
                            console.log(updateOtherIncidentReportRes)
                            postLog({
                                AccidentTime: parentFormData.IncidentTime,
                                Action: "批准",
                                CaseNumber: parentFormData.CaseNumber,
                                FormType: "OIN",
                                RecordId: parentFormData.Id,
                                Report: "事故跟進/結束報告",
                                ServiceUnit: parentFormData.ServiceLocation,
                            }).catch(console.error);

                            notifyOtherIncident(context, parentFormData.Id, 2, workflow);
                            formSubmittedHandler();
                        }).catch(console.error);
                    } else if (formType === "SPECIAL_INCIDENT_REPORT_LICENSE") {
                        updateSpecialIncidentReportLicense(parentFormData.Id, {
                            Status: "PENDING_SD_APPROVE"
                        }).then((updateSpecialIncidentReportLicenseRes) => {
                            console.log(updateSpecialIncidentReportLicenseRes)

                            postLog({
                                AccidentTime: parentFormData.IncidentTime,
                                Action: "批准",
                                CaseNumber: parentFormData.CaseNumber,
                                FormType: "SIH",
                                RecordId: parentFormData.Id,
                                Report: "事故跟進/結束報告",
                                ServiceUnit: parentFormData.ServiceLocation,
                            }).catch(console.error);
                            notifySpecialIncidentLicense(context, parentFormData.Id, 2, workflow);
                            formSubmittedHandler();
                        }).catch(console.error);
                    } else if (formType === "SPECIAL_INCIDENT_REPORT_ALLOWANCE") {
                        updateSpecialIncidentReportAllowance(parentFormData.Id, {
                            "Status": "PENDING_SD_APPROVE"
                        }).then(() => {

                            postLog({
                                AccidentTime: parentFormData.IncidentTime,
                                Action: "批准",
                                CaseNumber: parentFormData.CaseNumber,
                                FormType: "SID",
                                RecordId: parentFormData.Id,
                                Report: "事故跟進/結束報告",
                                ServiceUnit: parentFormData.ServiceLocation,
                            }).catch(console.error);
                            notifySpecialIncidentAllowance(context, parentFormData.Id, 2, workflow);
                            formSubmittedHandler();
                        }).catch(console.error);
                    }
                    //Create new follow up Form
                    /*createIncidentFollowUpForm({
                        "SMId": parentFormData.SMId,
                        "SDId": parentFormData.SDId,
                        "ParentFormId": parentFormData.Id,
                        "CaseNumber": parentFormData.CaseNumber,
                        "Title": `事故跟主/結束報告 - ${parentFormData.FollowUpFormsId.length + 1}`
                    }).then((createIncidentFollowUpFormRes) => {
                        console.log(createIncidentFollowUpFormRes);
                        if (formType === "OTHER_INCIDENT") {
                            updateOtherIncidentReport(parentFormData.Id, {
                                "FollowUpFormsId": {
                                    "results": [...parentFormData.FollowUpFormsId, createIncidentFollowUpFormRes.data.Id]
                                },
                                "NextDeadline": addMonths(new Date(), 1).toISOString(),
                            }).then((updateOtherIncidentReportRes) => {
                                postLog({
                                    AccidentTime: parentFormData.IncidentTime,
                                    Action: "提交",
                                    CaseNumber: parentFormData.CaseNumber,
                                    FormType: "OIN",
                                    RecordId: parentFormData.Id,
                                    Report: "事故跟進/結束報告",
                                    ServiceUnit: parentFormData.ServiceLocation,
                                }).catch(console.error);
                                notifyOtherIncident(context, parentFormData.Id, 2, workflow);
                                formSubmittedHandler();
                            }).catch(console.error);
                        } else if (formType === "SPECIAL_INCIDENT_REPORT_LICENSE") {
                            updateSpecialIncidentReportLicense(parentFormData.Id, {
                                "FollowUpFormsId": {
                                    "results": [...parentFormData.FollowUpFormsId, createIncidentFollowUpFormRes.data.Id]
                                },
                                "NextDeadline": addMonths(new Date(), 1).toISOString(),
                            }).then((updateSpecialIncidentReportLicenseRes) => {
    
                                postLog({
                                    AccidentTime: parentFormData.IncidentTime,
                                    Action: "提交",
                                    CaseNumber: parentFormData.CaseNumber,
                                    FormType: "SID",
                                    RecordId: parentFormData.Id,
                                    Report: "事故跟進/結束報告",
                                    ServiceUnit: parentFormData.ServiceLocation,
                                }).catch(console.error);
                                notifySpecialIncidentLicense(context, parentFormData.Id, 2, workflow);
                                formSubmittedHandler();
                            }).catch(console.error);
                        } else if (formType === "SPECIAL_INCIDENT_REPORT_ALLOWANCE") {
                            updateSpecialIncidentReportAllowance(parentFormData.Id, {
                                "FollowUpFormsId": {
                                    "results": [...parentFormData.FollowUpFormsId, createIncidentFollowUpFormRes.data.Id]
                                },
                                "NextDeadline": addMonths(new Date(), 1).toISOString(),
                            }).then((updateSpecialIncidentReportAllowanceRes) => {
                                console.log("SPECIAL_INCIDENT_REPORT_ALLOWANCE")
    
                                postLog({
                                    AccidentTime: parentFormData.IncidentTime,
                                    Action: "提交",
                                    CaseNumber: parentFormData.CaseNumber,
                                    FormType: "SIH",
                                    RecordId: parentFormData.Id,
                                    Report: "事故跟進/結束報告",
                                    ServiceUnit: parentFormData.ServiceLocation,
                                }).catch(console.error);
                                notifySpecialIncidentAllowance(context, parentFormData.Id, 2, workflow);
                                formSubmittedHandler();
                            }).catch(console.error);
                        }
    
                    }).catch(console.error);*/
                }).catch(console.error);
            } else {
                updateIncidentFollowUpForm(selectedIncidentFollowUpFormId, {
                    ...body,
                    "SMDate": new Date().toISOString()
                }).then((updateIncidentFollowUpFormRes) => {
                    if (formType === "OTHER_INCIDENT") {
                        updateOtherIncidentReport(parentFormData.Id, {
                            "Status": "PENDING_SD_APPROVE"
                        }).then((updateOtherIncidentReportRes) => {

                            postLog({
                                AccidentTime: parentFormData.IncidentTime,
                                Action: "提交",
                                CaseNumber: parentFormData.CaseNumber,
                                FormType: "OIN",
                                RecordId: parentFormData.Id,
                                Report: "事故跟進/結束報告",
                                ServiceUnit: parentFormData.ServiceLocation,
                            }).catch(console.error);
                            notifyOtherIncident(context, parentFormData.Id, 2, workflow);
                            formSubmittedHandler();
                        }).catch(console.error);
                    } else if (formType === "SPECIAL_INCIDENT_REPORT_LICENSE") {
                        updateSpecialIncidentReportLicense(parentFormData.Id, {
                            "Status": "PENDING_SD_APPROVE"
                        }).then(() => {

                            postLog({
                                AccidentTime: parentFormData.IncidentTime,
                                Action: "提交",
                                CaseNumber: parentFormData.CaseNumber,
                                FormType: "SIH",
                                RecordId: parentFormData.Id,
                                Report: "事故跟進/結束報告",
                                ServiceUnit: parentFormData.ServiceLocation,
                            }).catch(console.error);
                            notifySpecialIncidentLicense(context, parentFormData.Id, 2, workflow);
                            formSubmittedHandler();
                        }).catch(console.error);
                    } else if (formType === "SPECIAL_INCIDENT_REPORT_ALLOWANCE") {
                        updateSpecialIncidentReportAllowance(parentFormData.Id, {
                            "Status": "PENDING_SD_APPROVE"
                        }).then(() => {

                            postLog({
                                AccidentTime: parentFormData.IncidentTime,
                                Action: "提交",
                                CaseNumber: parentFormData.CaseNumber,
                                FormType: "SID",
                                RecordId: parentFormData.Id,
                                Report: "事故跟進/結束報告",
                                ServiceUnit: parentFormData.ServiceLocation,
                            }).catch(console.error);
                            notifySpecialIncidentAllowance(context, parentFormData.Id, 2, workflow);
                            formSubmittedHandler();
                        }).catch(console.error);
                    }
                }).catch(console.error);
            }
        }
        // Form follow up still continue

    }

    const smSaveHandler = (event) => {
        event.preventDefault();
        const [body] = dataFactory()
        updateIncidentFollowUpForm(selectedIncidentFollowUpFormId, {
            ...body,
            "SMDate": new Date().toISOString()
        }).then((res) => {
            console.log(res);
            formSubmittedHandler();
            if (formType === "OTHER_INCIDENT") {
                notifyOtherIncident(context, parentFormData.Id, 2, workflow);
            } else if (formType === "SPECIAL_INCIDENT_REPORT_LICENSE") {
                notifySpecialIncidentLicense(context, parentFormData.Id, 2, workflow);
            } else if (formType === "SPECIAL_INCIDENT_REPORT_ALLOWANCE") {
                notifySpecialIncidentAllowance(context, parentFormData.Id, 2, workflow);
            }

        }).catch(console.error);
    }

    const sdApproveHandler = (event) => {
        event.preventDefault();

        const [body] = dataFactory()
        if (confirm("確認批准 ?")) {

            updateIncidentFollowUpForm(selectedIncidentFollowUpFormId, {
                ...body,
                "Completed": true,
                "SDComment": sdComment,
                "SDDate": new Date().toISOString(),
            }).then((updateIncidentFollowUpFormRes) => {

                if (form.incidentFollowUpContinue) {
                    createIncidentFollowUpForm({
                        "SMId": parentFormData.SMId,
                        "SDId": parentFormData.SDId,
                        "ParentFormId": parentFormData.Id,
                        "CaseNumber": parentFormData.CaseNumber,
                        "Title": `事故跟進/結束報告 - 第${parentFormData.FollowUpFormsId.length + 1}篇`
                    }).then((createIncidentFollowUpFormRes) => {
                        console.log(createIncidentFollowUpFormRes);
                        if (formType === "OTHER_INCIDENT") {
                            updateOtherIncidentReport(parentFormData.Id, {
                                "FollowUpFormsId": {
                                    "results": [...parentFormData.FollowUpFormsId, createIncidentFollowUpFormRes.data.Id]
                                },
                                "NextDeadline": addMonths(new Date(), 6).toISOString(),
                                "ReminderDate": addDays(addMonths(new Date(), 6), -7).toISOString(),
                                "Status": "PENDING_SM_FILL_IN"
                            }).then((updateOtherIncidentReportRes) => {
                                postLog({
                                    AccidentTime: parentFormData.IncidentTime,
                                    Action: "提交",
                                    CaseNumber: parentFormData.CaseNumber,
                                    FormType: "OIN",
                                    RecordId: parentFormData.Id,
                                    Report: "事故跟進/結束報告",
                                    ServiceUnit: parentFormData.ServiceLocation,
                                }).catch(console.error);
                                notifyOtherIncident(context, parentFormData.Id, 2, workflow);
                                formSubmittedHandler();
                            }).catch(console.error);
                        } else if (formType === "SPECIAL_INCIDENT_REPORT_LICENSE") {
                            updateSpecialIncidentReportLicense(parentFormData.Id, {
                                "FollowUpFormsId": {
                                    "results": [...parentFormData.FollowUpFormsId, createIncidentFollowUpFormRes.data.Id]
                                },
                                "NextDeadline": addMonths(new Date(), 6).toISOString(),
                                "ReminderDate": addDays(addMonths(new Date(), 6), -7).toISOString(),
                                "Status": "PENDING_SM_FILL_IN"
                            }).then((updateSpecialIncidentReportLicenseRes) => {

                                postLog({
                                    AccidentTime: parentFormData.IncidentTime,
                                    Action: "提交",
                                    CaseNumber: parentFormData.CaseNumber,
                                    FormType: "SID",
                                    RecordId: parentFormData.Id,
                                    Report: "事故跟進/結束報告",
                                    ServiceUnit: parentFormData.ServiceLocation,
                                }).catch(console.error);
                                notifySpecialIncidentLicense(context, parentFormData.Id, 2, workflow);
                                formSubmittedHandler();
                            }).catch(console.error);
                        } else if (formType === "SPECIAL_INCIDENT_REPORT_ALLOWANCE") {
                            updateSpecialIncidentReportAllowance(parentFormData.Id, {
                                "FollowUpFormsId": {
                                    "results": [...parentFormData.FollowUpFormsId, createIncidentFollowUpFormRes.data.Id]
                                },
                                "NextDeadline": addMonths(new Date(), 6).toISOString(),
                                "ReminderDate": addDays(addMonths(new Date(), 6), -7).toISOString(),
                                "Status": "PENDING_SM_FILL_IN"
                            }).then((updateSpecialIncidentReportAllowanceRes) => {
                                console.log("SPECIAL_INCIDENT_REPORT_ALLOWANCE")

                                postLog({
                                    AccidentTime: parentFormData.IncidentTime,
                                    Action: "提交",
                                    CaseNumber: parentFormData.CaseNumber,
                                    FormType: "SIH",
                                    RecordId: parentFormData.Id,
                                    Report: "事故跟進/結束報告",
                                    ServiceUnit: parentFormData.ServiceLocation,
                                }).catch(console.error);
                                notifySpecialIncidentAllowance(context, parentFormData.Id, 2, workflow);
                                formSubmittedHandler();
                            }).catch(console.error);
                        }

                    }).catch(console.error);

                } else {
                    if (formType === "OTHER_INCIDENT") {
                        updateOtherIncidentReport(parentFormData.Id, {
                            "ReminderDate": null,
                            "Status": "CLOSED"
                        }).then((updateOtherIncidentReportRes) => {
                            console.log(updateOtherIncidentReportRes)
                            postLog({
                                AccidentTime: parentFormData.IncidentTime,
                                Action: "批准",
                                CaseNumber: parentFormData.CaseNumber,
                                FormType: "OIN",
                                RecordId: parentFormData.Id,
                                Report: "事故跟進/結束報告",
                                ServiceUnit: parentFormData.ServiceLocation,
                            }).catch(console.error);

                            notifyOtherIncident(context, parentFormData.Id, 2, workflow);
                            formSubmittedHandler();
                        }).catch(console.error);
                    } else if (formType === "SPECIAL_INCIDENT_REPORT_LICENSE") {
                        updateSpecialIncidentReportLicense(parentFormData.Id, {
                            "ReminderDate": null,
                            "Status": "CLOSED"
                        }).then((updateSpecialIncidentReportLicenseRes) => {
                            console.log(updateSpecialIncidentReportLicenseRes)

                            postLog({
                                AccidentTime: parentFormData.IncidentTime,
                                Action: "批准",
                                CaseNumber: parentFormData.CaseNumber,
                                FormType: "SIH",
                                RecordId: parentFormData.Id,
                                Report: "事故跟進/結束報告",
                                ServiceUnit: parentFormData.ServiceLocation,
                            }).catch(console.error);
                            notifySpecialIncidentLicense(context, parentFormData.Id, 2, workflow);
                            formSubmittedHandler();
                        }).catch(console.error);
                    } else if (formType === "SPECIAL_INCIDENT_REPORT_ALLOWANCE") {
                        updateSpecialIncidentReportAllowance(parentFormData.Id, {
                            "ReminderDate": null,
                            "Status": "CLOSED"
                        }).then(() => {

                            postLog({
                                AccidentTime: parentFormData.IncidentTime,
                                Action: "批准",
                                CaseNumber: parentFormData.CaseNumber,
                                FormType: "SID",
                                RecordId: parentFormData.Id,
                                Report: "事故跟進/結束報告",
                                ServiceUnit: parentFormData.ServiceLocation,
                            }).catch(console.error);
                            notifySpecialIncidentAllowance(context, parentFormData.Id, 2, workflow);
                            formSubmittedHandler();
                        }).catch(console.error);
                    }
                }


            }).catch(console.error);
        }
    }

    const sdRejectHanlder = (event) => {
        event.preventDefault();

        if (confirm("確認拒絕 ?")) {
            if (formType === "OTHER_INCIDENT") {
                updateOtherIncidentReport(parentFormData.Id, {
                    "Status": "PENDING_SM_FILL_IN",
                    "SDDate": new Date().toISOString(),
                    "SDComment": sdComment,
                }).then((updateOtherIncidentReportRes) => {
                    console.log(updateOtherIncidentReportRes)
                    notifyIncidentReject(context, parentFormData.Id, 2, workflow);
                    postLog({
                        AccidentTime: parentFormData.IncidentTime,
                        Action: "拒絕",
                        CaseNumber: parentFormData.CaseNumber,
                        FormType: "OIN",
                        RecordId: parentFormData.Id,
                        Report: "事故跟進/結束報告",
                        ServiceUnit: parentFormData.ServiceLocation,
                    }).catch(console.error);

                    formSubmittedHandler();
                    notifyOtherIncident(context, parentFormData.Id, 2, workflow);
                }).catch(console.error);
            } else if (formType === "SPECIAL_INCIDENT_REPORT_LICENSE") {
                updateSpecialIncidentReportLicense(parentFormData.Id, {
                    "Status": "PENDING_SM_FILL_IN",
                    "SDDate": new Date().toISOString(),
                    "SDComment": sdComment,
                }).then((updateSpecialIncidentReportLicenseRes) => {
                    console.log(updateSpecialIncidentReportLicenseRes);

                    postLog({
                        AccidentTime: parentFormData.IncidentTime,
                        Action: "拒絕",
                        CaseNumber: parentFormData.CaseNumber,
                        FormType: "SIH",
                        RecordId: parentFormData.Id,
                        Report: "事故跟進/結束報告",
                        ServiceUnit: parentFormData.ServiceLocation,
                    }).catch(console.error);

                    formSubmittedHandler();
                    notifySpecialIncidentLicense(context, parentFormData.Id, 2, workflow);
                }).catch(console.error);
            } else if (formType === "SPECIAL_INCIDENT_REPORT_ALLOWANCE") {
                updateSpecialIncidentReportAllowance(parentFormData.Id, {
                    "Status": "PENDING_SM_FILL_IN",
                    "SDDate": new Date().toISOString(),
                    "SDComment": sdComment,
                }).then((updateSpecialIncidentReportAllowance) => {
                    console.log(updateSpecialIncidentReportAllowance);

                    postLog({
                        AccidentTime: parentFormData.IncidentTime,
                        Action: "拒絕",
                        CaseNumber: parentFormData.CaseNumber,
                        FormType: "SID",
                        RecordId: parentFormData.Id,
                        Report: "事故跟進/結束報告",
                        ServiceUnit: parentFormData.ServiceLocation,
                    }).catch(console.error);

                    formSubmittedHandler();
                    notifySpecialIncidentAllowance(context, parentFormData.Id, 2, workflow);
                }).catch(console.error);
            }
        }
    }

    const sdSaveHandler = (event) => {
        event.preventDefault();
        const [body] = dataFactory()
        updateIncidentFollowUpForm(selectedIncidentFollowUpFormId, {
            ...body,
            "SDComment": sdComment,
            "SDDate": new Date().toISOString()
        }).then((res) => {
            console.log(res);

            if (formType === "OTHER_INCIDENT") {
                postLog({
                    AccidentTime: parentFormData.IncidentTime,
                    Action: "拒絕",
                    CaseNumber: parentFormData.CaseNumber,
                    FormType: "OIN",
                    RecordId: parentFormData.Id,
                    Report: "事故跟進/結束報告",
                    ServiceUnit: parentFormData.ServiceLocation,
                }).catch(console.error);
                notifyOtherIncident(context, parentFormData.Id, 2, workflow);
            } else if (formType === "SPECIAL_INCIDENT_REPORT_LICENSE") {
                postLog({
                    AccidentTime: parentFormData.IncidentTime,
                    Action: "拒絕",
                    CaseNumber: parentFormData.CaseNumber,
                    FormType: "SIH",
                    RecordId: parentFormData.Id,
                    Report: "事故跟進/結束報告",
                    ServiceUnit: parentFormData.ServiceLocation,
                }).catch(console.error);
            } else if (formType === "SPECIAL_INCIDENT_REPORT_ALLOWANCE") {
                postLog({
                    AccidentTime: parentFormData.IncidentTime,
                    Action: "拒絕",
                    CaseNumber: parentFormData.CaseNumber,
                    FormType: "SID",
                    RecordId: parentFormData.Id,
                    Report: "事故跟進/結束報告",
                    ServiceUnit: parentFormData.ServiceLocation,
                }).catch(console.error);
                notifySpecialIncidentAllowance(context, parentFormData.Id, 2, workflow);
            }

            formSubmittedHandler();

        }).catch(console.error);
    }

    const loadData = () => {
        console.log(parentFormData)
        if (parentFormData) {
            setInsuranceCaseNo(parentFormData.InsuranceCaseNo);
            setCaseNo(parentFormData.CaseNumber);
            debugger
            setIncidentDatetime(new Date(parentFormData.IncidentTime))
            if (Array.isArray(parentFormData.FollowUpFormsId) && parentFormData.FollowUpFormsId.length > 0) {
                getAllIncidentFollowUpFormByCaseNumber(parentFormData.CaseNumber).then((getAllIncidentFollowUpFormByCaseNumberRes) => {
                    if (Array.isArray(getAllIncidentFollowUpFormByCaseNumberRes) && getAllIncidentFollowUpFormByCaseNumberRes.length > 0) {
                        if (getAllIncidentFollowUpFormByCaseNumberRes[0].SMDate != null) {
                            setSmDate(new Date(getAllIncidentFollowUpFormByCaseNumberRes[0].SMDate));
                        }
                        if (getAllIncidentFollowUpFormByCaseNumberRes[0].SDDate != null) {
                            setSdDate(new Date(getAllIncidentFollowUpFormByCaseNumberRes[0].SDDate));
                        }
                        
                        setIncidentFollowUpFormList(getAllIncidentFollowUpFormByCaseNumberRes);
                        setSelectedIncidentFollowUpFormId(getAllIncidentFollowUpFormByCaseNumberRes[0].Id);
                    }
                }).catch(console.error);
            }
        }
    }

    const updateState = () => {
        const [data] = incidentFollowUpFormList.filter((item) => item.ID === selectedIncidentFollowUpFormId);

        if (data) {
            setCompleted(data.Completed);

            if (data.FollowUpActions) {
                setFollowUpActions(JSON.parse(data.FollowUpActions));
            }

            // setForm({
            //     executionPeriod: data.ExecutionPeriod || "",
            //     followUpMeasures: data.FollowUpMeasures || "",
            //     incidentFollowUpContinue: data.IncidentFollowUpContinue === true ? true : data.IncidentFollowUpContinue === false ? false : undefined,
            //     remark: data.Remark || ""
            // })
            setForm({
                incidentFollowUpContinue: data.IncidentFollowUpContinue === true ? true : data.IncidentFollowUpContinue === false ? false : undefined,
            })

            setFormStatus(data.Status);
            // setForm({
            //     // incidentFollowUpContinue: form.IncidentFollowUpContinue === true ? true : form.IncidentFollowUpContinue === false ? false : undefined,
            //     executionPeriod: form.ExecutionPeriod || "",
            //     followUpMeasures: form.FollowUpMeasures || "",
            //     remark: form.Remark || "",
            //     incidentFollowUpContinue: true
            // });

            if (data.SD && data.SD.EMail) {
                setSDEmail(data.SD.EMail);
            }

            if (data.SM && data.SM.EMail) {
                setSMEmail(data.SM.EMail);
            }

            setSdComment(data.SDComment || "");
            if (data.SMDate) {
                setSmDate(new Date(data.SMDate));
            }
        }
    }

    const formChangeHandler = (event) => {
        const value = +event.target.value;
        setSelectedIncidentFollowUpFormId(value);
        changeFormTwentySixDataSelected(value);
    }

    useEffect(() => {
        if (accidentSMbackup != '') {

            getUserInfoByEmailInUserInfoAD(siteCollectionUrl, context.pageContext.legacyPageContext.userEmail).then((userInfosRes) => {

                if (Array.isArray(userInfosRes) && userInfosRes.length > 0) {
                    let accidentSMbackupList = accidentSMbackup.split(';');
                    let per = permissionList.filter(item => { return item == parentFormData.ServiceUnit })
                    if (per.length > 0) {
                        for (let acc of accidentSMbackupList) {
                            if (acc.trim() == userInfosRes[0].hr_jobcode) {
                                setCanSaveDraft(true);
                            }
                        }
                    }

                }
            }).catch((err) => {
                console.error('getUserInfoByEmailInUserInfoAD error')
                console.error(err)
            });
        }
    }, [accidentSMbackup]);

    useEffect(() => {
        loadData()
    }, [parentFormData]);

    useEffect(() => {
        updateState();
    }, [selectedIncidentFollowUpFormId]);

    useEffect(() => {
        if (parentFormData && parentFormData.ServiceUnit) {
            let ser = serviceUnitList.filter(o => { return o.su_Eng_name_display == parentFormData.ServiceUnit });
            if (ser.length > 0) {
                setAccidentSMbackup(ser[0].Accident_SM_backup);

            }
        }
    }, []);
    console.log('formTwentySixData :', formTwentySixData);
    return (
        <>
            {isPrintMode && <Header displayName="事故跟進/結束報告" />}

            {
                incidentFollowUpFormList.length > 1 &&
                <div className="row">
                    <div className="col-sm-12 col-md-6">
                        <select className={"form-control"} value={selectedIncidentFollowUpFormId} onChange={formChangeHandler}>
                            {incidentFollowUpFormList.map((item) => {
                                return <option value={item.ID}>{moment(item.Created).format("YYYY-MM-DD")} - {item.Title}</option>
                            })}
                        </select>
                    </div>
                </div>
            }
            <div className="container-fluid px-4 pt-3">
                <section className="mb-5">
                    {/* <div className="row">
                        <div className="col-12 font-weight-bold">
                            <h5>報告資料</h5>
                        </div>
                    </div> */}
                    <div className="form-row mb-2">
                        {/* 事故性質 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>事故性質</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" readOnly value={formTypeParser(formType, "")} />
                        </div>
                        {/* 單位名稱 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>單位名稱</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" readOnly value={parentFormData && parentFormData.ServiceUnit || ""} />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>事故發生日期和時間</label>
                        <div className="col-12 col-md-4">
                            <DatePicker
                                className="form-control"
                                selected={incidentDatetime}
                                onChange={(date) => setIncidentDatetime(date)}
                                timeInputLabel="Time:"
                                dateFormat="yyyy/MM/dd h:mm aa"
                                showTimeInput
                                readOnly
                            />
                        </div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>檔案編號</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" readOnly value={caseNo} onChange={(event) => setCaseNo(event.target.value)} disabled />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>保險公司備案編號</label>
                        <div className="col">
                            <input type="text" className="form-control" value={insuranceCaseNo} onChange={event => setInsuranceCaseNo(event.target.value)} disabled />
                        </div>
                    </div>
                </section>

                <section className="mb-5">
                    {/* <div className="form-row mb-3">
                        <div className="col-12 font-weight-bold">
                            <h5>事故跟進行動表</h5>
                        </div>
                    </div> */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5>事故跟進行動表</h5>
                        {
                            // (completed === false || (stageThreePendingSmFillIn(currentUserRole, formStatus, formStage) || stageThreePendingSdApprove(currentUserRole, formStatus, formStage))) &&
                            <button type="button" className="btn btn-primary" onClick={(event) => { setFollowUpActions([...followUpActions, { action: "", date: new Date().toISOString(), remark: "" }]); }}
                                disabled={
                                    type=='cms' ||
                                    followUpActions.length >= 5 ||
                                    completed ||
                                    (!canSaveDraft && !pendingSdApprove(CURRENT_USER.email, currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || "", formTwentySixData) && !pendingSmFillIn(CURRENT_USER.email, currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || "", formTwentySixData) && !initialForm(CURRENT_USER.email, currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || "", formStatus, formTwentySixData))}>
                                新增事故跟進行動
                            </button>
                        }
                    </div>
                    {
                        followUpActions.map((item, index) => {
                            return (
                                <div className="mb-3 px-2 py-3" style={{
                                    border: "1px solid #d9dde0", borderRadius: "10px"
                                }}
                                >
                                    {
                                        followUpActions.length > 1 &&
                                        <div className="d-flex justify-content-between align-items-center mb-2" >
                                            <div className={`${styles.fieldTitle}`} style={{ fontSize: 18 }}>
                                                事故跟進行動 - {index + 1}
                                            </div>
                                            <div className="mr-2 p-1" style={{ fontSize: 25, cursor: "pointer" }} onClick={(event) => {
                                                if (followUpActions.length > 1) {
                                                    let arr = followUpActions.filter((item, j) => j !== index);
                                                    setFollowUpActions(arr);
                                                }
                                            }}>
                                                &times;
                                            </div>
                                        </div>
                                    }
                                    < div className="form-row mb-2" >
                                        {/* 事故性質 */}
                                        < label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`
                                        } > 跟進措施</label>
                                        <div className="col">
                                            <AutosizeTextarea className={`form-control ${(error && error['FollowUpActions' + index]) ? "is-invalid" : ""}`} name="followUpMeasures" onChange={(event) => {
                                                let arr = [...followUpActions];
                                                let actionItem = arr[index];
                                                actionItem.action = event.target.value;
                                                setFollowUpActions(arr);
                                            }}
                                                value={item.action}
                                                disabled={type=='cms' || completed || (!canSaveDraft && !pendingSdApprove(CURRENT_USER.email, currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || "", formTwentySixData) && !pendingSmFillIn(CURRENT_USER.email, currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || "", formTwentySixData) && !initialForm(CURRENT_USER.email, currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || "", formStatus, formTwentySixData))}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row mb-2">
                                        {/* 完成日期 */}
                                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>完成日期</label>
                                        <div className="col">
                                            <DatePicker className="form-control" dateFormat="yyyy/MM/dd" selected={new Date(item.date)} onChange={(date) => {
                                                let arr = [...followUpActions];
                                                let actionItem = arr[index];
                                                actionItem.date = new Date(date).toISOString();
                                                setFollowUpActions(arr);
                                            }}
                                                readOnly={type=='cms' || completed || (!canSaveDraft && !pendingSdApprove(CURRENT_USER.email, currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || "", formTwentySixData) && !pendingSmFillIn(CURRENT_USER.email, currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || "", formTwentySixData) && !initialForm(CURRENT_USER.email, currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || "", formStatus, formTwentySixData))}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row mb-2">
                                        {/* 備註 */}
                                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>備註</label>
                                        <div className="col">
                                            <AutosizeTextarea className="form-control" name="remark" onChange={(event) => {
                                                let arr = [...followUpActions];
                                                let actionItem = arr[index];
                                                actionItem.remark = event.target.value;
                                                setFollowUpActions(arr);
                                            }} value={item.remark}
                                                disabled={type=='cms' || completed || (!canSaveDraft && !pendingSdApprove(CURRENT_USER.email, currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || "", formTwentySixData) && !pendingSmFillIn(CURRENT_USER.email, currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || "", formTwentySixData) && !initialForm(CURRENT_USER.email, currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || "", formStatus, formTwentySixData))}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }


                    <div className="form-row mb-2">
                        {/* 意外跟進 */}

                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>事故跟進</label>
                        <div className="col-12 col-md-4">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="accidentFollowUp" id="accident-follow-up-true" onClick={() => setForm({ ...form, incidentFollowUpContinue: true })} checked={form.incidentFollowUpContinue === true}
                                    disabled={type=='cms' || completed || (!pendingSdApprove(CURRENT_USER.email, currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || "", formTwentySixData) && !pendingSmFillIn(CURRENT_USER.email, currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || "", formTwentySixData) && !initialForm(CURRENT_USER.email, currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || "", formStatus, formTwentySixData))}
                                />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="accident-follow-up-true">繼續</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="accidentFollowUp" id="accident-follow-up-false" onClick={() => setForm({ ...form, incidentFollowUpContinue: false })} checked={form.incidentFollowUpContinue === false}
                                    disabled={type=='cms' || completed || (!pendingSdApprove(CURRENT_USER.email, currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || "", formTwentySixData) && !pendingSmFillIn(CURRENT_USER.email, currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || "", formTwentySixData) && !initialForm(CURRENT_USER.email, currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || "", formStatus, formTwentySixData))}
                                />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="accident-follow-up-false">結束</label>
                            </div>
                            {/* <select className="form-control">
                                <option>請選擇</option>
                                <option>繼續</option>
                                <option>結束</option>
                            </select> */}
                        </div>
                    </div>
                </section >

                {/* <hr className="my-3" /> */}

                < section className="mb-5" >
                    {/* <div className="row">
                        <div className="col-12 font-weight-bold mb-2">
                            <span>[此欄由高級服務經理/服務經理姓名填寫]</span>
                        </div>
                    </div> */}
                    < div className="form-row mb-2" >
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>高級服務經理/<span className="d-sm-inline d-md-block">服務經理姓名</span></label>
                        <div className="col-12 col-md-4">
                            {/* <PeoplePicker
                                context={context}
                                personSelectionLimit={1}
                                showtooltip={false}
                                principalTypes={[PrincipalType.User]}
                                resolveDelay={1000}
                            /> */}
                            <input type="text" className="form-control" value={`${smInfo && smInfo.Lastname || ""} ${smInfo && smInfo.Firstname || ""}`.trim() || `${smInfo && smInfo.Name || ""}`} disabled />
                        </div>
                        <label className={`col-12 col-md-1 col-form-label ${styles.fieldTitle} pt-xl-0`}>日期</label>
                        <div className="col-12 col-md-5">
                            <DatePicker
                                className="form-control"
                                selected={smDate}
                                onChange={(date) => setSmDate(date)}
                                dateFormat="yyyy/MM/dd"
                                readOnly
                            />
                        </div>
                    </div >

                </section >

                <hr className="my-3" />


                <section className="mb-5">
                    <div className="form-row">
                        <div className="col-12 font-weight-bold mb-2">
                            <span className={`${styles.fieldTitle} ${styles.fillIn}`}>[此欄由服務總監填寫]</span>
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>服務總監姓名</label>
                        <div className="col-12 col-md-4">
                            {/* <PeoplePicker
                                context={context}
                                personSelectionLimit={1}
                                showtooltip={false}
                                principalTypes={[PrincipalType.User]}
                                resolveDelay={1000} /> */}
                            <input type="text" className="form-control" value={`${sdInfo && sdInfo.Lastname || ""} ${sdInfo && sdInfo.Firstname || ""}`.trim() || `${sdInfo && sdInfo.Name || ""}`} disabled />
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
                    <div className="form-row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>服務總監評語</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" value={sdComment} onChange={(event) => setSdComment(event.target.value)} disabled={type=='cms' || completed || (!pendingSdApprove(CURRENT_USER.email, currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || "", formTwentySixData))} />
                        </div>
                    </div>

                    {
                        pendingSdApprove(CURRENT_USER.email, currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || "", formTwentySixData) &&
                        <div className="form-row justify-content-center mb-2">
                            <div className="col-md-2 col-4">
                                <button className="btn btn-warning w-100" onClick={sdApproveHandler}>批准</button>
                            </div>
                            <div className="col-md-2 col-4">
                                <button className="btn btn-danger w-100" onClick={sdRejectHanlder}>拒絕</button>
                            </div>
                        </div>
                    }
                </section>

                <hr className="my-4" />
                {type != 'cms' &&
                <section className="py-3">
                    <div className="row">
                        {
                            !completed &&
                            <>
                                {
                                    pendingSmFillIn(CURRENT_USER.email, currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || "", formTwentySixData) &&
                                    <div className='col-md-2 col-4 mb-2'>
                                        <button className="btn btn-warning w-100" onClick={smSubmitHandler}>提交</button>
                                    </div>
                                }
                                {
                                    pendingSdApprove(CURRENT_USER.email, currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || "", formTwentySixData) &&
                                    <div className='col-md-2 col-4 mb-2'>
                                        <button className="btn btn-success w-100" onClick={sdSaveHandler}>儲存</button>
                                    </div>
                                }
                                {
                                    pendingSmFillIn(CURRENT_USER.email, currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || "", formTwentySixData) &&
                                    !initialForm(CURRENT_USER.email, currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || "", formStatus, formTwentySixData) &&
                                    <div className='col-md-2 col-4 mb-2'>
                                        <button className="btn btn-success w-100" onClick={smSaveHandler}>儲存</button>
                                    </div>
                                }
                                {
                                    (canSaveDraft || initialForm(CURRENT_USER.email, currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || "", formStatus, formTwentySixData)) &&
                                    <div className='col-md-2 col-4 mb-2'>
                                        <button className="btn btn-success w-100" onClick={draftHandler}>草稿</button>
                                    </div>
                                }
                            </>
                        }
                        <div className='col-md-2 col-4 mb-2'>
                            <button className="btn btn-secondary w-100" onClick={cancelHandler}>取消</button>
                        </div>
                        <div className='col-md-2 col-4 mb-2'>
                            <button className="btn btn-warning w-100" onClick={() => print()}>打印</button>
                        </div>
                    </div>
                </section>
                }
                {/*type =='cms' &&
                <section className="py-3">
                    <div className="row">
                        <div className="col-md-2 col-4 mb-2">
                            <button className="btn btn-warning w-100" onClick={(event => backToCMS(event))}>返回</button>
                        </div>

                    </div>
                </section>
            */}
            </div >
        </>
    )
}

