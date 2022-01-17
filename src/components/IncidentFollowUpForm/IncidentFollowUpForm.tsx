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
import { addBusinessDays, addMonths } from '../../utils/DateUtils';
import { faPager } from '@fortawesome/free-solid-svg-icons';
import { notifySpecialIncidentAllowance, notifyOtherIncident, notifySpecialIncidentLicense } from '../../api/Notification';
import { postLog } from '../../api/LogHelper';

interface IIncidentFollowUpFormProps {
    context: WebPartContext;
    styles: any;
    formType: string;
    formSubmittedHandler(): void;
    currentUserRole: Role;
    parentFormData: any;
    isPrintMode: any;
    siteCollectionUrl:String;
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

export default function IncidentFollowUpForm({ context, styles, formType, formSubmittedHandler, currentUserRole, parentFormData, isPrintMode,siteCollectionUrl }: IIncidentFollowUpFormProps) {

    const [form, setForm] = useState<IIncidentFollowUpFormStates>({
        incidentFollowUpContinue: undefined,
    });
    const [incidentDatetime, setIncidentDatetime] = useState(new Date());
    const [insuranceCaseNo, setInsuranceCaseNo] = useState("");
    const [caseNo, setCaseNo] = useState("");
    const [smDate, setSmDate] = useState(new Date());
    const [sdDate, setSdDate] = useState(new Date());
    const [sdComment, setSdComment] = useState("");
    const [sdInfo, setSDEmail, spSdInfo] = useUserInfo(siteCollectionUrl);
    const [smInfo, setSMEmail, spSmInfo] = useUserInfo(siteCollectionUrl);

    const [formStatus, setFormStatus] = useState("");
    const [formStage, setFormStage] = useState("");
    const [completed, setCompleted] = useState(false);
    const [incidentFollowUpFormList, setIncidentFollowUpFormList] = useState([]);
    const [selectedIncidentFollowUpFormId, setSelectedIncidentFollowUpFormId] = useState<number>(null);
    const [followUpActions, setFollowUpActions] = useState<IFollowUpAction[]>([{
        action: "",
        date: new Date().toISOString(),
        remark: ""
    }]);

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
        let error = {};

        body["FollowUpActions"] = JSON.stringify(followUpActions);

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
            error["IncidentFollowUpContinue"] = true
        }

        return [body, error];
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

