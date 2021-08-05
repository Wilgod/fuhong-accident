import * as React from 'react'
import { useState } from 'react';
import DatePicker from "react-datepicker";
import Header from "../../../components/Header/Header";
import "react-datepicker/dist/react-datepicker.css";
import "./custom.css";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as moment from 'moment';
import StyledDropzone from "../../../components/Dropzone/Dropzone";


if (document.getElementById('workbenchPageContent') != null) {
    document.getElementById('workbenchPageContent').style.maxWidth = '1920px';
}

if (document.querySelector('.CanvasZone') != null) {
    (document.querySelector('.CanvasZone') as HTMLElement).style.maxWidth = '1920px';
}


interface IOutsidersAccidentForm {
    context: WebPartContext;
}

interface IState {
    envFactor: string[];
    witness: string;
    police: string;
    familyContact: string;
    arrangement: string;
    photo: string;
    cctv: string;
}

export default function OutsidersAccidentForm({ context }: IOutsidersAccidentForm) {
    const [date, setDate] = useState(new Date());
    const [form, setForm] = useState<IState>({
        envFactor: [],
        witness: "",
        police: "",
        familyContact: "",
        arrangement: "",
        photo: "",
        cctv: ""
    });

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
                <Header displayName="外界人士意外填報表(一)" />
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
                        <label className="col-12 col-md-2 col-form-label">服務單位</label>
                        <div className="col-12 col-md-4">
                            <select className="form-control">
                                <option>請選擇服務單位</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group row ">
                        {/* 保險公司備案偏號 */}
                        <label className="col-12 col-md-2 col-form-label">保險公司備案偏號</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                    </div>
                </section>

                <section className="mb-3">
                    <div className="form-group row mb-2">
                        {/* 服務使用者姓名 (中文)*/}
                        <label className="col-12 col-md-2 col-form-label">姓名 (中文)</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                        {/* 服務使用者姓名 (英文)*/}
                        <label className="col-12 col-md-2 col-form-label">姓名 (英文)</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* 年齡*/}
                        <label className="col-12 col-md-2 col-form-label">年齡</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                        {/* 性別*/}
                        <label className="col-12 col-md-2 col-form-label">性別</label>
                        <div className="col-12 col-md-4 d-flex align-items-center">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="patientGender" id="gender-male" value="male" />
                                <label className="form-check-label" htmlFor="gender-male">男</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="patientGender" id="gender-female" value="female" />
                                <label className="form-check-label" htmlFor="gender-female">女</label>
                            </div>
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* 身份*/}
                        <label className="col-12 col-md-2 col-form-label">身份</label>
                        <div className="col-12 col-md-4">
                            <select className="form-control" >
                                <option>請選擇</option>
                                <option>訪客</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* 意外發生日期*/}
                        <label className="col-12 col-md-2 col-form-label">意外發生日期</label>
                        <div className="col-12 col-md-4">
                            {/* <input type="date"  /> */}
                            <DatePicker className="form-control" selected={date} onChange={(date) => setDate(date)} />
                        </div>
                        {/* 意外發生時間*/}
                        <label className="col-12 col-md-2 col-form-label">意外發生日期</label>
                        <div className="col-12 col-md-4">
                            {/* <input type="time" className="form-control" /> */}
                            <DatePicker
                                className="form-control"
                                selected={date}
                                onChange={(date) => setDate(date)}
                                showTimeSelect
                                showTimeSelectOnly
                                timeCaption="Time"
                                dateFormat="h:mm aa"
                            />
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* 地點 */}
                        <label className="col-12 col-md-2 col-form-label">地點</label>
                        <div className="col">
                            <textarea className="form-control" />
                        </div>
                    </div>
                </section>

                <section className="mb-3">
                    <div className="row">
                        <div className="col-12 font-weight-bold">
                            <h5>意外事件紀錄</h5>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 font-weight-bold">
                            <h6>初步觀察的意外成因</h6>
                        </div>
                    </div>
                    <div className="pl-3">
                        <div className="form-group row mb-4">
                            {/* 環境因素 */}
                            <label className="col-12 col-md-2 col-form-label">環境因素</label>
                            <div className="col">
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
                                        <textarea className="form-control" placeholder="請註明" />
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="form-group row mb-4">
                            {/* 其他因素 */}
                            <label className="col-12 col-md-2 col-form-label">其他因素</label>
                            <div className="col">
                                <textarea className="form-control" />
                            </div>
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        {/* 事發過程 */}
                        <label className="col-12 col-md-2 col-form-label">事發過程</label>
                        <div className="col">
                            <textarea className="form-control" />
                        </div>
                    </div>

                    <div className="form-group row mb-4">
                        {/* 意外事件有否證人證人目擊事故發生經過? */}
                        <label className="col-12 col-md-2 col-form-label">意外事件有否證人證人目擊事故發生經過?</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="witness" id="witness-true" value="witness-true" onClick={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="witness-true">有</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="witness" id="witness-false" value="witness-false" onClick={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="witness-false">沒有</label>
                            </div>
                            {
                                form.witness === "witness-true" &&
                                <>
                                    <div>
                                        <label className="form-label">證人姓名</label>
                                        <input type="text" className="form-control" />
                                    </div>
                                    <div>
                                        <label className="form-label">聯絡電話</label>
                                        <input type="text" className="form-control" />
                                    </div>
                                </>
                            }
                        </div>
                    </div>

                    <div className="form-group row mb-4">
                        {/* 相片及CCTV紀錄*/}
                        <label className="col-12 col-md-2 col-form-label">相片及CCTV紀錄</label>
                        <div className="col">
                            <div>相片</div>
                            <div className="pl-2">
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="photo" id="photo-true" value="PHOTO_TRUE" onClick={radioButtonHandler} />
                                    <label className="form-check-label" htmlFor="photo-true">有 (上載照片)</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="photo" id="photo-false" value="PHOTO_FALSE" onClick={radioButtonHandler} />
                                    <label className="form-check-label" htmlFor="photo-flase">未能提供</label>
                                </div>
                                {
                                    form.photo === "PHOTO_TRUE" &&
                                    <StyledDropzone />
                                }
                            </div>
                            <div>CCTV記錄</div>
                            <div className="pl-2">
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="cctv" id="cctv-true" value="CCTV_TRUE" onClick={radioButtonHandler} />
                                    <label className="form-check-label" htmlFor="cctv-true">有 (註: 三個工作天交總辦事處)</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="cctv" id="cctv-false" value="CCTV_FALSE" onClick={radioButtonHandler} />
                                    <label className="form-check-label" htmlFor="cctv-false">未能提供</label>
                                </div>
                                {
                                    form.cctv === "CCTV_TRUE" &&
                                    <DatePicker className="form-control" selected={date} onChange={(date) => setDate(date)} />
                                }
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mb-3">
                    <div className="row">
                        <div className="col-12 font-weight-bold">
                            <h5>意外事件後之處理</h5>
                        </div>
                    </div>
                    <div className="form-group row mb-4">
                        {/* 就診安排*/}
                        <label className="col-12 col-md-2 col-form-label">就診安排</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="arrangement" id="ARRANGEMENT_DOCTOR_VISIT" value="ARRANGEMENT_DOCTOR_VISIT" onClick={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="ARRANGEMENT_DOCTOR_VISIT">醫生到診</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="arrangement" id="ARRANGEMENT_OUTPATIENT" value="ARRANGEMENT_OUTPATIENT" onClick={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="ARRANGEMENT_OUTPATIENT">門診</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="arrangement" id="ARRANGEMENT_EMERGENCY_DEPARTMENT" value="ARRANGEMENT_EMERGENCY_DEPARTMENT" onClick={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="ARRANGEMENT_EMERGENCY_DEPARTMENT">急症室</label>
                            </div>
                            {
                                form.arrangement === "ARRANGEMENT_EMERGENCY_DEPARTMENT" &&
                                <>
                                    <div className="">
                                        <label className="form-label">醫院名稱</label>
                                        <input type="text" className="form-control" />
                                    </div>
                                    <div className="">
                                        <label className="form-label">到達時間</label>
                                        {/* <input className="form-control" type="time" /> */}
                                        <DatePicker className="form-control" selected={date} onChange={(date) => setDate(date)} />
                                    </div>
                                    <div className="">
                                        <label className="form-label">提供對服務使用者的治療</label>
                                        <textarea className="form-control" />
                                    </div>
                                </>
                            }

                        </div>
                    </div>

                    <div className="form-group row mb-4">
                        <label className="col-12 col-md-2 col-form-label">報警處理</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="police" id="police-true" value="police-true" onClick={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="police-true">有</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="police" id="police-false" value="police-false" onClick={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="police-false">沒有</label>
                            </div>
                            {
                                form.police === "police-true" &&
                                <>
                                    <div>
                                        <label className="form-label">日期及時間</label>
                                        <DatePicker
                                            className="form-control"
                                            selected={date}
                                            onChange={(date) => setDate(date)}
                                            timeInputLabel="Time:"
                                            dateFormat="MM/dd/yyyy h:mm aa"
                                            showTimeInput
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">警署名稱</label>
                                        <input type="text" className="form-control" />
                                    </div>
                                </>
                            }
                        </div>
                    </div>

                    <div className="form-group row mb-4">
                        <label className="col-12 col-md-2 col-form-label">家屬聯絡</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="familyContact" id="family-true" value="family-true" onClick={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="family-true">有</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="familyContact" id="family-false" value="family-false" onClick={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="family-false">沒有</label>
                            </div>
                            {
                                form.familyContact === "family-true" &&
                                <>
                                    <div>
                                        <label className="form-label">通知家屬日期及時間</label>
                                        <DatePicker
                                            className="form-control"
                                            selected={date}
                                            onChange={(date) => setDate(date)}
                                            timeInputLabel="Time:"
                                            dateFormat="MM/dd/yyyy h:mm aa"
                                            showTimeInput
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">與傷者關係</label>
                                        <input type="text" className="form-control" />
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                </section>

                <hr className="my-3" />

                <section className="mb-4">
                    <div className="form-group row mb-2">
                        {/* 填報人姓名 */}
                        <label className="col-12 col-md-2 col-form-label">填報人姓名</label>
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
                        {/* 職級 */}
                        <label className="col-12 col-md-2 col-form-label">日期</label>
                        <div className="col-12 col-md-4">
                            <DatePicker className="form-control" selected={date} onChange={(date) => setDate(date)} />
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        <label className="col-12 col-md-2 col-form-label">職級</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                    </div>
                </section>

                <hr className="my-3" />

                <section className="mb-4">
                    <div className="form-group row mb-2">
                        {/* 服務經理姓名 */}
                        <label className="col-12 col-md-2 col-form-label">服務經理姓名</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                        <label className="col-12 col-md-2 col-form-label">日期</label>
                        <div className="col-12 col-md-4">
                            <DatePicker className="form-control" selected={date} onChange={(date) => setDate(date)} />
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        <label className="col-12 col-md-2 col-form-label">服務經理評語</label>
                        <div className="col">
                            <textarea className="form-control" />
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        <div className="col-12">
                            <button className="btn btn-warning mr-3">批准</button>
                            <button className="btn btn-danger mr-3">拒絕</button>
                        </div>
                    </div>
                </section>

                <hr className="my-3" />

                <section className="mb-4">
                    <div className="form-group row mb-2">
                        {/* SD */}
                        <label className="col-12 col-md-2 col-form-label">SD姓名</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        <label className="col-12 col-md-2 col-form-label">SD評語</label>
                        <div className="col">
                            <textarea className="form-control" />
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        <div className="col-12">
                            <button className="btn btn-primary">儲存評語</button>
                        </div>
                    </div>
                </section>

                <hr className="my-3" />

                <section className="mb-4">
                    <div className="form-group row mb-2">
                        {/* SD */}
                        <label className="col-12 col-md-2 col-form-label">SPT姓名</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                        <label className="col-12 col-md-2 col-form-label">指派調查員</label>
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
                    </div>
                    <div className="form-group row mb-2">
                        <label className="col-12 col-md-2 col-form-label">SPT評語</label>
                        <div className="col">
                            <textarea className="form-control" />
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        <div className="col-12">
                            <button className="btn btn-warning mr-3">批准</button>
                            <button className="btn btn-danger mr-3">拒絕</button>
                        </div>
                    </div>
                </section>

                <hr className="my-3" />

                <section className="mb-3">
                    <div className="row">
                        <div className="col-12 font-weight-bold">
                            <span>[此欄由高級物理治療師填寫]</span>
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* 「意外報告 (二)」交由 */}
                        <label className="col-12 col-md-2 col-form-label">「意外報告 (二)」交由</label>
                        <div className="col-12 col-md-4">
                            <PeoplePicker
                                context={context}
                                personSelectionLimit={1}
                                showtooltip={true}
                                principalTypes={[PrincipalType.User]}
                                resolveDelay={1000} />
                        </div>
                    </div>


                    <div className="form-group row mb-2">
                        {/* 評語 */}
                        <label className="col-12 col-md-2 col-form-label">評語</label>
                        <div className="col">
                            <textarea className="form-control" placeholder="請註明" />
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* 高級物理治療師姓名 */}
                        <label className="col-12 col-md-2 col-form-label">高級物理治療師姓名</label>
                        <div className="col-12 col-md-4">
                            <PeoplePicker
                                context={context}
                                personSelectionLimit={1}
                                showtooltip={true}
                                principalTypes={[PrincipalType.User]}
                                resolveDelay={1000} />
                        </div>
                        {/* 日期 */}
                        <label className="col-2 col-form-label">日期</label>
                        <label className="col-4 col-form-label">
                            {`${moment(new Date()).format("DD-MMM-YYYY")}`}
                        </label>
                    </div>
                </section>


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
