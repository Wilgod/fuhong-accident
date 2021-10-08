import * as React from 'react'
import { useState, useEffect } from 'react'
import { WebPartContext } from '@microsoft/sp-webpart-base';
import Header from "../Header/Header";
import DatePicker from "react-datepicker";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import * as moment from 'moment';
import "./AccidentFollowUpForm.css";
import AutosizeTextarea from "../AutosizeTextarea/AutosizeTextarea";
import { IAccidentFollowUpFormStates, IAccidentFollowUpFormProps } from './IAccidentFollowUpForm';
import useUserInfoAD from '../../hooks/useUserInfoAD';
import useSPT from '../../hooks/useSPT';
import useSM from '../../hooks/useSM';
import useSD from '../../hooks/useSD';
import useSharePointGroup from '../../hooks/useSharePointGroup';
import useServiceUnitByShortForm from '../../hooks/useServiceUnitByShortForm';
import useServiceUser from '../../hooks/useServiceUser';
import { getAccidentFollowUpFormById, getAccidentReportFormById, getAllAccidentFollowUpFormByParentId, getServiceUserAccidentById } from '../../api/FetchFuHongList';
import { createAccidentFollowUpRepotForm, updateAccidentFollowUpRepotFormById, updateAccidentReportFormById, updateServiceUserAccidentById } from '../../api/PostFuHongList';
import { addMonths } from '../../utils/DateUtils';
import { stageThreePendingSdApprove, stageThreePendingSdApproveForSpt, stageThreePendingSmFillIn } from '../../webparts/fuHongServiceUserAccidentForm/permissionConfig';
import { ConsoleListener } from '@pnp/pnpjs';
const formTypeParser = (formType: string, additonalString: string) => {
    switch (formType) {
        case "SERVICE_USER":
            return "服務使用者" + additonalString;
        case "OUTSIDERS":
            return "外界人士" + additonalString;
        default: return "";
    }
}

