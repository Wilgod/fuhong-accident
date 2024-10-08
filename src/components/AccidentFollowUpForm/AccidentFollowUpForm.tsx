import * as React from 'react'
import { useState, useEffect } from 'react'
import { WebPartContext } from '@microsoft/sp-webpart-base';
import Header from "../Header/Header";
import DatePicker from "react-datepicker";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import * as moment from 'moment';
import "./AccidentFollowUpForm.css";
import AutosizeTextarea from "../AutosizeTextarea/AutosizeTextarea";
import { IAccidentFollowUpFormStates, IAccidentFollowUpFormProps, IFollowUpAction } from './IAccidentFollowUpForm';
import useUserInfoAD from '../../hooks/useUserInfoAD';
import useSharePointGroup from '../../hooks/useSharePointGroup';
import useServiceUnitByShortForm from '../../hooks/useServiceUnitByShortForm';
import useServiceUser from '../../hooks/useServiceUser';
import { getAccidentFollowUpFormById, getAccidentReportFormById, getAllAccidentFollowUpFormByCaseNumber, getAllAccidentFollowUpFormByParentId, getOutsiderAccidentById, getServiceUserAccidentById } from '../../api/FetchFuHongList';
import { createAccidentFollowUpRepotForm, updateAccidentFollowUpRepotFormById, updateAccidentReportFormById, updateServiceUserAccidentById, updateOutsiderAccidentFormById } from '../../api/PostFuHongList';
import { addMonths, addDays } from '../../utils/DateUtils';
import { stageThreePendingSdApprove, stageThreePendingSdApproveForSpt, stageThreePendingSmFillIn } from '../../webparts/fuHongServiceUserAccidentForm/permissionConfig';
import { ConsoleListener } from '@pnp/pnpjs';
import { getUserInfoByEmailInUserInfoAD } from '../../api/FetchUser';
import { notifyOutsiderAccident, notifyServiceUserAccident, notifyServiceUserAccidentSMSDComment, notifyServiceUserAccidentReject, notifyOutsiderAccidentReject } from '../../api/Notification';
import { getQueryParameterString } from '../../utils/UrlQueryHelper';
import { postLog } from '../../api/LogHelper';
const formTypeParser = (formType: string, additonalString: string) => {
    switch (formType) {
        case "SERVICE_USER":
            return "服務使用者" + additonalString;
        case "OUTSIDERS":
            return "外界人士" + additonalString;
        default: return "";
    }
}

interface IErrorFields {

}

