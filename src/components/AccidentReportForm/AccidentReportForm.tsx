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
import { createAccidentFollowUpRepotForm, updateAccidentReportFormById, updateServiceUserAccidentById, updateOutsiderAccidentFormById } from '../../api/PostFuHongList';
import { addBusinessDays, addMonths } from '../../utils/DateUtils';
import { pendingInvestigate, stageTwoPendingSptApprove, stageTwoPendingSptApproveForSM } from '../../webparts/fuHongServiceUserAccidentForm/permissionConfig';


const formTypeParser = (formType: string, additonalString: string) => {
    switch (formType) {
        case "SERVICE_USER":
            return "服務使用者" + additonalString;
        case "OUTSIDERS":
            return "外界人士" + additonalString;
        default: return "";
    }
}

export default function AccidentFollowUpRepotForm({ context, styles, formType, parentFormData, currentUserRole, formSubmittedHandler, isPrintMode }: IAccidentFollowUpRepotFormProps) {
    const [formStatus, setFormStatus] = useState("");
    const [formStage, setFormStage] = useState("");
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

    const [sptDate, setSptDate] = useState(new Date());
    const [smDate, setSmDate] = useState(new Date());
    const [sptComment, setSptComment] = useState("");
    const [smComment, setSmComment] = useState("");


    const [accidentTime, setAccidentTime] = useState(new Date());
    const [estimatedFinishDate, setEstimatedFinishDate] = useState(new Date());
    const [formReceivedDate, setFormReceivedDate] = useState(new Date());
    const [serviceUnitDetail, setServiceUnitByShortForm] = useServiceUnitByShortForm();
    const [serviceUserList, serviceUser, serviceUserRecordId, setServiceUserRecordId] = useServiceUser();

    const [serviceManager, setServiceManagerEmail, serviceManagerEmail] = useSharePointGroup(); //[此欄由高級服務經理/服務經理填寫]
    const [sPhysicalTherapy, setSPhysicalTherapyEmail, sPhysicalTherapyEmail] = useSharePointGroup(); // [此欄由高級物理治療師填寫]


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
            }
        }

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
            }
        }

        //AccidentalDiscovery 意外發現之經過
        if (form.accidentalDiscovery) {
            body["AccidentalDiscovery"] = form.accidentalDiscovery;
        } else {
            // error handling 
        }

        //AccidentCauseFactor 可能引致意外之因素
        if (form.accidentCauseFactor) {
            body["AccidentCauseFactor"] = form.accidentCauseFactor;
        } else {
            // error handling
        }

        //Suggestion 建議 
        if (form.suggestion) {
            body["Suggestion"] = form.suggestion;
        } else {
            //error handling
        }



        return [body, error];
    }

    const submitHandler = () => {
        if (parentFormData.AccidentReportFormId) {

            if (stageTwoPendingSptApproveForSM(currentUserRole, formStatus, formStage)) {
                // SM
                updateAccidentReportFormById(parentFormData.AccidentReportFormId, {
                    "SMComment": smComment,
                    "SMDate": smDate.toISOString()
                }).then((updateAccidentReportFormResponse) => {
                    formSubmittedHandler();
                }).catch(console.error);
            } else {
                // Investigator 
                const [body, error] = dataFactory();

                updateAccidentReportFormById(parentFormData.AccidentReportFormId, body).then((updateAccidentReportFormResponse) => {
                    if (formType === "SERVICE_USER") {
                        updateServiceUserAccidentById(parentFormData.Id, { "Status": "PENDING_SPT_APPROVE" }).then((updateServiceUserAccidentResponse) => {
                            console.log(updateServiceUserAccidentResponse)
                            // Trigger notification workflow;
                            formSubmittedHandler();
                        }).catch(console.error)
                    } else {
                        updateOutsiderAccidentFormById(parentFormData.Id, { "Status": "PENDING_SPT_APPROVE" }).then((updateOutsiderAccidentResponse) => {
                            console.log(updateOutsiderAccidentResponse);
                            formSubmittedHandler();
                        }).catch(console.error);
                    }
                }).catch(console.error);

            }
        }
    };

    const draftHandler = () => {
        if (parentFormData.AccidentReportFormId) {
            const [body, error] = dataFactory();

            if (formType === "SERVICE_USER") {
                updateAccidentReportFormById(parentFormData.AccidentReportFormId, body).then((updateAccidentReportFormResponse) => {
                    formSubmittedHandler();
                }).catch(console.error);
            } else {
                updateOutsiderAccidentFormById(parentFormData.Id, body).then((updateOutsiderAccidentResponse) => {
                    formSubmittedHandler();
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
                        "SPTId": parentFormData.SPTId,
                        "SMId": parentFormData.SMId,
                        "SDId": parentFormData.SDId,
                        "CaseNumber": parentFormData.CaseNumber,
                        "ParentFormId": parentFormData.Id
                    };
                    createAccidentFollowUpRepotForm(accidentFollowUpReportFormBody).then((accidentFollowUpReportFormResponse) => {

                        // Update main form status and stage 3
                        const serviceUserAccidentFormBody = {
                            "AccidentFollowUpFormId": {
                                results: [accidentFollowUpReportFormResponse.data.Id]
                            },
                            "Stage": "3",
                            "Status": "PENDING_SM_FILL_IN",
                            "NextDeadline": addMonths(new Date(), 6).toISOString(),
                            "Title": "意外跟進/結束表(三) - 1"
                        }
                        if (formType === "SERVICE_USER") {
                            updateServiceUserAccidentById(parentFormData.Id, serviceUserAccidentFormBody).then((serviceUserAccidentFormResponse) => {
                                //trigger notification work flow
                                formSubmittedHandler()
                            }).catch(console.error);
                        } else {
                            updateOutsiderAccidentFormById(parentFormData.Id, serviceUserAccidentFormBody).then((outsiderAccidentFormResponse) => {
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
                    const serviceUserAccidentFormBody = {
                        "Stage": "2",
                        "Status": "PENDING_INVESTIGATE"
                    }
                    updateServiceUserAccidentById(parentFormData.Id, serviceUserAccidentFormBody).then((serviceUserAccidentFormResponse) => {
                        //trigger notification work flow
                        formSubmittedHandler();
                    }).catch(console.error);
                }).catch(console.error);
            }
        }
    }
    console.log(parentFormData)
    const loadData = () => {
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



        //調查員
        if (parentFormData.Investigator) {
            setInvestigator([{ secondaryText: parentFormData.Investigator.EMail, id: parentFormData.Investigator.Id }]);
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
                    setServiceManagerEmail(formTwentyData.SM.EMail)
                }

                setSmComment(formTwentyData.SMComment);
                if (formTwentyData.SMDate) {
                    setSmDate(new Date(formTwentyData.SMDate));
                }


                setSptComment(formTwentyData.SPTComment);
                if (formTwentyData.SPTDate) {
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

    console.log(parentFormData)
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
                            <input type="text" className="form-control" readOnly value={`${parentFormData && parentFormData.ServiceUnit ? `${parentFormData.ServiceUnit}` : ""}`} />
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
                            {
                                formType === "SERVICE_USER" ?
                                    <input type="text" className="form-control" readOnly value={`${serviceUser && serviceUser.NameEN ? `${serviceUser.NameEN}` : ""}`} />
                                    :
                                    <input type="text" className="form-control" readOnly value={`${parentFormData && parentFormData.ServiceUserNameEN || ""}`} />
                            }
                        </div>
                        {/* 服務使用者姓名 (中文)*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>{formTypeParser(formType, "姓名")}<span className="d-sm-inline d-md-block">(中文)</span></label>
                        <div className="col-12 col-md-4">
                            {
                                formType === "SERVICE_USER" ?
                                    <input type="text" className="form-control" readOnly value={`${serviceUser && serviceUser.NameCN ? `${serviceUser.NameCN}` : ""}`} />
                                    :
                                    <input type="text" className="form-control" readOnly value={`${parentFormData && parentFormData.ServiceUserNameTC || ""}`} />
                            }
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        {/* 年齡*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>年齡</label>
                        <div className="col-12 col-md-4">
                            {
                                formType === "SERVICE_USER" ?
                                    <input type="text" className="form-control" readOnly value={`${serviceUser && serviceUser.Age ? `${serviceUser.Age}` : ""}`} />
                                    :
                                    <input type="text" className="form-control" readOnly value={`${parentFormData && parentFormData.ServiceUserAge || ""} `} />
                            }
                        </div>
                        {/* 性別*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>性別</label>
                        <div className="col-12 col-md-4">
                            {
                                formType === "SERVICE_USER" ?
                                    <input type="text" className="form-control" readOnly value={serviceUser && serviceUser.Gender === "Male" ? "男" : "女"} />
                                    :
                                    <input type="text" className="form-control" readOnly value={parentFormData && parentFormData.ServiceUserGender === "male" ? "男" : "女"} />
                            }
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
                        <div className="col">
                            <div className="form-check form-check-inline mr-0 mr-md-3">
                                <input className="form-check-input" type="checkbox" name="accidentNatureFall" id="accidental-nature-fall" checked={form.accidentNatureFall} onClick={checkboxBoolHandler} disabled={!pendingInvestigate(currentUserRole, formStatus, formStage) && !stageTwoPendingSptApprove(currentUserRole, formStatus, formStage)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="accidental-nature-fall">跌倒</label>
                            </div>
                            <div className="form-check form-check-inline mr-0 mr-md-3">
                                <input className="form-check-input" type="checkbox" name="accidentNatureChok" id="accidental-nature-choking" checked={form.accidentNatureChok} onClick={checkboxBoolHandler} disabled={!pendingInvestigate(currentUserRole, formStatus, formStage) && !stageTwoPendingSptApprove(currentUserRole, formStatus, formStage)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="accidental-nature-choking">哽塞</label>
                            </div>
                            <div className="form-check form-check-inline mr-0 mr-md-3">
                                <input className="form-check-input" type="checkbox" name="accidentNatureBehavior" id="accidental-nature-behavior" checked={form.accidentNatureBehavior} onClick={checkboxBoolHandler} disabled={!pendingInvestigate(currentUserRole, formStatus, formStage) && !stageTwoPendingSptApprove(currentUserRole, formStatus, formStage)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="accidental-nature-behavior">服務使用者行為問題</label>
                            </div>
                            <div className="form-check form-check-inline  mr-0 mr-md-3">
                                <input className="form-check-input" type="checkbox" name="accidentNatureEnvFactor" id="accidental-nature-env-factor" checked={form.accidentNatureEnvFactor} onClick={checkboxBoolHandler} disabled={!pendingInvestigate(currentUserRole, formStatus, formStage) && !stageTwoPendingSptApprove(currentUserRole, formStatus, formStage)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="accidental-nature-env-factor">環境因素</label>
                            </div>
                            <div className="form-check mr-0 mr-md-3">
                                <input className="form-check-input" type="checkbox" name="accidentNatureOther" id="accidental-nature-other" checked={form.accidentNatureOther} onClick={checkboxBoolHandler} disabled={!pendingInvestigate(currentUserRole, formStatus, formStage) && !stageTwoPendingSptApprove(currentUserRole, formStatus, formStage)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="accidental-nature-other">其他</label>
                            </div>
                            {
                                form.accidentNatureOther &&
                                <div className="">
                                    <AutosizeTextarea className="form-control" placeholder="請註明" name="accidentalNatureOtherRemark" value={form.accidentalNatureOtherRemark} onChange={textFieldHandler} disabled={!pendingInvestigate(currentUserRole, formStatus, formStage) && !stageTwoPendingSptApprove(currentUserRole, formStatus, formStage)} />
                                </div>
                            }
                        </div>
                    </div>
                    {/* 意外成因 */}
                    <div className="form-row mb-4">
                        {/* 環境因素 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>意外成因</label>
                        <div className="col">
                            <div>環境因素</div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="envFactorSlipperyGround" id="env-slippery-ground" checked={form.envFactorSlipperyGround} onClick={checkboxBoolHandler} disabled={!pendingInvestigate(currentUserRole, formStatus, formStage) && !stageTwoPendingSptApprove(currentUserRole, formStatus, formStage)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="env-slippery-ground">地面濕滑</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="envFactorUnevenGround" id="env-uneven-ground" checked={form.envFactorUnevenGround} onClick={checkboxBoolHandler} disabled={!pendingInvestigate(currentUserRole, formStatus, formStage) && !stageTwoPendingSptApprove(currentUserRole, formStatus, formStage)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="env-uneven-ground">地面不平</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="envFactorObstacleItems" id="env-obstacle-items" checked={form.envFactorObstacleItems} onClick={checkboxBoolHandler} disabled={!pendingInvestigate(currentUserRole, formStatus, formStage) && !stageTwoPendingSptApprove(currentUserRole, formStatus, formStage)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="env-obstacle-items">障礙物品</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="envFactorInsufficientLight" id="env-insufficient-light" checked={form.envFactorInsufficientLight} onClick={checkboxBoolHandler} disabled={!pendingInvestigate(currentUserRole, formStatus, formStage) && !stageTwoPendingSptApprove(currentUserRole, formStatus, formStage)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="env-insufficient-light">光線不足</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="envFactorNotEnoughSpace" id="env-not-enough-space" checked={form.envFactorNotEnoughSpace} onClick={checkboxBoolHandler} disabled={!pendingInvestigate(currentUserRole, formStatus, formStage) && !stageTwoPendingSptApprove(currentUserRole, formStatus, formStage)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="env-not-enough-space">空間不足</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="envFactorNoise" id="env-acoustic-stimulation" checked={form.envFactorNoise} onClick={checkboxBoolHandler} disabled={!pendingInvestigate(currentUserRole, formStatus, formStage) && !stageTwoPendingSptApprove(currentUserRole, formStatus, formStage)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="env-acoustic-stimulation">聲響刺激</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="envFactorCollision" id="env-collided-by-others" checked={form.envFactorCollision} onClick={checkboxBoolHandler} disabled={!pendingInvestigate(currentUserRole, formStatus, formStage) && !stageTwoPendingSptApprove(currentUserRole, formStatus, formStage)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="env-collided-by-others">被別人碰撞</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="envFactorHurtByOthers" id="env-hurt-by-others" checked={form.envFactorHurtByOthers} onClick={checkboxBoolHandler} disabled={!pendingInvestigate(currentUserRole, formStatus, formStage) && !stageTwoPendingSptApprove(currentUserRole, formStatus, formStage)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="env-hurt-by-others">被別人傷害</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="envFactorAssistiveEquipment" id="env-improper-use-of-assistive-equipment" checked={form.envFactorAssistiveEquipment} onClick={checkboxBoolHandler} disabled={!pendingInvestigate(currentUserRole, formStatus, formStage) && !stageTwoPendingSptApprove(currentUserRole, formStatus, formStage)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="env-improper-use-of-assistive-equipment">輔助器材使用不當 (如輪椅／便椅未上鎖)</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" name="envFactorOther" id="ENV-OTHER" checked={form.envFactorOther} onClick={checkboxBoolHandler} disabled={!pendingInvestigate(currentUserRole, formStatus, formStage) && !stageTwoPendingSptApprove(currentUserRole, formStatus, formStage)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="ENV-OTHER">其他</label>
                            </div>
                            {
                                form.envFactorOther &&
                                <div className="">
                                    <AutosizeTextarea className="form-control" placeholder="請註明" name="envFactorOtherRemark" value={form.envFactorOtherRemark} onChange={textFieldHandler} disabled={!pendingInvestigate(currentUserRole, formStatus, formStage) && !stageTwoPendingSptApprove(currentUserRole, formStatus, formStage)} />
                                </div>
                            }
                        </div>
                    </div>

                    <div className="form-row mb-4">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}></label>
                        <div className="col">
                            <div>個人因素</div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="personalFactorEmotional" id="PERSONAL-EMOTIONAL-INSTABILITY" checked={form.personalFactorEmotional} onClick={checkboxBoolHandler} disabled={!pendingInvestigate(currentUserRole, formStatus, formStage) && !stageTwoPendingSptApprove(currentUserRole, formStatus, formStage)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="PERSONAL-EMOTIONAL-INSTABILITY">情緒不穩</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="personalFactorImpatient" id="PERSONAL-HEARTBROKEN" checked={form.personalFactorImpatient} onClick={checkboxBoolHandler} disabled={!pendingInvestigate(currentUserRole, formStatus, formStage) && !stageTwoPendingSptApprove(currentUserRole, formStatus, formStage)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="PERSONAL-HEARTBROKEN">心急致傷</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="personalFactorChok" id="PERSONAL-CHOKING" checked={form.personalFactorChok} onClick={checkboxBoolHandler} disabled={!pendingInvestigate(currentUserRole, formStatus, formStage) && !stageTwoPendingSptApprove(currentUserRole, formStatus, formStage)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="PERSONAL-CHOKING">進食時哽塞</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name={"personalFactorUnsteadyWalk"} id="PERSONAL-UNSTEADY-WALKING" checked={form.personalFactorUnsteadyWalk} onClick={checkboxBoolHandler} disabled={!pendingInvestigate(currentUserRole, formStatus, formStage) && !stageTwoPendingSptApprove(currentUserRole, formStatus, formStage)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="PERSONAL-UNSTEADY-WALKING">步履不穩</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="personalFactorTwitch" id="PERSONAL-TWITCH" checked={form.personalFactorTwitch} onClick={checkboxBoolHandler} disabled={!pendingInvestigate(currentUserRole, formStatus, formStage) && !stageTwoPendingSptApprove(currentUserRole, formStatus, formStage)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="PERSONAL-TWITCH">抽搐</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" name="personalFactorOther" id="PERSONAL-OTHER" checked={form.personalFactorOther} onClick={checkboxBoolHandler} disabled={!pendingInvestigate(currentUserRole, formStatus, formStage) && !stageTwoPendingSptApprove(currentUserRole, formStatus, formStage)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="PERSONAL-OTHER">其他</label>
                            </div>
                            {
                                form.personalFactorOther &&
                                <div className="">
                                    <AutosizeTextarea className="form-control" placeholder="請註明" name="personalFactorOtherRemark" value={form.personalFactorOtherRemark} onChange={textFieldHandler} disabled={!pendingInvestigate(currentUserRole, formStatus, formStage) && !stageTwoPendingSptApprove(currentUserRole, formStatus, formStage)} />
                                </div>
                            }
                        </div>
                    </div>

                    <div className="form-row mb-4">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>意外發現之經過</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" name="accidentalDiscovery" value={form.accidentalDiscovery} onChange={textFieldHandler} disabled={!pendingInvestigate(currentUserRole, formStatus, formStage) && !stageTwoPendingSptApprove(currentUserRole, formStatus, formStage)} />
                        </div>
                    </div>

                    <div className="form-row mb-4">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>可能引致意外之因素</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" name="accidentCauseFactor" value={form.accidentCauseFactor} onChange={textFieldHandler} disabled={!pendingInvestigate(currentUserRole, formStatus, formStage) && !stageTwoPendingSptApprove(currentUserRole, formStatus, formStage)} />
                        </div>
                    </div>

                    <div className="form-row mb-4">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>建議</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" name={"suggestion"} value={form.suggestion} onChange={textFieldHandler} disabled={!pendingInvestigate(currentUserRole, formStatus, formStage) && !stageTwoPendingSptApprove(currentUserRole, formStatus, formStage)} />
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
                            <input type="text" className="form-control" readOnly value={`${parentFormData && parentFormData.SM ? `${parentFormData.SM.Title}` : ""}`} />
                        </div>
                        <label className={`col-12 col-md-1 col-form-label ${styles.fieldTitle} pt-xl-0`}>日期</label>
                        <div className="col-12 col-md-5">
                            <DatePicker className="form-control" dateFormat="yyyy/MM/dd" selected={smDate} onChange={setSmDate} readOnly />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>高級服務經理/<span className="d-sm-inline d-md-block">服務經理評語</span></label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" name="sdComment" value={smComment} onChange={(event) => setSmComment(event.target.value)} disabled={!stageTwoPendingSptApproveForSM(currentUserRole, formStatus, formStage)} />
                        </div>
                    </div>

                </section>

                <hr className="my-4" />

                <section className="mb-5">
                    <div className="form-row mb-2">
                        <div className="col-12 font-weight-bold mb-2">
                            <span className={styles.fieldTitle}>[此欄由高級物理治療師填寫]</span>
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
                            <DatePicker className="form-control" selected={sptDate} dateFormat="yyyy/MM/dd" onChange={setSptDate} readOnly={true} />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>高級物理治療師建議</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" name="sptComment" value={sptComment} onChange={(event) => setSptComment(event.target.value)} disabled={!stageTwoPendingSptApprove(currentUserRole, formStatus, formStage)} />
                        </div>
                    </div>
                    {
                        stageTwoPendingSptApprove(currentUserRole, formStatus, formStage) &&
                        <div className="form-group row mt-3 mb-2">
                            <div className="col-12">
                                <div className="d-flex justify-content-center">
                                    <button className="btn btn-warning mr-3" onClick={() => sptApproveHandler()}>批准</button>
                                    <button className="btn btn-danger mr-3" onClick={() => sptRejectHandler()}>拒絕</button>
                                </div>
                            </div>
                        </div>
                    }
                </section>

                <hr className="my-4" />

                <section className="py-3">
                    <div className="d-flex justify-content-center" style={{ gap: 10 }}>
                        {
                            (stageTwoPendingSptApproveForSM(currentUserRole, formStatus, formStage) || pendingInvestigate(currentUserRole, formStatus, formStage))
                            &&
                            <button className="btn btn-warning" onClick={() => submitHandler()}>提交</button>
                        }
                        {
                            pendingInvestigate(currentUserRole, formStatus, formStage) &&
                            <button className="btn btn-success" onClick={() => draftHandler()}>草稿</button>
                        }
                        <button className="btn btn-secondary" onClick={() => cancelHandler()}>取消</button>
                    </div>
                </section>
            </div >
        </>
    )
}
