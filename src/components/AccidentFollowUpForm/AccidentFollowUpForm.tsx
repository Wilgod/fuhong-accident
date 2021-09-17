import * as React from 'react'
import { useState } from 'react'
import { WebPartContext } from '@microsoft/sp-webpart-base';
import Header from "../Header/Header";
import DatePicker from "react-datepicker";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import * as moment from 'moment';
import "./AccidentFollowUpForm.css";
import AutosizeTextarea from "../AutosizeTextarea/AutosizeTextarea";
import { IAccidentFollowUpFormStates, IAccidentFollowUpFormProps } from './IAccidentFollowUpForm';
import useUserInfoAD from '../../hooks/useUserInfoAD';
const formTypeParser = (formType: string, additonalString: string) => {
    switch (formType) {
        case "SERVICE_USER":
            return "服務使用者" + additonalString;
        case "OUTSIDERS":
            return "外界人士" + additonalString;
        default: return "";
    }
}

export default function AccidentFollowUpForm({ context, formType, styles, currentUserRole }: IAccidentFollowUpFormProps) {
    const [smDate, setSmDate] = useState(new Date()); // 高級服務經理
    const [sdDate, setSdDate] = useState(new Date()); // 服務總監
    const [sptDate, setSptDate] = useState(new Date()); // 高級物理治療師
    const [smAD, setSmPicker, smPicker] = useUserInfoAD();// 高級服務經理
    const [sptAD, setSptPicker, sptPicker] = useUserInfoAD();// 高級物理治療師
    const [sdAD, setSdPicker, sdPicker] = useUserInfoAD();// 服務總監
    const [form, setForm] = useState<IAccidentFollowUpFormStates>({
        accidentalFollowUpContinue: "",
        executionPeriod: "",
        followUpMeasures: "",
        remark: "",
        sdComment: "",
        sptComment: ""
    });

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

    const dataFactory = () => {

        let body = {};
        let error = {};

        body["FormType"] = formType;

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

    const submitHandler = (event) => {

        //Implement
    }

    const draftHandler = (event) => {
        // Implement
    }

    const cancelHandler = (event) => {
        //Implement
    }

    const approveHandler = () => {
        //Implement
    }

    const rejectHnadler = () => {
        //Implement
    }

    return (
        <>
            <div className="mb-3">
                <Header displayName="意外跟進/結束表(三)" />
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
                            <input type="text" className="form-control" readOnly />
                        </div>
                        {/* 保險公司備案編號 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>保險公司備案編號</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" readOnly />
                        </div>
                    </div>
                    <div className="form-row">
                        {/* 保險公司備案編號 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>檔案編號</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" readOnly />
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
                            <input type="text" className="form-control" readOnly />
                        </div>
                    </div>
                    <div className="form-row">
                        {/* 發生意外日期 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>發生意外日期</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" readOnly />
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
                            <AutosizeTextarea className="form-control" name="followUpMeasures" onChange={textFieldHandler} value={form.followUpMeasures} />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/* 執行時段 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>執行時段</label>
                        <div className="col">
                            <input type="text" className="form-control" name="executionPeriod" onChange={textFieldHandler} />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/* 備註 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>備註</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" name="remark" onChange={textFieldHandler} value={form.remark} />
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        {/* 意外跟進 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>意外跟進</label>
                        <div className="col-12 col-md-4">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="accidentalFollowUpContinue" id="accident-follow-up-true" value="ACCIDENT_FOLLOW_UP_TRUE" onChange={radioButtonHandler} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="accident-follow-up-true">繼續</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="accidentalFollowUpContinue" id="accident-follow-up-false" value="ACCIDENT_FOLLOW_UP_FALSE" onChange={radioButtonHandler} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="accident-follow-up-false">結束</label>
                            </div>
                            {/* <select className="form-control">
                                <option>請選擇</option>
                                <option>繼續</option>
                                <option>結束</option>
                            </select> */}
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        {/* 服務經理姓名 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>高級服務經理/<span className="d-sm-inline d-md-block">服務經理姓名</span></label>
                        <div className="col-12 col-md-4">
                            <PeoplePicker
                                context={context}
                                personSelectionLimit={1}
                                showtooltip={false}
                                principalTypes={[PrincipalType.User]}
                                resolveDelay={1000}
                                selectedItems={setSmPicker}
                                defaultSelectedUsers={smAD && [smAD.mail]}
                            />
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
                            <PeoplePicker
                                context={context}
                                personSelectionLimit={1}
                                showtooltip={false}
                                principalTypes={[PrincipalType.User]}
                                resolveDelay={1000}
                                selectedItems={setSptPicker}
                                defaultSelectedUsers={sptAD && [sptAD.mail]}
                            />
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
                            <AutosizeTextarea className="form-control" name="sptComment" onChange={textFieldHandler} value={form.sptComment} />
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
                            <PeoplePicker
                                context={context}
                                personSelectionLimit={1}
                                showtooltip={false}
                                principalTypes={[PrincipalType.User]}
                                resolveDelay={1000}
                                ensureUser={true}
                                selectedItems={setSdPicker}
                                defaultSelectedUsers={sdAD && [sdAD.mail]}
                            />
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
                            <AutosizeTextarea className="form-control" name="sdComment" onChange={textFieldHandler} value={form.sdComment} />
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
                        <button className="btn btn-warning" onClick={(event => submitHandler(event))}>提交</button>
                        <button className="btn btn-success" onClick={(event => draftHandler(event))}>草稿</button>
                        <button className="btn btn-secondary" onClick={(event => cancelHandler(event))}>取消</button>
                    </div>
                </section>
            </div>
        </>
    )
}
