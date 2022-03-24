import * as React from 'react'
import { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as moment from 'moment';
import Chart from "react-google-charts";
import useServiceLocation from '../../../hooks/useServiceLocation';
import { useOutsiderStats } from '../../../hooks/useOutsiderStats';
import { useOutsidersAccidentReportStats } from '../../../hooks/useOutsidersAccidentReportStats';
import { getDateFinancialYear } from '../../../utils/DateUtils';
import arraySort from 'array-sort';
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

interface ISampleTwoDataset {
    month: string;
    dataset: IDataset;
    mmyyyy: number;
}

interface ISampleThreeDataset {
    financialYear: string;
    dataset: IMonth;
}

interface ISampleFourDataset {
    year: number;
    dataset: IMonth;
}

interface ISampleFiveDataset {
    financialYear: string;
    dataset: IDataset;
}

interface ISampleSixDataset {
    year: number;
    dataset: IDataset;
}

const financialYearChartParser = (result) =>{
    let dataResult = ['Month'];
    let jan =['JAN'];
    let feb =['FEB'];
    let mar =['MAR'];
    let apr =['APR'];
    let may =['MAY'];
    let jun =['JUN'];
    let jul =['JUL'];
    let aug =['AUG'];
    let sep =['SEP'];
    let oct =['OCT'];
    let nov =['NOV'];
    let dec =['DEC'];
    result.map((item) => {
        dataResult.push(item.financialYear);
        jan.push(item.dataset['jan']);
        feb.push(item.dataset['feb']);
        mar.push(item.dataset['mar']);
        apr.push(item.dataset['apr']);
        may.push(item.dataset['may']);
        jun.push(item.dataset['jun']);
        jul.push(item.dataset['jul']);
        aug.push(item.dataset['aug']);
        sep.push(item.dataset['sep']);
        oct.push(item.dataset['oct']);
        nov.push(item.dataset['nov']);
        dec.push(item.dataset['dec']);
    });
    let data=[
        dataResult,
        apr,
        may,
        jun,
        jul,
        aug,
        sep,
        oct,
        nov,
        dec,
        jan,
        feb,
        mar
        
    ];
    return data;
}

const normalChartParser = (result) =>{
    let dataResult = ['Month'];
    let jan =['JAN'];
    let feb =['FEB'];
    let mar =['MAR'];
    let apr =['APR'];
    let may =['MAY'];
    let jun =['JUN'];
    let jul =['JUL'];
    let aug =['AUG'];
    let sep =['SEP'];
    let oct =['OCT'];
    let nov =['NOV'];
    let dec =['DEC'];
    result.map((item) => {
        dataResult.push(item.year.toString());
        jan.push(item.dataset['jan']);
        feb.push(item.dataset['feb']);
        mar.push(item.dataset['mar']);
        apr.push(item.dataset['apr']);
        may.push(item.dataset['may']);
        jun.push(item.dataset['jun']);
        jul.push(item.dataset['jul']);
        aug.push(item.dataset['aug']);
        sep.push(item.dataset['sep']);
        oct.push(item.dataset['oct']);
        nov.push(item.dataset['nov']);
        dec.push(item.dataset['dec']);
    });
    let data=[
        dataResult,
        jan,
        feb,
        mar,
        apr,
        may,
        jun,
        jul,
        aug,
        sep,
        oct,
        nov,
        dec
    ];
    return data;
}

const financialChartParser = (result) =>{
    let dataResult = ['Year'];
    let accidentNatureFall =['跌倒'];
    let accidentNatureChok =['哽塞'];
    let accidentNatureBehavior =['服務使用者行為問題'];
    let accidentNatureEnvFactor =['環境因素'];
    let accidentNatureOther =['其他'];
    result.map((item) => {
        dataResult.push(item.financialYear);
        accidentNatureFall.push(item.dataset['accidentNatureFall']);
        accidentNatureChok.push(item.dataset['accidentNatureChok']);
        accidentNatureBehavior.push(item.dataset['accidentNatureBehavior']);
        accidentNatureEnvFactor.push(item.dataset['accidentNatureEnvFactor']);
        accidentNatureOther.push(item.dataset['accidentNatureOther']);
    });
    let data=[
        dataResult,
        accidentNatureFall,
        accidentNatureChok,
        accidentNatureBehavior,
        accidentNatureEnvFactor,
        accidentNatureOther
    ];
    return data;
}

const yearChartParser = (result) =>{
    let dataResult = ['Year'];
    let accidentNatureFall =['跌倒'];
    let accidentNatureChok =['哽塞'];
    let accidentNatureBehavior =['服務使用者行為問題'];
    let accidentNatureEnvFactor =['環境因素'];
    let accidentNatureOther =['其他'];
    result.map((item) => {
        dataResult.push(item.year.toString());
        accidentNatureFall.push(item.dataset['accidentNatureFall']);
        accidentNatureChok.push(item.dataset['accidentNatureChok']);
        accidentNatureBehavior.push(item.dataset['accidentNatureBehavior']);
        accidentNatureEnvFactor.push(item.dataset['accidentNatureEnvFactor']);
        accidentNatureOther.push(item.dataset['accidentNatureOther']);
    });
    let data=[
        dataResult,
        accidentNatureFall,
        accidentNatureChok,
        accidentNatureBehavior,
        accidentNatureEnvFactor,
        accidentNatureOther
    ];
    return data;
}

const monthZero = (dataset: IMonth = initialDatasetMonth): IMonth => {
    let result = { ...dataset };
    return result;
}

const monthFilter = (month: number, dataset: IMonth = initialDatasetMonth): IMonth => {
    debugger
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

const monthDiff = (d1: Date, d2: Date) => {
    try {
        let months: number;
        months = (d2.getFullYear() - d1.getFullYear()) * 12;
        months -= d1.getMonth();
        months += d2.getMonth();
        return months <= 0 ? 0 : months;
    } catch (err) {
        console.error(err);
    }
}

const sampleOneParser = (envFactor: any[]): IDataset => {
    let dataset: IDataset = { ...initialDataset };
    envFactor.forEach((item) => {
        dataset = natureFilter(item, dataset);
    })
    return dataset
}


const sampleTwoParser = (data: any[], startDate: Date, endDate: Date): ISampleTwoDataset[] => {
    try {


        let m = new Map<string, IDataset>();
        let result: ISampleTwoDataset[] = [];

        const diff = monthDiff(startDate, endDate);
        for (let i = diff; i > -1; i--) {
            let currentMonth = new Date(endDate).getMonth();
            let currentYear = new Date(endDate).getFullYear();
            let calMonth;
            let calYear;
            if (currentMonth - i < 0) {
                if (i > 12) {
                    let moreYear = Math.floor(i/12);
                    let remainMonth = i % 12;
                    if (currentMonth - remainMonth < 0) {
                        calMonth = 12 - (remainMonth - currentMonth) ;
                        calYear = currentYear - (moreYear + 1);
                    } else {
                        calMonth = currentMonth - remainMonth
                        calYear = currentYear - moreYear
                    }
                } else {
                    calMonth = 12 - (i - currentMonth);
                    calYear = currentYear - 1;
                }
            } else {
                calMonth = currentMonth - i
                calYear = currentYear;
            }
            const d = moment(new Date(calYear,calMonth,1)).format("MM/yyyy");
            m.set(d, { ...initialDataset });
        }

        data.forEach((item) => {
            if ((item.AccidentTime || item.IncidentTime || item.Created) && item.CaseNumber) {
                const formType: string = item.CaseNumber.split("-")[0];
                const date = new Date(item.AccidentTime || item.IncidentTime || item.Created);
                const formattedDate = moment(date).format("MM/yyyy");
                if (m.has(formattedDate)) {
                    let oldDataset = m.get(formattedDate);
                    let newDataset = natureFilter(item, oldDataset);
                    m.set(formattedDate, newDataset);
                } else {
                    let newDataset = natureFilter(item, { ...initialDataset });
                    m.set(formattedDate, newDataset);
                }
            }
        });

        m.forEach((value, key) => {
            let item: ISampleTwoDataset = { month: key, dataset: value, mmyyyy:parseInt(key.substr(3,4) + key.substr(0,2)) }
            result.push(item);
        })
        arraySort(result, 'mmyyyy');
        return result;
    } catch (err) {
        console.error(err);
    }
}

const sampleThreeParser = (data: any[],startDate,endDate): ISampleThreeDataset[] => {
    let result: ISampleThreeDataset[] = [];
    let m = new Map<string, IMonth>();

    data.forEach((item) => {
        const d = new Date(item.AccidentTime || item.IncidentTime || item.Created);
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
        let item: ISampleThreeDataset = { financialYear: key, dataset: value }
        result.push(item);
    })
    let temp = new Date(startDate.getFullYear(),startDate.getMonth(),startDate.getDate());
    for (let d = temp; d <= endDate; d.setFullYear(d.getFullYear() + 1)) {
        const financialYear =  getDateFinancialYear(d);
        let m1 = new Map<string, IMonth>();
        const filterResult = result.filter(item => {return item.financialYear == financialYear});
        if (filterResult.length == 0) {
            let newDataset = monthZero();
            m1.set(financialYear, newDataset);
        }
        m1.forEach((value, key) => {
            let item: ISampleThreeDataset = { financialYear: key, dataset: value }
            result.push(item);
        })
    }
    
    arraySort(result, 'financialYear');
    return result;
}

const sampleFourParser = (data: any[], startDate: Date, endDate: Date): ISampleFourDataset[] => {
    let result: ISampleFourDataset[] = [];
    let m = new Map<number, IMonth>();

    const startYear = startDate.getFullYear()
    const endYear = endDate.getFullYear();
    const distance = endYear - startYear;
    for (let i = distance; i > 0; i--) {
        let a = new Date(new Date().setFullYear(endYear - i)).getFullYear()
        m.set(a, { ...initialDatasetMonth });
    }

    data.forEach((item) => {
        if (item.AccidentTime || item.IncidentTime || item.Created) {
            const year = new Date(item.AccidentTime || item.IncidentTime || item.Created).getFullYear();
            const month = new Date(item.AccidentTime || item.IncidentTime || item.Created).getMonth() + 1;
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
        let item: ISampleFourDataset = { year: key, dataset: value }
        result.push(item);
    })
    let temp = new Date(startDate.getFullYear(),startDate.getMonth(),startDate.getDate());
    for (let d = temp; d <= endDate; d.setFullYear(d.getFullYear() + 1)) {
        const year =  d.getFullYear()
        let m1 = new Map<string, IMonth>();
        const filterResult = result.filter(item => {return item.year == year});
        if (filterResult.length == 0) {
            let newDataset = monthZero();
            m1.set(year.toString(), newDataset);
        }
        m1.forEach((value, key) => {
            let item: ISampleFourDataset = { year: parseInt(key), dataset: value }
            result.push(item);
        })
    }
    
    arraySort(result, 'year');
    return result
}

const sampleFiveParser = (data: any[],startDate,endDate): ISampleFiveDataset[] => {
    let result: ISampleFiveDataset[] = []
    let m = new Map<string, IDataset>();

    data.forEach((item) => {
        const d = new Date(item.AccidentTime || item.IncidentTime || item.Created);
        if (d) {

            const currentFinicailYear = getDateFinancialYear(d);
            if (m.has(currentFinicailYear)) {

                let oldDataset = m.get(currentFinicailYear);
                let newDataset = natureFilter(item, oldDataset);
                m.set(currentFinicailYear, newDataset);

            } else {
                let newDataset = natureFilter(item, { ...initialDataset });
                m.set(currentFinicailYear, newDataset);
            }
        }
    });

    m.forEach((value, key) => {
        let item: ISampleFiveDataset = { financialYear: key, dataset: value }
        result.push(item);
    })
    let temp = new Date(startDate.getFullYear(),startDate.getMonth(),startDate.getDate());
    for (let d = temp; d <= endDate; d.setFullYear(d.getFullYear() + 1)) {

        const financialYear =  getDateFinancialYear(d);
        let m1 = new Map<string, IDataset>();
        const filterResult = result.filter(item => {return item.financialYear == financialYear});
        if (filterResult.length == 0) {
            //let newDataset = unitFilter(formType, { ...initialDataset });
            m1.set(financialYear, initialDataset);
        }
        m1.forEach((value, key) => {
            let item: ISampleFiveDataset = { financialYear: key, dataset: value }
            result.push(item);
        })
    }
    return result;
}

const sampleSixParser = (data: any[], startDate: Date, endDate: Date): ISampleSixDataset[] => {
    let result: ISampleSixDataset[] = []
    let m = new Map<string, IDataset>();

    const startYear = startDate.getFullYear()
    const endYear = endDate.getFullYear();
    const distance = endYear - startYear;
    for (let i = distance; i > 0; i--) {
        let a = new Date(new Date().setFullYear(endYear - i)).getFullYear()
        m.set(a.toString(), { ...initialDataset });
    }

    data.forEach((item) => {
        if ((item.AccidentTime || item.IncidentTime) && item.CaseNumber) {
            const year = new Date(item.AccidentTime || item.IncidentTime || item.Created).getFullYear().toString();
            const month = new Date(item.AccidentTime || item.IncidentTime || item.Created).getMonth() + 1;

            if (m.has(year)) {
                let oldDataset = m.get(year);
                let newDataset = natureFilter(item, oldDataset);
                m.set(year, newDataset);
                if (item.ObserveEnvironmentFactor) {
                    let arr = JSON.parse(item.ObserveEnvironmentFactor);
                    if (Array.isArray(arr)) {
                        arr.forEach((factor) => {

                        })
                    }
                }
            } else {
                let newDataset = natureFilter(item, { ...initialDataset });
                m.set(year, newDataset);
            }
        }
    })

    m.forEach((value, key) => {
        let item: ISampleSixDataset = { year: +key, dataset: value }
        result.push(item);
    })
    let temp = new Date(startDate.getFullYear(),startDate.getMonth(),startDate.getDate());
    for (let d = temp; d <= endDate; d.setFullYear(d.getFullYear() + 1)) {

        const year =  d.getFullYear()
        let m1 = new Map<string, IDataset>();
        const filterResult = result.filter(item => {return item.year == year});
        if (filterResult.length == 0) {
            //let newDataset = unitFilter(formType, { ...initialDataset });
            m1.set(year.toString(), initialDataset);
        }
        m1.forEach((value, key) => {
            let item: ISampleSixDataset = { year: parseInt(key), dataset: value }
            result.push(item);
        })
    }
    arraySort(result, 'year');
    return result;
}

const natureFilter = (item: any, dataset: IDataset): IDataset => {
    debugger
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



function OutsiderAccidentNature(siteCollectionUrl) {
    const [groupBy, setGroupBy] = useState("NON");
    const [natureDataset, setNatureDataset] = useState<IDataset>(initialDataset);
    const [serivceLocation] = useServiceLocation(siteCollectionUrl.siteCollectionUrl);
    const [data, startDate, endDate, serviceUnits, setStartDate, setEndDate, setServiceUnits] = useOutsidersAccidentReportStats();

    const multipleOptionsSelectParser = (event) => {
        let result = [];
        const selectedOptions = event.target.selectedOptions;
        for (let i = 0; i < selectedOptions.length; i++) {
            result.push(selectedOptions[i].value);
        }
        return result;
    }

    const statsTableSwitch = () => {
        let title = `${moment(startDate).format("MM/YYYY")} - ${moment(endDate).format("MM/YYYY")} 外界人士意外`
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
                            <div className="col-12">
                                <h6>{`${title} - 意外性質統計 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
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
                            <div className="col-12">
                                <h6>{`${title} - 意外性質統計 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">跌倒</th>
                                            <th scope="col">哽塞</th>
                                            <th scope="col">服務使用者行為問題</th>
                                            <th scope="col">環境因素</th>
                                            <th scope="col">其他</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sampleTwoParser(data, startDate, endDate).map((item) => {
                                            return (
                                                <tr>
                                                    <th scope="row">{item.month}</th>
                                                    <td>{item.dataset.accidentNatureFall}</td>
                                                    <td>{item.dataset.accidentNatureChok}</td>
                                                    <td>{item.dataset.accidentNatureBehavior}</td>
                                                    <td>{item.dataset.accidentNatureEnvFactor}</td>
                                                    <td>{item.dataset.accidentNatureOther}</td>

                                                </tr>
                                            )
                                        })}
                                        {
                                            <tr style={{ color: "red" }}>
                                                <th scope="row">總數</th>
                                                <td>{natureDataset.accidentNatureFall}</td>
                                                <td>{natureDataset.accidentNatureChok}</td>
                                                <td>{natureDataset.accidentNatureBehavior}</td>
                                                <td>{natureDataset.accidentNatureEnvFactor}</td>
                                                <td>{natureDataset.accidentNatureOther}</td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>)
            case "BY_MONTH_FINANCIAL":
                let accidentNatureFallResult = sampleThreeParser(data.filter((item) => {return item.AccidentNatureFall}), startDate, endDate);
                let accidentNatureFallMFChart = financialYearChartParser(accidentNatureFallResult);

                let accidentNatureChokResult = sampleThreeParser(data.filter((item) => {return item.AccidentNatureChok}), startDate, endDate);
                let accidentNatureChokMFChart = financialYearChartParser(accidentNatureChokResult);

                let accidentNatureBehaviorResult = sampleThreeParser(data.filter((item) => {return item.AccidentNatureBehavior}), startDate, endDate);
                let accidentNatureBehaviorMFChart = financialYearChartParser(accidentNatureBehaviorResult);

                let accidentNatureEnvFactorResult = sampleThreeParser(data.filter((item) => {return item.AccidentNatureEnvFactor}), startDate, endDate);
                let accidentNatureEnvFactorMFChart = financialYearChartParser(accidentNatureEnvFactorResult);

                let accidentNatureOtherResult = sampleThreeParser(data.filter((item) => {return item.AccidentNatureOther}), startDate, endDate);
                let accidentNatureOtherMFChart = financialYearChartParser(accidentNatureOtherResult);
                return <>
                    <div className="row">
                        <div className="col-1">
                            <h6 style={{ fontWeight: 600 }}>
                                標題:
                            </h6>
                        </div>
                        <div className="col-12">
                            <h6>{`${title} - 意外性質 跌倒 統計 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
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
                                    {accidentNatureFallResult.map((item) => {
                                        return (
                                            <tr>
                                                <th scope="row">{item.financialYear}</th>
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
                                    })}

                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                <div className="">
                                    {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                </div>
                                <div className="">
                                新發生意外或事故 意外性質 跌倒 總數 (每月總數)
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Line"
                                loader={<div>Loading Chart</div>}
                                data={accidentNatureFallMFChart}
                                options={{
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '跌倒 (外界人士意外每月總數)',
                                    },
                                }}
                            />
                        </div>
                        <div className="col-12">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={accidentNatureFallMFChart}
                                options={{
                                    // Material design options
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '跌倒 (外界人士意外每月總數)',
                                    },
                                }}

                            />
                        </div>
                    </div>
                    <hr/>
                    
                    <div className="row">
                        <div className="col-1">
                            <h6 style={{ fontWeight: 600 }}>
                                標題:
                            </h6>
                        </div>
                        <div className="col-12">
                            <h6>{`${title} - 意外性質 哽塞 統計 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
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
                                    {accidentNatureChokResult.map((item) => {
                                        return (
                                            <tr>
                                                <th scope="row">{item.financialYear}</th>
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
                                    })}

                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                <div className="">
                                    {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                </div>
                                <div className="">
                                新發生意外或事故 意外性質 哽塞 總數 (每月總數)
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Line"
                                loader={<div>Loading Chart</div>}
                                data={accidentNatureChokMFChart}
                                options={{
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '哽塞 (外界人士意外每月總數)',
                                    },
                                }}
                            />
                        </div>
                        <div className="col-12">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={accidentNatureChokMFChart}
                                options={{
                                    // Material design options
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '哽塞 (外界人士意外每月總數)',
                                    },
                                }}

                            />
                        </div>
                    </div>
                    <hr/>

                    <div className="row">
                        <div className="col-1">
                            <h6 style={{ fontWeight: 600 }}>
                                標題:
                            </h6>
                        </div>
                        <div className="col-12">
                            <h6>{`${title} - 意外性質 服務使用者行為問題 統計 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
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
                                    {accidentNatureBehaviorResult.map((item) => {
                                        return (
                                            <tr>
                                                <th scope="row">{item.financialYear}</th>
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
                                    })}

                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                <div className="">
                                    {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                </div>
                                <div className="">
                                新發生意外或事故 意外性質 服務使用者行為問題 總數 (每月總數)
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Line"
                                loader={<div>Loading Chart</div>}
                                data={accidentNatureBehaviorMFChart}
                                options={{
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '服務使用者行為問題 (外界人士意外每月總數)',
                                    },
                                }}
                            />
                        </div>
                        <div className="col-12">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={accidentNatureBehaviorMFChart}
                                options={{
                                    // Material design options
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '服務使用者行為問題 (外界人士意外每月總數)',
                                    },
                                }}

                            />
                        </div>
                    </div>
                    <hr/>

                    <div className="row">
                        <div className="col-1">
                            <h6 style={{ fontWeight: 600 }}>
                                標題:
                            </h6>
                        </div>
                        <div className="col-12">
                            <h6>{`${title} - 意外性質 環境因素 統計 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
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
                                    {accidentNatureEnvFactorResult.map((item) => {
                                        return (
                                            <tr>
                                                <th scope="row">{item.financialYear}</th>
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
                                    })}

                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                <div className="">
                                    {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                </div>
                                <div className="">
                                新發生意外或事故 意外性質 環境因素 總數 (每月總數)
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Line"
                                loader={<div>Loading Chart</div>}
                                data={accidentNatureEnvFactorMFChart}
                                options={{
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '環境因素 (外界人士意外每月總數)',
                                    },
                                }}
                            />
                        </div>
                        <div className="col-12">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={accidentNatureEnvFactorMFChart}
                                options={{
                                    // Material design options
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '環境因素 (外界人士意外每月總數)',
                                    },
                                }}

                            />
                        </div>
                    </div>
                    <hr/>

                    <div className="row">
                        <div className="col-1">
                            <h6 style={{ fontWeight: 600 }}>
                                標題:
                            </h6>
                        </div>
                        <div className="col-12">
                            <h6>{`${title} - 意外性質 其他 統計 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
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
                                    {accidentNatureOtherResult.map((item) => {
                                        return (
                                            <tr>
                                                <th scope="row">{item.financialYear}</th>
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
                                    })}

                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                <div className="">
                                    {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                </div>
                                <div className="">
                                新發生意外或事故 意外性質 其他 總數 (每月總數)
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Line"
                                loader={<div>Loading Chart</div>}
                                data={accidentNatureOtherMFChart}
                                options={{
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '其他 (外界人士意外每月總數)',
                                    },
                                }}
                            />
                        </div>
                        <div className="col-12">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={accidentNatureOtherMFChart}
                                options={{
                                    // Material design options
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '其他 (外界人士意外每月總數)',
                                    },
                                }}

                            />
                        </div>
                    </div>
                </>
            case "BY_MONTH_CALENDAR":
                let titleYear2 = "";
                let accidentNatureFallMCResult = sampleFourParser(data.filter((item) => {return item.AccidentNatureFall}), startDate, endDate);
                let accidentNatureFallMCChart = normalChartParser(accidentNatureFallMCResult);

                let accidentNatureChokMCResult = sampleFourParser(data.filter((item) => {return item.AccidentNatureChok}), startDate, endDate);
                let accidentNatureChokMCChart = normalChartParser(accidentNatureChokMCResult);

                let accidentNatureBehaviorMCResult = sampleFourParser(data.filter((item) => {return item.AccidentNatureBehavior}), startDate, endDate);
                let accidentNatureBehaviorMCChart = normalChartParser(accidentNatureBehaviorMCResult);

                let accidentNatureEnvFactorMCResult = sampleFourParser(data.filter((item) => {return item.AccidentNatureEnvFactor}), startDate, endDate);
                let accidentNatureEnvFactorMCChart = normalChartParser(accidentNatureEnvFactorMCResult);

                let accidentNatureOtherMCResult = sampleFourParser(data.filter((item) => {return item.AccidentNatureOther}), startDate, endDate);
                let accidentNatureOtherMCChart = normalChartParser(accidentNatureOtherMCResult);

                accidentNatureFallMCResult.forEach((item, i) => {
                    titleYear2 += item.year
                    if (i !== accidentNatureFallMCResult.length - 1) {
                        titleYear2 += ", "
                    }
                })
                return <>
                    <div className="row">
                        <div className="col-1">
                            <h6 style={{ fontWeight: 600 }}>
                                標題:
                            </h6>
                        </div>
                        <div className="col-12">
                            <h6>{`${titleYear2} - 外界人士意外 - 意外性質跌倒 統計 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
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
                                    {accidentNatureFallMCResult.map((item) => {
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
                    <div className="row">
                        <div className="col-12">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Line"
                                loader={<div>Loading Chart</div>}
                                data={accidentNatureFallMCChart}
                                options={{
                                    chart: {
                                        title: '日曆年度',
                                        subtitle: '跌倒 (外界人士意外每月總數)',
                                    },
                                }}
                            />
                        </div>
                        <div className="col-12">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={accidentNatureFallMCChart}
                                options={{
                                    // Material design options
                                    chart: {
                                        title: '日曆年度',
                                        subtitle: '跌倒 (外界人士意外每月總數)',
                                    },
                                }}

                            />
                        </div>
                    </div>
                    <hr/>

                    <div className="row">
                        <div className="col-1">
                            <h6 style={{ fontWeight: 600 }}>
                                標題:
                            </h6>
                        </div>
                        <div className="col-12">
                            <h6>{`${titleYear2} - 外界人士意外 - 意外性質 哽塞 統計 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
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
                                    {accidentNatureChokMCResult.map((item) => {
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
                    <div className="row">
                        <div className="col-12">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Line"
                                loader={<div>Loading Chart</div>}
                                data={accidentNatureChokMCChart}
                                options={{
                                    chart: {
                                        title: '日曆年度',
                                        subtitle: '哽塞 (外界人士意外每月總數)',
                                    },
                                }}
                            />
                        </div>
                        <div className="col-12">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={accidentNatureChokMCChart}
                                options={{
                                    // Material design options
                                    chart: {
                                        title: '日曆年度',
                                        subtitle: '哽塞 (外界人士意外每月總數)',
                                    },
                                }}

                            />
                        </div>
                    </div>
                    <hr/>

                    <div className="row">
                        <div className="col-1">
                            <h6 style={{ fontWeight: 600 }}>
                                標題:
                            </h6>
                        </div>
                        <div className="col-12">
                            <h6>{`${titleYear2} - 外界人士意外 - 意外性質 服務使用者行為問題 統計 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
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
                                    {accidentNatureChokMCResult.map((item) => {
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
                    <div className="row">
                        <div className="col-12">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Line"
                                loader={<div>Loading Chart</div>}
                                data={accidentNatureBehaviorMCChart}
                                options={{
                                    chart: {
                                        title: '日曆年度',
                                        subtitle: '服務使用者行為問題 (外界人士意外每月總數)',
                                    },
                                }}
                            />
                        </div>
                        <div className="col-12">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={accidentNatureBehaviorMCChart}
                                options={{
                                    // Material design options
                                    chart: {
                                        title: '日曆年度',
                                        subtitle: '服務使用者行為問題 (外界人士意外每月總數)',
                                    },
                                }}

                            />
                        </div>
                    </div>
                    <hr/>

                    <div className="row">
                        <div className="col-1">
                            <h6 style={{ fontWeight: 600 }}>
                                標題:
                            </h6>
                        </div>
                        <div className="col-12">
                            <h6>{`${titleYear2} - 外界人士意外 - 意外性質 環境因素 統計 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
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
                                    {accidentNatureEnvFactorMCResult.map((item) => {
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
                    <div className="row">
                        <div className="col-12">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Line"
                                loader={<div>Loading Chart</div>}
                                data={accidentNatureEnvFactorMCChart}
                                options={{
                                    chart: {
                                        title: '日曆年度',
                                        subtitle: '環境因素 (外界人士意外每月總數)',
                                    },
                                }}
                            />
                        </div>
                        <div className="col-12">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={accidentNatureEnvFactorMCChart}
                                options={{
                                    // Material design options
                                    chart: {
                                        title: '日曆年度',
                                        subtitle: '環境因素 (外界人士意外每月總數)',
                                    },
                                }}

                            />
                        </div>
                    </div>
                    <hr/>

                    <div className="row">
                        <div className="col-1">
                            <h6 style={{ fontWeight: 600 }}>
                                標題:
                            </h6>
                        </div>
                        <div className="col-12">
                            <h6>{`${titleYear2} - 外界人士意外 - 意外性質 其他 統計 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
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
                                    {accidentNatureOtherMCResult.map((item) => {
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
                    <div className="row">
                        <div className="col-12">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Line"
                                loader={<div>Loading Chart</div>}
                                data={accidentNatureOtherMCChart}
                                options={{
                                    chart: {
                                        title: '日曆年度',
                                        subtitle: '意外性質 其他 (外界人士意外每月總數)',
                                    },
                                }}
                            />
                        </div>
                        <div className="col-12">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={accidentNatureOtherMCChart}
                                options={{
                                    // Material design options
                                    chart: {
                                        title: '日曆年度',
                                        subtitle: '意外性質 其他 (外界人士意外每月總數)',
                                    },
                                }}

                            />
                        </div>
                    </div>
                    <hr/>
                </>
            case "BY_YEAR_FINANCIAL":
                let titleYear3 = "";
                let accidentFinancialResult = sampleFiveParser(data, startDate, endDate);
                let accidentFinancialChart = financialChartParser(accidentFinancialResult);
                accidentFinancialResult.forEach((item, i) => {
                    titleYear3 += item.financialYear;
                    if (i !== accidentFinancialResult.length - 1) {
                        titleYear3 += ", "
                    }
                })
                return <>
                    <div className="row">
                        <div className="col-1">
                            <h6 style={{ fontWeight: 600 }}>
                                標題:
                            </h6>
                        </div>
                        <div className="col-12">
                            <h6>{`${titleYear3} - 外界人士意外 - 意外性質統計 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">跌倒</th>
                                        <th scope="col">哽塞</th>
                                        <th scope="col">服務使用者行為問題</th>
                                        <th scope="col">環境因素</th>
                                        <th scope="col">其他</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {accidentFinancialResult.map((item) => {
                                        return (
                                            <tr>
                                                <th scope="row">{item.financialYear}</th>
                                                <td>{item.dataset.accidentNatureFall}</td>
                                                <td>{item.dataset.accidentNatureChok}</td>
                                                <td>{item.dataset.accidentNatureBehavior}</td>
                                                <td>{item.dataset.accidentNatureEnvFactor}</td>
                                                <td>{item.dataset.accidentNatureOther}</td>
                                            </tr>
                                        )
                                    })}
                                    {
                                        <tr style={{ color: "red" }}>
                                            <th scope="row">總數</th>
                                            <td>{natureDataset.accidentNatureFall}</td>
                                            <td>{natureDataset.accidentNatureChok}</td>
                                            <td>{natureDataset.accidentNatureBehavior}</td>
                                            <td>{natureDataset.accidentNatureEnvFactor}</td>
                                            <td>{natureDataset.accidentNatureOther}</td>
                                        </tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Line"
                                loader={<div>Loading Chart</div>}
                                data={accidentFinancialChart}
                                options={{
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '意外性質統計(每年總數)',
                                    },
                                }}
                            />
                        </div>
                        <div className="col-12">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={accidentFinancialChart}
                                options={{
                                    // Material design options
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '意外性質統計(每年總數)',
                                    },
                                }}
                            />
                        </div>
                    </div>
                </>

            case "BY_YEAR_CALENDAR":
                let titleYear4 = "";
                let accidentYearResult = sampleSixParser(data, startDate, endDate);
                let accidentYearChart = yearChartParser(accidentYearResult);
                accidentYearResult.forEach((item, i) => {
                    titleYear4 += item.year;
                    if (i !== accidentYearResult.length - 1) {
                        titleYear4 += ", "
                    }
                })
                return <>
                    <div className="row">
                        <div className="col-1">
                            <h6 style={{ fontWeight: 600 }}>
                                標題:
                            </h6>
                        </div>
                        <div className="col-12">
                            <h6>{`${titleYear4} - 意外性質統計 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">跌倒</th>
                                        <th scope="col">哽塞</th>
                                        <th scope="col">服務使用者行為問題</th>
                                        <th scope="col">環境因素</th>
                                        <th scope="col">其他</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {accidentYearResult.map((item) => {
                                        return (
                                            <tr>
                                                <th scope="row">{item.year}</th>
                                                <td>{item.dataset.accidentNatureFall}</td>
                                                <td>{item.dataset.accidentNatureChok}</td>
                                                <td>{item.dataset.accidentNatureBehavior}</td>
                                                <td>{item.dataset.accidentNatureEnvFactor}</td>
                                                <td>{item.dataset.accidentNatureOther}</td>

                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Line"
                                loader={<div>Loading Chart</div>}
                                data={accidentYearChart}
                                options={{
                                    chart: {
                                        title: '日曆年度',
                                        subtitle: '意外性質統計(每年總數)',
                                    },
                                }}
                            />
                        </div>
                        <div className="col-12">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={accidentYearChart}
                                options={{
                                    // Material design options
                                    chart: {
                                        title: '日曆年度',
                                        subtitle: '意外性質統計(每年總數)',
                                    },
                                }}

                            />
                        </div>
                    </div>
                </>
            default:
                return null;
        }
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

    const chartSwitch = () => {
        let title = `${moment(startDate).format("MM/YYYY")} - ${moment(endDate).format("MM/YYYY")} 服務使用者意外`

        switch (groupBy) {
            case "NON":
                return (
                    <React.Fragment>
                        <div className="row">
                            <div className="col-12">
                                <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                    <div className="">
                                        {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                    </div>
                                    <div className="">
                                        外界人士意外 - 意外性質統計
                                    </div>
                                </div>
                                <div className="">
                                    <Chart
                                        chartType={"Bar"}
                                        width={'100%'}
                                        height={'400px'}
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
                            <div className="col-12">
                                <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                    <div className="">
                                        {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                    </div>
                                    <div className="">
                                        外界人士意外 - 意外性質統計
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
                let months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
                months -= startDate.getMonth();
                months += endDate.getMonth();
                let newWidth = (200 * months) + 200;
                return (
                    <div className="row">
                        <div className="col-12" style={{overflow:'auto'}}>
                            <Chart
                                width={newWidth}
                                height={400}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={[['月份', '跌倒', '哽塞', '服務使用者行為問題', '環境因素', '其他'],
                                ...sampleTwoParser(data, startDate, endDate).map((item) => {
                                    debugger
                                    return [item.month, item.dataset.accidentNatureFall, item.dataset.accidentNatureChok, item.dataset.accidentNatureBehavior, item.dataset.accidentNatureEnvFactor, item.dataset.accidentNatureOther]
                                })]
                            }

                            />
                        </div>
                    </div>
                    
                )
            default:
                return null;
        }
    }

    const changeGroupHandler = (event) => {
        const value = event.target.value;
        if (value == 'BY_MONTH_FINANCIAL') {
            setStartDate(new Date(new Date().getFullYear()-1, 3, 1));
            setEndDate(new Date(new Date().getFullYear(),2,31));
        } else if (value == 'BY_MONTH_CALENDAR') {
            setStartDate(new Date(new Date().getFullYear(), 0, 1));
            setEndDate(new Date(new Date().getFullYear(),11,31));
        } else if (value == 'BY_YEAR_FINANCIAL') {
            setStartDate(new Date(new Date().getFullYear()-3, 3, 1));
            setEndDate(new Date(new Date().getFullYear(),2,31));
        } else if (value == 'BY_YEAR_FINANCIAL') {
            setStartDate(new Date(new Date().getFullYear()-3, 0, 1));
            setEndDate(new Date(new Date().getFullYear(),11,31));
        }
        setGroupBy(value);
    }

    useEffect(() => {
        switch (groupBy) {
            case "NON":
                setNatureDataset(sampleOneParser(data));
            case "BY_MONTH":
            case "BY_MONTH_FINANCIAL":
            case "BY_MONTH_CALENDAR":
            case "BY_YEAR_FINANCIAL":
            case "BY_YEAR_CALENDAR":
            default:
                console.log("default");
        }
    }, [groupBy, data])

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
                    <select multiple className="form-control" onChange={changeGroupHandler}>
                        <option value="NON">不需要</option>
                        <option value="BY_MONTH">按月</option>
                        <option value="BY_MONTH_FINANCIAL">按月 - 財政年度</option>
                        <option value="BY_MONTH_CALENDAR">按月 - 日曆年度</option>
                        <option value="BY_YEAR_FINANCIAL">按年 - 財政年度</option>
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
            </div>
            <div className="">
                {chartSwitch()}
            </div>
        </div>
    )
}

export default OutsiderAccidentNature

