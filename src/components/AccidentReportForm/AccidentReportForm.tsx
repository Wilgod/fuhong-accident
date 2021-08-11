import * as React from 'react';
import { useState } from "react";
import { WebPartContext } from '@microsoft/sp-webpart-base';
import AutosizeTextarea from "../AutosizeTextarea/AutosizeTextarea";
import DatePicker from "react-datepicker";
import Header from "../Header/Header";
import "./AccidentReportForm.css";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
interface IAccidentFollowUpRepotFormProps {
    context: WebPartContext;
    styles: any;
    formType: string;

}

interface IAccidentFollowUpRepotFormStates {
    textarea: string;
    accidentalNature: string[];
    envFactor: string[];
    personalFactor: string[];
}

const formTypeParser = (formType: string, additonalString: string) => {
    switch (formType) {
        case "SERVICE_USER":
            return "服務使用者" + additonalString;
        case "OUTSIDERS":
            return "外界人士" + additonalString;
        default: return "";
    }
}

export default function AccidentFollowUpRepotForm({ context, styles, formType }: IAccidentFollowUpRepotFormProps) {
    const [date, setDate] = useState(new Date());
    const [form, setForm] = useState<IAccidentFollowUpRepotFormStates>({
        textarea: "",
        accidentalNature: [],
        envFactor: [],
        personalFactor: []
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

    return (
        <>
            <div className="mb-3">
                <Header displayName="服務使用者/外界人士意外報告(二)" />
            </div>
            <div className="container px-4">
                <section className="mb-3">
                    <div className="row">
                        <div className="col-12 font-weight-bold">
                            <h5>檔案編號</h5>
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* 服務單位 */}
                        <label className={`col-12 col-md-2 col-form-label fieldTitle`}>服務單位</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" readOnly />
                        </div>
                        {/* 保險公司備案偏號 */}
                        <label className={`col-12 col-md-2 col-form-label fieldTitle`}>保險公司備案偏號</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" readOnly />
                        </div>
                    </div>
                    <div className="form-group row">
                        {/* 保險公司備案偏號 */}
                        <label className={`col-12 col-md-2 col-form-label fieldTitle`}>檔案編號</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" readOnly />
                        </div>
                    </div>
                </section>

                <section className="mb-4">
                    <div className="row">
                        <div className="col-12 font-weight-bold">
                            <h5>{formTypeParser(formType, "資料")}</h5>
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        {/* 意外性質 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>意外性質</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control-plaintext" readOnly value={formTypeParser(formType, "意外")} />
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* 服務使用者姓名 (英文)*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>{formTypeParser(formType, "姓名 (英文)")}</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" readOnly />
                        </div>
                        {/* 服務使用者姓名 (中文)*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>{formTypeParser(formType, "姓名 (中文)")}</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" readOnly />
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* 年齡*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>年齡</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" readOnly />
                        </div>
                        {/* 性別*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>性別</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" readOnly />
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* 服務單位*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>服務單位</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" readOnly />
                        </div>
                        {/* 意外發生時間*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>意外發生日期</label>
                        <div className="col-12 col-md-4">
                            <DatePicker className="form-control" selected={date} dateFormat="yyyy/MM/dd" onChange={(date) => setDate(date)} readOnly={true} />
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* 意外發生日期*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>意外時間</label>
                        <div className="col-12 col-md-4">
                            {/* <input type="date"  /> */}
                            <DatePicker
                                className="form-control"
                                selected={date}
                                onChange={(date) => setDate(date)}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={1}
                                timeCaption="Time"
                                dateFormat="h:mm aa"
                                readOnly={true}
                            />
                        </div>
                        {/* 意外發生時間*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>收到「意外填報表」日期</label>
                        <div className="col-12 col-md-4">
                            <DatePicker className="form-control" selected={date} dateFormat="yyyy/MM/dd" onChange={(date) => setDate(date)} readOnly={true} />
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* 意外發生地點*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>預計意外分析完成日期<br />
                            <span>(意外發生日期 + 1個月)</span>
                        </label>
                        <div className="col-12 col-md-4">
                            <DatePicker className="form-control" selected={date} dateFormat="yyyy/MM/dd" onChange={(date) => setDate(date)} />
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* 意外性質*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>意外性質</label>
                        <div className="col">
                            <div className="form-check form-check-inline mr-0 mr-md-3">
                                <input className="form-check-input" type="checkbox" name="accidentalNature" id="ACCIDENTAL_NATURE_FALL" value="ACCIDENTAL_NATURE_FALL" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="ACCIDENTAL_NATURE_FALL">跌倒</label>
                            </div>
                            <div className="form-check form-check-inline mr-0 mr-md-3">
                                <input className="form-check-input" type="checkbox" name="accidentalNature" id="ACCIDENTAL_NATURE_CHOKING" value="ACCIDENTAL_NATURE_CHOKING" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="ACCIDENTAL_NATURE_CHOKING">哽塞</label>
                            </div>
                            <div className="form-check form-check-inline mr-0 mr-md-3">
                                <input className="form-check-input" type="checkbox" name="accidentalNature" id="ACCIDENTAL_NATURE_BEHAVIOR" value="ACCIDENTAL_NATURE_BEHAVIOR" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="ACCIDENTAL_NATURE_BEHAVIOR">服務使用者行為問題</label>
                            </div>
                            <div className="form-check form-check-inline  mr-0 mr-md-3">
                                <input className="form-check-input" type="checkbox" name="accidentalNature" id="ACCIDENTAL_NATURE_ENV_FACTOR" value="ACCIDENTAL_NATURE_ENV_FACTOR" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="ACCIDENTAL_NATURE_ENV_FACTOR">環境因素</label>
                            </div>
                            <div className="form-check mr-0 mr-md-3">
                                <input className="form-check-input" type="checkbox" name="accidentalNature" id="ACCIDENTAL_NATURE_OTHER" value="ACCIDENTAL_NATURE_OTHER" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="ACCIDENTAL_NATURE_OTHER">其他</label>
                            </div>
                            {
                                form.accidentalNature.indexOf("ACCIDENTAL_NATURE_OTHER") > -1 &&
                                <div className="">
                                    <AutosizeTextarea className="form-control" placeholder="請註明" />
                                </div>
                            }
                        </div>
                    </div>
                    {/* 意外成因 */}
                    <div className="form-group row mb-4">
                        {/* 環境因素 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>意外問題</label>
                        <div className="col">
                            <div>環境因素</div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="envFactor" id="ENV-SLIPPERY-GROUND" value="ENV_SLIPPERY_GROUND" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="ENV-SLIPPERY-GROUND">地面濕滑</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="envFactor" id="ENV-UNEVEN-GROUND" value="ENV_UNEVEN_GROUND" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="ENV-UNEVEN-GROUND">地面不平</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="envFactor" id="ENV-OBSTACLE-ITEMS" value="ENV_OBSTACLE_ITEMS" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="ENV-OBSTACLE-ITEMS">障礙物品</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="envFactor" id="ENV-INSUFFICIENT-LIGHT" value="ENV_INSUFFICIENT_LIGHT" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="ENV-INSUFFICIENT-LIGHT">光線不足</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="envFactor" id="ENV-NOT-ENOUGH-SPACE" value="ENV_NOT_ENOUGH_SPACE" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="ENV-NOT-ENOUGH-SPACE">空間不足</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="envFactor" id="ENV-ACOUSTIC-STIMULATION" value="ENV_ACOUSTIC_STIMULATION" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="ENV-ACOUSTIC-STIMULATION">聲響刺激</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="envFactor" id="ENV-COLLIDED-BY-OTHERS" value="ENV_COLLIDED_BY_OTHERS" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="ENV-COLLIDED-BY-OTHERS">被別人碰撞</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="envFactor" id="ENV-HURT-BY-OTHERS" value="ENV_HURT_BY_OTHERS" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="ENV-HURT-BY-OTHERS">被別人傷害</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="envFactor" id="ENV-IMPROPER-USE-OF-ASSISTIVE-EQUIPMENT" value="ENV_IMPROPER_USE_OF_ASSISTIVE_EQUIPMENT" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="ENV-IMPROPER-USE-OF-ASSISTIVE-EQUIPMENT">輔助器材使用不當 (如輪椅／便椅未上鎖)</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" name="envFactor" id="ENV-OTHER" value="ENV_OTHER" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="ENV-OTHER">其他</label>
                            </div>
                            {
                                form.envFactor.indexOf("ENV_OTHER") > -1 &&
                                <div className="">
                                    <AutosizeTextarea className="form-control" placeholder="請註明" />
                                </div>
                            }
                        </div>
                    </div>

                    <div className="form-group row mb-4">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>個人因素</label>
                        <div className="col">
                            <div>個人因素</div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="personalFactor" id="PERSONAL-EMOTIONAL-INSTABILITY" value="PERSONAL_EMOTIONAL_INSTABILITY" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="PERSONAL-EMOTIONAL-INSTABILITY">情緒不穩</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="personalFactor" id="PERSONAL-HEARTBROKEN" value="PERSONAL_HEARTBROKEN" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="PERSONAL-HEARTBROKEN">心急致傷</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="personalFactor" id="PERSONAL-CHOKING" value="PERSONAL_CHOKING" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="PERSONAL-CHOKING">進食時哽塞</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="personalFactor" id="PERSONAL-UNSTEADY-WALKING" value="PERSONAL_UNSTEADY_WALKING" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="PERSONAL-UNSTEADY-WALKING">步履不穩</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="personalFactor" id="PERSONAL-TWITCH" value="PERSONAL_TWITCH" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="PERSONAL-TWITCH">抽搐</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" name="personalFactor" id="PERSONAL-OTHER" value="PERSONAL_OTHER" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="PERSONAL-OTHER">其他個人因素</label>
                            </div>
                            {
                                form.personalFactor.indexOf("PERSONAL_OTHER") > -1 &&
                                <div className="">
                                    <AutosizeTextarea className="form-control" placeholder="請註明" />
                                </div>
                            }
                        </div>
                    </div>

                    <div className="form-group row mb-4">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>意外發現之經過</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" placeholder="請註明" />
                        </div>
                    </div>

                    <div className="form-group row mb-4">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>可能引致意外之因素</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" placeholder="請註明" />
                        </div>
                    </div>

                    <div className="form-group row mb-4">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>建議</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" placeholder="請註明" />
                        </div>
                    </div>


                    <div className="form-group row mb-2">
                        {/* 調查員姓名*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>調查員姓名</label>
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
                        {/* 職級*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>職級</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" readOnly />
                        </div>
                    </div>
                </section>

                <section className="mb-4">
                    <div className="row">
                        <div className="col-12 font-weight-bold">
                            <h5>高級物理治療師建議</h5>
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>高級物理治療師建議</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" placeholder="請註明" />
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        {/* 服務單位*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>高級物理治療師</label>
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
                        {/* 意外發生時間*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>意外發生日期</label>
                        <div className="col-12 col-md-4">
                            <DatePicker className="form-control" selected={date} dateFormat="yyyy/MM/dd" onChange={(date) => setDate(date)} readOnly={true} />
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}
