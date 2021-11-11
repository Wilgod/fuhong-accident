import * as React from 'react'
import { useState } from 'react'
import { WebPartContext } from '@microsoft/sp-webpart-base';
import Header from "../Header/Header";
import DatePicker from "react-datepicker";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import * as moment from 'moment';
import AutosizeTextarea from "../AutosizeTextarea/AutosizeTextarea";
import { createIncidentFollowUpForm } from '../../api/PostFuHongList';
import { Role } from '../../utils/RoleParser';

interface IIncidentFollowUpFormProps {
    context: WebPartContext;
    styles: any;
    formType: string;
    formSubmittedHandler(): void;
    currentUserRole: Role;
    parentFormData: any;
}

interface IIncidentFollowUpFormStates {
    followUpMeasures: string;
    executionPeriod: string;
    remark: string;
    incidentFollowUpContinue: boolean;

}

const formTypeParser = (formType: string, additonalString: string) => {
    switch (formType) {
        case "OTHER_INCIDENT": return "其他事故" + additonalString;
        case "SPECIAL_INCIDENT_REPORT_LICENSE": return "特別事故(牌照事務處)" + additonalString;
        case "SPECIAL_INCIDENT_REPORT_ALLOWANCE": return "特別事故(津貼科)" + additonalString;
        default: return "";
    }
}

export default function IncidentFollowUpForm({ context, styles, formType, formSubmittedHandler, currentUserRole, parentFormData }: IIncidentFollowUpFormProps) {
    const [form, setForm] = useState<IIncidentFollowUpFormStates>({
        followUpMeasures: "",
        executionPeriod: "",
        remark: "",
        incidentFollowUpContinue: undefined,
    });
    const [incidentDatetime, setIncidentDatetime] = useState(new Date());
    const [insuranceCaseNo, setInsuranceCaseNo] = useState("");
    const [caseNo, setCaseNo] = useState("");
    const [smDate, setSmDate] = useState(new Date());
    const [sdDate, setSdDate] = useState(new Date());
    const [sdComment, setSdComment] = useState("");

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

        //跟進措施
        if (form.followUpMeasures) {
            body["FollowUpMeasures"] = form.followUpMeasures;
        } else {
            error["FollowUpMeasures"] = true;
        }

        //執行時段
        if (form.executionPeriod) {
            body["ExecutionPeriod"] = form.executionPeriod;
        } else {
            error["ExecutionPeriod"] = true;
        }

        //備註
        body["Remark"] = form.remark;

        //事故跟進
        body["IncidentFollowUpContinue"] = form.incidentFollowUpContinue;
        if (form.incidentFollowUpContinue === undefined) {
            error["IncidentFollowUpContinue"] = true
        }



        return [body, error];
    }

    const submitHandler = (event) => {
        event.preventDefault();
        const [body, error] = dataFactory()
        console.log(body);
        console.log(error);
        createIncidentFollowUpForm(body).then(res => {
            console.log(res)
            formSubmittedHandler();
        }).catch(console.error);
    }

    const draftHandler = (event) => {
        event.preventDefault();
        const [body] = dataFactory()
        console.log(body);
        createIncidentFollowUpForm(body).then(res => {
            console.log(res)
            formSubmittedHandler();
        }).catch(console.error);
    }

    const cancelHandler = () => {
        //implement 
        const path = context.pageContext.site.absoluteUrl + `/accident-and-incident/SitePages/Home.aspx`;
        window.open(path, "_self");
    }


    return (
        <>
            <div>
                <Header displayName="事故跟進/結束報告" />
            </div>
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
                            <input type="text" className="form-control" readOnly />
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
                            <input type="text" className="form-control" readOnly value={caseNo} onChange={(event) => setCaseNo(event.target.value)} />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>保險公司備案編號</label>
                        <div className="col">
                            <input type="text" className="form-control" value={insuranceCaseNo} onChange={event => setInsuranceCaseNo(event.target.value)} />
                        </div>
                    </div>
                </section>

                <section className="mb-5">
                    <div className="form-row mb-3">
                        <div className="col-12 font-weight-bold">
                            <h5>事故跟進行動表</h5>
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/* 事故性質 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>跟進措施</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" name="followUpMeasures" value={form.followUpMeasures} onChange={inputFieldHandler} />
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        {/* 執行時段 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>執行時段</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" name="executionPeriod" value={form.executionPeriod} onChange={inputFieldHandler} />
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        {/* 備註 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>備註</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" name="remark" value={form.remark} onChange={inputFieldHandler} />
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        {/* 意外跟進 */}

                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>事故跟進</label>
                        <div className="col-12 col-md-4">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="accidentFollowUp" id="accident-follow-up-true" onClick={() => setForm({ ...form, incidentFollowUpContinue: true })} checked={form.incidentFollowUpContinue === true} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="accident-follow-up-true">繼續</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="accidentFollowUp" id="accident-follow-up-false" onClick={() => setForm({ ...form, incidentFollowUpContinue: false })} checked={form.incidentFollowUpContinue === false} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="accident-follow-up-false">結束</label>
                            </div>
                            {/* <select className="form-control">
                                <option>請選擇</option>
                                <option>繼續</option>
                                <option>結束</option>
                            </select> */}
                        </div>
                    </div>
                </section>

                {/* <hr className="my-3" /> */}

                <section className="mb-5">
                    {/* <div className="row">
                        <div className="col-12 font-weight-bold mb-2">
                            <span>[此欄由高級服務經理/服務經理姓名填寫]</span>
                        </div>
                    </div> */}
                    <div className="form-row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>高級服務經理/<span className="d-sm-inline d-md-block">服務經理姓名</span></label>
                        <div className="col-12 col-md-4">
                            <PeoplePicker
                                context={context}
                                personSelectionLimit={1}
                                showtooltip={false}
                                principalTypes={[PrincipalType.User]}
                                resolveDelay={1000}
                            />
                            {/* <input type="text" className="form-control" /> */}
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
                    </div>

                </section>

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
                            <PeoplePicker
                                context={context}
                                personSelectionLimit={1}
                                showtooltip={false}
                                principalTypes={[PrincipalType.User]}
                                resolveDelay={1000} />
                            {/* <input type="text" className="form-control" /> */}
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
                            <AutosizeTextarea className="form-control" value={sdComment} onChange={(event) => setSdComment(event.target.value)} />
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        <div className="col-12">
                            <div className="d-flex justify-content-center">
                                <button className="btn btn-warning mr-3">批准</button>
                                <button className="btn btn-danger mr-3">拒絕</button>
                            </div>
                        </div>
                    </div>
                </section>

                <hr className="my-4" />

                <section className="py-3">
                    <div className="d-flex justify-content-center" style={{ gap: 10 }}>
                        <button className="btn btn-warning" onClick={submitHandler}>提交</button>
                        <button className="btn btn-success" onClick={draftHandler}>草稿</button>
                        <button className="btn btn-secondary" onClick={cancelHandler}>取消</button>
                    </div>
                </section>
            </div>
        </>
    )
}