interface UserInfo {
	id: string;
	email: string;
	name: string;
}
export default function AccidentFollowUpForm({ context, formType, styles, currentUserRole, parentFormData, formSubmittedHandler, isPrintMode, siteCollectionUrl, permissionList, formTwentyData, formTwentyOneData, workflow, changeFormTwentyOneDataSelected, serviceUnitList, print }: IAccidentFollowUpFormProps) {
    const type: string = getQueryParameterString("type");
    const [smDate, setSmDate] = useState(null); // 高級服務經理
    const [sdDate, setSdDate] = useState(null); // 服務總監
    const [sptDate, setSptDate] = useState(null); // 高級物理治療師

    const [sptComment, setSptComment] = useState("");
    const [sdComment, setSdComment] = useState("");

    const [accidentTime, setAccidentTime] = useState(null);

    const [serviceUnitDetail, setServiceUnitByShortForm] = useServiceUnitByShortForm();
    const [serviceUserList, serviceUser, serviceUserRecordId, setServiceUserRecordId] = useServiceUser();

    const [formStatus, setFormStatus] = useState("");
    const [formStage, setFormStage] = useState("");

    const [serviceManager, setServiceManagerEmail, serviceManagerEmail] = useSharePointGroup(); //[此欄由高級服務經理/服務經理填寫]
    const [serviceDirector, setServiceDirectorEmail, serviceDirectorEmail] = useSharePointGroup(); //[服務總監]
    const [sPhysicalTherapy, setSPhysicalTherapyEmail, sPhysicalTherapyEmail] = useSharePointGroup(); // [此欄由高級物理治療師填寫]
    const [serviceUserUnitEn, setServiceUserUnitEn] = useState("");
    const [serviceUserUnit, setServiceUserUnit] = useState("");
    const [accidentSMbackup, setAccidentSMbackup] = useState("");
    const [jobCode, setJobCoe] = useState("");
    const [canSaveDraft, setCanSaveDraft] = useState(false);
    const [error, setError] = useState<IErrorFields>({});
    const [form, setForm] = useState<IAccidentFollowUpFormStates>({
        accidentalFollowUpContinue: undefined,
    });

    const CURRENT_USER: UserInfo = {
        email: context.pageContext.legacyPageContext.userEmail,
        name: context.pageContext.legacyPageContext.userDisplayName,
        id: context.pageContext.legacyPageContext.userId,
    }
    
    const [followUpActions, setFollowUpActions] = useState<IFollowUpAction[]>([{
        action: "",
        date: new Date().toISOString(),
        remark: ""
    }]);

    const [accidentFollowUpFormList, setAccidentFollowUpFormList] = useState([]);
    const [selectedAccidentFollowUpFormId, setSelectedAccidentFollowUpFormId] = useState(null);
    const [completed, setCompleted] = useState(false);

    const radioButtonHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setForm({ ...form, [name]: value });
    }

    const textFieldHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setForm({ ...form, [name]: value });
    }

    const dataFactory = () => {
        let body = {};
        let error1 = {};
        let msg = "";
        body["FollowUpActions"] = JSON.stringify(followUpActions);
        let emptyFollowUpActions = followUpActions.filter((item) => item.action == '');
        for (let i = 0; i < emptyFollowUpActions.length; i++) {
            error1["followUpActions" + i] = true;
            msg += "請填寫意外報告的跟進措施";
        }
        //if ()
        // if (form.followUpMeasures) {
        //     body["FollowUpMeasures"] = form.followUpMeasures;
        // } else {
        //     // error handling;
        // }

        // if (form.executionPeriod) {
        //     body["ExecutionPeriod"] = form.executionPeriod;
        // } else {
        //     //error handling
        // }

        // if (form.remark) {
        //     body["Remark"] = form.remark;
        // } else {
        //     //error handling;
        // }

        if (form.accidentalFollowUpContinue !== undefined) {
            body["AccidentalFollowUpContinue"] = form.accidentalFollowUpContinue;
        } else {
            // error handling
            error1["accidentalFollowUpContinue"] = true;
            msg += "請填寫意外跟進";
        }

        return [body, error1, msg];
    }
    //For SM only
    const smSubmitHandler = (event) => {

        if (stageThreePendingSdApproveForSpt(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyOneData, accidentFollowUpFormList, selectedAccidentFollowUpFormId)) { // SPT
            notifyServiceUserAccidentSMSDComment(context, parentFormData.Id, 3, workflow);
            sptCommentUpdate();
        } else {
            const [body, error, msg] = dataFactory();
            if (Object.keys(error).length > 0) {
                alert(msg);
                setError(error);
            } else {
                if (form.accidentalFollowUpContinue) {
                    let title = "";
                    if (parentFormData.AccidentFollowUpFormId) {
                        title = `事故跟進/結束報告 - 第${parentFormData.AccidentFollowUpFormId.length + 1}篇`;
                    } else {
                        title = `事故跟進/結束報告 - 第1篇`;
                    }

                    // Create a new follow up Form
                    /*createAccidentFollowUpRepotForm({
                        "CaseNumber": parentFormData.CaseNumber,
                        "ParentFormId": parentFormData.Id,
                        "SPTId": parentFormData.SPTId,
                        "SDId": parentFormData.SDId,
                        "SMId": parentFormData.SMId,
                        "Title": title
                    }).then((createServiceUserAccidentRes) => {
                        console.log(createServiceUserAccidentRes);
                        // Update current Form
                        updateAccidentFollowUpRepotFormById(selectedAccidentFollowUpFormId, {
                            ...body,
                            "SMDate": new Date().toISOString(),
                            "Completed": true
                        }).then((updateAccidentFollowUpRepotFormByIdRes) => {
                            // Update parent form
                            if (formType === "SERVICE_USER") {
                                updateServiceUserAccidentById(parentFormData.Id, {
                                    "AccidentFollowUpFormId": {
                                        results: [...parentFormData.AccidentFollowUpFormId, createServiceUserAccidentRes.data.Id]
                                    },
                                    "NextDeadline": addMonths(new Date(), 6),
                                }).then((updateServiceUserAccidentByIdRes) => {
                                    console.log(updateServiceUserAccidentByIdRes);
    
                                    postLog({
                                        AccidentTime: parentFormData.AccidentTime,
                                        Action: "提交",
                                        CaseNumber: parentFormData.CaseNumber,
                                        FormType: "SUI",
                                        RecordId: parentFormData.Id,
                                        Report: "事故跟進/結束報告(三)",
                                        ServiceUnit: parentFormData.ServiceLocation
                                    }).catch(console.error)
    
                                    formSubmittedHandler();
                                }).catch(console.error);
                            } else if (formType === "OUTSIDERS") {
                                updateOutsiderAccidentFormById(parentFormData.Id, {
                                    "AccidentFollowUpFormId": {
                                        results: [...parentFormData.AccidentFollowUpFormId, createServiceUserAccidentRes.data.Id]
                                    },
                                    "NextDeadline": addMonths(new Date(), 6),
                                }).then((res) => {
                                    console.log(res);
    
                                    postLog({
                                        AccidentTime: parentFormData.AccidentTime,
                                        Action: "提交",
                                        CaseNumber: parentFormData.CaseNumber,
                                        FormType: "PUI",
                                        RecordId: parentFormData.Id,
                                        Report: "事故跟進/結束報告(三)",
                                        ServiceUnit: parentFormData.ServiceLocation
                                    }).catch(console.error)
    
                                    formSubmittedHandler();
                                }).catch(console.error);
                            }
                        }).catch(console.error);
                    }).catch(console.error);*/
                    updateAccidentFollowUpRepotFormById(selectedAccidentFollowUpFormId, {
                        ...body,
                        "SMDate": new Date().toISOString(),
                        //"Completed": true
                    }).then((updateAccidentFollowUpRepotFormByIdRes) => {
                        // Update parent form
                        if (formType === "SERVICE_USER") {
                            updateServiceUserAccidentById(parentFormData.Id, {
                                /*"AccidentFollowUpFormId": {
                                    results: [...parentFormData.AccidentFollowUpFormId, createServiceUserAccidentRes.data.Id]
                                },*/
                                "Status": "PENDING_SD_APPROVE",
                                "NextDeadline": addMonths(new Date(), 6),
                                "ReminderDate": null,
                            }).then((updateServiceUserAccidentByIdRes) => {
                                console.log(updateServiceUserAccidentByIdRes);
                                notifyServiceUserAccident(context, parentFormData.Id, 3, workflow);
                                postLog({
                                    AccidentTime: parentFormData.AccidentTime,
                                    Action: "提交",
                                    CaseNumber: parentFormData.CaseNumber,
                                    FormType: "SUI",
                                    RecordId: parentFormData.Id,
                                    Report: "事故跟進/結束報告(三)",
                                    ServiceUnit: parentFormData.ServiceLocation
                                }).catch(console.error)

                                formSubmittedHandler();
                            }).catch(console.error);
                        } else if (formType === "OUTSIDERS") {
                            updateOutsiderAccidentFormById(parentFormData.Id, {
                                /*"AccidentFollowUpFormId": {
                                    results: [...parentFormData.AccidentFollowUpFormId, createServiceUserAccidentRes.data.Id]
                                },*/
                                "Status": "PENDING_SD_APPROVE",
                                "NextDeadline": addMonths(new Date(), 6),
                            }).then((res) => {
                                console.log(res);
                                notifyServiceUserAccident(context, parentFormData.Id, 3, workflow);
                                postLog({
                                    AccidentTime: parentFormData.AccidentTime,
                                    Action: "提交",
                                    CaseNumber: parentFormData.CaseNumber,
                                    FormType: "PUI",
                                    RecordId: parentFormData.Id,
                                    Report: "事故跟進/結束報告(三)",
                                    ServiceUnit: parentFormData.ServiceLocation
                                }).catch(console.error)

                                formSubmittedHandler();
                            }).catch(console.error);
                        }
                    }).catch(console.error);
                } else {
                    // Update current form
                    updateAccidentFollowUpRepotFormById(selectedAccidentFollowUpFormId, {
                        ...body,
                        "SMDate": new Date().toISOString(),
                    }).then((updateAccidentFollowUpRepotFormByIdRes) => {
                        if (formType === "SERVICE_USER") {
                            updateServiceUserAccidentById(parentFormData.Id, {
                                "Status": "PENDING_SD_APPROVE"
                            }).then((updateServiceUserAccidentByIdRes) => {
                                notifyServiceUserAccident(context, parentFormData.Id, 3, workflow);
                                postLog({
                                    AccidentTime: parentFormData.AccidentTime,
                                    Action: "提交",
                                    CaseNumber: parentFormData.CaseNumber,
                                    FormType: "SUI",
                                    RecordId: parentFormData.Id,
                                    Report: "事故跟進/結束報告(三)",
                                    ServiceUnit: parentFormData.ServiceLocation
                                }).catch(console.error)

                                formSubmittedHandler();
                            }).catch(console.error);
                        } else if (formType === "OUTSIDERS") {
                            updateOutsiderAccidentFormById(parentFormData.Id, {
                                "Status": "PENDING_SD_APPROVE"
                            }).then((updateAccidentFollowUpRepotFormByIdRes) => {
                                notifyServiceUserAccident(context, parentFormData.Id, 3, workflow);
                                postLog({
                                    AccidentTime: parentFormData.AccidentTime,
                                    Action: "提交",
                                    CaseNumber: parentFormData.CaseNumber,
                                    FormType: "PUI",
                                    RecordId: parentFormData.Id,
                                    Report: "事故跟進/結束報告(三)",
                                    ServiceUnit: parentFormData.ServiceLocation
                                }).catch(console.error);
                                formSubmittedHandler();
                            }).catch(console.error);
                        }
                    }).catch(console.error);
                }
            }



            // Form 21 SM's part done, and send it to sd and spt.
            // updateAccidentFollowUpRepotFormById(selectedAccidentFollowUpFormId, body).then((AccidentFollowUpReportFormResponse) => {
            //     //Update 
            //     if (formType === "SERVICE_USER") {
            //         updateServiceUserAccidentById(parentFormData.Id, { "Status": "PENDING_SD_APPROVE" }).then(() => {
            //             // trigger notification workflow
            //             formSubmittedHandler();
            //         }).catch(console.error)
            //     } else {
            //         updateOutsiderAccidentForm(parentFormData.Id, { "Status": "PENDING_SD_APPROVE" }).then(() => {
            //             formSubmittedHandler();
            //         }).catch(console.error);
            //     }
            // }).catch(console.error);
        }
    }

    const draftHandler = (event) => {
        const [body, error] = dataFactory();
        updateAccidentFollowUpRepotFormById(selectedAccidentFollowUpFormId, body).then((AccidentFollowUpReportFormResponse) => {
            // trigger notification workflow
            formSubmittedHandler();
        }).catch(console.error);
    }

    const cancelHandler = (event) => {
        //Implement
        const path = context.pageContext.site.absoluteUrl + `/accident-and-incident/SitePages/Home.aspx`;
        window.open(path, "_self");
    }

    const sptCommentUpdate = () => {
        const body = {
            "SPTComment": sptComment,
            "SPTDate": new Date().toISOString()
        }
        updateAccidentFollowUpRepotFormById(selectedAccidentFollowUpFormId, body).then((res) => {
            console.log(res);

            if (formType === "SERVICE_USER") {
                postLog({
                    AccidentTime: parentFormData.AccidentTime,
                    Action: "評語",
                    CaseNumber: parentFormData.CaseNumber,
                    FormType: "SUI",
                    RecordId: parentFormData.Id,
                    Report: "事故跟進/結束報告(三)",
                    ServiceUnit: parentFormData.ServiceLocation
                }).catch(console.error)
            } else {
                postLog({
                    AccidentTime: parentFormData.AccidentTime,
                    Action: "評語",
                    CaseNumber: parentFormData.CaseNumber,
                    FormType: "PUI",
                    RecordId: parentFormData.Id,
                    Report: "事故跟進/結束報告(三)",
                    ServiceUnit: parentFormData.ServiceLocation
                }).catch(console.error)
            }

            formSubmittedHandler();
        }).catch(console.error);
    }

    const sdApproveHandler = () => {
        if (confirm("確認批准 ?") === false) return;
        const [body, error] = dataFactory();
        updateAccidentFollowUpRepotFormById(selectedAccidentFollowUpFormId, {
            ...body,
            "SDDate": new Date().toISOString(),
            "SDComment": sdComment,
            "Completed": true
        }).then((updateAccidentFollowUpRepotFormByIdRes) => {
            if (formType === "SERVICE_USER") {
                updateServiceUserAccidentById(parentFormData.Id, { "Status": "CLOSED" }).then(() => {
                    // trigger notification workflow
                    notifyServiceUserAccident(context, parentFormData.Id, 3, workflow);

                    postLog({
                        AccidentTime: parentFormData.AccidentTime,
                        Action: "批准",
                        CaseNumber: parentFormData.CaseNumber,
                        FormType: "SUI",
                        RecordId: parentFormData.Id,
                        Report: "事故跟進/結束報告(三)",
                        ServiceUnit: parentFormData.ServiceLocation
                    }).catch(console.error)

                    formSubmittedHandler();
                }).catch(console.error);
            } else if (formType === "OUTSIDERS") {
                updateOutsiderAccidentFormById(parentFormData.Id, { "Status": "CLOSED" }).then(() => {

                    postLog({
                        AccidentTime: parentFormData.AccidentTime,
                        Action: "批准",
                        CaseNumber: parentFormData.CaseNumber,
                        FormType: "PUI",
                        RecordId: parentFormData.Id,
                        Report: "事故跟進/結束報告(三)",
                        ServiceUnit: parentFormData.ServiceLocation
                    }).catch(console.error)

                    notifyOutsiderAccident(context, parentFormData.Id, 3, workflow);
                    formSubmittedHandler();
                }).catch(console.error);
            }
        }).catch(console.error);
    }

    const sdRejectHandler = () => {
        if (confirm("確認拒絕 ?")) {
            updateAccidentFollowUpRepotFormById(selectedAccidentFollowUpFormId, {
                "Completed": false,
                "SDDate": new Date().toISOString(),
                "SDComment": sdComment
            }).then((AccidentFollowUpReportFormResponse) => {
                if (formType === "SERVICE_USER") {
                    updateServiceUserAccidentById(parentFormData.Id, { "Status": "PENDING_SM_FILL_IN" }).then(() => {
                        // trigger notification workflow
                        notifyServiceUserAccidentReject(context, parentFormData.Id, 3, workflow);
                        postLog({
                            AccidentTime: parentFormData.AccidentTime,
                            Action: "拒絕",
                            CaseNumber: parentFormData.CaseNumber,
                            FormType: "SUI",
                            RecordId: parentFormData.Id,
                            Report: "事故跟進/結束報告(三)",
                            ServiceUnit: parentFormData.ServiceLocation
                        }).catch(console.error);

                        formSubmittedHandler();
                    }).catch(console.error);
                } else if (formType === "OUTSIDERS") {
                    updateOutsiderAccidentFormById(parentFormData.Id, { "Status": "PENDING_SM_FILL_IN" }).then(() => {
                        notifyOutsiderAccidentReject(context, parentFormData.Id, 3, workflow);
                        postLog({
                            AccidentTime: parentFormData.AccidentTime,
                            Action: "拒絕",
                            CaseNumber: parentFormData.CaseNumber,
                            FormType: "PUI",
                            RecordId: parentFormData.Id,
                            Report: "事故跟進/結束報告(三)",
                            ServiceUnit: parentFormData.ServiceLocation
                        }).catch(console.error);

                        formSubmittedHandler();
                    }).catch(console.error);
                }
            }).catch(console.error);
        }
    }

    const sdSubmitHandler = (event) => {
        const [body] = dataFactory();
        if (form.accidentalFollowUpContinue) {
            if (confirm("確認繼續 ?") === false) return;

            let title = "";
            if (parentFormData.AccidentFollowUpFormId) {
                title = `事故跟進/結束報告(三) - 第${parentFormData.AccidentFollowUpFormId.length + 1}篇`;
            } else {
                title = `事故跟進/結束報告(三) - 第1篇`;
            }

            // Create a new follow up Form
            createAccidentFollowUpRepotForm({
                "CaseNumber": parentFormData.CaseNumber,
                "ParentFormId": parentFormData.Id,
                "InvestigatorId": formTwentyOneData.InvestigatorId,
                "SPTId": formTwentyOneData.SPTId,
                "SDId": formTwentyOneData.SDId,
                "SMId": formTwentyOneData.SMId,
                "Title": title
            }).then((createServiceUserAccidentRes) => {
                console.log(createServiceUserAccidentRes);
                // Update current Form
                updateAccidentFollowUpRepotFormById(selectedAccidentFollowUpFormId, {
                    ...body,
                    "SDDate": new Date().toISOString(),
                    "SDComment": sdComment,
                    "Completed": true
                }).then((updateAccidentFollowUpRepotFormByIdRes) => {
                    // Update parent form
                    if (formType === "SERVICE_USER") {
                        updateServiceUserAccidentById(parentFormData.Id, {
                            "Status": "PENDING_SM_FILL_IN",
                            "AccidentFollowUpFormId": {
                                results: [...parentFormData.AccidentFollowUpFormId, createServiceUserAccidentRes.data.Id]
                            },
                            "NextDeadline": addMonths(new Date(), 6),
                            "ReminderDate": addDays(addMonths(new Date(), 6), -7).toISOString()
                        }).then((updateServiceUserAccidentByIdRes) => {
                            console.log(updateServiceUserAccidentByIdRes);
                            notifyServiceUserAccident(context, parentFormData.Id, 3, workflow);
                            postLog({
                                AccidentTime: parentFormData.AccidentTime,
                                Action: "提交",
                                CaseNumber: parentFormData.CaseNumber,
                                FormType: "SUI",
                                RecordId: parentFormData.Id,
                                Report: "事故跟進/結束報告(三)",
                                ServiceUnit: parentFormData.ServiceLocation
                            }).catch(console.error);

                            formSubmittedHandler();
                        }).catch(console.error);
                    } else if (formType === "OUTSIDERS") {
                        updateOutsiderAccidentFormById(parentFormData.Id, {
                            "AccidentFollowUpFormId": {
                                results: [...parentFormData.AccidentFollowUpFormId, createServiceUserAccidentRes.data.Id]
                            },
                            "NextDeadline": addMonths(new Date(), 6),
                            "ReminderDate": addDays(addMonths(new Date(), 6), -7)
                        }).then((res) => {
                            console.log(res);

                            postLog({
                                AccidentTime: parentFormData.AccidentTime,
                                Action: "提交",
                                CaseNumber: parentFormData.CaseNumber,
                                FormType: "PUI",
                                RecordId: parentFormData.Id,
                                Report: "事故跟進/結束報告(三)",
                                ServiceUnit: parentFormData.ServiceLocation
                            }).catch(console.error);

                            formSubmittedHandler();
                        }).catch(console.error);
                    }
                }).catch(console.error);
            }).catch(console.error);
        } else {
            // Update current form
            updateAccidentFollowUpRepotFormById(selectedAccidentFollowUpFormId, {
                ...body,
                "SDDate": new Date().toISOString(),
                "SDComment": sdComment,
            }).then((updateAccidentFollowUpRepotFormByIdRes) => {
                if (formType === "SERVICE_USER") {
                    updateServiceUserAccidentById(parentFormData.Id, {
                        "Status": "CLOSED",
                        "ReminderDate": null
                    }).then((updateServiceUserAccidentByIdRes) => {
                        postLog({
                            AccidentTime: parentFormData.AccidentTime,
                            Action: "批准",
                            CaseNumber: parentFormData.CaseNumber,
                            FormType: "SUI",
                            RecordId: parentFormData.Id,
                            Report: "事故跟進/結束報告(三)",
                            ServiceUnit: parentFormData.ServiceLocation
                        }).catch(console.error);
                        formSubmittedHandler();
                    }).catch(console.error);
                } else if (formType === "OUTSIDERS") {
                    updateOutsiderAccidentFormById(parentFormData.Id, {
                        "Status": "CLOSED"
                    }).then((updateAccidentFollowUpRepotFormByIdRes) => {

                        postLog({
                            AccidentTime: parentFormData.AccidentTime,
                            Action: "批准",
                            CaseNumber: parentFormData.CaseNumber,
                            FormType: "PUI",
                            RecordId: parentFormData.Id,
                            Report: "事故跟進/結束報告(三)",
                            ServiceUnit: parentFormData.ServiceLocation
                        }).catch(console.error);

                        formSubmittedHandler();
                    }).catch(console.error);
                }
                formSubmittedHandler();
            }).catch(console.error);
        }
    }

    const backToCMS =(e) => {
        const path = context.pageContext.site.absoluteUrl + `/accident-and-incident/SitePages/Home.aspx?navScreen=cms&keyword=`+parentFormData.HKID+`&type=cms`;
        window.open(path, "_self");
    }
    
    const loadData = () => {
        if (parentFormData.Stage) {
            setFormStage(parentFormData.Stage);
        }
        if (parentFormData.Status) {
            setFormStatus(parentFormData.Status);
        }

        setAccidentTime(new Date(parentFormData.AccidentTime))
        // Service Unit
        setServiceUnitByShortForm(parentFormData.ServiceUnit);

        //Service User
        setServiceUserRecordId(parentFormData.ServiceUserId);
        debugger
        if (parentFormData && parentFormData.CaseNumber) {
            getAllAccidentFollowUpFormByCaseNumber(parentFormData.CaseNumber).then((accidentFollowUpFormRepseonseRes) => {
                setAccidentFollowUpFormList(accidentFollowUpFormRepseonseRes);
                if (accidentFollowUpFormRepseonseRes && accidentFollowUpFormRepseonseRes.length > 0) {
                    setSelectedAccidentFollowUpFormId(accidentFollowUpFormRepseonseRes[0].Id);

                    if (formTwentyOneData.SM && formTwentyOneData.SM.EMail) {
                        setServiceManagerEmail(formTwentyOneData.SM.EMail);
                        if (formTwentyOneData.SMDate != null) {
                            setSmDate(new Date(formTwentyOneData.SMDate))
                        }
                    }
                    if (formTwentyOneData.SD && formTwentyOneData.SD.EMail) {
                        setServiceDirectorEmail(formTwentyOneData.SD.EMail);
                        if (formTwentyOneData.SDDate != null) {
                            setSdDate(new Date(formTwentyOneData.SDDate))
                        }
                    }
                    if (formTwentyOneData.SPT && formTwentyOneData.SPT.EMail) {
                        setSPhysicalTherapyEmail(formTwentyOneData.SPT.EMail);
                        if (formTwentyOneData.SPTDate != null) {
                            setSptDate(new Date(formTwentyOneData.SPTDate))
                        }
                    }

                    // setIsSDApproved(accidentFollowUpFormRepseonseRes[0].SDApproved === true ? true : false);

                    // setForm({
                    //     accidentalFollowUpContinue: accidentFollowUpFormRepseonseRes[0].AccidentalFollowUpContinue ? "ACCIDENT_FOLLOW_UP_TRUE" : "ACCIDENT_FOLLOW_UP_FALSE",
                    //     executionPeriod: accidentFollowUpFormRepseonseRes[0].ExecutionPeriod,
                    //     followUpMeasures: accidentFollowUpFormRepseonseRes[0].FollowUpMeasures,
                    //     remark: accidentFollowUpFormRepseonseRes[0].Remark
                    // });

                    // setSdComment(accidentFollowUpFormRepseonseRes[0].SDComment);
                    // if (accidentFollowUpFormRepseonseRes[0].SMDate) {
                    //     setSmDate(new Date(accidentFollowUpFormRepseonseRes[0].SMDate));
                    // }

                    // setSptComment(accidentFollowUpFormRepseonseRes[0].SPTComment);
                    // if (accidentFollowUpFormRepseonseRes[0].SPTDate) {
                    //     setSmDate(new Date(accidentFollowUpFormRepseonseRes[0].SPTDate));
                    // }
                }
            }).catch(console.error);

        }
    }

    const formChangeHandler = (event) => {
        const value = +event.target.value;
        setSelectedAccidentFollowUpFormId(value);
        changeFormTwentyOneDataSelected(value);
    }

    const updateState = () => {
        const [data] = accidentFollowUpFormList.filter((item) => item.ID === selectedAccidentFollowUpFormId);

        if (data) {
            if (data.FollowUpActions) {
                setFollowUpActions(JSON.parse(data.FollowUpActions));
            }

            setCompleted(data.Completed === true ? true : false);

            // setForm({
            //     accidentalFollowUpContinue: data.AccidentalFollowUpContinue,
            //     executionPeriod: data.ExecutionPeriod || "",
            //     followUpMeasures: data.FollowUpMeasures || "",
            //     remark: data.Remark || ""
            // });
            setForm({
                accidentalFollowUpContinue: data.AccidentalFollowUpContinue,
            });

            setSdComment(data.SDComment || "");
            if (data.SMDate) {
                setSmDate(new Date(data.SMDate));
            } else setSmDate(new Date());

            setSptComment(data.SPTComment || "");
            if (data.SPTDate) {
                setSmDate(new Date(data.SPTDate));
            } else setSmDate(new Date());
        }
    }

    useEffect(() => {
        if (accidentSMbackup != '') {
            getUserInfoByEmailInUserInfoAD(siteCollectionUrl, context.pageContext.legacyPageContext.userEmail).then((userInfosRes) => {

                if (Array.isArray(userInfosRes) && userInfosRes.length > 0) {
                    setJobCoe(userInfosRes[0].hr_jobcode);
                    let accidentSMbackupList = accidentSMbackup.split(';');
                    console.log('permissionList', permissionList)
                    let per = permissionList.filter(item => { return item == serviceUserUnitEn })
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
        // Get stage oen form data
        if (parentFormData) {
            if (parentFormData && parentFormData.ServiceUserUnit) {
                let ser = serviceUnitList.filter(o => { return o.su_Eng_name_display == parentFormData.ServiceUserUnit });
                if (ser.length > 0) {
                    console.log("ser[0].su_name_tc", ser[0].su_name_tc)
                    setServiceUserUnit(ser[0].su_name_tc);
                }
            }
            loadData();
        }
    }, [parentFormData]);

    useEffect(() => {
        if (parentFormData && parentFormData.ServiceUserUnit) {
            let ser = serviceUnitList.filter(o => { return o.su_Eng_name_display == parentFormData.ServiceUserUnit });
            if (ser.length > 0) {
                console.log("ser[0].su_name_tc", ser[0].su_name_tc)
                setServiceUserUnit(ser[0].su_name_tc);
                setServiceUserUnitEn(ser[0].su_Eng_name_display);
                setAccidentSMbackup(ser[0].Accident_SM_backup);

            }
        }
    }, []);

    useEffect(() => {
        updateState();
    }, [selectedAccidentFollowUpFormId]);
    console.log('form.accidentalFollowUpContinue' , form.accidentalFollowUpContinue);
    return (
        <>
            {isPrintMode && <Header displayName="事故跟進/結束報告(三)" />}
            {
                accidentFollowUpFormList.length > 1 &&
                <div className="row">
                    <div className="col-sm-12 col-md-6">
                        <select className={"form-control"} value={selectedAccidentFollowUpFormId} onChange={formChangeHandler}>
                            {accidentFollowUpFormList.map((item) => {
                                return <option value={item.ID}>{moment(item.Created).format("YYYY-MM-DD")} - {item.Title}, 共{accidentFollowUpFormList.length}篇</option>
                            })}
                        </select>
                    </div>
                </div>
            }
            <div className="container-fluid px-4 pt-4">
                <section className="mb-5">
                    {/* <div className="row">
                        <div className="col-12 font-weight-bold">
                            <h5>檔案編號</h5>
                        </div>
                    </div> */}
                    <div className="form-row mb-2">
                        {/* 服務單位 */}
                        <label className={`col-12 col-lg-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>服務單位</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" readOnly value={`${serviceUserUnit}`} />
                        </div>
                        {/* 保險公司備案編號 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>保險公司備案編號</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" readOnly value={`${parentFormData && parentFormData.InsuranceCaseNo ? `${parentFormData.InsuranceCaseNo}` : ""}`} />
                        </div>
                    </div>
                    <div className="form-row">
                        {/* 保險公司備案編號 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>檔案編號</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" readOnly value={`${parentFormData && parentFormData.CaseNumber ? `${parentFormData.CaseNumber}` : ""}`} />
                        </div>
                    </div>
                </section>

                <section className="mb-5">
                    <div className="form-row mb-3">
                        <div className="col-12 font-weight-bold">
                            <h5>意外資料</h5>
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/* 意外性質 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>意外性質</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" readOnly value={formTypeParser(formType, "意外")} />
                        </div>
                        {/* 發生意外者姓名 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>發生意外者姓名</label>
                        <div className="col-12 col-md-4">
                            {/*
                                formType === "SERVICE_USER" ?
                                    <input type="text" className="form-control" readOnly value={`${serviceUser && serviceUser.NameCN ? `${serviceUser.NameCN}` : ""}`} />
                                    :
                                    <input type="text" className="form-control" readOnly value={`${parentFormData && parentFormData.ServiceUserNameTC || ""}`} />
                            */}
                            <input type="text" className="form-control" readOnly value={`${parentFormData && parentFormData.ServiceUserNameCN || ""}`} />
                        </div>
                    </div>
                    <div className="form-row">
                        {/* 發生意外日期 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>發生意外日期</label>
                        <div className="col-12 col-md-4">
                            <DatePicker
                                className="form-control"
                                selected={accidentTime}
                                showTimeSelect
                                timeFormat="p"
                                timeIntervals={15}
                                dateFormat="yyyy/MM/dd"
                                readOnly
                            />
                        </div>
                    </div>
                </section>

                <section className="mb-5">
                    {/* <div className="form-row mb-3">
                        <div className="col-12 font-weight-bold">
                            <h5>意外跟進行動表</h5>
                        </div>
                    </div> */}
                    <div className="d-flex justify-content-between align-items-center mb-3">

                        <h5>意外跟進行動表</h5>
                        {
                            // (completed === false || (stageThreePendingSmFillIn(currentUserRole, formStatus, formStage) || stageThreePendingSdApprove(currentUserRole, formStatus, formStage))) &&
                            <button type="button" className="btn btn-primary" onClick={(event) => { setFollowUpActions([...followUpActions, { action: "", date: new Date().toISOString(), remark: "" }]); }}
                                disabled={type=='cms' ||
                                    followUpActions.length >= 5 ||
                                    completed ||
                                    (!canSaveDraft && !stageThreePendingSmFillIn(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyOneData) && !stageThreePendingSdApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyOneData))}>
                                新增意外跟進行動
                            </button>
                        }
                    </div>
                    {
                        followUpActions.map((item, index) => {
                            return (
                                <div className="mb-3 px-2 py-3" style={{ border: "1px solid #d9dde0", borderRadius: "10px" }} >
                                    {
                                        followUpActions.length > 1 &&
                                        <div className="d-flex justify-content-between align-items-center mb-2" >
                                            <div className={`${styles.fieldTitle}`} style={{ fontSize: 18 }}>
                                                意外跟進行動 - {index + 1}
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
                                    <div className="form-row mb-2">
                                        {/* 意外報告的跟進措施 */}
                                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>意外報告的跟進措施</label>
                                        <div className="col">
                                            <AutosizeTextarea className={`form-control ${(error && error['followUpActions' + index]) ? "is-invalid" : ""}`} name="followUpMeasures" onChange={(event) => {
                                                let arr = [...followUpActions];
                                                let actionItem = arr[index];
                                                actionItem.action = event.target.value;
                                                setFollowUpActions(arr);
                                            }}
                                                value={item.action}
                                                disabled={type=='cms' ||completed || (!canSaveDraft && !stageThreePendingSmFillIn(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyOneData) && !stageThreePendingSdApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyOneData))} />
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
                                                readOnly={completed || (!canSaveDraft && !stageThreePendingSmFillIn(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyOneData) && !stageThreePendingSdApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyOneData))}
                                            />
                                            {/* <input type="text" className="form-control" name="executionPeriod" value={form.executionPeriod} onChange={textFieldHandler}
                                            disabled={type=='cms' ||completed || (!stageThreePendingSmFillIn(currentUserRole, formStatus, formStage) && !stageThreePendingSdApprove(currentUserRole, formStatus, formStage))} /> */}
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
                                                disabled={type=='cms' ||completed || (!canSaveDraft && !stageThreePendingSmFillIn(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyOneData) && !stageThreePendingSdApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyOneData))} />
                                        </div>
                                    </div>
                                </div>)
                        })
                    }

                    <div className="form-row mb-2">
                        {/* 意外跟進 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>意外跟進</label>
                        <div className="col-12 col-md-4">
                            <div className={`form-check form-check-inline ${(error && error['accidentalFollowUpContinue']) ? "is-invalid" : ""}`} >
                                <input className="form-check-input" type="radio" name="accidentalFollowUpContinue" id="accident-follow-up-true" checked={form.accidentalFollowUpContinue === true} value="ACCIDENT_FOLLOW_UP_TRUE" onChange={() => setForm({ ...form, accidentalFollowUpContinue: true })}
                                    disabled={type=='cms' || completed || (!stageThreePendingSmFillIn(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyOneData) && !stageThreePendingSdApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyOneData))} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="accident-follow-up-true">繼續</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="accidentalFollowUpContinue" id="accident-follow-up-false" checked={form.accidentalFollowUpContinue === false} value="ACCIDENT_FOLLOW_UP_FALSE" onChange={() => setForm({ ...form, accidentalFollowUpContinue: false })}
                                    disabled={type=='cms' ||completed || (!stageThreePendingSmFillIn(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyOneData) && !stageThreePendingSdApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyOneData))} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="accident-follow-up-false">結束</label>
                            </div>
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        {/* 服務經理姓名 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>高級服務經理/<span className="d-sm-inline d-md-block">服務經理姓名</span></label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" readOnly value={`${serviceManager && serviceManager.Title ? `${serviceManager.Title}` : ""}`} disabled={type=='cms' ||completed || (!stageThreePendingSmFillIn(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyOneData) && !stageThreePendingSdApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyOneData))} />
                        </div>
                        {/* 日期*/}
                        <label className={`col-12 col-md-1 col-form-label ${styles.fieldTitle} pt-xl-0`}>日期</label>
                        <div className="col-12 col-md-5">
                            {/* <input type="date"  /> */}
                            <DatePicker className="form-control" dateFormat="yyyy/MM/dd" selected={smDate} onChange={setSmDate} readOnly />
                        </div>
                    </div>
                </section>

                <hr className="my-4" />

                <section className="mb-3">
                    <div className="form-row mb-2">
                        <div className="col-12 font-weight-bold mb-2">
                            <span className={`${styles.fieldTitle} ${styles.fillIn}`}>[此欄由高級物理治療師填寫]</span>
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/* 高級物理治療師姓名 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>高級物理治療師姓名</label>
                        <div className="col-12 col-md-4">
                            {/* <PeoplePicker
                                context={context}
                                personSelectionLimit={1}
                                showtooltip={false}
                                principalTypes={[PrincipalType.User]}
                                resolveDelay={1000}
                                selectedItems={setSptPicker}
                                defaultSelectedUsers={sptAD && [sptAD.mail]}
                            /> */}
                            {/* <select className="form-control" value={sPhysicalTherapyEmail} onChange={(event) => setSPhysicalTherapyEmail(event.target.value)}>
                                <option>請選擇高級物理治療師</option>
                                {
                                    sptList.map((spt) => {
                                        return <option value={spt.mail}>{spt.displayName}</option>
                                    })
                                }
                            </select> */}
                            <input type="text" className="form-control" readOnly value={`${sPhysicalTherapy && sPhysicalTherapy.Title ? `${sPhysicalTherapy.Title}` : ""}`} />
                        </div>
                        {/* 日期*/}
                        <label className={`col-12 col-md-1 col-form-label ${styles.fieldTitle} pt-xl-0`}>日期</label>
                        <div className="col-12 col-md-5">
                            {/* <input type="date"  /> */}
                            <DatePicker className="form-control" dateFormat="yyyy/MM/dd" selected={sptDate} onChange={setSptDate} readOnly />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/* 評語 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>高級物理治療師評語</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" name="sptComment" onChange={(event) => setSptComment(event.target.value)} value={sptComment} disabled={type=='cms' ||!stageThreePendingSdApproveForSpt(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyOneData, accidentFollowUpFormList, selectedAccidentFollowUpFormId)} />
                        </div>
                    </div>
                    {/* <div className="form-group row mb-2">
                        <div className="col-12">
                            <div className="d-flex justify-content-center">
                                <button className="btn btn-primary">儲存評語</button>
                            </div>
                        </div>
                    </div> */}
                </section>

                <hr className="my-4" />

                <section className="mb-3">
                    <div className="form-row mb-2">
                        <div className="col-12 font-weight-bold mb-2">
                            <span className={`${styles.fieldTitle} ${styles.fillIn}`}>[此欄由服務總監填寫]</span>
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        {/* 服務總監姓名 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>服務總監姓名</label>
                        <div className="col-12 col-md-4">
                            {/* <PeoplePicker
                                context={context}
                                personSelectionLimit={1}
                                showtooltip={false}
                                principalTypes={[PrincipalType.User]}
                                resolveDelay={1000}
                                ensureUser={true}
                                selectedItems={setSdPicker}
                                defaultSelectedUsers={sdAD && [sdAD.mail]}
                            /> */}
                            {/* <select className="form-control" value={serviceDirectorEmail} onChange={(event) => setServiceDirectorEmail(event.target.value)}>
                                <option>請選擇服務總監</option>
                                {
                                    sdList.map((sd) => {
                                        return <option value={sd.mail}>{sd.displayName}</option>
                                    })
                                }
                            </select> */}
                            <input type="text" className="form-control" readOnly value={`${serviceDirector && serviceDirector.Title ? `${serviceDirector.Title}` : ""}`} />
                        </div>
                        {/* 日期*/}
                        <label className={`col-12 col-md-1 col-form-label ${styles.fieldTitle} pt-xl-0`}>日期</label>
                        <div className="col-12 col-md-5">
                            {/* <input type="date"  /> */}
                            <DatePicker className="form-control" dateFormat="yyyy/MM/dd" selected={sdDate} onChange={setSdDate} readOnly />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/* 評語 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>服務總監評語</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" name="sdComment" onChange={(event) => setSdComment(event.target.value)} value={sdComment} disabled={type=='cms' ||completed || !stageThreePendingSdApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyOneData)} />
                        </div>
                    </div>

                    {
                        !completed && stageThreePendingSdApprove(CURRENT_USER.email,currentUserRole, formStatus, formStage, formTwentyOneData) &&
                        <div className="form-row justify-content-center mb-2">
                            {
                                <div className="col-md-2 col-4 mb-2">
                                    <button className="btn btn-warning w-100" onClick={() => sdApproveHandler()}>批准</button>
                                </div>
                            }
                            <div className="col-md-2 col-4 mb-2">
                                <button className="btn btn-danger w-100" onClick={() => sdRejectHandler()}>拒絕</button>
                            </div>
                        </div>
                    }
                </section>

                <hr className="my-4" />
                {type !='cms' &&
                <section className="py-3">
                    <div className="row">
                        {
                            <>
                                {!completed && stageThreePendingSmFillIn(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyOneData) &&
                                    <div className="col-md-2 col-4 mb-2">
                                        <button className="btn btn-warning w-100" onClick={(event) => smSubmitHandler(event)}>提交</button>
                                    </div>
                                }
                                {
                                    stageThreePendingSdApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyOneData) &&
                                    <div className="col-md-2 col-4 mb-2">
                                        <button className="btn btn-warning w-100" onClick={(event => sdSubmitHandler(event))}>提交</button>
                                    </div>
                                }
                                {
                                    stageThreePendingSdApproveForSpt(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyOneData, accidentFollowUpFormList, selectedAccidentFollowUpFormId) &&
                                    <div className="col-md-2 col-4 mb-2">
                                        <button className="btn btn-warning w-100" onClick={(event => sptCommentUpdate())}>提交</button>
                                    </div>
                                }
                                {
                                    (canSaveDraft || stageThreePendingSmFillIn(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyOneData)) &&
                                    <div className="col-md-2 col-4 mb-2">
                                        <button className="btn btn-success w-100" onClick={(event => draftHandler(event))}>草稿</button>
                                    </div>
                                }
                            </>
                        }
                        <div className="col-md-2 col-4 mb-2">
                            <button className="btn btn-secondary w-100" onClick={(event => cancelHandler(event))}>取消</button>
                        </div>
                        <div className="col-md-2 col-4 mb-2">
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
            </div>
        </>
    )
}
