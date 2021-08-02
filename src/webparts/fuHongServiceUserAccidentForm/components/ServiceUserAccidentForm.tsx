import * as React from 'react'
import Header from "../../../components/Header/Header";

export default function ServiceUserAccidentForm() {
    return (
        <>
            <div className="mb-3">
                <Header displayName="服務使用者意外填報表(一)" />
            </div>
            <div className="container">
                <section className="mb-2">
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
                        {/* 保險公司備偏號 */}
                        <label className="col-12 col-md-2 col-form-label">保險公司備偏號</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                    </div>
                </section>

                <hr className="my-3" />

                <section className="mb-2">
                    <div className="form-group row mb-2">
                        {/* 服務使用者姓名 (英文)*/}
                        <label className="col-12 col-md-2 col-form-label">服務使用者姓名 (英文)</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                        {/* 服務使用者姓名 (中文)*/}
                        <label className="col-12 col-md-2 col-form-label">服務使用者姓名 (中文)</label>
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
                        <div className="col-12 col-md-4">
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
                        {/* 年齡*/}
                        <label className="col-12 col-md-2 col-form-label">服務使用者檔案號碼</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                        {/* 性別*/}
                        <label className="col-12 col-md-2 col-form-label">接受服務類別</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* 意外發生日期*/}
                        <label className="col-12 col-md-2 col-form-label">意外發生日期</label>
                        <div className="col-12 col-md-4">
                            <input type="date" className="form-control" />
                        </div>
                        {/* 意外發生時間*/}
                        <label className="col-12 col-md-2 col-form-label">意外發生日期</label>
                        <div className="col-12 col-md-4">
                            <input type="time" className="form-control" />
                        </div>
                    </div>


                </section>
            </div>
        </>
    )
}
