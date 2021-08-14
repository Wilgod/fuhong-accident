import * as React from 'react'
import { useState } from 'react'
import DatePicker from "react-datepicker";
import Header from "../../../components/Header/Header";
import "react-datepicker/dist/react-datepicker.css";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { WebPartContext } from '@microsoft/sp-webpart-base';
import AutosizeTextarea from "../../../components/AutosizeTextarea/AutosizeTextarea";


interface ISpecialIncidentReportAllowanceProps {
    context: WebPartContext;
    styles: any;
}

interface ISpecialIncidentReportAllowanceStates {

}

export default function SpecialIncidentReportAllowance({ context, styles }: ISpecialIncidentReportAllowanceProps) {
    const [form, setForm] = useState({});
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
                    <div className="row my-3">
                        <div className="col-12 fontweight-bold">
                            <span className={`px-2 font-weight-bold`} style={{ fontSize: 15 }}>(特別事故 發生後三個工作天內提交社會福利署津貼組及相關服務科)</span>
                        </div>
                    </div>

                    <hr className="my-3" />

                    <div className="row">
                        <div className="col-1">
                            致:
                        </div>
                        <div className="col-8">
                            津貼科
                        </div>
                        <div className="col">
                            (傳真: 2575 5632)
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-1">
                           
                        </div>
                        <div className="col-8">
                            安老服務科
                        </div>
                        <div className="col">
                            (傳真: 2575 5632)
                        </div>
                    </div>

                    <hr className="my-3" />

                </section>
            </div>
        </>
    )
}
