import * as React from 'react'
import { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as moment from 'moment';
import Chart from "react-google-charts";
import useServiceLocation from '../../../hooks/useServiceLocation';
import useGeneralStats from '../../../hooks/useGeneralStats';

interface IDataset {
    sui: number;
    pui: number;
    sih: number;
    sid: number;
    oin: number;
}

const initialDataset: IDataset = {
    sui: 0,
    pui: 0,
    sih: 0,
    sid: 0,
    oin: 0
}

const unitFilter = (formType: string, dataset: IDataset) => {
    let result = dataset;
    console.log("")
    switch (formType) {
        case "SUI":
            result.sui = result.sui + 1;
            return result;
        case "PUI":
            result.pui = result.pui + 1;
            return result;
        case "SIH":
            result.sih = result.sih + 1;
            return result;
        case "SID":
            result.sid = result.sid + 1;
            return result;
        case "OIN":
            result.oin = result.oin + 1;
            return result;
        default:
            throw new Error("unitFilter error");
    }
}


const sampleOneParser = (data: any[]): IDataset => {
    try {
        let result: IDataset = { ...initialDataset }
        if (Array.isArray(data)) {
            data.forEach((item) => {
                if (item.CaseNumber) {
                    const formType: string = item.CaseNumber.split("-")[0];
                    result = unitFilter(formType, result);
                }
            })
        }
        return result;
    } catch (err) {
        console.error(err);
        throw new Error("sampleOneParser error");
    }
}


function General() {
    const [groupBy, setGroupBy] = useState("NON");
    const [serivceLocation] = useServiceLocation();
    const [data, startDate, endDate, setStartDate, setEndDate, setServiceUnits] = useGeneralStats();
    const [unitDataset, setUnitDataset] = useState<IDataset>(initialDataset);

    const multipleOptionsSelectParser = (event) => {
        let result = [];
        const selectedOptions = event.target.selectedOptions;
        for (let i = 0; i < selectedOptions.length; i++) {
            result.push(selectedOptions[i].value);
        }
        return result;
    }

    const byMonthTableComponent = () => {
        return (
            <table className="table" >
                <thead>
                    <tr>
                        <th scope="col"></th>
                        <th>總數</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">服務使用者意外</th>
                        <th>{unitDataset.sui}</th>
                    </tr>
                    <tr>
                        <th scope="row">外界人士意外</th>
                        <th>{unitDataset.pui}</th>
                    </tr>
                    <tr>
                        <th scope="row">特別事故(牌照事務處)</th>
                        <th>{unitDataset.sih}</th>
                    </tr>
                    <tr>
                        <th scope="row">特別事故(津貼科)</th>
                        <th>{unitDataset.sid}</th>
                    </tr>
                    <tr>
                        <th scope="row">其他事故</th>
                        <th>{unitDataset.oin}</th>
                    </tr>
                </tbody>
            </table >
        )
    }

    useEffect(() => {
        switch (groupBy) {
            case "NON":
                setUnitDataset(sampleOneParser(data))
            case "BY_MONTH":
            case "BY_MONTH_FINICIAL":
            case "BY_MONTH_CALENDAR":
            case "BY_YEAR_FINICIAL":
            case "BY_YEAR_CALENDAR":
            default:
                console.log("default");
        }
    }, [groupBy, data])

    const statsTableSwitch = () => {
        let title = `${moment(startDate).format("MM/YYYY")} - ${moment(endDate).format("MM/YYYY")} 服務使用者意外`
        switch (groupBy) {
            case "NON":
                return (
                    <React.Fragment>
                        <div className="row">
                            <div className="col-1">
                                <h6 style={{ fontWeight: 600 }}>
                                    標題:
                                </h6>
                            </div>
                            <div className="col-7">
                                <h6>{`${title} - 新發生意外或事故總數`}</h6>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-7">
                                {byMonthTableComponent()}
                            </div>
                        </div>
                    </React.Fragment>
                )
            case "BY_MONTH":
            case "BY_MONTH_FINICIAL":
            case "BY_MONTH_CALENDAR":
            case "BY_YEAR_FINICIAL":
            case "BY_YEAR_CALENDAR":
            default:
                return null;
        }
    }

    const chartSwitch = () => {
        switch (groupBy) {
            case "NON":
                return (
                    <React.Fragment>
                        <div className="row">
                            <div className="col-6">
                                <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                    <div className="">
                                        {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                    </div>
                                    <div className="">
                                    新發生意外或事故總數
                                    </div>
                                </div>
                                <div className="">
                                    <Chart
                                        chartType={"Bar"}
                                        loader={<div className="d-flex justify-content-center align-items-center"> <div className="spinner-border text-primary" /></div>}
                                        data={[
                                            ["服務單位", "數量"],
                                            ["服務使用者意外", unitDataset.sui],
                                            ["外界人士意外", unitDataset.pui],
                                            ["特別事故(牌照事務處)", unitDataset.sih],
                                            ["特別事故(津貼科)", unitDataset.sid],
                                            ["其他事故", unitDataset.oin]
                                        ]}
                                    />

                                </div>
                            </div>
                            <div className="col-6">
                                <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                    <div className="">
                                        {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                    </div>
                                    <div className="">
                                        新發生意外或事故總數
                                    </div>
                                </div>
                                <Chart
                                    chartType={"PieChart"}
                                    loader={<div className="d-flex justify-content-center align-items-center"> <div className="spinner-border text-primary" /></div>}
                                    data={
                                        [
                                            ["服務單位", '數量'],
                                            ["服務使用者意外", unitDataset.sui],
                                            ["外界人士意外", unitDataset.pui],
                                            ["特別事故(牌照事務處)", unitDataset.sih],
                                            ["特別事故(津貼科)", unitDataset.sid],
                                            ["其他事故", unitDataset.oin]
                                        ]
                                    }
                                />
                            </div>
                        </div>
                    </React.Fragment>
                )
            case "BY_MONTH":
            case "BY_MONTH_FINICIAL":
            case "BY_MONTH_CALENDAR":
            case "BY_YEAR_FINICIAL":
            case "BY_YEAR_CALENDAR":
            default:
                console.log("default");
        }
    }

    return (
        <div>
            <div className="row mb-3">
                <div className="col">
                    <h6 style={{ fontWeight: 600 }}>統計資料 &gt; 一般統計 &gt; 新發生意外或事故</h6>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="mb-3" style={{ fontWeight: 600 }}>
                        發生日期
                    </div>
                    <div className="d-flex flex-column py-1">
                        <div className="mb-3 d-flex">
                            <div className="mr-3">
                                由
                            </div>
                            <DatePicker className="form-control" dateFormat="yyyy/MM/dd" selected={startDate} onChange={setStartDate} />
                        </div>
                        <div className="d-flex">
                            <div className="mr-3">
                                至
                            </div>
                            <DatePicker className="form-control" dateFormat="yyyy/MM/dd" selected={endDate} onChange={setEndDate} />
                        </div>
                    </div>
                </div>
                <div className="col" >
                    <div className="mb-3" style={{ fontWeight: 600 }}>
                        日期分組
                    </div>
                    {/* <div className="" style={{ overflowY: "scroll", border: "1px solid gray", height: 100 }}>

                    </div> */}
                    <select multiple className="form-control" onChange={(event) => {
                        const value = event.target.value;
                        setGroupBy(value);
                    }}>
                        <option value="NON">不需要</option>
                        <option value="BY_MONTH">按月</option>
                        <option value="BY_MONTH_FINICIAL">按月 - 財政年度</option>
                        <option value="BY_MONTH_CALENDAR">按月 - 日曆年度</option>
                        <option value="BY_YEAR_FINICIAL">按年 - 財政年度</option>
                        <option value="BY_YEAR_CALENDAR">按年 - 日曆年度</option>
                    </select>
                </div>
                <div className="col" >
                    <div className="mb-3" style={{ fontWeight: 600 }}>
                        服務單位
                    </div>
                    {/* <div className="" style={{ overflowY: "scroll", border: "1px solid gray", height: 100 }}>
                    </div> */}
                    <select multiple className="form-control" onChange={(event) => {
                        const selectedOptions = multipleOptionsSelectParser(event);
                        setServiceUnits(selectedOptions);
                    }}>
                        <option value="ALL">--- 所有 ---</option>
                        {
                            serivceLocation.map((item) => <option value={item}>{item}</option>)
                        }
                    </select>
                </div>
                <div className="col"></div>
            </div>
            <div className="mb-1" style={{ fontWeight: 600, fontSize: 17 }}>
                統計結果
            </div>
            <div className="mb-2">
                <div className="mb-2" style={{ fontWeight: 600 }}>
                    統計資料
                </div>
                {statsTableSwitch()}
                {/* <BootstrapTable boot keyField='id' data={[]} columns={columns()} pagination={paginationFactory()} bootstrap4={true} /> */}
            </div>
            <div className="">
                <div className="" style={{ fontWeight: 600 }}>
                    統計圖表
                </div>
                {chartSwitch()}
            </div>
        </div>
    )
}

export default General
