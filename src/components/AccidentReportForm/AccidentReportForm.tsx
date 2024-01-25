import * as React from 'react';
import { useState, useEffect } from "react";
import AutosizeTextarea from "../AutosizeTextarea/AutosizeTextarea";
import DatePicker from "react-datepicker";
import Header from "../Header/Header";
import "./AccidentReportForm.css";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import useUserInfoAD from "../../hooks/useUserInfoAD";
import { IAccidentFollowUpRepotFormProps, IAccidentFollowUpRepotFormStates, IAccidentFollowUpReportFormError } from "./IAccidentReportForm";
import { Role } from '../../utils/RoleParser';
import useServiceUnitByShortForm from '../../hooks/useServiceUnitByShortForm';
import useServiceUser from '../../hooks/useServiceUser';
import useSharePointGroup from '../../hooks/useSharePointGroup';
import { getAccidentReportFormById } from '../../api/FetchFuHongList';
import { createAccidentFollowUpRepotForm, updateAccidentReportFormById, updateServiceUserAccidentById, updateOutsiderAccidentFormById, uploadAccidentReportAttachmentById, getAccidentReportFormAllAttachmentById } from '../../api/PostFuHongList';
import { addBusinessDays, addMonths, addDays } from '../../utils/DateUtils';
import { pendingInvestigate, stageTwoPendingSptApprove, stageTwoPendingSptApproveForSM } from '../../webparts/fuHongServiceUserAccidentForm/permissionConfig';
import { notifyOutsiderAccident, notifyServiceUserAccident, notifyServiceUserAccidentSMSDComment, notifyServiceUserAccidentReject, notifyOutsiderAccidentReject } from '../../api/Notification';
import { postLog } from '../../api/LogHelper';
import { getQueryParameterString } from '../../utils/UrlQueryHelper';
import StyledDropzone from "../../components/Dropzone/Dropzone";
import { attachmentsFilesFormatParser } from '../../utils/FilesParser';
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
export default function AccidentFollowUpRepotForm({ context, styles, formType, parentFormData, currentUserRole, formSubmittedHandler, isPrintMode, formTwentyData, workflow, serviceUnitList, print }: IAccidentFollowUpRepotFormProps) {
    const type: string = getQueryParameterString("type");
    const [formStatus, setFormStatus] = useState("");
    const [formStage, setFormStage] = useState("");
    const [error, setError] = useState<IErrorFields>({});
    const [uploadFile, setUploadFile] = useState([]);
    const [selectedFile, setSelectedFile] = useState([]);
    const [form, setForm] = useState<IAccidentFollowUpRepotFormStates>({
        accidentNatureFall: false,
        accidentNatureChok: false,
        accidentNatureBehavior: false,
        accidentNatureEnvFactor: false,
        accidentNatureOther: false,
        accidentalNatureOtherRemark: "",
        envFactorSlipperyGround: false,
        envFactorUnevenGround: false,
        envFactorObstacleItems: false,
        envFactorInsufficientLight: false,
        envFactorNotEnoughSpace: false,
        envFactorNoise: false,
        envFactorCollision: false,
        envFactorHurtByOthers: false,
        envFactorAssistiveEquipment: false,
        envFactorOther: false,
        envFactorOtherRemark: "",
        personalFactorEmotional: false,
        personalFactorImpatient: false,
        personalFactorChok: false,
        personalFactorUnsteadyWalk: false,
        personalFactorTwitch: false,
        personalFactorOther: false,
        personalFactorOtherRemark: "",
        accidentalDiscovery: "",
        accidentCauseFactor: "",
        suggestion: "",
    });

    const [investigator, setInvestigator] = useUserInfoAD();
    const [getCurrentUser, setCurrentUser] = useState(context.pageContext.user.email);
    const [sptDate, setSptDate] = useState(null);
    const [smDate, setSmDate] = useState(null);
    const [sptComment, setSptComment] = useState("");
    const [smComment, setSmComment] = useState("");


    const [accidentTime, setAccidentTime] = useState(null);
    const [estimatedFinishDate, setEstimatedFinishDate] = useState(null);
    const [formReceivedDate, setFormReceivedDate] = useState(null);
    const [serviceUnitDetail, setServiceUnitByShortForm] = useServiceUnitByShortForm();
    const [serviceUserList, serviceUser, serviceUserRecordId, setServiceUserRecordId] = useServiceUser();

    const [serviceManager, setServiceManagerEmail, serviceManagerEmail] = useSharePointGroup(); //[此欄由高級服務經理/服務經理填寫]
    const [sPhysicalTherapy, setSPhysicalTherapyEmail, sPhysicalTherapyEmail] = useSharePointGroup(); // [此欄由高級物理治療師填寫]

    const CURRENT_USER: UserInfo = {
        email: context.pageContext.legacyPageContext.userEmail,
        name: context.pageContext.legacyPageContext.userDisplayName,
        id: context.pageContext.legacyPageContext.userId,
    }
    const textFieldHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setForm({ ...form, [name]: value });
    }

    const checkboxBoolHandler = (event) => {
        const name = event.target.name;
        setForm({ ...form, [name]: !form[name] });
    }



    const dataFactory = () => {
        let body = {};
        let msg = "";
        let error: IAccidentFollowUpReportFormError = {};
        // Title <-form type
        body["Title"] = formType;
        body["AccidentNatureFall"] = form.accidentNatureFall;
        body["AccidentNatureChok"] = form.accidentNatureChok;
        body["AccidentNatureBehavior"] = form.accidentNatureBehavior;
        body["AccidentNatureEnvFactor"] = form.accidentNatureEnvFactor;
        body["AccidentNatureOther"] = form.accidentNatureOther;
        if (form.accidentNatureOther) {
            if (form.accidentalNatureOtherRemark) {
                body["AccidentNatureOtherRemark"] = form.accidentalNatureOtherRemark;
            } else {
                // Error handling
                error["accidentNatureOtherRemark"] = true;
                msg += "請填寫其他環境因素\n";
            }
        }
        if (!form.accidentNatureFall && !form.accidentNatureChok && !form.accidentNatureBehavior && !form.accidentNatureEnvFactor && !form.accidentNatureOther &&
            !form.envFactorSlipperyGround && !form.envFactorUnevenGround && !form.envFactorObstacleItems && !form.envFactorInsufficientLight && !form.envFactorAssistiveEquipment && !form.envFactorNotEnoughSpace
            && !form.envFactorNoise && !form.envFactorCollision && !form.envFactorHurtByOthers && !form.envFactorOther && !form.personalFactorEmotional && !form.personalFactorImpatient && !form.personalFactorChok
            && !form.personalFactorUnsteadyWalk && !form.personalFactorTwitch && !form.personalFactorOther) {
            error["accidentalNature"] = true;
            error["envFactor"] = true;
            error["personalFactor"] = true;
            msg += "請填寫意外性質";
            msg += "請填寫環境因素";
            msg += "請填寫個人因素";
        }
        /*if () {
            error["envFactor"] = true;
        }*/
        body["EnvFactorSlipperyGround"] = form.envFactorSlipperyGround;
        body["EnvFactorUnevenGround"] = form.envFactorUnevenGround;
        body["EnvFactorObstacleItems"] = form.envFactorObstacleItems;
        body["EnvFactorInsufficientLight"] = form.envFactorInsufficientLight;
        body["EnvFactorAssistiveEquipment"] = form.envFactorAssistiveEquipment
        body["EnvFactorNotEnoughSpace"] = form.envFactorNotEnoughSpace;
        body["EnvFactorNoise"] = form.envFactorNoise
        body["EnvFactorCollision"] = form.envFactorCollision;
        body["EnvFactorHurtByOthers"] = form.envFactorHurtByOthers;
        body["EnvFactorOther"] = form.envFactorOther;
        if (form.envFactorOther) {
            if (form.envFactorOtherRemark) {
                body["EnvFactorOtherRemark"] = form.envFactorOtherRemark;
            } else {
                error["envFactorOtherRemark"] = true;
                msg += "請填寫其他環境因素\n";
                //Error handling
            }
        }

        body["PersonalFactorEmotional"] = form.personalFactorEmotional;
        body["PersonalFactorImpatient"] = form.personalFactorImpatient;
        body["PersonalFactorChok"] = form.personalFactorChok;
        body["PersonalFactorUnsteadyWalk"] = form.personalFactorUnsteadyWalk;
        body["PersonalFactorTwitch"] = form.personalFactorTwitch;
        body["PersonalFactorOther"] = form.personalFactorOther;
        if (form.personalFactorOther) {
            if (form.personalFactorOtherRemark) {
                body["PersonalFactorOtherRemark"] = form.personalFactorOtherRemark;
            } else {
                //error handling
                error["personalFactorOtherRemark"] = true;
                msg += "請填寫其他個人因素\n";
            }
        }
        /*if (!form.personalFactorEmotional && !form.personalFactorImpatient && !form.personalFactorChok && !form.personalFactorUnsteadyWalk && !form.personalFactorTwitch && !form.personalFactorOther) {
            error["personalFactor"] = true;
        }*/
        //AccidentalDiscovery 意外發現之經過
        if (form.accidentalDiscovery) {
            body["AccidentalDiscovery"] = form.accidentalDiscovery;
        } else {
            error["AccidentalDiscovery"] = true;
            msg += "請填寫意外發現之經過\n";
        }

        //AccidentCauseFactor 可能引致意外之因素
        if (form.accidentCauseFactor) {
            body["AccidentCauseFactor"] = form.accidentCauseFactor;
        } else {
            error["AccidentCauseFactor"] = true;
            msg += "請填寫可能引致意外之因素\n";
        }

        //Suggestion 建議 
        if (form.suggestion) {
            body["Suggestion"] = form.suggestion;
        } else {
            error["Suggestion"] = true;
            msg += "請填寫建議\n";
        }



        return [body, error, msg];
    }

    const backToCMS =(e) => {
        const path = context.pageContext.site.absoluteUrl + `/accident-and-incident/SitePages/Home.aspx?navScreen=cms&keyword=`+parentFormData.HKID+`&type=cms`;
        window.open(path, "_self");
    }
    
    const submitHandler = () => {
        debugger
        if (parentFormData.AccidentReportFormId) {

            if (stageTwoPendingSptApproveForSM(CURRENT_USER.email, currentUserRole, formStatus, formStage, sptDate, formTwentyData)) {
                // SM
                updateAccidentReportFormById(parentFormData.AccidentReportFormId, {
                    "SMComment": smComment,
                    "SMDate": new Date().toISOString()
                }).then(async (updateAccidentReportFormResponse) => {
                    if (uploadFile.length > 0) {
                        let att = [];
                        att = [...attachmentsFilesFormatParser(uploadFile, "")];
                        await uploadAccidentReportAttachmentById(parentFormData.AccidentReportFormId, att).then(updateServiceUserAccidentAttachmentByIdRes => {
                            if (updateServiceUserAccidentAttachmentByIdRes) {
                                // Do something
                            }
                        }).catch(console.error);
                    }
                    if (formType === "SERVICE_USER") {
                        postLog({
                            AccidentTime: parentFormData.AccidentTime,
                            Action: "服務經理留下評語",
                            CaseNumber: parentFormData.CaseNumber,
                            FormType: "SUI",
                            RecordId: parentFormData.Id,
                            Report: "服務使用者意外報告(二)",
                            ServiceUnit: parentFormData.ServiceLocation,
                        }).catch(console.error);
                    } else {
                        postLog({
                            AccidentTime: parentFormData.AccidentTime,
                            Action: "服務經理留下評語",
                            CaseNumber: parentFormData.CaseNumber,
                            FormType: "PUI",
                            RecordId: parentFormData.Id,
                            Report: "外界人士意外報告(二)",
                            ServiceUnit: parentFormData.ServiceLocation,
                        }).catch(console.error);
                    }
                    notifyServiceUserAccidentSMSDComment(context, parentFormData.Id, 2, workflow);
                    formSubmittedHandler();
                }).catch(console.error);
            } else {
                // Investigator 
                const [body, error, msg] = dataFactory();
                
                console.log('error',error)
                debugger
                if (Object.keys(error).length > 0) {
                    alert(msg);
                    setError(error);
                } else {
                    updateAccidentReportFormById(parentFormData.AccidentReportFormId, body).then(async (updateAccidentReportFormResponse) => {
                        if (uploadFile.length > 0) {
                            let att = [];
                            att = [...attachmentsFilesFormatParser(uploadFile, "")];
                            await uploadAccidentReportAttachmentById(parentFormData.AccidentReportFormId, att).then(updateServiceUserAccidentAttachmentByIdRes => {
                                if (updateServiceUserAccidentAttachmentByIdRes) {
                                    // Do something
                                }
                            }).catch(console.error);
                        }
                        if (formType === "SERVICE_USER") {
                            updateServiceUserAccidentById(parentFormData.Id, { "Status": "PENDING_SPT_APPROVE", "ReminderDate": null }).then((updateServiceUserAccidentResponse) => {
                                console.log(updateServiceUserAccidentResponse)
                                // Trigger notification workflow;

                                postLog({
                                    AccidentTime: parentFormData.AccidentTime,
                                    Action: "提交至高級物理治療師",
                                    CaseNumber: parentFormData.CaseNumber,
                                    FormType: "SUI",
                                    RecordId: parentFormData.Id,
                                    Report: "服務使用者意外報告(二)",
                                    ServiceUnit: parentFormData.ServiceLocation,
                                }).catch(console.error);

                                formSubmittedHandler();
                            }).catch(console.error)
                        } else {
                            updateOutsiderAccidentFormById(parentFormData.Id, { "Status": "PENDING_SPT_APPROVE", "ReminderDate": null }).then((updateOutsiderAccidentResponse) => {
                                console.log(updateOutsiderAccidentResponse);

                                postLog({
                                    AccidentTime: parentFormData.AccidentTime,
                                    Action: "提交至高級物理治療師",
                                    CaseNumber: parentFormData.CaseNumber,
                                    FormType: "PUI",
                                    RecordId: parentFormData.Id,
                                    Report: "外界人士意外報告(二)",
                                    ServiceUnit: parentFormData.ServiceLocation,
                                }).catch(console.error);

                                formSubmittedHandler();
                            }).catch(console.error);
                        }
                        notifyServiceUserAccident(context, parentFormData.Id, 2, workflow);
                    }).catch(console.error);
                }


            }
        }
    };

    const draftHandler = async () => {
        if (parentFormData.AccidentReportFormId) {
            const [body, error] = dataFactory();
            debugger
            if (formType === "SERVICE_USER") {
                debugger
                updateAccidentReportFormById(parentFormData.AccidentReportFormId, body).then((updateAccidentReportFormResponse) => {
                    formSubmittedHandler();
                }).catch(console.error);
            } else {
                updateAccidentReportFormById(parentFormData.AccidentReportFormId, body).then((updateOutsiderAccidentResponse) => {
                    formSubmittedHandler();
                }).catch(console.error);
            }
            if (uploadFile.length > 0) {
                let att = [];
                att = [...attachmentsFilesFormatParser(uploadFile, "")];

                await uploadAccidentReportAttachmentById(parentFormData.AccidentReportFormId, att).then(updateServiceUserAccidentAttachmentByIdRes => {
                    if (updateServiceUserAccidentAttachmentByIdRes) {
                        // Do something
                    }
                }).catch(console.error);
            }

        }
    };

    const cancelHandler = () => {
        //const data = dataFactory();
        const path = context.pageContext.site.absoluteUrl + `/accident-and-incident/SitePages/Home.aspx`;
        window.open(path, "_self");
    };

    const sptApproveHandler = () => {
        // approve
        // main form Status
        // sub form spt approved // SPTApproved, comment , date
        // Create Form 21
        if (confirm("確認批准 ?")) {
            const [body] = dataFactory();
            if (parentFormData && parentFormData.AccidentReportFormId) {
                const accidentReportFormBody = {
                    ...body,
                    "SPTApproved": true,
                    "SPTDate": new Date().toISOString(),
                    "SPTComment": sptComment
                }
                updateAccidentReportFormById(parentFormData.AccidentReportFormId, accidentReportFormBody).then((accidentReportForm) => {
                    // Create Accident Follow Up Report Form
                    const accidentFollowUpReportFormBody = {
                        "InvestigatorId": parentFormData.InvestigatorId,
                        "SPTId": parentFormData.SPTId,
                        "SMId": serviceManager.Id,
                        "SDId": parentFormData.SDId,
                        "CaseNumber": parentFormData.CaseNumber,
                        "ParentFormId": parentFormData.Id,
                        "Title": "事故跟進/結束報告(三) - 第1篇"
                    };
                    createAccidentFollowUpRepotForm(accidentFollowUpReportFormBody).then((accidentFollowUpReportFormResponse) => {

                        // Update main form status and stage 3
                        const serviceUserAccidentFormBody = {
                            "AccidentFollowUpFormId": {
                                results: [accidentFollowUpReportFormResponse.data.Id]
                            },
                            "Stage": "3",
                            "Status": "PENDING_SM_FILL_IN",
                            "NextDeadline": addMonths(new Date(), 6),
                            "ReminderDate": addDays(addMonths(new Date(), 6), -7)
                        }
                        if (formType === "SERVICE_USER") {
                            updateServiceUserAccidentById(parentFormData.Id, serviceUserAccidentFormBody).then((serviceUserAccidentFormResponse) => {
                                //trigger notification work flow
                                notifyServiceUserAccident(context, parentFormData.Id, 3, workflow);

                                postLog({
                                    AccidentTime: parentFormData.AccidentTime,
                                    Action: "高級物理治療師批准",
                                    CaseNumber: parentFormData.CaseNumber,
                                    FormType: "SUI",
                                    RecordId: parentFormData.Id,
                                    Report: "服務使用者意外報告(二)",
                                    ServiceUnit: parentFormData.ServiceLocation,
                                }).catch(console.error);

                                formSubmittedHandler()
                            }).catch(console.error);
                        } else {
                            updateOutsiderAccidentFormById(parentFormData.Id, serviceUserAccidentFormBody).then((outsiderAccidentFormResponse) => {
                                notifyOutsiderAccident(context, parentFormData.Id, 3, workflow);

                                postLog({
                                    AccidentTime: parentFormData.AccidentTime,
                                    Action: "高級物理治療師批准",
                                    CaseNumber: parentFormData.CaseNumber,
                                    FormType: "PUI",
                                    RecordId: parentFormData.Id,
                                    Report: "外界人士意外報告(二)",
                                    ServiceUnit: parentFormData.ServiceLocation,
                                }).catch(console.error);

                                formSubmittedHandler()
                            }).catch(console.error);
                        }
                    }).catch(console.error);
                }).catch(console.log);
            }
        }
    }

    const sptRejectHandler = () => {
        // main form Status
        // sub form spt approved // SPTApproved, comment , date
        if (confirm("確認拒絕 ?")) {

            const [body] = dataFactory();
            if (parentFormData && parentFormData.AccidentReportFormId) {
                const accidentReportFormBody = {
                    ...body,
                    "SPTApproved": false,
                    "SPTDate": new Date().toISOString(),
                    "SPTComment": sptComment
                }
                updateAccidentReportFormById(parentFormData.AccidentReportFormId, accidentReportFormBody).then((accidentReportForm) => {
                    // Update main form status and stage
                    // Update main form status and stage 3
                    const body = {
                        "Stage": "2",
                        "Status": "PENDING_INVESTIGATE"
                    }

                    if (formType === "SERVICE_USER") {
                        updateServiceUserAccidentById(parentFormData.Id, body).then((serviceUserAccidentFormResponse) => {
                            notifyServiceUserAccidentReject(context, parentFormData.Id, 2, workflow);
                            postLog({
                                AccidentTime: parentFormData.AccidentTime,
                                Action: "高級物理治療師拒絕",
                                CaseNumber: parentFormData.CaseNumber,
                                FormType: "SUI",
                                RecordId: parentFormData.Id,
                                Report: "服務使用者意外報告(二)",
                                ServiceUnit: parentFormData.ServiceLocation,
                            }).catch(console.error);

                            formSubmittedHandler();
                        }).catch(console.error);
                    } else {
                        updateOutsiderAccidentFormById(parentFormData.Id, body).then((outsiderAccidentFormResponse) => {
                            notifyOutsiderAccidentReject(context, parentFormData.Id, 2, workflow);
                            postLog({
                                AccidentTime: parentFormData.AccidentTime,
                                Action: "高級物理治療師拒絕",
                                CaseNumber: parentFormData.CaseNumber,
                                FormType: "PUI",
                                RecordId: parentFormData.Id,
                                Report: "外界人士意外報告(二)",
                                ServiceUnit: parentFormData.ServiceLocation,
                            }).catch(console.error);
                            formSubmittedHandler()
                        }).catch(console.error);
                    }
                    //trigger notification work flow
                }).catch(console.error);
            }
        }
    }

    const loadData = () => {
        debugger
        if (parentFormData.Status) {
            setFormStatus(parentFormData.Status)
        }

        if (parentFormData.Stage) {
            setFormStage(parentFormData.Stage);
        }

        // Service Unit
        setServiceUnitByShortForm(parentFormData.ServiceUnit);

        //Service User
        setServiceUserRecordId(parentFormData.ServiceUserId);

        if (formTwentyData.Attachments) {
            getAccidentReportFormAllAttachmentById(formTwentyData.Id).then((attchementsRes) => {
                let attachments = [];
                attchementsRes.forEach((att) => {
                    attachments.push(att);
                });
                debugger
                setSelectedFile(attachments);
            }).catch(console.error);
        }

        //調查員
        console.log('parentFormData.Investigator', parentFormData.Investigator);
        console.log('investigator1', investigator);
        debugger
        if (formTwentyData.Investigator) {
            setInvestigator([{ secondaryText: formTwentyData.Investigator.EMail, id: formTwentyData.Investigator.Id }]);
        } else if (parentFormData.Investigator) {
            console.log('setInvestigator');
            setInvestigator([{ secondaryText: parentFormData.Investigator.EMail, id: parentFormData.Investigator.Id }]);

            console.log('investigator2', investigator);
        }

        if (parentFormData.AccidentTime) {
            setAccidentTime(new Date(parentFormData.AccidentTime))
        }

        // Get Accident report form
        if (parentFormData && parentFormData.AccidentReportFormId) {
            getAccidentReportFormById(parentFormData.AccidentReportFormId).then((formTwentyData) => {
                //收到「意外填報表」日期
                if (formTwentyData.ReceivedDate) {
                    setFormReceivedDate(new Date(formTwentyData.ReceivedDate));
                }
                //預計意外分析完成日期
                if (formTwentyData.ReceivedDate) {
                    setEstimatedFinishDate(new Date(formTwentyData.EstimatedFinishDate));
                }

                if (formTwentyData.SPT && formTwentyData.SPT.EMail) {
                    setSPhysicalTherapyEmail(formTwentyData.SPT.EMail)
                }
                if (formTwentyData.SM && formTwentyData.SM.EMail) {
                    setServiceManagerEmail(formTwentyData.SM.EMail);
                }

                setSmComment(formTwentyData.SMComment);
                if (formTwentyData.SMDate) {
                    setSmDate(new Date(formTwentyData.SMDate));
                }


                setSptComment(formTwentyData.SPTComment);
                if (formTwentyData.SPTDate) {
                    debugger
                    setSptDate(new Date(formTwentyData.SPTDate));
                }

                setForm({
                    accidentCauseFactor: formTwentyData.AccidentCauseFactor,
                    accidentNatureBehavior: formTwentyData.AccidentNatureBehavior,
                    accidentNatureChok: formTwentyData.AccidentNatureChok,
                    accidentNatureEnvFactor: formTwentyData.AccidentNatureEnvFactor,
                    accidentNatureFall: formTwentyData.AccidentNatureFall,
                    accidentalDiscovery: formTwentyData.AccidentalDiscovery,
                    accidentNatureOther: formTwentyData.AccidentNatureOther,
                    accidentalNatureOtherRemark: formTwentyData.AccidentNatureOtherRemark,
                    envFactorAssistiveEquipment: formTwentyData.EnvFactorAssistiveEquipment,
                    envFactorCollision: formTwentyData.EnvFactorCollision,
                    envFactorHurtByOthers: formTwentyData.EnvFactorHurtByOthers,
                    envFactorInsufficientLight: formTwentyData.EnvFactorInsufficientLight,
                    envFactorNoise: formTwentyData.EnvFactorNoise,
                    envFactorNotEnoughSpace: formTwentyData.EnvFactorNotEnoughSpace,
                    envFactorObstacleItems: formTwentyData.EnvFactorObstacleItems,
                    envFactorOther: formTwentyData.EnvFactorOther,
                    envFactorOtherRemark: formTwentyData.EnvFactorOtherRemark,
                    envFactorSlipperyGround: formTwentyData.EnvFactorSlipperyGround,
                    envFactorUnevenGround: formTwentyData.EnvFactorUnevenGround,
                    personalFactorChok: formTwentyData.PersonalFactorChok,
                    personalFactorEmotional: formTwentyData.PersonalFactorEmotional,
                    personalFactorImpatient: formTwentyData.PersonalFactorImpatient,
                    personalFactorTwitch: formTwentyData.PersonalFactorTwitch,
                    personalFactorUnsteadyWalk: formTwentyData.PersonalFactorUnsteadyWalk,
                    personalFactorOther: formTwentyData.PersonalFactorOther,
                    personalFactorOtherRemark: formTwentyData.PersonalFactorOtherRemark,
                    suggestion: formTwentyData.Suggestion
                });
            }).catch(console.error);
        }
    }

    useEffect(() => {
        // Get stage oen form data
        if (parentFormData) {
            loadData();
        }
    }, [parentFormData]);


    let ServiceUserUnit = "";
    if (parentFormData && parentFormData.ServiceUserUnit) {
        let ser = serviceUnitList.filter(o => { return o.su_Eng_name_display == parentFormData.ServiceUserUnit });
        if (ser.length > 0) {
            ServiceUserUnit = ser[0].su_name_tc
        }
    }

    console.log('sptDate',sptDate);
    const UploadedFilesComponent = (files: any[]) => files.map((file, index) => {
        const fileName = file.FileName
        return <li key={`${file.FileName}_${index}`}>
            <div className="d-flex">
                <span className="flex-grow-1 text-break">
                    <a href={file.ServerRelativeUrl} target={"_blank"} data-interception="off">{fileName}</a>
                </span>
                {/* <span style={{ fontSize: 18, fontWeight: 700, cursor: "pointer" }} onClick={() => removeHandler(index)}>
                    &times;
                </span> */}
            </div>
        </li>
    })
    return (
        <>
            {isPrintMode && <Header displayName="服務使用者/外界人士意外報告(二)" />}
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
                            <input type="text" className="form-control" readOnly value={`${ServiceUserUnit}`} />
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
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>上載文件</label>
                        <div className="col-12 col-md-4">
                            {pendingInvestigate(CURRENT_USER.email, investigator, formStatus, formStage) &&
                                <StyledDropzone selectedFiles={setUploadFile} />
                            }
                            {
                                selectedFile.length > 0 &&
                                <aside>
                                    <ul>{UploadedFilesComponent(selectedFile)}</ul>
                                </aside>
                            }
                        </div>
                        
                    </div>
                </section>

                <section className="mb-5">
                    <div className="form-row mb-3">
                        <div className="col-12 font-weight-bold">
                            <h5>{formTypeParser(formType, "資料")}</h5>
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/* 意外性質 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>意外性質</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control-plaintext" readOnly value={formTypeParser(formType, "意外")} />
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        {/* 服務使用者姓名 (英文)*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>{formTypeParser(formType, "姓名")}<span className="d-sm-inline d-md-block">(英文)</span></label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" readOnly value={`${parentFormData && parentFormData.ServiceUserNameEN || ""}`} />
                            {/*
                                formType === "SERVICE_USER" ?
                                    <input type="text" className="form-control" readOnly value={`${serviceUser && serviceUser.NameEN ? `${serviceUser.NameEN}` : ""}`} />
                                    :
                                    <input type="text" className="form-control" readOnly value={`${parentFormData && parentFormData.ServiceUserNameEN || ""}`} />
                            */}
                        </div>
                        {/* 服務使用者姓名 (中文)*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>{formTypeParser(formType, "姓名")}<span className="d-sm-inline d-md-block">(中文)</span></label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" readOnly value={`${parentFormData && parentFormData.ServiceUserNameCN || ""}`} />
                            {/*
                                formType === "SERVICE_USER" ?
                                    <input type="text" className="form-control" readOnly value={`${serviceUser && serviceUser.NameCN ? `${serviceUser.NameCN}` : ""}`} />
                                    :
                                    <input type="text" className="form-control" readOnly value={`${parentFormData && parentFormData.ServiceUserNameTC || ""}`} />
                            */}
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        {/* 年齡*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>年齡</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" readOnly value={`${parentFormData && parentFormData.ServiceUserAge || ""} `} />
                            {/*
                                formType === "SERVICE_USER" ?
                                    <input type="text" className="form-control" readOnly value={`${serviceUser && serviceUser.Age ? `${serviceUser.Age}` : ""}`} />
                                    :
                                    <input type="text" className="form-control" readOnly value={`${parentFormData && parentFormData.ServiceUserAge || ""} `} />
                            */}
                        </div>
                        {/* 性別*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>性別</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" readOnly value={parentFormData && parentFormData.ServiceUserGender === "male" ? "男" : "女"} />
                            {/*
                                formType === "SERVICE_USER" ?
                                    <input type="text" className="form-control" readOnly value={serviceUser && serviceUser.Gender === "male" ? "男" : "女"} />
                                    :
                                    <input type="text" className="form-control" readOnly value={parentFormData && parentFormData.ServiceUserGender === "male" ? "男" : "女"} />
                            */}
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        {/* 意外發生日期*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>意外發生日期和時間</label>
                        <div className="col-12 col-md-4">
                            <DatePicker
                                className="form-control"
                                selected={accidentTime}
                                showTimeSelect
                                timeFormat="p"
                                timeIntervals={15}
                                dateFormat="yyyy/MM/dd h:mm aa"
                                readOnly
                            />
                        </div>
                        {/* 意外發生地點*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>意外發生地點</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" readOnly value={parentFormData && parentFormData.AccidentLocation ? `${parentFormData.AccidentLocation}` : ""} />
                        </div>

                    </div>

                    <div className="form-row mb-2">
                        {/* 收到「意外填報表」日期*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>收到「意外填報表」日期</label>
                        <div className="col-12 col-md-4">
                            <DatePicker className="form-control" selected={formReceivedDate} dateFormat="yyyy/MM/dd" readOnly />
                        </div>
                        {/* 預計意外分析完成日期*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>預計意外分析完成日期<br />
                            <span>(意外發生日期 + 1個月)</span>
                        </label>
                        <div className="col-12 col-md-4">
                            <DatePicker className="form-control" selected={estimatedFinishDate} dateFormat="yyyy/MM/dd" readOnly />
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        {/* 意外性質*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>意外性質</label>
                        <div className={`col ${(error && error['accidentalNature']) ? styles.divInvalid : ""}`}>
                            <div className="form-check form-check-inline mr-0 mr-md-3">
                                <input className="form-check-input" type="checkbox" name="accidentNatureFall" id="accidental-nature-fall" checked={form.accidentNatureFall} onClick={checkboxBoolHandler} disabled={type=='cms' ||!pendingInvestigate(CURRENT_USER.email, investigator, formStatus, formStage) && !stageTwoPendingSptApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyData)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="accidental-nature-fall">跌倒</label>
                            </div>
                            <div className="form-check form-check-inline mr-0 mr-md-3">
                                <input className="form-check-input" type="checkbox" name="accidentNatureChok" id="accidental-nature-choking" checked={form.accidentNatureChok} onClick={checkboxBoolHandler} disabled={type=='cms' ||!pendingInvestigate(CURRENT_USER.email, investigator, formStatus, formStage) && !stageTwoPendingSptApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyData)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="accidental-nature-choking">哽塞</label>
                            </div>
                            <div className="form-check form-check-inline mr-0 mr-md-3">
                                <input className="form-check-input" type="checkbox" name="accidentNatureBehavior" id="accidental-nature-behavior" checked={form.accidentNatureBehavior} onClick={checkboxBoolHandler} disabled={type=='cms' ||!pendingInvestigate(CURRENT_USER.email, investigator, formStatus, formStage) && !stageTwoPendingSptApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyData)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="accidental-nature-behavior">服務使用者行為問題</label>
                            </div>
                            <div className="form-check form-check-inline  mr-0 mr-md-3">
                                <input className="form-check-input" type="checkbox" name="accidentNatureEnvFactor" id="accidental-nature-env-factor" checked={form.accidentNatureEnvFactor} onClick={checkboxBoolHandler} disabled={type=='cms' ||!pendingInvestigate(CURRENT_USER.email, investigator, formStatus, formStage) && !stageTwoPendingSptApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyData)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="accidental-nature-env-factor">環境因素</label>
                            </div>
                            <div className="form-check mr-0 mr-md-3">
                                <input className="form-check-input" type="checkbox" name="accidentNatureOther" id="accidental-nature-other" checked={form.accidentNatureOther} onClick={checkboxBoolHandler} disabled={type=='cms' ||!pendingInvestigate(CURRENT_USER.email, investigator, formStatus, formStage) && !stageTwoPendingSptApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyData)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="accidental-nature-other">其他</label>
                            </div>
                            {
                                form.accidentNatureOther &&
                                <div className="">
                                    <AutosizeTextarea className={`form-control ${(error && error['accidentNatureOtherRemark']) ? "is-invalid" : ""}`} placeholder="請註明" name="accidentalNatureOtherRemark" value={form.accidentalNatureOtherRemark} onChange={textFieldHandler} disabled={type=='cms' ||!pendingInvestigate(CURRENT_USER.email, investigator, formStatus, formStage) && !stageTwoPendingSptApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyData)} />
                                </div>
                            }
                        </div>
                    </div>
                    {/* 意外成因 */}
                    <div className="form-row mb-4">
                        {/* 環境因素 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>意外成因</label>
                        <div className={`col ${(error && error['envFactor']) ? styles.divInvalid : ""}`}>
                            <div>環境因素</div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="envFactorSlipperyGround" id="env-slippery-ground" checked={form.envFactorSlipperyGround} onClick={checkboxBoolHandler} disabled={type=='cms' ||!pendingInvestigate(CURRENT_USER.email, investigator, formStatus, formStage) && !stageTwoPendingSptApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyData)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="env-slippery-ground">地面濕滑</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="envFactorUnevenGround" id="env-uneven-ground" checked={form.envFactorUnevenGround} onClick={checkboxBoolHandler} disabled={type=='cms' ||!pendingInvestigate(CURRENT_USER.email, investigator, formStatus, formStage) && !stageTwoPendingSptApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyData)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="env-uneven-ground">地面不平</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="envFactorObstacleItems" id="env-obstacle-items" checked={form.envFactorObstacleItems} onClick={checkboxBoolHandler} disabled={type=='cms' ||!pendingInvestigate(CURRENT_USER.email, investigator, formStatus, formStage) && !stageTwoPendingSptApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyData)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="env-obstacle-items">障礙物品</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="envFactorInsufficientLight" id="env-insufficient-light" checked={form.envFactorInsufficientLight} onClick={checkboxBoolHandler} disabled={type=='cms' ||!pendingInvestigate(CURRENT_USER.email, investigator, formStatus, formStage) && !stageTwoPendingSptApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyData)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="env-insufficient-light">光線不足</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="envFactorNotEnoughSpace" id="env-not-enough-space" checked={form.envFactorNotEnoughSpace} onClick={checkboxBoolHandler} disabled={type=='cms' ||!pendingInvestigate(CURRENT_USER.email, investigator, formStatus, formStage) && !stageTwoPendingSptApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyData)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="env-not-enough-space">空間不足</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="envFactorNoise" id="env-acoustic-stimulation" checked={form.envFactorNoise} onClick={checkboxBoolHandler} disabled={type=='cms' ||!pendingInvestigate(CURRENT_USER.email, investigator, formStatus, formStage) && !stageTwoPendingSptApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyData)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="env-acoustic-stimulation">聲響刺激</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="envFactorCollision" id="env-collided-by-others" checked={form.envFactorCollision} onClick={checkboxBoolHandler} disabled={type=='cms' ||!pendingInvestigate(CURRENT_USER.email, investigator, formStatus, formStage) && !stageTwoPendingSptApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyData)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="env-collided-by-others">被別人碰撞</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="envFactorHurtByOthers" id="env-hurt-by-others" checked={form.envFactorHurtByOthers} onClick={checkboxBoolHandler} disabled={type=='cms' ||!pendingInvestigate(CURRENT_USER.email, investigator, formStatus, formStage) && !stageTwoPendingSptApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyData)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="env-hurt-by-others">被別人傷害</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="envFactorAssistiveEquipment" id="env-improper-use-of-assistive-equipment" checked={form.envFactorAssistiveEquipment} onClick={checkboxBoolHandler} disabled={type=='cms' ||!pendingInvestigate(CURRENT_USER.email, investigator, formStatus, formStage) && !stageTwoPendingSptApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyData)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="env-improper-use-of-assistive-equipment">輔助器材使用不當 (如輪椅／便椅未上鎖)</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" name="envFactorOther" id="ENV-OTHER" checked={form.envFactorOther} onClick={checkboxBoolHandler} disabled={type=='cms' ||!pendingInvestigate(CURRENT_USER.email, investigator, formStatus, formStage) && !stageTwoPendingSptApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyData)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="ENV-OTHER">其他</label>
                            </div>
                            {
                                form.envFactorOther &&
                                <div className="">
                                    <AutosizeTextarea className={`form-control ${(error && error['envFactorOtherRemark']) ? "is-invalid" : ""}`} placeholder="請註明" name="envFactorOtherRemark" value={form.envFactorOtherRemark} onChange={textFieldHandler} disabled={type=='cms' ||!pendingInvestigate(CURRENT_USER.email, investigator, formStatus, formStage) && !stageTwoPendingSptApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyData)} />
                                </div>
                            }
                        </div>
                    </div>

                    <div className="form-row mb-4">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}></label>
                        <div className={`col ${(error && error['personalFactor']) ? styles.divInvalid : ""}`}>
                            <div>個人因素</div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="personalFactorEmotional" id="PERSONAL-EMOTIONAL-INSTABILITY" checked={form.personalFactorEmotional} onClick={checkboxBoolHandler} disabled={type=='cms' ||!pendingInvestigate(CURRENT_USER.email, investigator, formStatus, formStage) && !stageTwoPendingSptApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyData)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="PERSONAL-EMOTIONAL-INSTABILITY">情緒不穩</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="personalFactorImpatient" id="PERSONAL-HEARTBROKEN" checked={form.personalFactorImpatient} onClick={checkboxBoolHandler} disabled={type=='cms' ||!pendingInvestigate(CURRENT_USER.email, investigator, formStatus, formStage) && !stageTwoPendingSptApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyData)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="PERSONAL-HEARTBROKEN">心急致傷</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="personalFactorChok" id="PERSONAL-CHOKING" checked={form.personalFactorChok} onClick={checkboxBoolHandler} disabled={type=='cms' ||!pendingInvestigate(CURRENT_USER.email, investigator, formStatus, formStage) && !stageTwoPendingSptApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyData)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="PERSONAL-CHOKING">進食時哽塞</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name={"personalFactorUnsteadyWalk"} id="PERSONAL-UNSTEADY-WALKING" checked={form.personalFactorUnsteadyWalk} onClick={checkboxBoolHandler} disabled={type=='cms' ||!pendingInvestigate(CURRENT_USER.email, investigator, formStatus, formStage) && !stageTwoPendingSptApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyData)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="PERSONAL-UNSTEADY-WALKING">步履不穩</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="personalFactorTwitch" id="PERSONAL-TWITCH" checked={form.personalFactorTwitch} onClick={checkboxBoolHandler} disabled={type=='cms' ||!pendingInvestigate(CURRENT_USER.email, investigator, formStatus, formStage) && !stageTwoPendingSptApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyData)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="PERSONAL-TWITCH">抽搐</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" name="personalFactorOther" id="PERSONAL-OTHER" checked={form.personalFactorOther} onClick={checkboxBoolHandler} disabled={type=='cms' ||!pendingInvestigate(CURRENT_USER.email, investigator, formStatus, formStage) && !stageTwoPendingSptApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyData)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="PERSONAL-OTHER">其他</label>
                            </div>
                            {
                                form.personalFactorOther &&
                                <div className="">
                                    <AutosizeTextarea className={`form-control ${(error && error['personalFactorOtherRemark']) ? "is-invalid" : ""}`} placeholder="請註明" name="personalFactorOtherRemark" value={form.personalFactorOtherRemark} onChange={textFieldHandler} disabled={type=='cms' ||!pendingInvestigate(CURRENT_USER.email, investigator, formStatus, formStage) && !stageTwoPendingSptApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyData)} />
                                </div>
                            }
                        </div>
                    </div>

                    <div className="form-row mb-4">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>意外發現之經過</label>
                        <div className="col">
                            <AutosizeTextarea className={`form-control ${(error && error['AccidentalDiscovery']) ? "is-invalid" : ""}`} name="accidentalDiscovery" value={form.accidentalDiscovery} onChange={textFieldHandler} disabled={type=='cms' ||!pendingInvestigate(CURRENT_USER.email, investigator, formStatus, formStage) && !stageTwoPendingSptApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyData)} />
                        </div>
                    </div>

                    <div className="form-row mb-4">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>可能引致意外之因素</label>
                        <div className="col">
                            <AutosizeTextarea className={`form-control ${(error && error['AccidentCauseFactor']) ? "is-invalid" : ""}`} name="accidentCauseFactor" value={form.accidentCauseFactor} onChange={textFieldHandler} disabled={type=='cms' ||!pendingInvestigate(CURRENT_USER.email, investigator, formStatus, formStage) && !stageTwoPendingSptApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyData)} />
                        </div>
                    </div>

                    <div className="form-row mb-4">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>建議</label>
                        <div className="col">
                            <AutosizeTextarea className={`form-control ${(error && error['Suggestion']) ? "is-invalid" : ""}`} name={"suggestion"} value={form.suggestion} onChange={textFieldHandler} disabled={type=='cms' ||!pendingInvestigate(CURRENT_USER.email, investigator, formStatus, formStage) && !stageTwoPendingSptApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyData)} />
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        {/* 調查員姓名*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>調查員姓名</label>
                        <div className="col-12 col-md-4">
                            {/* <PeoplePicker
                                context={context}
                                titleText=""
                                showtooltip={false}
                                personSelectionLimit={1}
                                ensureUser={true}
                                isRequired={false}
                                selectedItems={seInvestigator}
                                showHiddenInUI={false}
                                defaultSelectedUsers={investigator && [investigator.mail]}
                                
                            /> */}
                            <input type="text" className="form-control" value={investigator && (investigator.displayName || "")} readOnly />
                        </div>
                        {/* 職級*/}
                        <label className={`col-12 col-md-1 col-form-label ${styles.fieldTitle} pt-xl-0`}>職級</label>
                        <div className="col-12 col-md-5">
                            <input type="text" className="form-control" value={investigator && (investigator.jobTitle || "")} readOnly />
                        </div>
                    </div>
                </section>

                <hr className="my-4" />

                <section className="mb-5">
                    <div className="form-row mb-2">
                        <div className="col-12 font-weight-bold mb-2">
                            <span className={`${styles.fieldTitle} ${styles.fillIn}`}>[此欄由高級服務經理/服務經理填寫]</span>
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
                                selectedItems={setSD}
                                showHiddenInUI={false}
                                defaultSelectedUsers={SD && [SD.mail]}
                            /> */}
                            {/* <select className="form-control" value={serviceManagerEmail} onChange={(event) => setServiceManagerEmail(event.target.value)}>
                                <option>請選擇服務經理</option>
                                {
                                    smList.map((sm) => {
                                        return <option value={sm.mail}>{sm.displayName}</option>
                                    })
                                }
                            </select> */}
                            {/*<input type="text" className="form-control" readOnly value={`${parentFormData && parentFormData.SM ? `${parentFormData.SM.Title}` : ""}`} />*/}
                            <input type="text" className="form-control" readOnly value={`${serviceManager && serviceManager.Title ? `${serviceManager.Title}` : ""}`} />

                        </div>
                        <label className={`col-12 col-md-1 col-form-label ${styles.fieldTitle} pt-xl-0`}>日期</label>
                        <div className="col-12 col-md-5">
                            <DatePicker className="form-control" dateFormat="yyyy/MM/dd" selected={smDate} onChange={setSmDate} readOnly />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>高級服務經理/<span className="d-sm-inline d-md-block">服務經理評語</span></label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" name="sdComment" value={smComment} onChange={(event) => setSmComment(event.target.value)} disabled={type=='cms' ||!stageTwoPendingSptApproveForSM(CURRENT_USER.email, currentUserRole, formStatus, formStage, sptDate, formTwentyData)} />
                        </div>
                    </div>

                </section>

                <hr className="my-4" />

                <section className="mb-5">
                    <div className="form-row mb-2">
                        <div className="col-12 font-weight-bold mb-2">
                            <span className={`${styles.fieldTitle} ${styles.fillIn}`}>[此欄由高級物理治療師填寫]</span>
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        {/* 高級物理治療師姓名*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>高級物理治療師姓名</label>
                        <div className="col-12 col-md-4">
                            {/* <PeoplePicker
                                context={context}
                                titleText=""
                                showtooltip={false}
                                personSelectionLimit={1}
                                ensureUser={true}
                                isRequired={false}
                                selectedItems={setSPT}
                                showHiddenInUI={false}
                                defaultSelectedUsers={SPT && [SPT.mail]} /> */}
                            {/* <select className="form-control" value={sPhysicalTherapyEmail} onChange={(event) => setSPhysicalTherapyEmail(event.target.value)}>
                                <option>請選擇高級物理治療師</option>
                                {
                                    sptList.map((spt) => {
                                        return <option value={spt.mail}>{spt.displayName}</option>
                                    })
                                }
                            </select> */}
                            <input type="text" className="form-control" readOnly value={`${parentFormData && parentFormData.SPT ? `${parentFormData.SPT.Title}` : ""}`} />
                        </div>
                        {/* 意外發生時間*/}
                        <label className={`col-12 col-md-1 col-form-label ${styles.fieldTitle} pt-xl-0`}>日期</label>
                        <div className="col-12 col-md-5">
                            <DatePicker className="form-control" selected={sptDate} dateFormat="yyyy/MM/dd"  readOnly={true} />{/*onChange={setSptDate}*/}
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>高級物理治療師建議</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" name="sptComment" value={sptComment} onChange={(event) => setSptComment(event.target.value)} disabled={type=='cms' ||!stageTwoPendingSptApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyData)} />
                        </div>
                    </div>
                    {
                        stageTwoPendingSptApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, formTwentyData) &&
                        <div className="form-group row justify-content-center mt-3 mb-2">
                            <div className="col-md-2 col-4 mb-2">
                                <button className="btn btn-warning w-100" onClick={() => sptApproveHandler()}>批准</button>
                            </div>
                            <div className="col-md-2 col-4 mb-2">
                                <button className="btn btn-danger w-100" onClick={() => sptRejectHandler()}>拒絕</button>
                            </div>
                        </div>
                    }
                </section>

                <hr className="my-4" />
                {type !='cms' &&
                <section className="py-3">
                <div className="row">
                    {
                        (stageTwoPendingSptApproveForSM(CURRENT_USER.email, currentUserRole, formStatus, formStage, sptDate, formTwentyData) || pendingInvestigate(CURRENT_USER.email, investigator, formStatus, formStage))
                        &&
                        <div className='col-md-2 col-4 mb-2'>
                            <button className="btn btn-warning w-100" onClick={() => submitHandler()}>提交</button>
                        </div>
                    }
                    {
                        pendingInvestigate(CURRENT_USER.email, investigator, formStatus, formStage) &&
                        <div className='col-md-2 col-4 mb-2'>
                            <button className="btn btn-success w-100" onClick={() => draftHandler()}>草稿</button>
                        </div>
                    }
                    <div className='col-md-2 col-4 mb-2'>
                        <button className="btn btn-secondary w-100" onClick={() => cancelHandler()}>取消</button>
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
