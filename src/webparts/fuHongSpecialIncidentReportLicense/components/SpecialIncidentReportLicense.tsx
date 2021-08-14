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
    abuser: string;
    referrals: string;
    residentAbusePolice: string;
    disputePolice: string;
    seriousMedicalIncident: string;
    otherSeriousIncident: string;
    otherIncident: string;
    tenantGender: string;
    notified: String;
}

export default function SpecialIncidentReportLicense({ context, styles }: ISpecialIncidentReportLicenseProps) {
    const [form, setForm] = useState<ISpecialIncidentReportLicenseStates>({
        unusalIncident: "",
        police: "",
        policeInvestigate: "",
        residentMissing: "",
        residentMissingReason: "",
        residentMissingFound: "",
        residentAbuse: [],
        abuser: "",
        referrals: "",
        residentAbusePolice: "",
        disputePolice: "",
        seriousMedicalIncident: "",
        otherSeriousIncident: "",
        otherIncident: "",
        tenantGender: "",
        notified: ""
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
                <Header displayName="殘疾人士院舍特別事故報告" />
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
                                <input className="form-check-input " type="radio" name="unusalIncident" id="unusal-incident-general" value="UNUSAL_INCIDENT_GENERAL" onChange={radioButtonHandler} />
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
                                        <label>報案編號</label>
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
                                <label className="form-check-label" htmlFor="resident-abuse-other">其他 (請註明)</label>
                            </div>
                            {
                                form.residentAbuse.indexOf("RESIDENT_ABUSE_OTHER") > -1 &&
                                <AutosizeTextarea className="form-control" placeholder="請註明" />
                            }
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* (3a) 施虐者／懷疑施虐者的身份 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>(3a) 施虐者／懷疑施虐者的身份</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="abuser" id="abuser-staff" value="ABUSER_STAFF" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="abuser-staff">員工</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="abuser" id="abuser-tenant" value="ABUSER_TENANT" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="abuser-tenant">住客</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="abuser" id="abuser-guest" value="ABUSER_GUEST" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="abuser-guest">訪客</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="abuser" id="abuser-other" value="ABUSER_OTHER" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="abuser-other">其他 (請註明)</label>
                            </div>
                            {
                                form.abuser === "ABUSER_OTHER" &&
                                <AutosizeTextarea className="form-control" placeholder="請註明" />
                            }
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* (3b)*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>(3b)</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="referrals" id="referrals-true" value="REFERRALS_TRUE" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="referrals-true">已轉介社工</label>
                            </div>

                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="referrals" id="referrals-false" value="REFERRALS_FALSE" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="referrals-false">沒有轉介社工</label>
                            </div>
                            {
                                form.referrals === "REFERRALS_TRUE" &&
                                <>
                                    <div className="">
                                        <label>轉介日期</label>
                                        <DatePicker className="form-control" selected={date} dateFormat="yyyy/MM/dd" onChange={setDate} />
                                    </div>
                                    <div className="">
                                        <label>服務單位</label>
                                        <input type="text" className="form-control" />
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        {/* (3c)*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>(3c)</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="residentAbusePolice" id="resident-abuse-police-true" value="RESIDENT_ABUSE_POLICE_TRUE" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="resident-abuse-police-true">已報警求助</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="residentAbusePolice" id="resident-abuse-police-false" value="RESIDENT_ABUSE_POLICE_FALSE" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="resident-abuse-police-false">沒有報警求助</label>
                            </div>
                            {
                                form.residentAbusePolice === "RESIDENT_ABUSE_POLICE_TRUE" &&
                                <>
                                    <div className="mb-1">
                                        <label>報警日期</label>
                                        <DatePicker className="form-control" selected={date} dateFormat="yyyy/MM/dd" onChange={setDate} />
                                    </div>
                                    <div>
                                        <label>報案編號</label>
                                        <AutosizeTextarea className="form-control" />
                                    </div>
                                </>
                            }
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* (4) 院舍內有爭執事件以致需要報警求助 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>(4) 院舍內有爭執事件以致需要報警求助</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="disputePolice" id="dispute-police-tenant-and-tenant" value="DISPUTE_POLICE_TENANT_AND_TENANT" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="dispute-police-tenant-and-tenant">住客與住客</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="disputePolice" id="dispute-police-tenant-and-staff" value="DISPUTE_POLICE_TENANT_AND_STAFF" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="dispute-police-tenant-and-staff">住客與員工</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="disputePolice" id="dispute-police-tenant-and-guest" value="DISPUTE_POLICE_TENANT_AND_GUEST" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="dispute-police-tenant-and-guest">住客與訪客</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="disputePolice" id="dispute-police-staff-and-staff" value="DISPUTE_POLICE_STAFF_AND_STAFF" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="dispute-police-staff-and-staff">員工與員工</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="disputePolice" id="dispute-police-staff-and-guest" value="DISPUTE_POLICE_STAFF_AND_GUEST" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="dispute-police-staff-and-guest">員工與訪客</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="disputePolice" id="dispute-police-guest-and-guest" value="DISPUTE_POLICE_GUEST_AND_GUEST" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="dispute-police-guest-and-guest">訪客與訪客</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="disputePolice" id="dispute-police-other" value="DISPUTE_POLICE_OTHER" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="dispute-police-other">其他 (請註明)</label>
                            </div>
                            {
                                form.disputePolice === "DISPUTE_POLICE_OTHER" &&
                                <div className="">
                                    <AutosizeTextarea placeholder="請註明" className="form-control" />
                                </div>
                            }
                            <div className="mb-1">
                                <label>報警日期</label>
                                <DatePicker className="form-control" selected={date} dateFormat="yyyy/MM/dd" onChange={setDate} />
                            </div>
                            <div>
                                <label>報案編號</label>
                                <AutosizeTextarea className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* (5) 嚴重醫療／藥物事故（須同時提交「藥物風險管理報告」） */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>(5) 嚴重醫療／藥物事故（須同時提交「藥物風險管理報告」）</label>
                        <div className="col">
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="seriousMedicalIncident" id="serious-medical-incident-mistake" value="SERIOUS_MEDICAL_INCIDENT_MISTAKE" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="serious-medical-incident-mistake">住客誤服藥物引致入院接受檢查或治療</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="seriousMedicalIncident" id="serious-medical-incident-over-or-missed" value="SERIOUS_MEDICAL_INCIDENT_OVER_OR_MISSED" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="serious-medical-incident-over-or-missed">住客漏服或多服藥物引致入院接受檢查或治療</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="seriousMedicalIncident" id="serious-medical-incident-counter-drug" value="SERIOUS_MEDICAL_INCIDENT_COUNTER_DRUG" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="serious-medical-incident-counter-drug">住客服用成藥或非處方藥物引致入院接受檢查或治療</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="seriousMedicalIncident" id="serious-medical-incident-other" value="SERIOUS_MEDICAL_INCIDENT_OTHER" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="serious-medical-incident-other">其他 (請註明)</label>
                            </div>
                            {
                                form.seriousMedicalIncident === "SERIOUS_MEDICAL_INCIDENT_OTHER" &&
                                <div className="">
                                    <AutosizeTextarea placeholder="請註明" className="form-control" />
                                </div>
                            }
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* (6) 其他重大特別事故以致影響院舍日常運作 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>(6) 其他重大特別事故以致影響院舍日常運作</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="otherSeriousIncident" id="other-incident-power-supply" value="OTHER_INCIDENT_POWER_SUPPLY" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="other-incident-power-supply">停止電力供應</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="otherSeriousIncident" id="other-incident-building" value="OTHER_INCIDENT_BUILDING" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="other-incident-building">樓宇破損或結構問題</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="otherSeriousIncident" id="other-incident-fire" value="OTHER_INCIDENT_FIRE" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="other-incident-fire">火警</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="otherSeriousIncident" id="other-incident-water-supply" value="OTHER_INCIDENT_WATER_SUPPLY" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="other-incident-water-supply">停止食水供應</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="otherSeriousIncident" id="other-incident-other" value="OTHER_INCIDENT_OTHER" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="other-incident-other">水浸／山泥傾瀉／其他天災意外</label>
                            </div>
                            {
                                form.otherSeriousIncident === "SERIOUS_MEDICAL_INCIDENT_OTHER" &&
                                <div className="">
                                    <AutosizeTextarea placeholder="請註明" className="form-control" />
                                </div>
                            }
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* (7) 其他 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>(7) 其他</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="otherIncident" id="other-incident-true" value="OTHER_INCIDENT_TRUE" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="other-incident-true">是</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="otherIncident" id="other-incident-false" value="OTHER_INCIDENT_FALSE" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="other-incident-false">否</label>
                            </div>
                            {
                                form.otherIncident === "OTHER_INCIDENT_TRUE" &&
                                <AutosizeTextarea placeholder="請註明" className="form-control" />
                            }
                        </div>
                    </div>
                </section>
                <section className="mb-4">
                    <div className="row">
                        <div className="col-12 font-weight-bold">
                            <h5>住客及家屬情況</h5>
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        {/* 住客姓名 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>住客姓名</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                        {/* 年齡 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>年齡</label>
                        <div className="col-12 col-md-4">
                            <input type="number" className="form-control" min={0} />
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        {/* 住客性別 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>性別</label>
                        <div className="col-12 col-md-4">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="tenantGender" id="tenant-gender-male" value="TENANT_GENDER_MALE" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="tenant-gender-male">男</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="tenantGender" id="tenant-gender-female" value="TENANT_GENDER_FEMALE" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="tenant-gender-female">女</label>
                            </div>
                        </div>
                        {/* 年齡 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>房及床號</label>
                        <div className="col-12 col-md-4">
                            <input type="number" className="form-control" />
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        <div className="col">
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="notified" id="notified-true" value="NOTIFIED_TRUE" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="notified-true">已通知住客監護人／保證人／家人／親屬</label>
                            </div>
                            {
                                form.notified === "NOTIFIED_TRUE" &&
                                <>
                                    <div className="row my-2">
                                        {/* 姓名 */}
                                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>姓名</label>
                                        <div className="col-12 col-md-4">
                                            <input type="text" className="form-control" />
                                        </div>
                                        {/* 年齡 */}
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
                                <label className="form-check-label" htmlFor="notified-false">沒有通知住客監護人／保證人／家人／親屬</label>
                            </div>
                            {
                                form.notified === "NOTIFIED_FALSE" &&
                                <>
                                    <label>原因:</label>
                                    <AutosizeTextarea className="form-control" placeholder="請註明" />
                                </>
                            }
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>填報人姓名</label>
                        <div className="col-12 col-md-4">
                            <PeoplePicker
                                context={context}
                                personSelectionLimit={1}
                                showtooltip={false}
                                principalTypes={[PrincipalType.User]}
                                resolveDelay={1000} />
                        </div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>填報人職位</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>填報日期</label>
                        <div className="col-12 col-md-4">
                            <DatePicker
                                className="form-control"
                                selected={date}
                                onChange={(date) => setDate(date)}
                                dateFormat="yyyy/MM/dd"
                            />
                        </div>
                    </div>
                </section>

                <section className="mb-4">
                    <div className="row">
                        <div className="col-12 font-weight-bold">
                            <h5>殘疾人士院舍特別事故報告 (附頁)</h5>
                        </div>
                    </div>
                    <div className="row mt-3 mb-2">
                        <div className="col-12">
                            <span>(此附頁／載有相關資料的自訂報告須連同首兩頁的表格一併呈交)</span>
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>殘疾人士院舍名稱</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>事故發生日期和時間</label>
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
                    <div className="form-group row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>受影響住客姓名</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>身份證號碼</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        {/* 住客性別 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>性別</label>
                        <div className="col-12 col-md-4">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="tenantGender" id="tenant-gender-male" value="TENANT_GENDER_MALE" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="tenant-gender-male">男</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="tenantGender" id="tenant-gender-female" value="TENANT_GENDER_FEMALE" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="tenant-gender-female">女</label>
                            </div>
                        </div>
                        {/* 年齡 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>年齡</label>
                        <div className="col-12 col-md-4">
                            <input type="number" className="form-control" />
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        {/* 住客病歷 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>住客病歷</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" placeholder="請註明" />
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        {/* 特別事故詳情／發生經過 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>特別事故詳情／發生經過</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" placeholder="請註明" />
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        {/* 院舍跟進行動／預防事故再次發生的建議或措施 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>院舍跟進行動／預防事故再次發生的建議或措施</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" placeholder="請註明" />
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        {/* 填報人姓名 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>填報人姓名</label>
                        <div className="col-12 col-md-4">
                            <PeoplePicker
                                context={context}
                                personSelectionLimit={1}
                                showtooltip={false}
                                principalTypes={[PrincipalType.User]}
                                resolveDelay={1000} />
                        </div>
                        {/* 職位 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>職位</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>填報人姓名</label>
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

                <hr className="my-3" />

                <section className="py-3">
                    <div className="d-flex justify-content-center" style={{ gap: 10 }}>
                        <button className="btn btn-warning">提交</button>
                        <button className="btn btn-success">草稿</button>
                        <button className="btn btn-secondary">取消</button>
                    </div>
                </section>
            </div>
        </>
    )
}
