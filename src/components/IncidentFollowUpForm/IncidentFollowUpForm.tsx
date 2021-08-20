import * as React from 'react'
import { useState } from 'react'
import { WebPartContext } from '@microsoft/sp-webpart-base';
import Header from "../Header/Header";
import DatePicker from "react-datepicker";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import * as moment from 'moment';
import AutosizeTextarea from "../AutosizeTextarea/AutosizeTextarea";

interface IIncidentFollowUpFormProps {
    context: WebPartContext;
    styles: any;
    formType: string;
}

interface IIncidentFollowUpFormStates {

}

const formTypeParser = (formType: string, additonalString: string) => {
    switch (formType) {
        case "OTHER_INCIDENT": return "其他事故" + additonalString;
        case "SPECIAL_INCIDENT_REPORT_LICENSE": return "特別事故(牌照事務處)" + additonalString;
        case "SPECIAL_INCIDENT_REPORT_ALLOWANCE": return "特別事故(津貼科)" + additonalString;
        default: return "";
    }
}

export default function IncidentFollowUpForm({ context, styles, formType }: IIncidentFollowUpFormProps) {
    const [form, setForm] = useState<IIncidentFollowUpFormStates>();
    const radioButtonHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setForm({ ...form, [name]: value });
    }
    return (
        <>
            <div className="mb-3">
                <Header displayName="事故跟進/結束報告" />
            </div>
            <div className="container px-4">
                <section className="mb-3">
                    {/* <div className="row">
                        <div className="col-12 font-weight-bold">
                            <h5>報告資料</h5>
                        </div>
                    </div> */}
                    <div className="form-group row mb-2">
                        {/* 事故性質 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>事故性質</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" readOnly value={formTypeParser(formType, "")} />
                        </div>
                        {/* 單位名稱 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>單位名稱</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" readOnly />
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>事故發生日期及時間</label>
                        <div className="col-12 col-md-4">
                            <DatePicker
                                className="form-control"
                                selected={new Date()}
                                timeInputLabel="Time:"
                                dateFormat="yyyy/MM/dd h:mm aa"
                                showTimeInput
                                readOnly
                            />
                        </div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>檔案編號</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" readOnly />
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>保險公司備案編號</label>
                        <div className="col">
                            <input type="text" className="form-control" />
                        </div>
                    </div>
                </section>

                <section className="mb-3">
                    <div className="row">
                        <div className="col-12 font-weight-bold">
                            <h5>事故跟進行動表</h5>
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        {/* 事故性質 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>跟進措施</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" placeholder="請註明" />
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* 執行時段 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>執行時段</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" placeholder="請註明" />
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* 備註 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>備註</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" placeholder="請註明" />
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* 意外跟進 */}

                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>意外跟進</label>
                        <div className="col-12 col-md-4">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="accidentFollowUp" id="accident-follow-up-true" value="ACCIDENT_FOLLOW_UP_TRUE" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="accident-follow-up-true">是</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="accidentFollowUp" id="accident-follow-up-false" value="ACCIDENT_FOLLOW_UP_FALSE" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="accident-follow-up-false">否</label>
                            </div>
                            {/* <select className="form-control">
                                <option>請選擇</option>
                                <option>繼續</option>
                                <option>結束</option>
                            </select> */}
                        </div>
                    </div>
                </section>

                <hr className="my-3" />

                <section className="mb-3">
                    <div className="row">
                        <div className="col-12 font-weight-bold mb-2">
                            <span>[此欄由高級服務經理/服務經理姓名填寫]</span>
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>高級服務經理/服務經理姓名</label>
                        <div className="col-12 col-md-4">
                            <PeoplePicker
                                context={context}
                                personSelectionLimit={1}
                                showtooltip={false}
                                principalTypes={[PrincipalType.User]}
                                resolveDelay={1000} />
                            {/* <input type="text" className="form-control" /> */}
                        </div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>日期</label>
                        <div className="col-12 col-md-4">
                            <DatePicker
                                className="form-control"
                                selected={new Date()}
                                dateFormat="yyyy/MM/dd"
                            />
                        </div>
                    </div>

                </section>

                <hr className="my-3" />


                <section className="mb-3">
                    <div className="row">
                        <div className="col-12 font-weight-bold mb-2">
                            <span>[此欄由服務總監填寫]</span>
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>服務總監</label>
                        <div className="col-12 col-md-4">
                            <PeoplePicker
                                context={context}
                                personSelectionLimit={1}
                                showtooltip={false}
                                principalTypes={[PrincipalType.User]}
                                resolveDelay={1000} />
                            {/* <input type="text" className="form-control" /> */}
                        </div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>日期</label>
                        <div className="col-12 col-md-4">
                            <DatePicker
                                className="form-control"
                                selected={new Date()}
                                dateFormat="yyyy/MM/dd"
                            />
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>評語</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" />
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        <div className="col-12">
                            <div className="d-flex justify-content-center">
                                <button className="btn btn-warning mr-3">批准</button>
                                <button className="btn btn-danger mr-3">拒絕</button>
                            </div>
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