    const smSubmitHandler = (event) => {
        event.preventDefault();
        let [body, error] = dataFactory();
        // Form follow up still continue
        if (form.incidentFollowUpContinue) {
            updateIncidentFollowUpForm(selectedIncidentFollowUpFormId, {
                ...body,
                "SMDate": new Date().toISOString(),
                "Completed": true
            }).then((updateIncidentFollowUpFormRes) => {
                //Create new follow up Form
                createIncidentFollowUpForm({
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

                            formSubmittedHandler();
                        }).catch(console.error);
                    }

                }).catch(console.error);
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

                        formSubmittedHandler();
                    }).catch(console.error);
                }
            }).catch(console.error);
        }
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
                if (formType === "OTHER_INCIDENT") {
                    updateOtherIncidentReport(parentFormData.Id, {
                        Status: "CLOSED"
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

                        notifyOtherIncident(context, parentFormData.Id, 2);
                        formSubmittedHandler();
                    }).catch(console.error);
                } else if (formType === "SPECIAL_INCIDENT_REPORT_LICENSE") {
                    updateSpecialIncidentReportLicense(parentFormData.Id, {
                        Status: "CLOSED"
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
                        notifySpecialIncidentLicense(context, parentFormData.Id, 2);
                        formSubmittedHandler();
                    }).catch(console.error);
                } else if (formType === "SPECIAL_INCIDENT_REPORT_ALLOWANCE") {
                    updateSpecialIncidentReportAllowance(parentFormData.Id, {
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
                        notifySpecialIncidentAllowance(context, parentFormData.Id, 2);
                        formSubmittedHandler();
                    }).catch(console.error);
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
            }

            formSubmittedHandler();
        }).catch(console.error);
    }

    const loadData = () => {
        console.log(parentFormData)
        if (parentFormData) {
            setInsuranceCaseNo(parentFormData.InsuranceCaseNo);
            setCaseNo(parentFormData.CaseNumber);

            if (Array.isArray(parentFormData.FollowUpFormsId) && parentFormData.FollowUpFormsId.length > 0) {
                getAllIncidentFollowUpFormByCaseNumber(parentFormData.CaseNumber).then((getAllIncidentFollowUpFormByCaseNumberRes) => {
                    if (Array.isArray(getAllIncidentFollowUpFormByCaseNumberRes) && getAllIncidentFollowUpFormByCaseNumberRes.length > 0) {
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

    }

    useEffect(() => {
        loadData()
    }, [parentFormData]);

    useEffect(() => {
        updateState();
    }, [selectedIncidentFollowUpFormId]);

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
                                    followUpActions.length >= 5 ||
                                    completed ||
                                    (!pendingSdApprove(currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || "") && !pendingSmFillIn(currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || "") && !initialForm(currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || "", formStatus))}>
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
                                            <AutosizeTextarea className="form-control" name="followUpMeasures" onChange={(event) => {
                                                let arr = [...followUpActions];
                                                let actionItem = arr[index];
                                                actionItem.action = event.target.value;
                                                setFollowUpActions(arr);
                                            }}
                                                value={item.action}
                                                disabled={completed || (!pendingSdApprove(currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || "") && !pendingSmFillIn(currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || "") && !initialForm(currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || "", formStatus))}
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
                                                readOnly={completed || (!pendingSdApprove(currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || "") && !pendingSmFillIn(currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || "") && !initialForm(currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || "", formStatus))}
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
                                                disabled={completed || (!pendingSdApprove(currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || "") && !pendingSmFillIn(currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || "") && !initialForm(currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || "", formStatus))}
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
                                    disabled={completed || (!pendingSdApprove(currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || "") && !pendingSmFillIn(currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || "") && !initialForm(currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || "", formStatus))}
                                />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="accident-follow-up-true">繼續</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="accidentFollowUp" id="accident-follow-up-false" onClick={() => setForm({ ...form, incidentFollowUpContinue: false })} checked={form.incidentFollowUpContinue === false}
                                    disabled={completed || (!pendingSdApprove(currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || "") && !pendingSmFillIn(currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || "") && !initialForm(currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || "", formStatus))}
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
                            <span className={styles.fieldTitle}>[此欄由服務總監填寫]</span>
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
                            <AutosizeTextarea className="form-control" value={sdComment} onChange={(event) => setSdComment(event.target.value)} disabled={completed || (!pendingSdApprove(currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || ""))} />
                        </div>
                    </div>

                    {
                        pendingSdApprove(currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || "") &&
                        <div className="form-row mb-2">
                            <div className="col-12">
                                <div className="d-flex justify-content-center">
                                    <button className="btn btn-warning mr-3" onClick={sdApproveHandler}>批准</button>
                                    <button className="btn btn-danger mr-3" onClick={sdRejectHanlder}>拒絕</button>
                                </div>
                            </div>
                        </div>
                    }
                </section>

                <hr className="my-4" />

                <section className="py-3">
                    <div className="d-flex justify-content-center" style={{ gap: 10 }}>
                        {
                            !completed &&
                            <>
                                {
                                    pendingSmFillIn(currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || "") &&
                                    <button className="btn btn-warning" onClick={smSubmitHandler}>提交</button>
                                }
                                {
                                    pendingSdApprove(currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || "") &&
                                    <button className="btn btn-success" onClick={sdSaveHandler}>儲存</button>
                                }
                                {
                                    pendingSmFillIn(currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || "") &&
                                    !initialForm(currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || "", formStatus) &&
                                    <button className="btn btn-success" onClick={smSaveHandler}>儲存</button>
                                }
                                {
                                    initialForm(currentUserRole, parentFormData && parentFormData.Status || "", parentFormData && parentFormData.Stage || "", formStatus) &&
                                    <button className="btn btn-success" onClick={draftHandler}>草稿</button>
                                }
                            </>
                        }
                        <button className="btn btn-secondary" onClick={cancelHandler}>取消</button>
                    </div>
                </section>
            </div >
        </>
    )
}

