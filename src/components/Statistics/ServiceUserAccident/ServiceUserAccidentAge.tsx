import * as React from 'react'
import { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as moment from 'moment';
import { useServiceUserStats } from '../../../hooks/useServiceUserStats';
import Chart from "react-google-charts";
import useServiceLocation from '../../../hooks/useServiceLocation';


//Age interval
interface IDataset {
    lessThanFifteen: number;
    fifteenToTwenty: number;
    twentyOneToThirty: number;
    thirtyOneToforty: number;
    fortyOneTofifty: number;
    fiftyOneToSixty: number;
    greaterThanSixty: number;
}

interface IMonth {
    jan: number;
    feb: number;
    mar: number;
    apr: number;
    may: number;
    jun: number;
    jul: number;
    aug: number;
    sep: number;
    oct: number;
    nov: number;
    dec: number;
}

const initialDatasetMonth: IMonth = {
    apr: 0,
    aug: 0,
    dec: 0,
    feb: 0,
    jan: 0,
    jul: 0,
    jun: 0,
    mar: 0,
    may: 0,
    nov: 0,
    oct: 0,
    sep: 0
}

interface ISampleDataTwoDataset {
    year: string;
    dataset: IDataset;
}

interface ISampleDataFour {
    year: string;
    dataset: IMonth;
}

const initialDataset: IDataset = {
    lessThanFifteen: 0,
    fifteenToTwenty: 0,
    twentyOneToThirty: 0,
    thirtyOneToforty: 0,
    fortyOneTofifty: 0,
    fiftyOneToSixty: 0,
    greaterThanSixty: 0,
}

const agefilter = (age: number, dataset: IDataset): IDataset => {
    let result = dataset;
    if (age < 15) {
        result.lessThanFifteen = result.lessThanFifteen + 1;
    } else if (age >= 15 && age <= 20) {
        result.fifteenToTwenty = result.fifteenToTwenty + 1;
    } else if (age >= 21 && age <= 30) {
        result.twentyOneToThirty = result.twentyOneToThirty + 1;
    } else if (age >= 31 && age <= 40) {
        result.thirtyOneToforty = result.thirtyOneToforty + 1;
    } else if (age >= 41 && age <= 50) {
        result.fortyOneTofifty = result.fortyOneTofifty + 1;
    } else if (age >= 51 && age <= 60) {
        result.fifteenToTwenty = result.fifteenToTwenty + 1;
    } else {
        result.greaterThanSixty = result.greaterThanSixty + 1;
    }
    return result;
}

const monthFilter = (month: number, dataset: IMonth = initialDatasetMonth): IMonth => {
    let result = { ...dataset };
    switch (month) {
        case 1:
            result.jan = result.jan + 1;
            return result;
        case 2:
            result.feb = result.feb + 1;
            return result;
        case 3:
            result.mar = result.mar + 1;
            return result;
        case 4:
            result.apr = result.apr + 1;
            return result;
        case 5:
            result.may = result.may + 1;
            return result;
        case 6:
            result.jun = result.jun + 1;
            return result;
        case 7:
            result.jul = result.jul + 1;
            return result;
        case 8:
            result.aug = result.aug + 1;
            return result;
        case 9:
            result.sep = result.sep + 1;
            return result;
        case 10:
            result.oct = result.oct + 1;
            return result;
        case 11:
            result.nov = result.nov + 1;
            return result;
        case 12:
            result.dec = result.dec + 1;
            return result;
        default: return;
    }
}

const sampleOneParser = (serviceUserAge: any[]) => {
    let dataset: IDataset = { ...initialDataset };
    serviceUserAge.forEach((item) => {
        dataset = agefilter(item.ServiceUserAge, dataset);
    });
    return dataset;
}

const sampleTwoParser = (serviceUserAge: any[], startDate: Date, endDate: Date): ISampleDataTwoDataset[] => {
    let result: ISampleDataTwoDataset[] = [];
    const m = new Map<string, IDataset>();

    serviceUserAge.forEach((item) => {
        if (item.AccidentTime) {
            const date = new Date(item.AccidentTime);
            const formattedDate = moment(date).format("MM/yyyy");
            if (m.has(formattedDate)) {
                let oldDataset = m.get(formattedDate);
                let newDataset = agefilter(item.serviceUserAge, oldDataset);
                m.set(formattedDate, newDataset);
            } else {
                let newDataset = agefilter(item.serviceUserAge, initialDataset);
                m.set(formattedDate, newDataset);
            }
        }
    })


    m.forEach((value, key) => {
        let item: ISampleDataTwoDataset = { year: key, dataset: value }
        result.push(item);
    })

    return result;
}

const sampleThreeParser = (serviceUserAge: any[], startDate: Date, endDate: Date) => {

}

const sampleFourParser = (serviceUserAge: any[], startDate: Date, endDate: Date): ISampleDataFour[] => {
    let result: ISampleDataFour[] = []
    const m = new Map<string, IMonth>();

    const startYear = startDate.getFullYear()
    const endYear = endDate.getFullYear();
    const distance = endYear - startYear;
    for (let i = distance; i > 0; i--) {
        let a = new Date(new Date().setFullYear(endYear - i)).getFullYear().toString()
        m.set(a, { ...initialDatasetMonth });
    }

    serviceUserAge.forEach((item) => {
        if (item.AccidentTime || item.IncidentTime) {
            const year = new Date(item.AccidentTime || item.IncidentTime).getFullYear().toString();
            const month = new Date(item.AccidentTime || item.IncidentTime).getMonth() + 1;
            if (m.has(year)) {
                let oldDataset = m.get(year);
                let newDataset = monthFilter(month, oldDataset);
                m.set(year, newDataset);
            } else {
                let newDataset = monthFilter(month);
                m.set(year, newDataset);
            }
        }
    })

    m.forEach((value, key) => {
        let item: ISampleDataFour = { year: key, dataset: value }
        result.push(item);
    })

    return result;
}

const sampleFiveParser = (serviceUserAge: any[]) => {

}

const sampleSixParser = (serviceUserAge: any[]) => {

}

function ServiceUserAccidentAge() {

    const [groupBy, setGroupBy] = useState("NON");
    const [ageDataset, setAgeDataset] = useState<IDataset>(initialDataset);
    const [serivceLocation] = useServiceLocation();
    const [serviceUserAge, startDate, endDate, setStartDate, setEndDate, setServiceUnits] = useServiceUserStats();

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
                        <th scope="row">&lt;15歲</th>
                        <th>{ageDataset.lessThanFifteen}</th>
                    </tr>
                    <tr>
                        <th scope="row">15-20歲</th>
                        <th>{ageDataset.fifteenToTwenty}</th>
                    </tr>
                    <tr>
                        <th scope="row">21-30歲</th>
                        <th>{ageDataset.twentyOneToThirty}</th>
                    </tr>
                    <tr>
                        <th scope="row">31-40歲</th>
                        <th>{ageDataset.thirtyOneToforty}</th>
                    </tr>
                    <tr>
                        <th scope="row">41-50歲</th>
                        <th>{ageDataset.fortyOneTofifty}</th>
                    </tr>
                    <tr>
                        <th scope="row">&gt;60歲</th>
                        <th>{ageDataset.greaterThanSixty}</th>
                    </tr>
                </tbody>
            </table >
        )
    }

    useEffect(() => {
        switch (groupBy) {
            case "NON":
                setAgeDataset(sampleOneParser(serviceUserAge));
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
                                <h6>{`${title} - 年齡統計`}</h6>
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
                return (
                    <>
                        <div className="row">
                            <div className="col-1">
                                <h6 style={{ fontWeight: 600 }}>
                                    標題:
                                </h6>
                            </div>
                            <div className="col-7">
                                <h6>{`${title} - 年齡統計(每月總數)`}</h6>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-7">
                                <table className="table" >
                                    <thead>
                                        <tr>
                                            <th scope="col"></th>
                                            <th scope="col">&lt;15歲</th>
                                            <th scope="col">15-20歲</th>
                                            <th scope="col">21-30歲</th>
                                            <th scope="col">31-40歲</th>
                                            <th scope="col">41-50歲</th>
                                            <th scope="col">&gt;60歲</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            sampleTwoParser(serviceUserAge, startDate, endDate).map((item) => {
                                                return (
                                                    <tr>
                                                        <th scope="row">{item.year}</th>
                                                        <th>{item.dataset.lessThanFifteen}</th>
                                                        <th>{item.dataset.fifteenToTwenty}</th>
                                                        <th>{item.dataset.twentyOneToThirty}</th>
                                                        <th>{item.dataset.thirtyOneToforty}</th>
                                                        <th>{item.dataset.fortyOneTofifty}</th>
                                                        <th>{item.dataset.greaterThanSixty}</th>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table >
                            </div>
                        </div>
                    </>
                )
            case "BY_MONTH_FINICIAL":
                return (
                    <>
                        <div className="row">
                            <div className="col-1">
                                <h6 style={{ fontWeight: 600 }}>
                                    標題:
                                </h6>
                            </div>
                            <div className="col-7">
                                <h6>{`${title} - 年齡統計(每月總數)`}</h6>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-7">
                                <table className="table" >
                                    <thead>
                                        <tr>
                                            <th scope="col"></th>
                                            <th scope="col">&lt;15歲</th>
                                            <th scope="col">15-20歲</th>
                                            <th scope="col">21-30歲</th>
                                            <th scope="col">31-40歲</th>
                                            <th scope="col">41-50歲</th>
                                            <th scope="col">&gt;60歲</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            sampleTwoParser(serviceUserAge, startDate, endDate).map((item) => {
                                                return (
                                                    <tr>
                                                        <th scope="row">{item.year}</th>
                                                        <th>{item.dataset.lessThanFifteen}</th>
                                                        <th>{item.dataset.fifteenToTwenty}</th>
                                                        <th>{item.dataset.twentyOneToThirty}</th>
                                                        <th>{item.dataset.thirtyOneToforty}</th>
                                                        <th>{item.dataset.fortyOneTofifty}</th>
                                                        <th>{item.dataset.greaterThanSixty}</th>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table >
                            </div>
                        </div>
                    </>
                )
            case "BY_MONTH_CALENDAR":
                sampleFourParser
                return (
                    <>

                    </>
                )
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
                                        服務使用者意外 - 年齡統計
                                    </div>
                                </div>
                                <div className="">
                                    <Chart
                                        chartType={"Bar"}
                                        loader={<div className="d-flex justify-content-center align-items-center"> <div className="spinner-border text-primary" /></div>}
                                        data={[
                                            ["年齡", "年齡"],
                                            ["<15歲", ageDataset.lessThanFifteen],
                                            ["15-20歲", ageDataset.fifteenToTwenty],
                                            ["21-30歲", ageDataset.twentyOneToThirty],
                                            ["31-40歲", ageDataset.thirtyOneToforty],
                                            ["41-50歲", ageDataset.fortyOneTofifty],
                                            ["51-60歲", ageDataset.fiftyOneToSixty],
                                            [">60歲", ageDataset.greaterThanSixty],
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
                                        服務使用者意外 - 年齡統計
                                    </div>
                                </div>
                                <Chart
                                    chartType={"PieChart"}
                                    loader={<div className="d-flex justify-content-center align-items-center"> <div className="spinner-border text-primary" /></div>}
                                    data={
                                        [
                                            ["年齡", '年齡'],
                                            ["<15歲", ageDataset.lessThanFifteen],
                                            ["15-20歲", ageDataset.fifteenToTwenty],
                                            ["21-30歲", ageDataset.twentyOneToThirty],
                                            ["31-40歲", ageDataset.thirtyOneToforty],
                                            ["41-50歲", ageDataset.fortyOneTofifty],
                                            ["51-60歲", ageDataset.fiftyOneToSixty],
                                            [">60歲", ageDataset.greaterThanSixty],
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
                    <h6 style={{ fontWeight: 600 }}>統計資料 &gt; 服務使用者意外統計 &gt; 年齡</h6>
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

export default ServiceUserAccidentAge
