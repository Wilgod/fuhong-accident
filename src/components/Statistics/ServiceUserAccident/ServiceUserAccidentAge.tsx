import * as React from 'react'
import { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as moment from 'moment';
import { useServiceUserStats } from '../../../hooks/useServiceUserStats';
import Chart from "react-google-charts";
import useServiceLocation from '../../../hooks/useServiceLocation';
import { getDateFinancialYear } from '../../../utils/DateUtils';


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

interface ISampleSixDataset {
    year: number;
    dataset: IDataset;
}

interface ISampleFiveDataset {
    finicialYear: string;
    dataset: IDataset;
}

interface ISampleDataFour {
    year: string;
    dataset: IMonth;
}

interface ISampleThreeDataset {
    finicalYear: string;
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
    let result = { ...dataset };
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
                let newDataset = agefilter(item.ServiceUserAge, oldDataset);
                m.set(formattedDate, newDataset);
            } else {
                let newDataset = agefilter(item.ServiceUserAge, initialDataset);
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

const sampleThreeParser = (serviceUserAge: any[]) => {
    let result: ISampleThreeDataset[] = [];
    let m = new Map<string, IMonth>();

    serviceUserAge.forEach((item) => {
        const d = new Date(item.AccidentTime || item.IncidentTime);
        if (d) {
            const currentFinicailYear = getDateFinancialYear(d);
            if (m.has(currentFinicailYear)) {
                let oldDataset = m.get(currentFinicailYear);
                let newDataset = monthFilter(d.getMonth() + 1, oldDataset);
                m.set(currentFinicailYear, newDataset);
            } else {
                let newDataset = monthFilter(d.getMonth() + 1);
                m.set(currentFinicailYear, newDataset);
            }
        }
    });

    m.forEach((value, key) => {
        let item: ISampleThreeDataset = { finicalYear: key, dataset: value }
        result.push(item);
    })

    return result;
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
    let result: ISampleFiveDataset[] = []
    let m = new Map<string, IDataset>();

    serviceUserAge.forEach((item) => {
        const d = new Date(item.AccidentTime || item.IncidentTime);
        if (d) {

            const currentFinicailYear = getDateFinancialYear(d);
            if (m.has(currentFinicailYear)) {
                let oldDataset = m.get(currentFinicailYear);
                let newDataset = agefilter(item.ServiceUserAge, oldDataset);
                m.set(currentFinicailYear, newDataset);
            } else {
                let newDataset = agefilter(item.ServiceUserAge, { ...initialDataset });
                m.set(currentFinicailYear, newDataset);
            }
        }
    });

    m.forEach((value, key) => {
        let item: ISampleFiveDataset = { finicialYear: key, dataset: value }
        result.push(item);
    })

    return result;
}

const sampleSixParser = (serviceUserAge: any[], startDate: Date, endDate: Date) => {

    let result: ISampleSixDataset[] = []
    let m = new Map<string, IDataset>();

    const startYear = startDate.getFullYear()
    const endYear = endDate.getFullYear();
    const distance = endYear - startYear;
    for (let i = distance; i > 0; i--) {
        let a = new Date(new Date().setFullYear(endYear - i)).getFullYear()
        m.set(a.toString(), { ...initialDataset });
    }

    serviceUserAge.forEach((item) => {
        if ((item.AccidentTime || item.IncidentTime) && item.CaseNumber) {
            const year = new Date(item.AccidentTime || item.IncidentTime).getFullYear().toString();
            const month = new Date(item.AccidentTime || item.IncidentTime).getMonth() + 1;
            const formType: string = item.CaseNumber.split("-")[0];
            if (m.has(year)) {
                let oldDataset = m.get(year);
                let newDataset = agefilter(item.ServiceUserAge, oldDataset);
                m.set(year, newDataset);
            } else {
                let newDataset = agefilter(item.ServiceUserAge, { ...initialDataset });
                m.set(year, newDataset);
            }
        }
    })

    m.forEach((value, key) => {
        let item: ISampleSixDataset = { year: +key, dataset: value }
        result.push(item);
    })

    return result;
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
                                        {
                                            <tr>
                                                <th scope="row">總數</th>
                                                <th>{ageDataset.lessThanFifteen}</th>
                                                <th>{ageDataset.fifteenToTwenty}</th>
                                                <th>{ageDataset.twentyOneToThirty}</th>
                                                <th>{ageDataset.thirtyOneToforty}</th>
                                                <th>{ageDataset.fortyOneTofifty}</th>
                                                <th>{ageDataset.greaterThanSixty}</th>
                                            </tr>
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
                                            <th scope="col">Apr</th>
                                            <th scope="col">May</th>
                                            <th scope="col">Jun</th>
                                            <th scope="col">Jul</th>
                                            <th scope="col">Aug</th>
                                            <th scope="col">Sep</th>
                                            <th scope="col">Oct</th>
                                            <th scope="col">Nov</th>
                                            <th scope="col">Dec</th>
                                            <th scope="col">Jan</th>
                                            <th scope="col">Feb</th>
                                            <th scope="col">Mar</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            sampleThreeParser(serviceUserAge).map((item) => {
                                                return (
                                                    <tr>
                                                        <th scope="row">{item.finicalYear}</th>
                                                        <td>{item.dataset.apr}</td>
                                                        <td>{item.dataset.may}</td>
                                                        <td>{item.dataset.jun}</td>
                                                        <td>{item.dataset.jun}</td>
                                                        <td>{item.dataset.aug}</td>
                                                        <td>{item.dataset.sep}</td>
                                                        <td>{item.dataset.oct}</td>
                                                        <td>{item.dataset.nov}</td>
                                                        <td>{item.dataset.dec}</td>
                                                        <td>{item.dataset.jan}</td>
                                                        <td>{item.dataset.feb}</td>
                                                        <td>{item.dataset.mar}</td>
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

                return (
                    <>
                        <div className="row">
                            <div className="col-1">
                                <h6 style={{ fontWeight: 600 }}>
                                    標題:
                                </h6>
                            </div>
                            <div className="col-7">
                                <h6>{`年 - 新發生意外或事故`}</h6>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Jan</th>
                                            <th scope="col">Feb</th>
                                            <th scope="col">Mar</th>
                                            <th scope="col">Apr</th>
                                            <th scope="col">May</th>
                                            <th scope="col">Jun</th>
                                            <th scope="col">Jul</th>
                                            <th scope="col">Aug</th>
                                            <th scope="col">Sep</th>
                                            <th scope="col">Oct</th>
                                            <th scope="col">Nov</th>
                                            <th scope="col">Dec</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sampleFourParser(serviceUserAge, startDate, endDate).map((item) => {
                                            return (
                                                <tr>
                                                    <th scope="row">{item.year}</th>
                                                    <td>{item.dataset.jan}</td>
                                                    <td>{item.dataset.feb}</td>
                                                    <td>{item.dataset.mar}</td>
                                                    <td>{item.dataset.apr}</td>
                                                    <td>{item.dataset.may}</td>
                                                    <td>{item.dataset.jun}</td>
                                                    <td>{item.dataset.jun}</td>
                                                    <td>{item.dataset.aug}</td>
                                                    <td>{item.dataset.sep}</td>
                                                    <td>{item.dataset.oct}</td>
                                                    <td>{item.dataset.nov}</td>
                                                    <td>{item.dataset.dec}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )
            case "BY_YEAR_FINICIAL":
                return <>
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
                                        sampleFiveParser(serviceUserAge).map((item) => {
                                            return (
                                                <tr>
                                                    <th scope="row">{item.finicialYear}</th>
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
            case "BY_YEAR_CALENDAR":
                return <>
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
                                        sampleSixParser(serviceUserAge, startDate, endDate).map((item) => {
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
                return (
                    <Chart
                        width={'500px'}
                        height={'300px'}
                        chartType="Bar"
                        loader={<div>Loading Chart</div>}
                        data={[
                            ['Year', 'Sales', 'Expenses', 'Profit'],
                            ['2014', 1000, 400, 200],
                            ['2015', 1170, 460, 250],
                            ['2016', 660, 1120, 300],
                            ['2017', 1030, 540, 350],
                        ]}
                        options={{
                            // Material design options
                            chart: {
                                title: 'Company Performance',
                                subtitle: 'Sales, Expenses, and Profit: 2014-2017',
                            },
                        }}
                        // For tests
                        rootProps={{ 'data-testid': '2' }}
                    />
                )
            case "BY_MONTH_FINICIAL":
                return (
                    <div className="row">
                        <div className="col-6">
                            <Chart
                                width={'600px'}
                                height={'400px'}
                                chartType="Line"
                                loader={<div>Loading Chart</div>}
                                data={[
                                    [
                                        'Day',
                                        'Guardians of the Galaxy',
                                        'The Avengers',
                                        'Transformers: Age of Extinction',
                                    ],
                                    [1, 37.8, 80.8, 41.8],
                                    [2, 30.9, 69.5, 32.4],
                                    [3, 25.4, 57, 25.7],
                                    [4, 11.7, 18.8, 10.5],
                                    [5, 11.9, 17.6, 10.4],
                                    [6, 8.8, 13.6, 7.7],
                                    [7, 7.6, 12.3, 9.6],
                                    [8, 12.3, 29.2, 10.6],
                                    [9, 16.9, 42.9, 14.8],
                                    [10, 12.8, 30.9, 11.6],
                                    [11, 5.3, 7.9, 4.7],
                                    [12, 6.6, 8.4, 5.2],
                                    [13, 4.8, 6.3, 3.6],
                                    [14, 4.2, 6.2, 3.4],
                                ]}
                                options={{
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '新發生意外或事故 (服務使用者意外每月總數)',
                                    },
                                }}
                                rootProps={{ 'data-testid': '3' }}
                            />
                        </div>
                        <div className="col-6">
                            <Chart
                                width={'500px'}
                                height={'300px'}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={[
                                    ['Year', 'Sales', 'Expenses', 'Profit'],
                                    ['2014', 1000, 400, 200],
                                    ['2015', 1170, 460, 250],
                                    ['2016', 660, 1120, 300],
                                    ['2017', 1030, 540, 350],
                                ]}
                                options={{
                                    // Material design options
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '新發生意外或事故 (服務使用者意外每月總數)',
                                    },
                                }}
                                // For tests
                                rootProps={{ 'data-testid': '2' }}
                            />
                        </div>
                    </div>
                )
            case "BY_MONTH_CALENDAR":
                return (
                    <div className="row">
                        <div className="col-6">
                            <Chart
                                width={'600px'}
                                height={'400px'}
                                chartType="Line"
                                loader={<div>Loading Chart</div>}
                                data={[
                                    [
                                        'Day',
                                        'Guardians of the Galaxy',
                                        'The Avengers',
                                        'Transformers: Age of Extinction',
                                    ],
                                    [1, 37.8, 80.8, 41.8],
                                    [2, 30.9, 69.5, 32.4],
                                    [3, 25.4, 57, 25.7],
                                    [4, 11.7, 18.8, 10.5],
                                    [5, 11.9, 17.6, 10.4],
                                    [6, 8.8, 13.6, 7.7],
                                    [7, 7.6, 12.3, 9.6],
                                    [8, 12.3, 29.2, 10.6],
                                    [9, 16.9, 42.9, 14.8],
                                    [10, 12.8, 30.9, 11.6],
                                    [11, 5.3, 7.9, 4.7],
                                    [12, 6.6, 8.4, 5.2],
                                    [13, 4.8, 6.3, 3.6],
                                    [14, 4.2, 6.2, 3.4],
                                ]}
                                options={{
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '新發生意外或事故 (服務使用者意外每月總數)',
                                    },
                                }}
                                rootProps={{ 'data-testid': '3' }}
                            />
                        </div>
                        <div className="col-6">
                            <Chart
                                width={'500px'}
                                height={'300px'}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={[
                                    ['Year', 'Sales', 'Expenses', 'Profit'],
                                    ['2014', 1000, 400, 200],
                                    ['2015', 1170, 460, 250],
                                    ['2016', 660, 1120, 300],
                                    ['2017', 1030, 540, 350],
                                ]}
                                options={{
                                    // Material design options
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '新發生意外或事故 (服務使用者意外每月總數)',
                                    },
                                }}
                                // For tests
                                rootProps={{ 'data-testid': '2' }}
                            />
                        </div>
                    </div>
                )
            case "BY_YEAR_FINICIAL":
                return (
                    <div className="row">
                        <div className="col-6">
                            <Chart
                                width={'600px'}
                                height={'400px'}
                                chartType="Line"
                                loader={<div>Loading Chart</div>}
                                data={[
                                    [
                                        'Day',
                                        'Guardians of the Galaxy',
                                        'The Avengers',
                                        'Transformers: Age of Extinction',
                                    ],
                                    [1, 37.8, 80.8, 41.8],
                                    [2, 30.9, 69.5, 32.4],
                                    [3, 25.4, 57, 25.7],
                                    [4, 11.7, 18.8, 10.5],
                                    [5, 11.9, 17.6, 10.4],
                                    [6, 8.8, 13.6, 7.7],
                                    [7, 7.6, 12.3, 9.6],
                                    [8, 12.3, 29.2, 10.6],
                                    [9, 16.9, 42.9, 14.8],
                                    [10, 12.8, 30.9, 11.6],
                                    [11, 5.3, 7.9, 4.7],
                                    [12, 6.6, 8.4, 5.2],
                                    [13, 4.8, 6.3, 3.6],
                                    [14, 4.2, 6.2, 3.4],
                                ]}
                                options={{
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '新發生意外或事故 (服務使用者意外每月總數)',
                                    },
                                }}
                                rootProps={{ 'data-testid': '3' }}
                            />
                        </div>
                        <div className="col-6">
                            <Chart
                                width={'500px'}
                                height={'300px'}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={[
                                    ['Year', 'Sales', 'Expenses', 'Profit'],
                                    ['2014', 1000, 400, 200],
                                    ['2015', 1170, 460, 250],
                                    ['2016', 660, 1120, 300],
                                    ['2017', 1030, 540, 350],
                                ]}
                                options={{
                                    // Material design options
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '新發生意外或事故 (服務使用者意外每月總數)',
                                    },
                                }}
                                // For tests
                                rootProps={{ 'data-testid': '2' }}
                            />
                        </div>
                    </div>
                )
            case "BY_YEAR_CALENDAR":
                return (
                    <div className="row">
                        <div className="col-6">
                            <Chart
                                width={'600px'}
                                height={'400px'}
                                chartType="Line"
                                loader={<div>Loading Chart</div>}
                                data={[
                                    [
                                        'Day',
                                        'Guardians of the Galaxy',
                                        'The Avengers',
                                        'Transformers: Age of Extinction',
                                    ],
                                    [1, 37.8, 80.8, 41.8],
                                    [2, 30.9, 69.5, 32.4],
                                    [3, 25.4, 57, 25.7],
                                    [4, 11.7, 18.8, 10.5],
                                    [5, 11.9, 17.6, 10.4],
                                    [6, 8.8, 13.6, 7.7],
                                    [7, 7.6, 12.3, 9.6],
                                    [8, 12.3, 29.2, 10.6],
                                    [9, 16.9, 42.9, 14.8],
                                    [10, 12.8, 30.9, 11.6],
                                    [11, 5.3, 7.9, 4.7],
                                    [12, 6.6, 8.4, 5.2],
                                    [13, 4.8, 6.3, 3.6],
                                    [14, 4.2, 6.2, 3.4],
                                ]}
                                options={{
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '新發生意外或事故 (服務使用者意外每月總數)',
                                    },
                                }}
                                rootProps={{ 'data-testid': '3' }}
                            />
                        </div>
                        <div className="col-6">
                            <Chart
                                width={'500px'}
                                height={'300px'}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={[
                                    ['Year', 'Sales', 'Expenses', 'Profit'],
                                    ['2014', 1000, 400, 200],
                                    ['2015', 1170, 460, 250],
                                    ['2016', 660, 1120, 300],
                                    ['2017', 1030, 540, 350],
                                ]}
                                options={{
                                    // Material design options
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '新發生意外或事故 (服務使用者意外每月總數)',
                                    },
                                }}
                                // For tests
                                rootProps={{ 'data-testid': '2' }}
                            />
                        </div>
                    </div>
                )
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
