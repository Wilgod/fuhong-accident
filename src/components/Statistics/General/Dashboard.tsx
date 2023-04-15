import * as React from "react";
import { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as moment from 'moment';
import Chart from "react-google-charts";
import useServiceLocation from '../../../hooks/useServiceLocation';
import useDashboardStats from '../../../hooks/useDashboardStats';
import { getCurrentFinancialYear } from '../../../utils/CaseNumberParser';
import { getDateFinancialYear, getDateYear } from '../../../utils/DateUtils';
import arraySort from 'array-sort';
import * as copy from 'copy-to-clipboard';
import "./General.css";
import html2canvas from 'html2canvas';
import downloadjs from 'downloadjs';
import { isMobile } from 'react-device-detect';

interface IDataset {
    sui: number;
    pui: number;
    sih: number;
    sid: number;
    oin: number;
}

interface ISampleTwoDataset {
    month: string;
    dataset: IDataset
    mmyyyy: number;
}

interface ISampleThreeDataset {
    year: string;
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

const initialDataset: IDataset = {
    sui: 0,
    pui: 0,
    sih: 0,
    sid: 0,
    oin: 0
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


const unitFilter = (formType: string, dataset: IDataset) => {
    let result = { ...dataset };

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
            return result;
    }
}

const monthZero = (dataset: IMonth = initialDatasetMonth): IMonth => {
    let result = { ...dataset };
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

const sampleTwoParser = (data: any[], startDate: Date, endDate: Date): ISampleTwoDataset[] => {
    let m = new Map<string, IDataset>();
    let result: ISampleTwoDataset[] = [];

    const diff = monthDiff(startDate, endDate);
    for (let i = diff; i > -1; i--) {
        //new Date(endDate).setMonth(new Date(endDate).getMonth() - i)
        let currentMonth = new Date(endDate).getMonth();
        let currentYear = new Date(endDate).getFullYear();
        let calMonth;
        let calYear;
        if (currentMonth - i < 0) {
            if (i > 12) {
                let moreYear = Math.floor(i / 12);
                let remainMonth = i % 12;
                if (currentMonth - remainMonth < 0) {
                    calMonth = 12 - (remainMonth - currentMonth);
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
        const d = moment(new Date(calYear, calMonth, 1)).format("MM/yyyy");
        m.set(d, { ...initialDataset });
    }

    data.forEach((item) => {
        if ((item.AccidentTime || item.IncidentTime) && item.CaseNumber) {
            const formType: string = item.CaseNumber.split("-")[0];
            const date = new Date(item.AccidentTime || item.IncidentTime);
            const formattedDate = moment(date).format("MM/yyyy");
            if (m.has(formattedDate)) {
                let oldDataset = m.get(formattedDate);
                let newDataset = unitFilter(formType, oldDataset);
                m.set(formattedDate, newDataset);
            } else {
                let newDataset = unitFilter(formType, initialDataset);
                m.set(formattedDate, newDataset);
            }
        }
    });

    m.forEach((value, key) => {
        let item: ISampleTwoDataset = { month: key, dataset: value, mmyyyy: parseInt(key.substr(3, 4) + key.substr(0, 2)) }
        result.push(item);
    })
    arraySort(result, 'mmyyyy');
    return result;
}

const yearChartParser = (result, startMonth) => {
    let dataResult = ['Month'];
    let jan = ['JAN'];
    let feb = ['FEB'];
    let mar = ['MAR'];
    let apr = ['APR'];
    let may = ['MAY'];
    let jun = ['JUN'];
    let jul = ['JUL'];
    let aug = ['AUG'];
    let sep = ['SEP'];
    let oct = ['OCT'];
    let nov = ['NOV'];
    let dec = ['DEC'];
    result.map((item) => {
        dataResult.push(item.year);
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
    let data = [];
    if (startMonth == 0) {
        data = [dataResult, jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec];
    } else if (startMonth == 1) {
        data = [dataResult, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec, jan];
    } else if (startMonth == 2) {
        data = [dataResult, mar, apr, may, jun, jul, aug, sep, oct, nov, dec, jan, feb];
    } else if (startMonth == 3) {
        data = [dataResult, apr, may, jun, jul, aug, sep, oct, nov, dec, jan, feb, mar];
    } else if (startMonth == 4) {
        data = [dataResult, may, jun, jul, aug, sep, oct, nov, dec, jan, feb, mar, apr];
    } else if (startMonth == 5) {
        data = [dataResult, jun, jul, aug, sep, oct, nov, dec, jan, feb, mar, apr, may];
    } else if (startMonth == 6) {
        data = [dataResult, jul, aug, sep, oct, nov, dec, jan, feb, mar, apr, may, jun];
    } else if (startMonth == 7) {
        data = [dataResult, aug, sep, oct, nov, dec, jan, feb, mar, apr, may, jun, jul];
    } else if (startMonth == 8) {
        data = [dataResult, sep, oct, nov, dec, jan, feb, mar, apr, may, jun, jul, aug];
    } else if (startMonth == 9) {
        data = [dataResult, oct, nov, dec, jan, feb, mar, apr, may, jun, jul, aug, sep];
    } else if (startMonth == 10) {
        data = [dataResult, nov, dec, jan, feb, mar, apr, may, jun, jul, aug, sep, oct];
    } else if (startMonth == 11) {
        data = [dataResult, dec, jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov];
    }
    return data;
}






const sampleThreeParser = (data: any[], startDate: Date, endDate: Date): ISampleThreeDataset[] => {
    let result: ISampleThreeDataset[] = [];
    let m = new Map<string, IMonth>();

    data.forEach((item) => {
        const d = new Date(item.AccidentTime || item.IncidentTime);
        if ((d.getTime() <= endDate.getTime() && d.getTime() >= startDate.getTime()))
            if (d) {
                //const currentFinicailYear = getDateFinancialYear(d);

                const currentYear = startDate.getFullYear() + '-' + endDate.getFullYear();
                let oldDataset = m.get(currentYear);
                let newDataset = monthFilter(d.getMonth() + 1, oldDataset);
                m.set(currentYear, newDataset);
            }
    });
    m.forEach((value, key) => {
        let item: ISampleThreeDataset = { year: key, dataset: value }
        result.push(item);
    })

    let temp = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    for (let d = temp; d <= endDate; d.setFullYear(d.getFullYear() + 1)) {
        const year = startDate.getFullYear() + '-' + endDate.getFullYear();
        let m1 = new Map<string, IMonth>();
        const filterResult = result.filter(item => { return item.year == year });
        if (filterResult.length == 0) {
            let newDataset = monthZero();
            m1.set(year, newDataset);
        }
        m1.forEach((value, key) => {
            let item: ISampleThreeDataset = { year: key, dataset: value }
            result.push(item);
        })
    }

    arraySort(result, 'year');
    return result;
}


function Dashboard(props) {
    const [groupBy, setGroupBy] = useState("NON");
    const [serviceLocation] = useServiceLocation(props.siteCollectionUrl);
    const [data, startDate, endDate, serviceUnits, setStartDate, setEndDate, setServiceUnits] = useDashboardStats(props.permission);
    const [unitDataset, setUnitDataset] = useState<IDataset>(initialDataset);
    const [displayBarChart1, setDisplayBarChart1] = useState("none");
    const [displayBarChart2, setDisplayBarChart2] = useState("none");
    const [displayBarChart3, setDisplayBarChart3] = useState("none");
    const [displayBarChart4, setDisplayBarChart4] = useState("none");
    const [displayBarChart5, setDisplayBarChart5] = useState("none");
    const [displayBarChart6, setDisplayBarChart6] = useState("none");

    const ref = React.useRef();
    const multipleOptionsSelectParser = (event) => {
        let result = [];
        const selectedOptions = event.target.selectedOptions;
        for (let i = 0; i < selectedOptions.length; i++) {
            result.push(selectedOptions[i].value);
        }
        return result;
    }

    const changeStaticsComponentByStartDate = (e) => {
        setStartDate(e);
        const oldGroupBy = groupBy
        setGroupBy("");
        setTimeout(() => {
            setGroupBy(oldGroupBy);
        }, 500);
    }
    const changeStaticsComponentByEndDate = (e) => {
        setEndDate(e);
        const oldGroupBy = groupBy
        setGroupBy("");
        setTimeout(() => {
            setGroupBy(oldGroupBy);
        }, 500);
    }
    const byMonthTableComponent = () => {
        return (
            <table className="table" id="table1">
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

    const changeGroupHandler = (event) => {
        const value = event.target.value;
        if (value == 'BY_MONTH_FINANCIAL') {
            setStartDate(new Date(new Date().getFullYear() - 1, 3, 1));
            setEndDate(new Date(new Date().getFullYear(), 2, 31));
        } else if (value == 'BY_MONTH_CALENDAR') {
            setStartDate(new Date(new Date().getFullYear(), 0, 1));
            setEndDate(new Date(new Date().getFullYear(), 11, 31));
        } else if (value == 'BY_YEAR_FINANCIAL') {
            setStartDate(new Date(new Date().getFullYear() - 3, 3, 1));
            setEndDate(new Date(new Date().getFullYear(), 2, 31));
        } else if (value == 'BY_YEAR_FINANCIAL') {
            setStartDate(new Date(new Date().getFullYear() - 3, 0, 1));
            setEndDate(new Date(new Date().getFullYear(), 11, 31));
        }
        setGroupBy(value);
    }

    function copyTable(id) {
        var urlField = document.querySelector(id);
        let range, sel;
        range = document.createRange();
        sel = window.getSelection();
        // unselect any element in the page
        sel.removeAllRanges();

        try {
            range.selectNodeContents(urlField);
            sel.addRange(range);
        } catch (e) {
            range.selectNode(urlField);
            sel.addRange(range);
        }

        document.execCommand('copy');
        sel.removeAllRanges();
    }
    useEffect(() => {
        switch (groupBy) {
            case "NON":
                setUnitDataset(sampleOneParser(data))
            case "BY_MONTH":
            case "BY_MONTH_FINANCIAL":
            case "BY_MONTH_CALENDAR":
            case "BY_YEAR_FINANCIAL":
            case "BY_YEAR_CALENDAR":
            default:
                console.log("default");
        }
    }, [groupBy, data])


    const downloadScreenshot = async (className) => {

        let chart = (document.querySelector("." + className) as HTMLElement);
        const canvas = await html2canvas(chart);
        const dataURL = canvas.toDataURL('image/png');
        downloadjs(dataURL, 'download.png', 'image/png');
    }



    const statsTableSwitch = () => {
        let title = `${moment(startDate).format("MM/YYYY")} - ${moment(endDate).format("MM/YYYY")}`
        switch (groupBy) {
            case "NON":
                console.log('serviceUnits', serviceUnits)
                return (
                    <React.Fragment>
                        <div className="row">
                            <div className="col-12">
                                <h6 style={{ fontWeight: 600 }}>
                                    標題:
                                </h6>
                            </div>
                            <div className="col-12">
                                <h6>{`${title} - 新發生意外或事故總數 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
                            </div>
                            <div className="col-12" style={{ margin: '5px 0' }}>
                                <button className="btn btn-primary" onClick={() => copyTable('#table1')}>複製到表格</button>&nbsp;&nbsp;&nbsp;
                                {displayBarChart1 == '' &&
                                    <button className="btn btn-primary" onClick={() => setDisplayBarChart1('none')}>隱藏圖表</button>
                                }
                                {displayBarChart1 == 'none' &&
                                    <button className="btn btn-primary" onClick={() => setDisplayBarChart1('')}>顯示圖表</button>
                                }
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                {byMonthTableComponent()}
                            </div>
                        </div>
                    </React.Fragment>
                )
            default:
                return null;
        }
    }

    const chartSwitch = () => {
        let title = `${moment(startDate).format("MM/YYYY")} - ${moment(endDate).format("MM/YYYY")}`
        console.log('startDate', startDate.getMonth());
        let SUIResult = sampleThreeParser(data.filter((item) => item.CaseNumber.indexOf("SUI") > -1), startDate, endDate);
        let SUIFYChart = yearChartParser(SUIResult, startDate.getMonth());

        let PUIResult = sampleThreeParser(data.filter((item) => item.CaseNumber.indexOf("PUI") > -1), startDate, endDate);
        let PUIFYChart = yearChartParser(PUIResult, startDate.getMonth());

        let SIHResult = sampleThreeParser(data.filter((item) => item.CaseNumber.indexOf("SIH") > -1), startDate, endDate);
        let SIHFYChart = yearChartParser(SIHResult, startDate.getMonth());

        let SIDResult = sampleThreeParser(data.filter((item) => item.CaseNumber.indexOf("SID") > -1), startDate, endDate);
        let SIDFYChart = yearChartParser(SIDResult, startDate.getMonth());

        let OINResult = sampleThreeParser(data.filter((item) => item.CaseNumber.indexOf("OIN") > -1), startDate, endDate);
        let OINFYChart = yearChartParser(OINResult, startDate.getMonth());
        let div = [];
        if (startDate.getMonth() == 0) {
            div.push(<th scope="col">Jan</th>);
            div.push(<th scope="col">Feb</th>);
            div.push(<th scope="col">Mar</th>);
            div.push(<th scope="col">Apr</th>);
            div.push(<th scope="col">May</th>);
            div.push(<th scope="col">Jun</th>);
            div.push(<th scope="col">Jul</th>);
            div.push(<th scope="col">Aug</th>);
            div.push(<th scope="col">Sep</th>);
            div.push(<th scope="col">Oct</th>);
            div.push(<th scope="col">Nov</th>);
            div.push(<th scope="col">Dec</th>);
        } else if (startDate.getMonth() == 1) {
            div.push(<th scope="col">Feb</th>);
            div.push(<th scope="col">Mar</th>);
            div.push(<th scope="col">Apr</th>);
            div.push(<th scope="col">May</th>);
            div.push(<th scope="col">Jun</th>);
            div.push(<th scope="col">Jul</th>);
            div.push(<th scope="col">Aug</th>);
            div.push(<th scope="col">Sep</th>);
            div.push(<th scope="col">Oct</th>);
            div.push(<th scope="col">Nov</th>);
            div.push(<th scope="col">Dec</th>);
            div.push(<th scope="col">Jan</th>);
        } else if (startDate.getMonth() == 2) {
            div.push(<th scope="col">Mar</th>);
            div.push(<th scope="col">Apr</th>);
            div.push(<th scope="col">May</th>);
            div.push(<th scope="col">Jun</th>);
            div.push(<th scope="col">Jul</th>);
            div.push(<th scope="col">Aug</th>);
            div.push(<th scope="col">Sep</th>);
            div.push(<th scope="col">Oct</th>);
            div.push(<th scope="col">Nov</th>);
            div.push(<th scope="col">Dec</th>);
            div.push(<th scope="col">Jan</th>);
            div.push(<th scope="col">Feb</th>);
        } else if (startDate.getMonth() == 3) {
            div.push(<th scope="col">Apr</th>);
            div.push(<th scope="col">May</th>);
            div.push(<th scope="col">Jun</th>);
            div.push(<th scope="col">Jul</th>);
            div.push(<th scope="col">Aug</th>);
            div.push(<th scope="col">Sep</th>);
            div.push(<th scope="col">Oct</th>);
            div.push(<th scope="col">Nov</th>);
            div.push(<th scope="col">Dec</th>);
            div.push(<th scope="col">Jan</th>);
            div.push(<th scope="col">Feb</th>);
            div.push(<th scope="col">Mar</th>);
        } else if (startDate.getMonth() == 4) {
            div.push(<th scope="col">May</th>);
            div.push(<th scope="col">Jun</th>);
            div.push(<th scope="col">Jul</th>);
            div.push(<th scope="col">Aug</th>);
            div.push(<th scope="col">Sep</th>);
            div.push(<th scope="col">Oct</th>);
            div.push(<th scope="col">Nov</th>);
            div.push(<th scope="col">Dec</th>);
            div.push(<th scope="col">Jan</th>);
            div.push(<th scope="col">Feb</th>);
            div.push(<th scope="col">Mar</th>);
            div.push(<th scope="col">Apr</th>);
        } else if (startDate.getMonth() == 5) {
            div.push(<th scope="col">Jun</th>);
            div.push(<th scope="col">Jul</th>);
            div.push(<th scope="col">Aug</th>);
            div.push(<th scope="col">Sep</th>);
            div.push(<th scope="col">Oct</th>);
            div.push(<th scope="col">Nov</th>);
            div.push(<th scope="col">Dec</th>);
            div.push(<th scope="col">Jan</th>);
            div.push(<th scope="col">Feb</th>);
            div.push(<th scope="col">Mar</th>);
            div.push(<th scope="col">Apr</th>);
            div.push(<th scope="col">May</th>);
        } else if (startDate.getMonth() == 6) {
            div.push(<th scope="col">Jul</th>);
            div.push(<th scope="col">Aug</th>);
            div.push(<th scope="col">Sep</th>);
            div.push(<th scope="col">Oct</th>);
            div.push(<th scope="col">Nov</th>);
            div.push(<th scope="col">Dec</th>);
            div.push(<th scope="col">Jan</th>);
            div.push(<th scope="col">Feb</th>);
            div.push(<th scope="col">Mar</th>);
            div.push(<th scope="col">Apr</th>);
            div.push(<th scope="col">May</th>);
            div.push(<th scope="col">Jun</th>);
        } else if (startDate.getMonth() == 7) {
            div.push(<th scope="col">Aug</th>);
            div.push(<th scope="col">Sep</th>);
            div.push(<th scope="col">Oct</th>);
            div.push(<th scope="col">Nov</th>);
            div.push(<th scope="col">Dec</th>);
            div.push(<th scope="col">Jan</th>);
            div.push(<th scope="col">Feb</th>);
            div.push(<th scope="col">Mar</th>);
            div.push(<th scope="col">Apr</th>);
            div.push(<th scope="col">May</th>);
            div.push(<th scope="col">Jun</th>);
            div.push(<th scope="col">Jul</th>);
        } else if (startDate.getMonth() == 8) {
            div.push(<th scope="col">Sep</th>);
            div.push(<th scope="col">Oct</th>);
            div.push(<th scope="col">Nov</th>);
            div.push(<th scope="col">Dec</th>);
            div.push(<th scope="col">Jan</th>);
            div.push(<th scope="col">Feb</th>);
            div.push(<th scope="col">Mar</th>);
            div.push(<th scope="col">Apr</th>);
            div.push(<th scope="col">May</th>);
            div.push(<th scope="col">Jun</th>);
            div.push(<th scope="col">Jul</th>);
            div.push(<th scope="col">Aug</th>);
        } else if (startDate.getMonth() == 9) {
            div.push(<th scope="col">Oct</th>);
            div.push(<th scope="col">Nov</th>);
            div.push(<th scope="col">Dec</th>);
            div.push(<th scope="col">Jan</th>);
            div.push(<th scope="col">Feb</th>);
            div.push(<th scope="col">Mar</th>);
            div.push(<th scope="col">Apr</th>);
            div.push(<th scope="col">May</th>);
            div.push(<th scope="col">Jun</th>);
            div.push(<th scope="col">Jul</th>);
            div.push(<th scope="col">Aug</th>);
            div.push(<th scope="col">Sep</th>);
        } else if (startDate.getMonth() == 10) {
            div.push(<th scope="col">Nov</th>);
            div.push(<th scope="col">Dec</th>);
            div.push(<th scope="col">Jan</th>);
            div.push(<th scope="col">Feb</th>);
            div.push(<th scope="col">Mar</th>);
            div.push(<th scope="col">Apr</th>);
            div.push(<th scope="col">May</th>);
            div.push(<th scope="col">Jun</th>);
            div.push(<th scope="col">Jul</th>);
            div.push(<th scope="col">Aug</th>);
            div.push(<th scope="col">Sep</th>);
            div.push(<th scope="col">Oct</th>);
        } else if (startDate.getMonth() == 11) {
            div.push(<th scope="col">Dec</th>);
            div.push(<th scope="col">Jan</th>);
            div.push(<th scope="col">Feb</th>);
            div.push(<th scope="col">Mar</th>);
            div.push(<th scope="col">Apr</th>);
            div.push(<th scope="col">May</th>);
            div.push(<th scope="col">Jun</th>);
            div.push(<th scope="col">Jul</th>);
            div.push(<th scope="col">Aug</th>);
            div.push(<th scope="col">Sep</th>);
            div.push(<th scope="col">Oct</th>);
            div.push(<th scope="col">Nov</th>);
        }
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-12" style={{ display: displayBarChart1 }}>
                        <button className="btn btn-primary" onClick={() => downloadScreenshot("nonBarChart")}>下載圖表</button>
                        <div className="nonBarChart">
                            <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                <div className="">
                                    {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                </div>
                                <div className="">
                                    新發生意外或事故總數
                                </div>
                            </div>
                            <Chart
                                chartType={"Bar"}
                                width={'100%'}
                                height={'400px'}
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
                    {/*<div className="col-12">
                        <button className="btn btn-primary" onClick={()=>downloadScreenshot("nonPieChart")}>下載圖表</button>
                        <div className="nonPieChart">
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
                                width={'100%'}
                                height={'400px'}
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
                    </div>*/}
                </div>

                <hr />
                <div className="row">
                    <div className="col-12">
                        <h6 style={{ fontWeight: 600 }}>
                            標題:
                        </h6>
                    </div>
                    <div className="col-12">
                        <h6>{`${title} - 服務使用者意外每月總數 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`} </h6>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12" style={{ margin: '5px 0' }}>
                        <button className="btn btn-primary" onClick={() => copyTable('#table3')}>複製到表格</button>&nbsp;&nbsp;&nbsp;
                        {displayBarChart2 == '' &&
                            <button className="btn btn-primary" onClick={() => setDisplayBarChart2('none')}>隱藏圖表</button>
                        }
                        {displayBarChart2 == 'none' &&
                            <button className="btn btn-primary" onClick={() => setDisplayBarChart2('')}>顯示圖表</button>
                        }
                    </div>
                    <div className="col-12" style={{ overflow: isMobile && 'auto' }}>
                        <table className="table" id="table3" style={{ width: isMobile && 'max-content' }}>
                            <thead>
                                <tr>
                                    <th scope="col">服務使用者意外</th>
                                    {div}
                                </tr>
                            </thead>
                            <tbody>
                                {SUIResult.map((item) => {
                                    let result = [];
                                    if (startDate.getMonth() == 0) {
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                    } else if (startDate.getMonth() == 1) {
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                    } else if (startDate.getMonth() == 2) {
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                    } else if (startDate.getMonth() == 3) {
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                    } else if (startDate.getMonth() == 4) {
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                    } else if (startDate.getMonth() == 5) {
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                    } else if (startDate.getMonth() == 6) {
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                    } else if (startDate.getMonth() == 7) {
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                    } else if (startDate.getMonth() == 8) {
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                    } else if (startDate.getMonth() == 9) {
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                    } else if (startDate.getMonth() == 10) {
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                    } else if (startDate.getMonth() == 11) {
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                    }
                                    return (
                                        <tr>
                                            <th scope="row">{item.year}</th>
                                            {result}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="row" style={{ display: displayBarChart2 }}>
                    {/*<div className="col-12">
                        <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthFinancialLineChart1")}>下載圖表</button>
                    </div>
                    <div className="col-12 byMonthFinancialLineChart1">
                        <div className="text-center mb-2" style={{ fontSize: 16 }}>
                            <div className="">
                                {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                            </div>
                            <div className="">
                            服務使用者意外 (每月總數)
                            </div>
                        </div>
                        <Chart
                            width={'100%'}
                            height={'400px'}
                            chartType="Line"
                            loader={<div>Loading Chart</div>}
                            data={SUIFYChart}
                        />
                    </div>*/}
                    <div className="col-12">
                        <button className="btn btn-primary" onClick={() => downloadScreenshot("byMonthFinancialBarChart1")}>下載圖表</button>
                    </div>
                    <div className="col-12 byMonthFinancialBarChart1">
                        <div className="text-center mb-2" style={{ fontSize: 16 }}>
                            <div className="">
                                {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                            </div>
                            <div className="">
                                服務使用者意外 (每月總數)
                            </div>
                        </div>
                        <Chart
                            width={'100%'}
                            height={'400px'}
                            chartType="Bar"
                            loader={<div>Loading Chart</div>}
                            data={SUIFYChart}

                        />
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-12">
                        <h6 style={{ fontWeight: 600 }}>
                            標題:
                        </h6>
                    </div>
                    <div className="col-12">
                        <h6>{`${title} - 外界人士意外每月總數 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
                    </div>
                    <div className="col-12" style={{ margin: '5px 0' }}>
                        <button className="btn btn-primary" onClick={() => copyTable('#table4')}>複製到表格</button>&nbsp;&nbsp;&nbsp;
                        {displayBarChart3 == '' &&
                            <button className="btn btn-primary" onClick={() => setDisplayBarChart3('none')}>隱藏圖表</button>
                        }
                        {displayBarChart3 == 'none' &&
                            <button className="btn btn-primary" onClick={() => setDisplayBarChart3('')}>顯示圖表</button>
                        }
                    </div>
                </div>
                <div className="row">
                    <div className="col-12" style={{ overflow: isMobile && 'auto' }}>
                        <table className="table" id="table4" style={{ width: isMobile && 'max-content' }}>
                            <thead>
                                <tr>
                                    <th scope="col">外界人士意外</th>
                                    {div}
                                </tr>
                            </thead>
                            <tbody>
                                {sampleThreeParser(data.filter((item) => item.CaseNumber.indexOf("PUI") > -1), startDate, endDate).map((item) => {
                                    let result = [];
                                    if (startDate.getMonth() == 0) {
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                    } else if (startDate.getMonth() == 1) {
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                    } else if (startDate.getMonth() == 2) {
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                    } else if (startDate.getMonth() == 3) {
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                    } else if (startDate.getMonth() == 4) {
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                    } else if (startDate.getMonth() == 5) {
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                    } else if (startDate.getMonth() == 6) {
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                    } else if (startDate.getMonth() == 7) {
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                    } else if (startDate.getMonth() == 8) {
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                    } else if (startDate.getMonth() == 9) {
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                    } else if (startDate.getMonth() == 10) {
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                    } else if (startDate.getMonth() == 11) {
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                    }
                                    return (
                                        <tr>
                                            <th scope="row">{item.year}</th>
                                            {result}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="row" style={{ display: displayBarChart3 }}>
                    {/*<div className="col-12">
                        <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthFinancialLineChart2")}>下載圖表</button>
                    </div>
                    <div className="col-12 byMonthFinancialLineChart2">
                        <div className="text-center mb-2" style={{ fontSize: 16 }}>
                            <div className="">
                                {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                            </div>
                            <div className="">
                            外界人士意外 (每月總數)
                            </div>
                        </div>
                        <Chart
                            width={'100%'}
                            height={'400px'}
                            chartType="Line"
                            loader={<div>Loading Chart</div>}
                            data={PUIFYChart}
                        />
                    </div>*/}
                    <div className="col-12">
                        <button className="btn btn-primary" onClick={() => downloadScreenshot("byMonthFinancialBarChart2")}>下載圖表</button>
                    </div>
                    <div className="col-12 byMonthFinancialBarChart2">
                        <div className="text-center mb-2" style={{ fontSize: 16 }}>
                            <div className="">
                                {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                            </div>
                            <div className="">
                                外界人士意外 (每月總數)
                            </div>
                        </div>
                        <Chart
                            width={'100%'}
                            height={'400px'}
                            chartType="Bar"
                            loader={<div>Loading Chart</div>}
                            data={PUIFYChart}
                        />
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-12">
                        <h6 style={{ fontWeight: 600 }}>
                            標題:
                        </h6>
                    </div>
                    <div className="col-12">
                        <h6>{`${title} - 特別事故(牌照事務處)每月總數 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
                    </div>
                    <div className="col-12" style={{ margin: '5px 0' }}>
                        <button className="btn btn-primary" onClick={() => copyTable('#table5')}>複製到表格</button>&nbsp;&nbsp;&nbsp;
                        {displayBarChart4 == '' &&
                            <button className="btn btn-primary" onClick={() => setDisplayBarChart4('none')}>隱藏圖表</button>
                        }
                        {displayBarChart4 == 'none' &&
                            <button className="btn btn-primary" onClick={() => setDisplayBarChart4('')}>顯示圖表</button>
                        }
                    </div>
                </div>
                <div className="row">
                    <div className="col-12" style={{ overflow: isMobile && 'auto' }}>
                        <table className="table" id="table5" style={{ width: isMobile && 'max-content' }}>
                            <thead>
                                <tr>
                                    <th scope="col">特別事故(牌照事務處)</th>
                                    {div}
                                </tr>
                            </thead>
                            <tbody>
                                {sampleThreeParser(data.filter((item) => item.CaseNumber.indexOf("SIH") > -1), startDate, endDate).map((item) => {
                                    let result = [];
                                    if (startDate.getMonth() == 0) {
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                    } else if (startDate.getMonth() == 1) {
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                    } else if (startDate.getMonth() == 2) {
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                    } else if (startDate.getMonth() == 3) {
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                    } else if (startDate.getMonth() == 4) {
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                    } else if (startDate.getMonth() == 5) {
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                    } else if (startDate.getMonth() == 6) {
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                    } else if (startDate.getMonth() == 7) {
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                    } else if (startDate.getMonth() == 8) {
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                    } else if (startDate.getMonth() == 9) {
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                    } else if (startDate.getMonth() == 10) {
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                    } else if (startDate.getMonth() == 11) {
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                    }
                                    return (
                                        <tr>
                                            <th scope="row">{item.year}</th>
                                            {result}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="row" style={{ display: displayBarChart4 }}>
                    {/*<div className="col-12">
                        <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthFinancialLineChart3")}>下載圖表</button>
                    </div>
                    <div className="col-12 byMonthFinancialLineChart3">
                        <div className="text-center mb-2" style={{ fontSize: 16 }}>
                            <div className="">
                                {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                            </div>
                            <div className="">
                            特別事故(牌照事務處) (每月總數)
                            </div>
                        </div>
                        <Chart
                            width={'100%'}
                            height={'400px'}
                            chartType="Line"
                            loader={<div>Loading Chart</div>}
                            data={SIHFYChart}
                        />
                    </div>*/}
                    <div className="col-12">
                        <button className="btn btn-primary" onClick={() => downloadScreenshot("byMonthFinancialBarChart3")}>下載圖表</button>
                    </div>
                    <div className="col-12 byMonthFinancialBarChart3">
                        <div className="text-center mb-2" style={{ fontSize: 16 }}>
                            <div className="">
                                {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                            </div>
                            <div className="">
                                特別事故(牌照事務處) (每月總數)
                            </div>
                        </div>
                        <Chart
                            width={'100%'}
                            height={'400px'}
                            chartType="Bar"
                            loader={<div>Loading Chart</div>}
                            data={SIHFYChart}
                        />
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-12">
                        <h6 style={{ fontWeight: 600 }}>
                            標題:
                        </h6>
                    </div>
                    <div className="col-12">
                        <h6>{`${title} - 財政年度新發生意外或事故 (特別事故(津貼科)每月總數) - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
                    </div>
                    <div className="col-12" style={{ margin: '5px 0' }}>
                        <button className="btn btn-primary" onClick={() => copyTable('#table6')}>複製到表格</button>&nbsp;&nbsp;&nbsp;
                        {displayBarChart5 == '' &&
                            <button className="btn btn-primary" onClick={() => setDisplayBarChart5('none')}>隱藏圖表</button>
                        }
                        {displayBarChart5 == 'none' &&
                            <button className="btn btn-primary" onClick={() => setDisplayBarChart5('')}>顯示圖表</button>
                        }
                    </div>
                </div>
                <div className="row">
                    <div className="col-12" style={{ overflow: isMobile && 'auto' }}>
                        <table className="table" id="table6" style={{ width: isMobile && 'max-content' }}>
                            <thead>
                                <tr>
                                    <th scope="col">特別事故(津貼科))</th>
                                    {div}
                                </tr>
                            </thead>
                            <tbody>
                                {sampleThreeParser(data.filter((item) => item.CaseNumber.indexOf("SID") > -1), startDate, endDate).map((item) => {
                                    let result = [];
                                    if (startDate.getMonth() == 0) {
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                    } else if (startDate.getMonth() == 1) {
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                    } else if (startDate.getMonth() == 2) {
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                    } else if (startDate.getMonth() == 3) {
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                    } else if (startDate.getMonth() == 4) {
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                    } else if (startDate.getMonth() == 5) {
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                    } else if (startDate.getMonth() == 6) {
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                    } else if (startDate.getMonth() == 7) {
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                    } else if (startDate.getMonth() == 8) {
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                    } else if (startDate.getMonth() == 9) {
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                    } else if (startDate.getMonth() == 10) {
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                    } else if (startDate.getMonth() == 11) {
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                    }
                                    return (
                                        <tr>
                                            <th scope="row">{item.year}</th>
                                            {result}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="row" style={{ display: displayBarChart5 }}>
                    {/*<div className="col-12">
                        <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthFinancialLineChart4")}>下載圖表</button>
                    </div>
                    <div className="col-12 byMonthFinancialLineChart4">
                        <div className="text-center mb-2" style={{ fontSize: 16 }}>
                            <div className="">
                                {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                            </div>
                            <div className="">
                            特別事故(津貼科) (每月總數)
                            </div>
                        </div>
                        <Chart
                            width={'100%'}
                            height={'400px'}
                            chartType="Line"
                            loader={<div>Loading Chart</div>}
                            data={SIDFYChart}
                        />
                    </div>*/}
                    <div className="col-12">
                        <button className="btn btn-primary" onClick={() => downloadScreenshot("byMonthFinancialBarChart4")}>下載圖表</button>
                    </div>
                    <div className="col-12 byMonthFinancialBarChart4">
                        <div className="text-center mb-2" style={{ fontSize: 16 }}>
                            <div className="">
                                {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                            </div>
                            <div className="">
                                特別事故(津貼科) (每月總數)
                            </div>
                        </div>
                        <Chart
                            width={'100%'}
                            height={'400px'}
                            chartType="Bar"
                            loader={<div>Loading Chart</div>}
                            data={SIDFYChart}
                        />
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-12">
                        <h6 style={{ fontWeight: 600 }}>
                            標題:
                        </h6>
                    </div>
                    <div className="col-12">
                        <h6>{`${title} - 財政年度新發生意外或事故 (其他事故每月總數) - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
                    </div>
                    <div className="col-12" style={{ margin: '5px 0' }}>
                        <button className="btn btn-primary" onClick={() => copyTable('#table7')}>複製到表格</button>&nbsp;&nbsp;&nbsp;
                        {displayBarChart6 == '' &&
                            <button className="btn btn-primary" onClick={() => setDisplayBarChart6('none')}>隱藏圖表</button>
                        }
                        {displayBarChart6 == 'none' &&
                            <button className="btn btn-primary" onClick={() => setDisplayBarChart6('')}>顯示圖表</button>
                        }
                    </div>
                </div>
                <div className="row">
                    <div className="col-12" style={{ overflow: isMobile && 'auto' }}>
                        <table className="table" id="table7" style={{ width: isMobile && 'max-content' }}>
                            <thead>
                                <tr>
                                    <th scope="col">其他事故意外</th>
                                    {div}
                                </tr>
                            </thead>
                            <tbody>
                                {sampleThreeParser(data.filter((item) => item.CaseNumber.indexOf("OIN") > -1), startDate, endDate).map((item) => {
                                    let result = [];
                                    if (startDate.getMonth() == 0) {
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                    } else if (startDate.getMonth() == 1) {
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                    } else if (startDate.getMonth() == 2) {
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                    } else if (startDate.getMonth() == 3) {
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                    } else if (startDate.getMonth() == 4) {
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                    } else if (startDate.getMonth() == 5) {
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                    } else if (startDate.getMonth() == 6) {
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                    } else if (startDate.getMonth() == 7) {
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                    } else if (startDate.getMonth() == 8) {
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                    } else if (startDate.getMonth() == 9) {
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                    } else if (startDate.getMonth() == 10) {
                                        result.push(<td>{item.dataset.nov}</td>);
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                    } else if (startDate.getMonth() == 11) {
                                        result.push(<td>{item.dataset.dec}</td>);
                                        result.push(<td>{item.dataset.jan}</td>);
                                        result.push(<td>{item.dataset.feb}</td>);
                                        result.push(<td>{item.dataset.mar}</td>);
                                        result.push(<td>{item.dataset.apr}</td>);
                                        result.push(<td>{item.dataset.may}</td>);
                                        result.push(<td>{item.dataset.jun}</td>);
                                        result.push(<td>{item.dataset.jul}</td>);
                                        result.push(<td>{item.dataset.aug}</td>);
                                        result.push(<td>{item.dataset.sep}</td>);
                                        result.push(<td>{item.dataset.oct}</td>);
                                        result.push(<td>{item.dataset.nov}</td>);
                                    }
                                    return (
                                        <tr>
                                            <th scope="row">{item.year}</th>
                                            {result}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="row" style={{ display: displayBarChart6 }}>
                    {/*<div className="col-12">
                        <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthFinancialLineChart5")}>下載圖表</button>
                    </div>
                    <div className="col-12 byMonthFinancialLineChart5">
                        <div className="text-center mb-2" style={{ fontSize: 16 }}>
                            <div className="">
                                {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                            </div>
                            <div className="">
                            其他事故 (每月總數)
                            </div>
                        </div>
                        <Chart
                            width={'100%'}
                            height={'400px'}
                            chartType="Line"
                            loader={<div>Loading Chart</div>}
                            data={OINFYChart}
                        />
                    </div>*/}
                    <div className="col-12">
                        <button className="btn btn-primary" onClick={() => downloadScreenshot("byMonthFinancialBarChart5")}>下載圖表</button>
                    </div>
                    <div className="col-12 byMonthFinancialBarChart5">
                        <div className="text-center mb-2" style={{ fontSize: 16 }}>
                            <div className="">
                                {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                            </div>
                            <div className="">
                                其他事故 (每月總數)
                            </div>
                        </div>
                        <Chart
                            width={'100%'}
                            height={'400px'}
                            chartType="Bar"
                            loader={<div>Loading Chart</div>}
                            data={OINFYChart}
                        />
                    </div>
                </div>
            </React.Fragment>
        )
    }
    return (
        <div>
            <div className="row mb-3">
                <div className="col">
                    <h6 style={{ fontWeight: 600 }}>常用圖表</h6>
                </div>
            </div>
            <div className="row">
                {/*<div className="col">
                    <div className="mb-3" style={{ fontWeight: 600 }}>
                        發生日期
                    </div>
                    <div className="d-flex flex-column py-1">
                        <div className="mb-3 d-flex">
                            <div className="mr-3">
                                由
                            </div>
                            <DatePicker className="form-control" dateFormat="yyyy/MM/dd" selected={startDate} onChange={(e) => changeStaticsComponentByStartDate(e)} />
                        </div>
                        <div className="d-flex">
                            <div className="mr-3">
                                至
                            </div>
                            <DatePicker className="form-control" dateFormat="yyyy/MM/dd" selected={endDate} onChange={(e) => changeStaticsComponentByEndDate(e)} />
                        </div>
                    </div>
                </div>*/}
                {/*<div className="col" >
                    <div className="mb-3" style={{ fontWeight: 600 }}>
                        日期分組
                    </div>
                    <select multiple className="form-control" onChange={changeGroupHandler}>
                        <option value="NON">不需要</option>
                        <option value="BY_MONTH">按月</option>
                        <option value="BY_MONTH_FINANCIAL">按月 - 財政年度</option>
                        <option value="BY_MONTH_CALENDAR">按月 - 日曆年度</option>
                        <option value="BY_YEAR_FINANCIAL">按年 - 財政年度</option>
                        <option value="BY_YEAR_CALENDAR">按年 - 日曆年度</option>
                    </select>
                </div>*/}
                <div className="col-12 mb-3" >
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
                        {props.permission.indexOf('All') >= 0 && serviceLocation.length > 0 &&
                            serviceLocation.map((item) => {
                                return <option value={item.su_Eng_name_display}>{item.su_name_tc}</option>
                            })
                        }
                        {props.permission.indexOf('All') < 0 && serviceLocation.length > 0 &&
                            props.permission.map((item) => {
                                let ser = serviceLocation.filter(o => { return o.su_Eng_name_display == item });

                                if (ser.length > 0) {
                                    return <option value={ser[0].su_Eng_name_display}>{ser[0].su_name_tc}</option>
                                }

                            })
                        }
                        {/*
                            serivceLocation.map((item) => <option value={item.su_Eng_name_display}>{item.su_name_tc}</option>)
                    */}
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
            <div className="" >
                {chartSwitch()}
            </div>
        </div>
    )
}

export default Dashboard
