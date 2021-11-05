import * as React from 'react'
import { useState } from "react";
import DatePicker from "react-datepicker";
import Header from "../../../components/Header/Header";
import "react-datepicker/dist/react-datepicker.css";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { WebPartContext } from '@microsoft/sp-webpart-base';
import AutosizeTextarea from "../../../components/AutosizeTextarea/AutosizeTextarea";
import { ISpecialIncidentReportLicenseProps, ISpecialIncidentReportLicenseStates } from './ISpecialIncidentReportLicense';
import { inputProperties } from 'office-ui-fabric-react';
import { createSpecialIncidentReportLicense } from '../../../api/PostFuHongList';


export default function SpecialIncidentReportLicense({ context, styles, formSubmittedHandler }: ISpecialIncidentReportLicenseProps) {
    const [isPrintMode, setPrintMode] = useState(false);
    const [form, setForm] = useState<ISpecialIncidentReportLicenseStates>({
        abuser: "",
        abuserDescription: "",
        abuser_police: undefined,
        abuser_policeCaseNo: "",
        abuser_policeDate: new Date(),
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
        guardianRelation: "",
        guardianStaff: "",
        guardianDate: new Date(),
        homesManagerName: "",
        homesName: "",
        homesManagerTel: "",
        insuranceCaseNo: "",
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
        unusalIncideintGeneral: "",
        unusalIncideintIncident: "",
        unusalIncident: ""
    });

    const [incidentTime, setIncidentTime] = useState(new Date());


    const [date, setDate] = useState(new Date());
    const [smDate, setSmDate] = useState(new Date());
    const [smComment, setSmComment] = useState("");
    const [sdDate, setSdDate] = useState(new Date());
    const [sdComment, setSdComment] = useState("");

    const [extraFile, setExtraFile] = useState<FileList>(null);
    const [subpoenaFile, setSubpoenaFile] = useState<FileList>(null);

    const radioButtonHandler = (event) => {
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

    const inputFieldHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setForm({ ...form, [name]: value });
    }

    const dataFactory = () => {
        let body = {};
        let error = {};

        //經辦人 (負責督察姓名)
        if (form.responsibleName) {
            body["ResponsibleName"] = form.responsibleName;
        } else {
            error["ResponsibleName"] = true;
        }

        //殘疾人士院舍名稱
        if (form.homesName) {
            body["HomesName"] = form.homesName;
        } else {
            error["HomesName"] = true;
        }

        //殘疾人士院舍主管姓名
        if (form.homesManagerName) {
            body["HomesManagerName"] = form.homesManagerName;
        } else {
            error["HomesManagerName"] = true;
        }

        //聯絡電話
        if (form.homesManagerTel) {
            body["HomesManagerTel"] = form.homesManagerTel;
        } else {
            error["HomesManagerTel"] = true;
        }

        //事故發生日期
        body["IncidentTime"] = incidentTime.toISOString();

        //(1) 住客不尋常死亡／事故導致住客嚴重受傷或死亡
        if (form.unusalIncident) {
            body["UnusalIncident"] = form.unusalIncident;
        } else {
            error["UnusalIncident"] = true;
        }

        //在院舍內發生事故及送院後死亡
        if (form.unusalIncideintGeneral) {
            body["UnusalIncideintGeneral"] = form.unusalIncideintGeneral;
        } else {
            error["UnusalIncideintGeneral"] = true;
        }

        //其他不尋常死亡／事故
        if (form.unusalIncideintIncident) {
            body["UnusalIncideintIncident"] = form.unusalIncideintIncident;
        } else {
            error["UnusalIncideintIncident"] = true;
        }

        //1a)  已報警求助
        body["Police"] = form.police;
        if (form.police === true) {
            body["PoliceDatetime"] = form.policeDatetime.toISOString();
            if (form.policeReportNumber) {
                body["PoliceReportNumber"] = form.policeReportNumber;
            } else {
                error["PoliceReportNumber"] = true;
            }
        } else if (form.police === undefined) {
            error["Police"] = true;
        }

        //(1b) 警方到院舍調查日期及時間
        body["PoliceInvestigate"] = form.policeInvestigate;
        if (form.policeInvestigate === true) {
            body["PoliceInvestigateDate"] = form.policeInvestigateDate.toISOString();
        } else if (form.policeInvestigate === undefined) {
            error["PoliceInvestigate"] = true;
        }


        //(2) 住客失蹤以致需要報警求助 
        if (form.residentMissing) {
            body["ResidentMissing"] = form.residentMissing;
            if (form.residentMissing === "RESIDENT_MISSING_OUTSIDE") {
                if (form.residentMissingReason) {
                    body["ResidentMissingReason"] = form.residentMissingReason;
                } else {
                    error["ResidentMissingReason"] = true;
                }
            }
        } else {
            error["ResidentMissing"] = true;
        }

        body["MissingPoliceDate"] = form.missingPoliceDate.toISOString();
        body["MissingPoliceReportNo"] = form.missingPoliceReportNo;

        //(2a)
        body["Found"] = form.found;
        if (form.found) {

        } else {
            error["Found"] = true;
        }

        return [body, error];
    }

    const submitHandler = (event) => {
        event.preventDefault();
        const [body, error] = dataFactory()
        console.log(body);
        console.log(error);
        createSpecialIncidentReportLicense(body).then((res) => {
            formSubmittedHandler();
        }).catch(console.error);
    }

    const draftHandler = (event) => {
        event.preventDefault();
        const [body] = dataFactory()
        console.log(body);

        createSpecialIncidentReportLicense(body).then((res) => {
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
                <Header displayName="殘疾人士院舍特別事故報告" />
            </div>
            <div className="container-fluid px-4 pt-3">
                <section className="mb-5">
                    {/* <div className="row">
                        <div className="col-12 font-weight-bold">
                            <h5>報告資料</h5>
                        </div>
                    </div> */}
                    <div className="row">
                        <div className="col-12">
                            <div className={`font-weight-bold mb-3`} style={{ fontSize: 15 }}>【須在事件<span className="text-danger">發生後的3個曆日（包括公眾假期）內</span>提交】</div>
                            {/* Only show in print form */}
                            {
                                isPrintMode ?
                                    <div className="">注意：請在合適方格內加上「&#10003;」號，並連同附頁／載有相關資料的自訂報告一併呈交</div>
                                    :
                                    <div className="">

                                        <div className="mb-1 text-secondary font-weight-bold">若有相關資料/自訂報告，請於此上載</div>

                                        <div className="input-group mb-3">
                                            <div className="custom-file">
                                                <input type="file" className="custom-file-input" name="subpoenaFile" id="subpoena-file" onChange={(event) => setExtraFile(event.target.files)} />
                                                <label className={`custom-file-label ${styles.fileUploader}`} htmlFor="subpoena-file">{extraFile && extraFile.length > 0 ? `${extraFile[0].name}` : "請選擇文件 (如適用)"}</label>
                                            </div>
                                            {
                                                extraFile && extraFile.length > 0 &&
                                                <div className="input-group-append">
                                                    <button className="btn btn-outline-secondary btn-sm" type="button" onClick={() => setExtraFile(null)}>清除</button>
                                                </div>
                                            }
                                        </div>
                                    </div>
                            }
                        </div>
                    </div>

                    <hr className="my-4" />

                    <div className="row">
                        <div className="col-12">
                            <p className={`${styles.fieldTitle}`}>致 : 社會福利署殘疾人士院舍牌照事務處（傳真：2153 0071／查詢電話：2891 6379）</p>
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/* 經辦人 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>經辦人<span className="d-sm-inline d-md-block">(負責督察姓名)</span></label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/* 殘疾人士院舍名稱 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>殘疾人士院舍名稱</label>
                        <div className="col">
                            <input type="text" className="form-control" />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/* 殘疾人士院舍主管姓名 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>殘疾人士院舍主管<span className="d-sm-inline d-md-block">姓名</span></label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                        {/* 聯絡電話 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>聯絡電話</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/* 事故發生日期 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>事故發生日期</label>
                        <div className="col-12 col-md-4">
                            <DatePicker className="form-control" selected={date} dateFormat="yyyy/MM/dd" onChange={setDate} />
                        </div>
                        {
                            isPrintMode === false &&
                            <>
                                {/* 保險公司備案編號 */}
                                <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>保險公司備案編號</label>
                                <div className="col-12 col-md-4">
                                    <input type="text" className="form-control" />
                                </div>
                            </>
                        }

                    </div>
                </section>

                <section className="mb-5">
                    <div className="form-row mb-3">
                        <div className="col-12 font-weight-bold">
                            <h5>特別事故類別</h5>
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/*(1) 住客不尋常死亡／事故導致住客嚴重受傷或死亡 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>(1) 住客不尋常死亡／事故導致住客嚴重受傷或死亡</label>
                        <div className="col">

                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="unusalIncident" id="unusal-incident-general" value="UNUSAL_INCIDENT_GENERAL" onChange={radioButtonHandler} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="unusal-incident-general">在院舍內發生事故及送院後死亡</label>
                            </div>
                            {
                                form.unusalIncident === "UNUSAL_INCIDENT_GENERAL" &&
                                <div className="">
                                    <div>請註明事件:</div>
                                    <AutosizeTextarea className="form-control" placeholder="請註明" />
                                </div>
                            }
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="unusalIncident" id="unusal-incident-suicide" value="UNUSAL_INCIDENT_SUICIDE" onChange={radioButtonHandler} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="unusal-incident-suicide">在院舍內自殺及送院後死亡</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="unusalIncident" id="unusal-incident-other" value="UNUSAL_INCIDENT_OTHER" onChange={radioButtonHandler} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="unusal-incident-other">其他不尋常死亡／事故</label>
                            </div>
                            {
                                form.unusalIncident === "UNUSAL_INCIDENT_OTHER" &&
                                <div className="">
                                    <div>請註明事件:</div>
                                    <AutosizeTextarea className="form-control" placeholder="請註明" />
                                </div>
                            }
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="unusalIncident" id="unusal-incident-court" value="UNUSAL_INCIDENT_COURT" onChange={radioButtonHandler} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="unusal-incident-court">接獲死因裁判法庭要求出庭的傳票<br />(請夾附傳票副本並在附頁說明詳情)</label>
                            </div>
                            {
                                form.unusalIncident === "UNUSAL_INCIDENT_COURT" &&
                                <div className="input-group mb-2">
                                    <div className="custom-file">
                                        <input type="file" className="custom-file-input" name="subpoenaFile" id="subpoena-file" onChange={(event) => setSubpoenaFile(event.target.files)} />
                                        <label className={`custom-file-label ${styles.fileUploader}`} htmlFor="subpoena-file">{subpoenaFile && subpoenaFile.length > 0 ? `${subpoenaFile[0].name}` : "請選擇文件 (如適用)"}</label>
                                    </div>
                                    {
                                        subpoenaFile && subpoenaFile.length > 0 &&
                                        <div className="input-group-append">
                                            <button className="btn btn-outline-secondary btn-sm" type="button" onClick={() => setSubpoenaFile(null)}>清除</button>
                                        </div>
                                    }
                                </div>
                            }
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/* 報警求助 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>(1a)</label>
                        <div className="col">
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="police" id="police-true" onClick={() => setForm({ ...form, police: true })} checked={form.police === true} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="police-true">已報警求助</label>
                            </div>
                            {
                                form.police &&
                                <>
                                    <div className="mb-1">
                                        <label>報警日期</label>
                                        <DatePicker className="form-control" selected={form.policeDatetime} dateFormat="yyyy/MM/dd" onChange={(date) => setForm({ ...form, policeDatetime: date })} />
                                    </div>
                                    <div>
                                        <label>報案編號</label>
                                        <input className="form-control" name="policeReportNumber" value={form.policeReportNumber} onChange={inputFieldHandler} />
                                    </div>
                                </>
                            }
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="police" id="police-false" onClick={() => setForm({ ...form, police: false })} checked={form.police === false} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="police-false">沒有報警求助</label>
                            </div>
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        {/* 警方到院舍調查日期及時間 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>(1b) 警方到院舍調查日期及時間</label>
                        <div className="col">
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="policeInvestigate" id="police-investigate-true" onClick={() => setForm({ ...form, policeInvestigate: true })} checked={form.policeInvestigate === true} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="police-investigate-true">有</label>
                            </div>
                            {
                                form.policeInvestigate === true &&
                                <>
                                    <div className="mb-1">
                                        <label>調查日期和時間</label>
                                        <DatePicker className="form-control" selected={form.policeInvestigateDate} dateFormat="yyyy/MM/dd  h:mm aa" showTimeSelect timeIntervals={15} onChange={(date) => setForm({ ...form, policeInvestigateDate: date })} />
                                    </div>
                                </>
                            }
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="policeInvestigate" id="police-investigate-false" onClick={() => setForm({ ...form, policeInvestigate: false })} checked={form.policeInvestigate === false} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="police-investigate-false">沒有</label>
                            </div>
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        {/* (2) 住客失蹤以致需要報警求助 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>(2) 住客失蹤以致需要報警求助</label>
                        <div className="col">
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="residentMissing" id="resident-missing-inside" value="RESIDENT_MISSING_INSIDE" onChange={radioButtonHandler} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="resident-missing-inside">住客擅自／在員工不知情下離開院舍</label>
                            </div>
                            <div className="form-check mb-2">
                                <input className="form-check-input" type="radio" name="residentMissing" id="resident-missing-outside" value="RESIDENT_MISSING_OUTSIDE" onChange={radioButtonHandler} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="resident-missing-outside">院外活動期間失蹤</label>
                            </div>
                            {
                                form.residentMissing === "RESIDENT_MISSING_OUTSIDE" &&
                                <div className="px-3">
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="residentMissingReason" id="resident-missing-reason-vacation" value="RESIDENT_MISSING_REASON_VACATION" onChange={radioButtonHandler} />
                                        <label className={`form-check-label ${styles.labelColor}`} htmlFor="resident-missing-reason-vacation">回家度假期間</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="residentMissingReason" id="resident-missing-reason-voluntarily" value="RESIDENT_MISSING_REASON_VOLUNTARILY" onChange={radioButtonHandler} />
                                        <label className={`form-check-label ${styles.labelColor}`} htmlFor="resident-missing-reason-voluntarily">自行外出活動</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="residentMissingReason" id="resident-missing-reason-home-out" value="RESIDENT_MISSING_REASON_HOME_OUT" onChange={radioButtonHandler} />
                                        <label className={`form-check-label ${styles.labelColor}`} htmlFor="resident-missing-reason-home-out">院舍外出活動</label>
                                    </div>
                                </div>
                            }

                            <div className="mb-1">
                                <label>報警日期</label>
                                <DatePicker className="form-control" selected={form.missingPoliceDate} dateFormat="yyyy/MM/dd" onChange={(date) => setForm({ ...form, missingPoliceDate: date })} />
                            </div>
                            <div>
                                <label>報警編號</label>
                                <AutosizeTextarea className="form-control" value={form.missingPoliceReportNo} onChange={inputFieldHandler} name="missingPoliceReportNo" />
                            </div>
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        {/* (2a) */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>(2a)</label>
                        <div className="col">
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="residentMissingFound" id="resident-missing-found-true" onClick={() => setForm({ ...form, found: true })} checked={form.found === true} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="resident-missing-found-true">已尋回</label>
                            </div>
                            {
                                form.found === true &&
                                <div className="d-flex align-items-center">
                                    <label className="mr-3">尋回日期</label>
                                    <DatePicker className="form-control" selected={form.foundDate} dateFormat="yyyy/MM/dd" onChange={(date) => setForm({ ...form, foundDate: date })} />
                                </div>
                            }
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="residentMissingFound" id="resident-missing-found-false" onClick={() => setForm({ ...form, found: false })} checked={form.found === false} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="resident-missing-found-false">仍未尋回</label>
                            </div>
                            {
                                form.found === false &&
                                <div className="d-flex align-items-center">
                                    由失蹤日計起至呈報日，已失蹤
                                    <div className="input-group mb-3">
                                        <input type="number" className="form-control" min={0} value={form.notYetFoundDayCount} onChange={(event) => setForm({ ...form, notYetFoundDayCount: +event.target.value })} />
                                        <div className="input-group-append">
                                            <span className="input-group-text" id="basic-addon2">日</span>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>


                    <div className="form-row mb-2">
                        {/* (2b) 失蹤住客病歷 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>(2b) 失蹤住客病歷</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" />
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        {/* (3) 院舍內證實／懷疑有住客受虐待／被侵犯私隱 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>(3) 院舍內證實／懷疑有住客受虐待／被侵犯私隱</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="residentAbuse" id="resident-abuse-body" checked={form.ra_body === true} onClick={() => setForm({ ...form, ra_body: !form.ra_body })} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="resident-abuse-body">身體虐待</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="residentAbuse" id="resident-abuse-mental" checked={form.ra_mental === true} onClick={() => setForm({ ...form, ra_mental: !form.ra_mental })} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="resident-abuse-mental">精神虐待</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="residentAbuse" id="resident-abuse-negligent" checked={form.ra_negligent === true} onClick={() => setForm({ ...form, ra_negligent: !form.ra_negligent })} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="resident-abuse-negligent">疏忽照顧</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="residentAbuse" id="resident-abuse-embezzle-property" checked={form.ra_embezzleProperty === true} onClick={() => setForm({ ...form, ra_embezzleProperty: !form.ra_embezzleProperty })} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="resident-abuse-embezzle-property">侵吞財產</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="residentAbuse" id="resident-abuse-abandoned" checked={form.ra_abandoned === true} onClick={() => setForm({ ...form, ra_abandoned: !form.ra_abandoned })} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="resident-abuse-abandoned">遺棄</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="residentAbuse" id="resident-abuse-sexual-assault" checked={form.ra_sexualAssault === true} onClick={() => setForm({ ...form, ra_sexualAssault: !form.ra_sexualAssault })} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="resident-abuse-sexual-assault">非禮／性侵犯</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" name="residentAbuse" id="resident-abuse-other" checked={form.ra_other === true} onClick={() => setForm({ ...form, ra_other: !form.ra_other })} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="resident-abuse-other">其他</label>
                            </div>
                            {
                                form.other &&
                                <AutosizeTextarea className="form-control" placeholder="請註明" name="ra_otherDescription" value={form.ra_otherDescription} onChange={inputFieldHandler} />
                            }
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        {/* (3a) 施虐者／懷疑施虐者的身份 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>(3a) 施虐者／懷疑施虐者的身份</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="abuser" id="abuser-staff" value="ABUSER_STAFF" onChange={radioButtonHandler} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="abuser-staff">員工</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="abuser" id="abuser-tenant" value="ABUSER_TENANT" onChange={radioButtonHandler} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="abuser-tenant">住客</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="abuser" id="abuser-guest" value="ABUSER_GUEST" onChange={radioButtonHandler} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="abuser-guest">訪客</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="abuser" id="abuser-other" value="ABUSER_OTHER" onChange={radioButtonHandler} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="abuser-other">其他</label>
                            </div>
                            {
                                form.abuser === "ABUSER_OTHER" &&
                                <AutosizeTextarea className="form-control" placeholder="請註明" />
                            }
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        {/* (3b)*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>(3b)</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="referrals" id="referrals-false" checked={form.referSocialWorker === false} onClick={() => setForm({ ...form, referSocialWorker: false })} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="referrals-false">沒有</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="referrals" id="referrals-true" checked={form.referSocialWorker === true} onClick={() => setForm({ ...form, referSocialWorker: true })} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="referrals-true">已轉介社工</label>
                            </div>
                            {
                                form.referSocialWorker &&
                                <>
                                    <div className="">
                                        <label>轉介日期</label>
                                        <DatePicker className="form-control" selected={form.referDate} dateFormat="yyyy/MM/dd" onChange={(date) => setForm({ ...form, referDate: date })} />
                                    </div>
                                    <div className="">
                                        <label>服務單位</label>
                                        <input type="text" className="form-control" name="referServiceUnit" value={form.referServiceUnit} onChange={inputFieldHandler} />
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/* (3c)*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>(3c)</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="residentAbusePolice" id="resident-abuse-police-false" checked={form.abuser_police === false} onClick={() => setForm({ ...form, abuser_police: false })} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="resident-abuse-police-false">沒有</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="residentAbusePolice" id="resident-abuse-police-true" checked={form.abuser_police === false} onClick={() => setForm({ ...form, abuser_police: true })} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="resident-abuse-police-true">已報警求助</label>
                            </div>
                            {
                                form.abuser_police &&
                                <>
                                    <div className="mb-1">
                                        <label>報警日期</label>
                                        <DatePicker className="form-control" selected={date} dateFormat="yyyy/MM/dd" onChange={setDate} />
                                    </div>
                                    <div>
                                        <label>報案編號</label>
                                        <input className="form-control" />
                                    </div>
                                </>
                            }
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        {/* (4) 院舍內有爭執事件以致需要報警求助 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>(4) 院舍內有爭執事件以致需要報警求助</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="conflict" id="dispute-police-tenant-and-tenant" value="DISPUTE_POLICE_TENANT_AND_TENANT" onChange={radioButtonHandler} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="dispute-police-tenant-and-tenant">住客與住客</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="conflict" id="dispute-police-tenant-and-staff" value="DISPUTE_POLICE_TENANT_AND_STAFF" onChange={radioButtonHandler} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="dispute-police-tenant-and-staff">住客與員工</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="conflict" id="dispute-police-tenant-and-guest" value="DISPUTE_POLICE_TENANT_AND_GUEST" onChange={radioButtonHandler} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="dispute-police-tenant-and-guest">住客與訪客</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="conflict" id="dispute-police-staff-and-staff" value="DISPUTE_POLICE_STAFF_AND_STAFF" onChange={radioButtonHandler} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="dispute-police-staff-and-staff">員工與員工</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="conflict" id="dispute-police-staff-and-guest" value="DISPUTE_POLICE_STAFF_AND_GUEST" onChange={radioButtonHandler} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="dispute-police-staff-and-guest">員工與訪客</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="conflict" id="dispute-police-guest-and-guest" value="DISPUTE_POLICE_GUEST_AND_GUEST" onChange={radioButtonHandler} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="dispute-police-guest-and-guest">訪客與訪客</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="conflict" id="dispute-police-other" value="DISPUTE_POLICE_OTHER" onChange={radioButtonHandler} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="dispute-police-other">其他 (請註明)</label>
                            </div>
                            {
                                form.conflict === "DISPUTE_POLICE_OTHER" &&
                                <div className="">
                                    <AutosizeTextarea placeholder="請註明" className="form-control" value={form.conflictDescription} onChange={inputFieldHandler} name="conflictDescription" />
                                </div>
                            }
                            <div className="mb-1">
                                <label>報警日期</label>
                                <DatePicker className="form-control" selected={form.conflict_policeDate} dateFormat="yyyy/MM/dd" onChange={(date) => setForm({ ...form, conflict_policeDate: date })} />
                            </div>
                            <div>
                                <label>報案編號</label>
                                <input className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        {/* (5) 嚴重醫療／藥物事故（須同時提交「藥物風險管理報告」） */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>(5) 嚴重醫療／藥物事故（須同時提交「藥物風險管理報告」）</label>
                        <div className="col">
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="medicalIncident" id="serious-medical-incident-mistake" value="SERIOUS_MEDICAL_INCIDENT_MISTAKE" onChange={radioButtonHandler} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="serious-medical-incident-mistake">住客誤服藥物引致入院接受檢查或治療</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="medicalIncident" id="serious-medical-incident-over-or-missed" value="SERIOUS_MEDICAL_INCIDENT_OVER_OR_MISSED" onChange={radioButtonHandler} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="serious-medical-incident-over-or-missed">住客漏服或多服藥物引致入院接受檢查或治療</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="medicalIncident" id="serious-medical-incident-counter-drug" value="SERIOUS_MEDICAL_INCIDENT_COUNTER_DRUG" onChange={radioButtonHandler} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="serious-medical-incident-counter-drug">住客服用成藥或非處方藥物引致入院接受檢查或治療</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="medicalIncident" id="serious-medical-incident-other" value="SERIOUS_MEDICAL_INCIDENT_OTHER" onChange={radioButtonHandler} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="serious-medical-incident-other">其他</label>
                            </div>
                            {
                                form.medicalIncident === "SERIOUS_MEDICAL_INCIDENT_OTHER" &&
                                <div className="">
                                    <AutosizeTextarea placeholder="請註明" className="form-control" name="mi_description" value={form.mi_description} onChange={inputFieldHandler} />
                                </div>
                            }
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        {/* (6) 其他重大特別事故以致影響院舍日常運作 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>(6) 其他重大特別事故以致影響院舍日常運作</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="otherIncident" id="other-incident-power-supply" value="OTHER_INCIDENT_POWER_SUPPLY" onChange={radioButtonHandler} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="other-incident-power-supply">停止電力供應</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="otherIncident" id="other-incident-building" value="OTHER_INCIDENT_BUILDING" onChange={radioButtonHandler} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="other-incident-building">樓宇破損或結構問題</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="otherIncident" id="other-incident-fire" value="OTHER_INCIDENT_FIRE" onChange={radioButtonHandler} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="other-incident-fire">火警</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="otherIncident" id="other-incident-water-supply" value="OTHER_INCIDENT_WATER_SUPPLY" onChange={radioButtonHandler} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="other-incident-water-supply">停止食水供應</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="otherIncident" id="other-incident-other" value="OTHER_INCIDENT_OTHER" onChange={radioButtonHandler} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="other-incident-other">水浸／山泥傾瀉／其他天災意外</label>
                            </div>
                            {/* {
                                form.otherIncident === "SERIOUS_MEDICAL_INCIDENT_OTHER" &&
                                <div className="">
                                    <AutosizeTextarea placeholder="請註明" className="form-control" />
                                </div>
                            } */}
                        </div>
                    </div>


                    <div className="form-row mb-2">
                        {/* (7) 其他 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>(7) 其他</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="otherIncident" id="other-incident-true" checked={form.other === true} onClick={() => setForm({ ...form, other: true })} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="other-incident-true">有</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="otherIncident" id="other-incident-false" checked={form.other === false} onClick={() => setForm({ ...form, other: false })} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="other-incident-false">沒有</label>
                            </div>
                            {
                                form.other &&
                                <AutosizeTextarea placeholder="請註明" className="form-control" value={form.otherDescription} onChange={inputFieldHandler} name="otherDescription" />
                            }
                        </div>
                    </div>
                </section>



                <section className="mb-5">
                    <div className="form-row mb-3">
                        <div className="col-12 font-weight-bold">
                            <h5>住客及家屬情況</h5>
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/* 住客姓名 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>住客姓名</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                        {/* 年齡 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>年齡</label>
                        <div className="col-12 col-md-4">
                            <input type="number" className="form-control" min={0} />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/* 住客性別 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>性別</label>
                        <div className="col-12 col-md-4">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="tenantGender" id="tenant-gender-male" value="TENANT_GENDER_MALE" onChange={radioButtonHandler} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="tenant-gender-male">男</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="tenantGender" id="tenant-gender-female" value="TENANT_GENDER_FEMALE" onChange={radioButtonHandler} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="tenant-gender-female">女</label>
                            </div>
                        </div>
                        {/* 房及床號 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>房及/或床號</label>
                        <div className="col-12 col-md-4">
                            <input type="number" className="form-control" />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        <div className="col">
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="notified" id="notified-true" value="NOTIFIED_TRUE" onChange={radioButtonHandler} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="notified-true">已通知住客監護人／保證人／家人／親屬</label>
                            </div>
                            {
                                form.guardian === true &&
                                <>
                                    <div className="row my-2">
                                        {/* 姓名 */}
                                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>姓名</label>
                                        <div className="col-12 col-md-4">
                                            <input type="text" className="form-control" />
                                        </div>
                                        {/* 關係 */}
                                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>關係</label>
                                        <div className="col-12 col-md-4">
                                            <input type="text" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="row mb-2">
                                        {/* 負責通知的員工姓名 */}
                                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>負責通知的員工姓名</label>
                                        <div className="col-12 col-md-4">
                                            <input type="text" className="form-control" />
                                        </div>
                                        {/* 負責通知的員工職位 */}
                                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>負責通知的員工職位</label>
                                        <div className="col-12 col-md-4">
                                            <input type="text" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="row mb-2">
                                        {/* 日期和時間 */}
                                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>日期和時間</label>
                                        <div className="col-12 col-md-4">
                                            <DatePicker
                                                className="form-control"
                                                selected={date}
                                                onChange={(date) => setDate(date)}
                                                showTimeSelect
                                                timeFormat="p"
                                                timeIntervals={15}
                                                dateFormat="yyyy/MM/dd h:mm aa"
                                            />
                                        </div>
                                    </div>
                                </>
                            }
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="notified" id="notified-false" value="NOTIFIED_FALSE" onChange={radioButtonHandler} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="notified-false">沒有通知住客監護人／保證人／家人／親屬</label>
                            </div>
                            {
                                form.guardian === false &&
                                <>
                                    <label>原因:</label>
                                    <AutosizeTextarea className="form-control" placeholder="請註明" />
                                </>
                            }
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>填報人姓名</label>
                        <div className="col-12 col-md-4">
                            <PeoplePicker
                                context={context}
                                personSelectionLimit={1}
                                showtooltip={false}
                                principalTypes={[PrincipalType.User]}
                                resolveDelay={1000} />
                        </div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>填報人職位</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>填報日期</label>
                        <div className="col-12 col-md-4">
                            <DatePicker
                                className="form-control"
                                selected={date}
                                onChange={(date) => setDate(date)}
                                dateFormat="yyyy/MM/dd"
                                readOnly
                            />
                        </div>
                    </div>
                </section>

                <section className="mb-5">
                    <div className="form-row mb-3">
                        <div className="col-12 font-weight-bold">
                            <h5>殘疾人士院舍特別事故報告 (附頁)</h5>
                        </div>
                    </div>
                    <div className="row mt-3 mb-2">
                        <div className="col-12">
                            <span>(此附頁／載有相關資料的自訂報告須連同首兩頁的表格一併呈交)</span>
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>殘疾人士院舍名稱</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" readOnly />
                        </div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>事故發生日期和時間</label>
                        <div className="col-12 col-md-4">
                            <DatePicker
                                className="form-control"
                                selected={date}
                                onChange={(date) => setDate(date)}
                                showTimeSelect
                                timeFormat="p"
                                timeIntervals={15}
                                dateFormat="yyyy/MM/dd h:mm aa"
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>受影響住客姓名</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" name="affectedName" value={form.affectedName} onChange={inputFieldHandler} />
                        </div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>身份證號碼</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" name="affectedIdCardNo" value={form.affectedIdCardNo} onChange={inputFieldHandler} />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/* 住客性別 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>性別</label>
                        <div className="col-12 col-md-4">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="affectedGender" id="attach-tenant-gender-male" value="male" onChange={radioButtonHandler} checked={form.affectedGender === "male"} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="attach-tenant-gender-male">男</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="affectedGender" id="attach-tenant-gender-female" value="female" onChange={radioButtonHandler} checked={form.affectedGender === "female"} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="attach-tenant-gender-female">女</label>
                            </div>
                        </div>
                        {/* 年齡 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>年齡</label>
                        <div className="col-12 col-md-4">
                            <input type="number" className="form-control" min={0} name="affectedAge" value={form.affectedAge} onChange={inputFieldHandler} />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/* 住客病歷 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>住客病歷</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" value={form.affectedMedicalRecord} name="affectedMedicalRecord" onChange={inputFieldHandler} />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/* 特別事故詳情／發生經過 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>特別事故詳情／發生經過</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" value={form.affectedDetail} name="affectedDetail" onChange={inputFieldHandler} />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/* 院舍跟進行動／預防事故再次發生的建議或措施 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>院舍跟進行動／預防事故再次發生的建議或措施</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" value={form.affectedFollowUp} name="affectedFollowUp" onChange={inputFieldHandler} />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/* 填報人姓名 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>填報人姓名</label>
                        <div className="col-12 col-md-4">
                            <PeoplePicker
                                context={context}
                                personSelectionLimit={1}
                                showtooltip={false}
                                principalTypes={[PrincipalType.User]}
                                resolveDelay={1000} />
                        </div>
                        {/* 職位 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>職位</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>填報日期</label>
                        <div className="col-12 col-md-4">
                            <DatePicker
                                className="form-control"
                                selected={date}
                                onChange={(date) => setDate(date)}
                                showTimeSelect
                                timeFormat="p"
                                timeIntervals={15}
                                dateFormat="yyyy/MM/dd h:mm aa"
                            />
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
                        {/* 服務經理姓名 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>高級服務經理/<span className="d-sm-inline d-md-block">服務經理姓名</span></label>
                        <div className="col-12 col-md-4">
                            <PeoplePicker
                                context={context}
                                titleText=""
                                showtooltip={false}
                                personSelectionLimit={1}
                                ensureUser={true}
                                isRequired={false}
                                selectedItems={(e) => { console }}
                                showHiddenInUI={false} />
                        </div>
                        <label className={`col-12 col-md-1 col-form-label ${styles.fieldTitle} pt-xl-0`}>日期</label>
                        <div className="col-12 col-md-5">
                            <DatePicker className="form-control" selected={smDate} onChange={(date) => setSmDate(date)} dateFormat={"yyyy/MM/dd"} readOnly />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>高級服務經理/<span className="d-sm-inline d-md-block">服務經理評語</span></label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" value={smComment} onChange={(event) => setSmComment(event.target.value)} />
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

                <section className="mb-5">
                    <div className="form-row mb-2">
                        <div className="col-12 font-weight-bold mb-2">
                            <span className={styles.fieldTitle}>[此欄由服務總監填寫]</span>
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/* SD */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>服務總監姓名</label>
                        <div className="col-12 col-md-4">
                            <PeoplePicker
                                context={context}
                                titleText=""
                                showtooltip={false}
                                personSelectionLimit={1}
                                ensureUser={true}
                                isRequired={false}
                                selectedItems={(e) => { console }}
                                showHiddenInUI={false} />
                        </div>
                        <label className={`col-12 col-md-1 col-form-label ${styles.fieldTitle} pt-xl-0`}>日期</label>
                        <div className="col-12 col-md-5">
                            <DatePicker className="form-control" dateFormat="yyyy/MM/dd" selected={sdDate} onChange={(date) => setSdDate(date)} readOnly />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>服務總監評語</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" value={sdComment} onChange={(event) => setSdComment(event.target.value)} />
                        </div>
                    </div>
                    {/* <div className="form-row row mb-2">
                        <div className="col-12">
                            <button className="btn btn-primary">儲存評語</button>
                        </div>
                    </div> */}
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
