import * as React from 'react'
import { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as moment from 'moment';
import { useServiceUserStats } from '../../../hooks/useServiceUserStats';
import Chart from "react-google-charts";
import useServiceLocation from '../../../hooks/useServiceLocation';
import { useAccidentReportStats } from '../../../hooks/useAccidentReportStats';


//Age interval
interface IDataset {
    accidentNatureFall: number;
    accidentNatureChok: number;
    accidentNatureBehavior: number;
    accidentNatureEnvFactor: number;
    accidentNatureOther: number;
}

const initialDataset: IDataset = {
    accidentNatureFall: 0,
    accidentNatureChok: 0,
    accidentNatureBehavior: 0,
    accidentNatureEnvFactor: 0,
    accidentNatureOther: 0
}

const natureFilter = (item: any, dataset: IDataset): IDataset => {
    let result = dataset;
    if (item.AccidentNatureFall === true) {
        result.accidentNatureFall += 1;
    }

    if (item.AccidentNatureChok === true) {
        result.accidentNatureChok += 1;
    }

    if (item.AccidentNatureBehavior === true) {
        result.accidentNatureBehavior += 1;
    }

    if (item.AccidentNatureEnvFactor === true) {
        result.accidentNatureEnvFactor += 1;
    }

    if (item.AccidentNatureOther === true) {
        result.accidentNatureOther += 1;
    }

    return result;
}

const sampleOneParser = (serviceUserAge: any[]) => {
    let dataset: IDataset = { ...initialDataset };
    serviceUserAge.forEach((item) => {
        dataset = natureFilter(item, dataset);
    });
    return dataset;
}

const sampleTwoParser = (serviceUserAge: any[]): Map<string, IDataset> => {
    const result = new Map<string, IDataset>();
    serviceUserAge.forEach((item) => {
        const year = new Date(item.AccidentTime).getFullYear();
        if (result.has(`${year}`)) {
            let dataset = result.get(`${year}`);

        } else {

        }
    });
    return result;
}

function ServiceUserAccidentNature() {

    const [groupBy, setGroupBy] = useState("NON");
    const [natureDataset, setNatureDataset] = useState<IDataset>(initialDataset);
    const [serivceLocation] = useServiceLocation();
    const [serviceUserAge, startDate, endDate, setStartDate, setEndDate, setServiceUnits] = useAccidentReportStats();

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
                        <th scope="row">跌倒</th>
                        <th>{natureDataset.accidentNatureFall}</th>
                    </tr>
                    <tr>
                        <th scope="row">哽塞</th>
                        <th>{natureDataset.accidentNatureChok}</th>
                    </tr>
                    <tr>
                        <th scope="row">服務使用者行為問題</th>
                        <th>{natureDataset.accidentNatureBehavior}</th>
                    </tr>
                    <tr>
                        <th scope="row">環境因素</th>
                        <th>{natureDataset.accidentNatureEnvFactor}</th>
                    </tr>
                    <tr>
                        <th scope="row">其他</th>
                        <th>{natureDataset.accidentNatureOther}</th>
                    </tr>
                </tbody>
            </table >
        )
    }

    useEffect(() => {
        switch (groupBy) {
            case "NON":
                setNatureDataset(sampleOneParser(serviceUserAge));
            case "BY_MONTH":
            case "BY_MONTH_FINICIAL":
            case "BY_MONTH_CALENDAR":
            case "BY_YEAR_FINICIAL":
            case "BY_YEAR_CALENDAR":
            default:
                console.log("default");
        }
    }, [groupBy, serviceUserAge])

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
                                <h6>{`${title} - 意外性質統計`}</h6>
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
        let title = `${moment(startDate).format("MM/YYYY")} - ${moment(endDate).format("MM/YYYY")} 服務使用者意外`

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
                                        服務使用者意外 - 意外性質統計
                                    </div>
                                </div>
                                <div className="">
                                    <Chart
                                        chartType={"Bar"}
                                        loader={<div className="d-flex justify-content-center align-items-center"> <div className="spinner-border text-primary" /></div>}
                                        data={[
                                            ["意外性質", "數量"],
                                            ["跌倒", natureDataset.accidentNatureFall],
                                            ["哽塞", natureDataset.accidentNatureChok],
                                            ["服務使用者行為問題", natureDataset.accidentNatureBehavior],
                                            ["環境因素", natureDataset.accidentNatureEnvFactor],
                                            ["其他", natureDataset.accidentNatureOther],
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
                                        服務使用者意外 - 意外性質統計
                                    </div>
                                </div>
                                <Chart
                                    chartType={"PieChart"}
                                    loader={<div className="d-flex justify-content-center align-items-center"> <div className="spinner-border text-primary" /></div>}
                                    data={
                                        [
                                            ["意外性質", "數量"],
                                            ["跌倒", natureDataset.accidentNatureFall],
                                            ["哽塞", natureDataset.accidentNatureChok],
                                            ["服務使用者行為問題", natureDataset.accidentNatureBehavior],
                                            ["環境因素", natureDataset.accidentNatureEnvFactor],
                                            ["其他", natureDataset.accidentNatureOther],
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
                return null;
        }
    }

    return (
        <div>
            <div className="row mb-3">
                <div className="col">
                    <h6 style={{ fontWeight: 600 }}>統計資料 &gt; 服務使用者意外統計 &gt; 意外性質</h6>
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
                            <DatePicker className="form-control" dateFormat="yyyy/MM/dd" selected={startDate} onChange={(date) => setStartDate(date)} />
                        </div>
                        <div className="d-flex">
                            <div className="mr-3">
                                至
                            </div>
                            <DatePicker className="form-control" dateFormat="yyyy/MM/dd" selected={endDate} onChange={(date) => setEndDate(date)} />
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
        </div >
    )
}

export default ServiceUserAccidentNature
