import * as React from 'react'
import { useState } from "react";
import DatePicker from "react-datepicker";
import Header from "../../../components/Header/Header";
import "react-datepicker/dist/react-datepicker.css";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { WebPartContext } from '@microsoft/sp-webpart-base';
import AutosizeTextarea from "../../../components/AutosizeTextarea/AutosizeTextarea";

interface ISpecialIncidentReportLicenseProps {
    context: WebPartContext;
    styles: any;
}

interface ISpecialIncidentReportLicenseStates {
    unusalIncident: string;
    police: string;
    policeInvestigate: string;
    residentMissing: string;
    residentMissingReason: string;
    residentMissingFound: string;
    residentAbuse: string[];

}

export default function SpecialIncidentReportLicense({ context, styles }: ISpecialIncidentReportLicenseProps) {
    const [form, setForm] = useState<ISpecialIncidentReportLicenseStates>({
        unusalIncident: "",
        police: "",
        policeInvestigate: "",
        residentMissing: "",
        residentMissingReason: "",
        residentMissingFound: "",
        residentAbuse: []
    });
    const [date, setDate] = useState(new Date());

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

    return (
        <>
            <div className="mb-3">
                <Header displayName="服務使用者意外填報表(一)" />
            </div>
            <div className="container px-4">
                <section className="mb-4">
                    <div className="row">
                        <div className="col-12 font-weight-bold">
                            <h5>報告資料</h5>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 fontweight-bold">
                            <span className={`px-2 font-weight-bold`} style={{ fontSize: 15 }}>【須在事件<span className="text-danger">發生後的3個曆日（包括公眾假期）內</span>提交】</span>
                            {/* <div className=""></div> */}
                        </div>
                    </div>

                    <hr className="my-3" />

                    <div className="row">
                        <div className="col-12">
                            <p className={`${styles.fieldTitle}`}>致 : 社會福利署殘疾人士院舍牌照事務處（傳真：2153 0071／查詢電話：2891 6379）</p>
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        {/* 經辦人 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>經辦人<br />(負責督察姓名)</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        {/* 殘疾人士院舍名稱 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>殘疾人士院舍名稱</label>
                        <div className="col">
                            <input type="text" className="form-control" />
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        {/* 殘疾人士院舍主管姓名 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>殘疾人士院舍主管姓名</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                        {/* 聯絡電話 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>聯絡電話</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        {/* 事故發生日期 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>事故發生日期</label>
                        <div className="col-12 col-md-4">
                            <DatePicker className="form-control" selected={date} dateFormat="yyyy/MM/dd" onChange={setDate} />
                        </div>
                    </div>
                </section>

                <section className="mb-4">
                    <div className="row">
                        <div className="col-12 font-weight-bold">
                            <h5>特別事故報告</h5>
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        {/*(1) 住客不尋常死亡／事故導致住客嚴重受傷或死亡 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>(1) 住客不尋常死亡／事故導致住客嚴重受傷或死亡</label>
                        <div className="col">

                            <div className="form-check">
                                <input className="form-check-input form-check-lg" type="radio" name="unusalIncident" id="unusal-incident-general" value="UNUSAL_INCIDENT_GENERAL" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="unusal-incident-general">在院舍內發生事故及送院後死亡</label>
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
                                <label className="form-check-label" htmlFor="unusal-incident-suicide">在院舍內自殺及送院後死亡</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="unusalIncident" id="unusal-incident-other" value="UNUSAL_INCIDENT_OTHER" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="unusal-incident-other">其他不尋常死亡／事故</label>
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
                                <label className="form-check-label" htmlFor="unusal-incident-court">接獲死因裁判法庭要求出庭的傳票<br />(請夾附傳票副本並在附頁說明詳情)</label>
                            </div>
                            {
                                form.unusalIncident === "UNUSAL_INCIDENT_COURT" &&
                                <input type="file" className="form-control-file" id="exampleFormControlFile1" />
                            }
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        {/* 報警求助 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>(1a)</label>
                        <div className="col">
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="police" id="police-true" value="POLICE_TRUE" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="police-true">已報警求助</label>
                            </div>
                            {
                                form.police === "POLICE_TRUE" &&
                                <>
                                    <div className="mb-1">
                                        <label>報警日期</label>
                                        <DatePicker className="form-control" selected={date} dateFormat="yyyy/MM/dd" onChange={setDate} />
                                    </div>
                                    <div>
                                        <label>報警編號</label>
                                        <AutosizeTextarea className="form-control" />
                                    </div>
                                </>
                            }
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="police" id="police-false" value="POLICE_FALSE" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="police-false">沒有報警求助</label>
                            </div>
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* 警方到院舍調查日期及時間 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>(1b) 警方到院舍調查日期及時間</label>
                        <div className="col">
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="policeInvestigate" id="police-investigate-true" value="POLICE_INVESTIGATE_TRUE" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="police-investigate-true">有</label>
                            </div>
                            {
                                form.policeInvestigate === "POLICE_INVESTIGATE_TRUE" &&
                                <>
                                    <div className="mb-1">
                                        <label>調查日期和時間</label>
                                        <DatePicker className="form-control" selected={date} dateFormat="yyyy/MM/dd  h:mm aa" showTimeSelect timeIntervals={15} onChange={setDate} />
                                    </div>
                                </>
                            }
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="policeInvestigate" id="police-investigate-false" value="POLICE_INVESTIGATE_FALSE" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="police-investigate-false">沒有</label>
                            </div>
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* (2) 住客失蹤以致需要報警求助 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>(2) 住客失蹤以致需要報警求助</label>
                        <div className="col">
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="residentMissing" id="resident-missing-inside" value="RESIDENT_MISSING_INSIDE" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="resident-missing-inside">住客擅自／在員工不知情下離開院舍</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="residentMissing" id="resident-missing-outside" value="RESIDENT_MISSING_OUTSIDE" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="resident-missing-outside">院外活動期間失蹤</label>
                            </div>
                            {
                                form.residentMissing === "RESIDENT_MISSING_OUTSIDE" &&
                                <div className="px-3">
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="residentMissingReason" id="resident-missing-reason-vacation" value="RESIDENT_MISSING_REASON_VACATION" onChange={radioButtonHandler} />
                                        <label className="form-check-label" htmlFor="resident-missing-reason-vacation">回家度假期間</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="residentMissingReason" id="resident-missing-reason-voluntarily" value="RESIDENT_MISSING_REASON_VOLUNTARILY" onChange={radioButtonHandler} />
                                        <label className="form-check-label" htmlFor="resident-missing-reason-voluntarily">自行外出活動</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="residentMissingReason" id="resident-missing-reason-home-out" value="RESIDENT_MISSING_REASON_HOME_OUT" onChange={radioButtonHandler} />
                                        <label className="form-check-label" htmlFor="resident-missing-reason-home-out">院舍外出活動</label>
                                    </div>
                                </div>
                            }

                            <div className="mb-1">
                                <label>報警日期</label>
                                <DatePicker className="form-control" selected={date} dateFormat="yyyy/MM/dd" onChange={setDate} />
                            </div>
                            <div>
                                <label>報警編號</label>
                                <AutosizeTextarea className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* (2) 住客失蹤以致需要報警求助 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>(2a)</label>
                        <div className="col">
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="residentMissingFound" id="resident-missing-found-true" value="RESIDENT_MISSING_FOUND_TRUE" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="resident-missing-found-true">已尋回</label>
                            </div>
                            {
                                form.residentMissingFound === "RESIDENT_MISSING_FOUND_TRUE" &&
                                <div>
                                    <label>尋回日期</label>
                                    <DatePicker className="form-control" selected={date} dateFormat="yyyy/MM/dd" onChange={setDate} />
                                </div>
                            }
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="residentMissingFound" id="resident-missing-found-false" value="RESIDENT_MISSING_FOUND_FALSE" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="resident-missing-found-false">仍未尋回</label>
                            </div>
                            {
                                form.residentMissingFound === "RESIDENT_MISSING_FOUND_FALSE" &&
                                <div className="d-flex">
                                    由失蹤日計起至呈報日，已失蹤
                                    <div className="input-group mb-3">
                                        <input type="number" className="form-control" min={0} />
                                        <div className="input-group-append">
                                            <span className="input-group-text" id="basic-addon2">日</span>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>


                    <div className="form-group row mb-2">
                        {/* (2b) 失蹤住客病歷 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>(2b) 失蹤住客病歷</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" placeholder="請註明" />
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* (3) 院舍內證實／懷疑有住客受虐待／被侵犯私隱 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>(3) 院舍內證實／懷疑有住客受虐待／被侵犯私隱</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="residentAbuse" id="resident-abuse-body" value="RESIDENT_ABUSE_BODY" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="resident-abuse-body">身體虐待</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="residentAbuse" id="resident-abuse-mental" value="RESIDENT_ABUSE_MENTAL" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="resident-abuse-mental">精神虐待</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="residentAbuse" id="resident-abuse-negligent" value="RESIDENT_ABUSE_NEGLIGENT" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="resident-abuse-negligent">疏忽照顧</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="residentAbuse" id="resident-abuse-embezzle-property" value="RESIDENT_ABUSE_EMBEZZLE_PROPERTY" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="resident-abuse-embezzle-property">侵吞財產</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="residentAbuse" id="resident-abuse-abandoned" value="RESIDENT_ABUSE_ABANDONED" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="resident-abuse-abandoned">遺棄</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="residentAbuse" id="resident-abuse-sexual-assault" value="RESIDENT_ABUSE_SEXUAL_ASSAULT" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="resident-abuse-sexual-assault">非禮／性侵犯</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" name="residentAbuse" id="resident-abuse-other" value="RESIDENT_ABUSE_OTHER" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="resident-abuse-other">其他</label>
                            </div>
                            {
                                form.residentAbuse.indexOf("RESIDENT_ABUSE_OTHER") > -1 &&
                                <AutosizeTextarea className="form-control" placeholder="請詿明" />
                            }
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* (3) 施虐者／懷疑施虐者的身份 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>(3a) 施虐者／懷疑施虐者的身份</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="residentAbuse" id="resident-abuse-body" value="RESIDENT_ABUSE_BODY" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="resident-abuse-body">員工</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="residentAbuse" id="resident-abuse-mental" value="RESIDENT_ABUSE_MENTAL" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="resident-abuse-mental">住客</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="residentAbuse" id="resident-abuse-negligent" value="RESIDENT_ABUSE_NEGLIGENT" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="resident-abuse-negligent">訪客</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" name="residentAbuse" id="resident-abuse-other" value="RESIDENT_ABUSE_OTHER" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="resident-abuse-other">其他</label>
                            </div>
                            {
                                form.residentAbuse.indexOf("RESIDENT_ABUSE_OTHER") > -1 &&
                                <AutosizeTextarea className="form-control" placeholder="請詿明" />
                            }
                        </div>
                    </div>
                </section>


            </div>
        </>
    )
}