export default function AccidentFollowUpForm({ context, formType, styles, currentUserRole, parentFormData, formSubmittedHandler }: IAccidentFollowUpFormProps) {
    const [smDate, setSmDate] = useState(new Date()); // 高級服務經理
    const [sdDate, setSdDate] = useState(new Date()); // 服務總監
    const [sptDate, setSptDate] = useState(new Date()); // 高級物理治療師

    const [sptComment, setSptComment] = useState("");
    const [sdComment, setSdComment] = useState("");


    const [accidentTime, setAccidentTime] = useState(new Date());

    const [serviceUnitDetail, setServiceUnitByShortForm] = useServiceUnitByShortForm();
    const [serviceUserList, serviceUser, serviceUserRecordId, setServiceUserRecordId] = useServiceUser();

    const [formStatus, setFormStatus] = useState("");
    const [formStage, setFormStage] = useState("");

    const [form, setForm] = useState<IAccidentFollowUpFormStates>({
        accidentalFollowUpContinue: "",
        executionPeriod: "",
        followUpMeasures: "",
        remark: "",
    });

    const [accidentFollowUpFormList, setAccidentFollowUpFormList] = useState([]);
    const [selectedAccidentFollowUpFormId, setSelectedAccidentFollowUpFormId] = useState(null);
    const [isSDApproved, setIsSDApproved] = useState(false);

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
        let error = {};

        if (form.followUpMeasures.trim()) {
            body["FollowUpMeasures"] = form.followUpMeasures;
        } else {
            // error handling;
        }

        if (form.executionPeriod.trim()) {
            body["ExecutionPeriod"] = form.executionPeriod;
        } else {
            //error handling
        }

        if (form.remark) {
            body["Remark"] = form.remark;
        } else {
            //error handling;
        }

        if (form.accidentalFollowUpContinue) {
            body["AccidentalFollowUpContinue"] = form.accidentalFollowUpContinue === "ACCIDENT_FOLLOW_UP_TRUE" ? true : false;
        }

        return [body, error];
    }
    //For SM only
    const smSubmitHandler = (event) => {

        if (stageThreePendingSdApproveForSpt(currentUserRole, formStatus, formStage)) { // SPT
            sptCommentUpdate();
        } else {
            //Implement
            const [body, error] = dataFactory();
            // Form 21 SM's part done, and send it to sd and spt.
            updateAccidentFollowUpRepotFormById(selectedAccidentFollowUpFormId, body).then((AccidentFollowUpReportFormResponse) => {
                //Update 
                updateServiceUserAccidentById(parentFormData.Id, { "Status": "PENDING_SD_APPROVE" }).then(() => {
                    // trigger notification workflow
                    formSubmittedHandler()
                }).catch(console.error)
            }).catch(console.error);
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
            formSubmittedHandler();
        });
    }

    const sdApproveHandler = () => {

        // Flow:
        // if continue: 
        // create new form 19 
        // status send back to sm
        // update current form 21 to complete
        // complete current selected form
        // if close:
        // update form 19 status
        // update form 21 to complete

        const [body, error] = dataFactory();
        if (body["AccidentalFollowUpContinue"] === true) { // form continue
            // Get form 19, for AccidentFollowUpFormId[]
            getServiceUserAccidentById(parentFormData.Id).then((getAccidentFollowUpFormByIdRes) => {
                let title = "";
                if (getAccidentFollowUpFormByIdRes.AccidentFollowUpFormId) {
                    title = `意外跟進/結束表 - ${getAccidentFollowUpFormByIdRes.AccidentFollowUpFormId.length + 1}`;
                } else {
                    title = `意外跟進/結束表 - 1`;
                }

                const newAccountFollowUpReportFormBody = {
                    "CaseNumber": parentFormData.CaseNumber,
                    "ParentFormId": parentFormData.ID,
                    "SPTId": parentFormData.SPTId,
                    "SDId": parentFormData.SDId,
                    "SMId": parentFormData.SMId,
                    "Title": title
                }
                // Create form 21
                createAccidentFollowUpRepotForm(newAccountFollowUpReportFormBody).then((accidentFollowUpRepotFormRes) => {

                    // Update form 19 , add new form 21 id to it. Also recount the deadline
                    let accidentFollowUpFormId = [accidentFollowUpRepotFormRes.data.Id];
                    if (getAccidentFollowUpFormByIdRes.AccidentFollowUpFormId) {
                        accidentFollowUpFormId = [...getAccidentFollowUpFormByIdRes.AccidentFollowUpFormId, ...accidentFollowUpRepotFormRes.data.Id];
                    }
                    updateServiceUserAccidentById(parentFormData.Id, {
                        "AccidentFollowUpFormId": {
                            results: accidentFollowUpFormId
                        },
                        "NextDeadline": addMonths(new Date(), 6),
                        "Status": "PENDING_SM_FILL_IN"
                    }).then((updateServiceUserAccidentFormRes) => {
                        // Update current form 21 Status to complete

                        const updateAccidentFollowUpReportFormBody = {
                            ...body,
                            "SDApproved": true,
                            "SDDate": new Date().toISOString(),
                            "SDComment": sdComment
                        }

                        updateAccidentFollowUpRepotFormById(selectedAccidentFollowUpFormId, updateAccidentFollowUpReportFormBody).then((res) => {
                            formSubmittedHandler();
                            // Trigger notification workflow
                        }).catch(console.error);
                    }).catch(console.error);
                }).catch(console.error);
            }).catch(console.error);
        } else {
            // update form 19 status
            // update form 21 to complete
            const updateAccidentFollowUpReportFormBody = {
                ...body,
                "SDApproved": true,
                "SDDate": new Date().toISOString(),
                "SDComment": sdComment
            }
            updateAccidentFollowUpRepotFormById(selectedAccidentFollowUpFormId, updateAccidentFollowUpReportFormBody).then((AccidentFollowUpReportFormResponse) => {
                //Update 
                updateServiceUserAccidentById(parentFormData.Id, { "Status": "CLOSED" }).then(() => {
                    // trigger notification workflow
                    formSubmittedHandler()
                }).catch(console.error)
            }).catch(console.error);
        }

    }

    const sdRejectHandler = () => {
        const updateAccidentFollowUpReportFormBody = {
            "SDApproved": false,
            "SDDate": new Date().toISOString(),
            "SDComment": sdComment
        }
        updateAccidentFollowUpRepotFormById(selectedAccidentFollowUpFormId, updateAccidentFollowUpReportFormBody).then((AccidentFollowUpReportFormResponse) => {
            updateServiceUserAccidentById(parentFormData.Id, { "Status": "PENDING_SM_FILL_IN" }).then(() => {
                // trigger notification workflow
                formSubmittedHandler()
            }).catch(console.error);
        }).catch(console.error);
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

        if (parentFormData && parentFormData.Id) {
            getAllAccidentFollowUpFormByParentId(parentFormData.Id).then((accidentFollowUpFormRepseonse) => {
                setAccidentFollowUpFormList(accidentFollowUpFormRepseonse);
                if (accidentFollowUpFormRepseonse && accidentFollowUpFormRepseonse.length > 0) {
                    setSelectedAccidentFollowUpFormId(accidentFollowUpFormRepseonse[0].Id);

                    setIsSDApproved(accidentFollowUpFormRepseonse[0].SDApproved === true ? true : false);

                    setForm({
                        accidentalFollowUpContinue: accidentFollowUpFormRepseonse[0].AccidentalFollowUpContinue ? "ACCIDENT_FOLLOW_UP_TRUE" : "ACCIDENT_FOLLOW_UP_FALSE",
                        executionPeriod: accidentFollowUpFormRepseonse[0].ExecutionPeriod,
                        followUpMeasures: accidentFollowUpFormRepseonse[0].FollowUpMeasures,
                        remark: accidentFollowUpFormRepseonse[0].Remark
                    });

                    setSdComment(accidentFollowUpFormRepseonse[0].SDComment);
                    if (accidentFollowUpFormRepseonse[0].SMDate) {
                        setSmDate(new Date(accidentFollowUpFormRepseonse[0].SMDate));
                    }

                    setSptComment(accidentFollowUpFormRepseonse[0].SPTComment);
                    if (accidentFollowUpFormRepseonse[0].SPTDate) {
                        setSmDate(new Date(accidentFollowUpFormRepseonse[0].SPTDate));
                    }
                }
            }).catch(console.error);

            // getAccidentFollowUpFormById(parentFormData.AccidentFollowUpFormId[0]).then((accidentFollowUpFormRepseonse) => {
            //     setForm({
            //         accidentalFollowUpContinue: accidentFollowUpFormRepseonse.AccidentalFollowUpContinue ? "ACCIDENT_FOLLOW_UP_TRUE" : "ACCIDENT_FOLLOW_UP_FALSE",
            //         executionPeriod: accidentFollowUpFormRepseonse.ExecutionPeriod,
            //         followUpMeasures: accidentFollowUpFormRepseonse.FollowUpMeasures,
            //         remark: accidentFollowUpFormRepseonse.Remark
            //     });

            //     setSdComment(accidentFollowUpFormRepseonse.SDComment);
            //     if (accidentFollowUpFormRepseonse.SMDate) {
            //         setSmDate(new Date(accidentFollowUpFormRepseonse.SMDate));
            //     }

            //     setSptComment(accidentFollowUpFormRepseonse.SPTComment);
            //     if (accidentFollowUpFormRepseonse.SPTDate) {
            //         setSmDate(new Date(accidentFollowUpFormRepseonse.SPTDate));
            //     }

            // }).catch(console.error);
        }
    }

    const formChangeHandler = (event) => {
        const value = +event.target.value;
        setSelectedAccidentFollowUpFormId(value);

        const [form] = accidentFollowUpFormList.filter((item) => item.ID === value);

        setIsSDApproved(form.SDApproved === true ? true : false);

        setForm({
            accidentalFollowUpContinue: form.AccidentalFollowUpContinue === null ? null : form.AccidentalFollowUpContinue === true ? "ACCIDENT_FOLLOW_UP_TRUE" : "ACCIDENT_FOLLOW_UP_FALSE",
            executionPeriod: form.ExecutionPeriod || "",
            followUpMeasures: form.FollowUpMeasures || "",
            remark: form.Remark || ""
        });

        setSdComment(form.SDComment || "");
        if (form.SMDate) {
            setSmDate(new Date(form.SMDate));
        } else setSmDate(new Date());

        setSptComment(form.SPTComment || "");
        if (form.SPTDate) {
            setSmDate(new Date(form.SPTDate));
        } else setSmDate(new Date());
    }

    useEffect(() => {
        // Get stage oen form data
        if (parentFormData) {
            loadData();
        }
    }, [parentFormData]);

    return (
        <>
            <div className="mb-3">
                <Header displayName="意外跟進/結束表(三)" >
                    {
                        accidentFollowUpFormList.length > 1 &&
                        <select className={"form-control"} value={selectedAccidentFollowUpFormId} onChange={formChangeHandler}>
                            {accidentFollowUpFormList.map((item) => {
                                return <option value={item.ID}>{moment(item.Created).format("YYYY-MM-DD")} - {item.Title}</option>
                            })}
                        </select>
                    }
                </Header>
            </div>
            <div className="container-fluid px-4">
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
                            <input type="text" className="form-control" readOnly value={`${serviceUnitDetail && serviceUnitDetail.Title ? `${serviceUnitDetail.Title} - ${serviceUnitDetail.ShortForm}` : ""}`} />
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
                            <input type="text" className="form-control" readOnly value={`${serviceUser && serviceUser.NameCN ? `${serviceUser.NameCN}` : ""}`} />
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
                    <div className="form-row mb-3">
                        <div className="col-12 font-weight-bold">
                            <h5>意外跟進行動表</h5>
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/* 意外報告的跟進措施 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>意外報告的跟進措施</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" name="followUpMeasures" onChange={textFieldHandler} value={form.followUpMeasures} disabled={isSDApproved || (!stageThreePendingSmFillIn(currentUserRole, formStatus, formStage) && !stageThreePendingSdApprove(currentUserRole, formStatus, formStage))} />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/* 執行時段 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>執行時段</label>
                        <div className="col">
                            <input type="text" className="form-control" name="executionPeriod" value={form.executionPeriod} onChange={textFieldHandler} disabled={isSDApproved || (!stageThreePendingSmFillIn(currentUserRole, formStatus, formStage) && !stageThreePendingSdApprove(currentUserRole, formStatus, formStage))} />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/* 備註 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>備註</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" name="remark" onChange={textFieldHandler} value={form.remark} disabled={isSDApproved || (!stageThreePendingSmFillIn(currentUserRole, formStatus, formStage) && !stageThreePendingSdApprove(currentUserRole, formStatus, formStage))} />
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        {/* 意外跟進 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>意外跟進</label>
                        <div className="col-12 col-md-4">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="accidentalFollowUpContinue" id="accident-follow-up-true" checked={form.accidentalFollowUpContinue === "ACCIDENT_FOLLOW_UP_TRUE"} value="ACCIDENT_FOLLOW_UP_TRUE" onChange={radioButtonHandler} disabled={isSDApproved || (!stageThreePendingSmFillIn(currentUserRole, formStatus, formStage) && !stageThreePendingSdApprove(currentUserRole, formStatus, formStage))} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="accident-follow-up-true">繼續</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="accidentalFollowUpContinue" id="accident-follow-up-false" checked={form.accidentalFollowUpContinue === "ACCIDENT_FOLLOW_UP_FALSE"} value="ACCIDENT_FOLLOW_UP_FALSE" onChange={radioButtonHandler} disabled={isSDApproved || (!stageThreePendingSmFillIn(currentUserRole, formStatus, formStage) && !stageThreePendingSdApprove(currentUserRole, formStatus, formStage))} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="accident-follow-up-false">結束</label>
                            </div>
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        {/* 服務經理姓名 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>高級服務經理/<span className="d-sm-inline d-md-block">服務經理姓名</span></label>
                        <div className="col-12 col-md-4">
                            {/* <PeoplePicker
                                context={context}
                                personSelectionLimit={1}
                                showtooltip={false}
                                principalTypes={[PrincipalType.User]}
                                resolveDelay={1000}
                                selectedItems={setSmPicker}
                                defaultSelectedUsers={smAD && [smAD.mail]}
                            /> */}
                            {/* <select className="form-control" value={serviceManagerEmail} onChange={(event) => setServiceManagerEmail(event.target.value)}>
                                <option>請選擇服務經理</option>
                                {
                                    smList.map((sm) => {
                                        return <option value={sm.mail}>{sm.displayName}</option>
                                    })
                                }
                            </select> */}
                            <input type="text" className="form-control" readOnly value={`${parentFormData && parentFormData.SM ? `${parentFormData.SM.Title}` : ""}`} disabled={isSDApproved || (!stageThreePendingSmFillIn(currentUserRole, formStatus, formStage) && !stageThreePendingSdApprove(currentUserRole, formStatus, formStage))} />
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
                            <span className={styles.fieldTitle}>[此欄由高級物理治療師填寫]</span>
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
                            <input type="text" className="form-control" readOnly value={`${parentFormData && parentFormData.SPT ? `${parentFormData.SPT.Title}` : ""}`} />
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
                            <AutosizeTextarea className="form-control" name="sptComment" onChange={(event) => setSptComment(event.target.value)} value={sptComment} disabled={isSDApproved || !stageThreePendingSdApproveForSpt(currentUserRole, formStatus, formStage)} />
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
                            <span className={styles.fieldTitle}>[此欄由服務總監填寫]</span>
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
                            <input type="text" className="form-control" readOnly value={`${parentFormData && parentFormData.SD ? `${parentFormData.SD.Title}` : ""}`} />
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
                            <AutosizeTextarea className="form-control" name="sdComment" onChange={(event) => setSdComment(event.target.value)} value={sdComment} disabled={isSDApproved || !stageThreePendingSdApprove(currentUserRole, formStatus, formStage)} />
                        </div>
                    </div>

                    {
                        !isSDApproved && stageThreePendingSdApprove(currentUserRole, formStatus, formStage) &&
                        <div className="form-row mb-2">
                            <div className="col-12">
                                <div className="d-flex justify-content-center">
                                    <button className="btn btn-warning mr-3" onClick={() => sdApproveHandler()}>批准</button>
                                    <button className="btn btn-danger mr-3" onClick={() => sdRejectHandler()}>拒絕</button>
                                </div>
                            </div>
                        </div>
                    }
                </section>

                <hr className="my-4" />

                <section className="py-3">
                    <div className="d-flex justify-content-center" style={{ gap: 10 }}>
                        {
                            !isSDApproved &&
                            <>
                                {
                                    (stageThreePendingSdApproveForSpt(currentUserRole, formStatus, formStage) || stageThreePendingSmFillIn(currentUserRole, formStatus, formStage)) &&
                                    <button className="btn btn-warning" onClick={(event => smSubmitHandler(event))}>提交</button>
                                }
                                {
                                    stageThreePendingSmFillIn(currentUserRole, formStatus, formStage) &&
                                    <button className="btn btn-success" onClick={(event => draftHandler(event))}>草稿</button>
                                }
                            </>
                        }
                        <button className="btn btn-secondary" onClick={(event => cancelHandler(event))}>取消</button>
                    </div>
                </section>
            </div>
        </>
    )
}
