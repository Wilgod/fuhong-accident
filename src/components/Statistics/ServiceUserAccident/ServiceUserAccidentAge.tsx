import * as React from 'react'
import { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useServiceUnit2 from '../../../hooks/useServiceUser2';
import BootstrapTable from 'react-bootstrap-table-next';
import * as moment from 'moment';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { useServiceUserAge } from '../../../hooks/useServiceUserAge';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, BarElement, LinearScale, CategoryScale } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const labels = ["<15歲", "15-20歲", "21-30歲", "31-40歲", "41-50歲", "51-60歲", ">60歲"];

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

const sampleOneParser = (serviceUserAge: any[]) => {
    let dataset: IDataset = { ...initialDataset };
    serviceUserAge.forEach((item) => {
        dataset = agefilter(item.ServiceUserAge, dataset);
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

function ServiceUserAccidentAge() {

    const [groupBy, setGroupBy] = useState("NON");
    const [ageDataset, setAgeDataset] = useState<IDataset>(initialDataset);
    const [serviceUnitList] = useServiceUnit2();
    const [serviceUserAge, startDate, endDate, setStartDate, setEndDate, setServiceUnits] = useServiceUserAge();

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
                                <Bar
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: `${title} - 年齡統計`,
                                            },
                                            legend: {
                                                display: false
                                            }
                                        }
                                    }}
                                    data={{
                                        labels: labels,
                                        datasets: [
                                            {
                                                label: "年齡",
                                                data: [
                                                    ageDataset.lessThanFifteen,
                                                    ageDataset.fifteenToTwenty,
                                                    ageDataset.twentyOneToThirty,
                                                    ageDataset.thirtyOneToforty,
                                                    ageDataset.fortyOneTofifty,
                                                    ageDataset.greaterThanSixty
                                                ],
                                                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                                            }
                                        ]
                                    }} />;
                            </div>
                            <div className="col-6">
                                <Pie
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: `${title} - 年齡統計`,
                                            }
                                        }
                                    }}

                                    data={{
                                        labels: labels,
                                        datasets: [
                                            {
                                                label: "年齡",
                                                data: [
                                                    ageDataset.lessThanFifteen,
                                                    ageDataset.fifteenToTwenty,
                                                    ageDataset.twentyOneToThirty,
                                                    ageDataset.thirtyOneToforty,
                                                    ageDataset.fortyOneTofifty,
                                                    ageDataset.greaterThanSixty],
                                                backgroundColor: [
                                                    'rgba(255, 99, 132, 0.2)',
                                                    'rgba(54, 162, 235, 0.2)',
                                                    'rgba(255, 206, 86, 0.2)',
                                                    'rgba(75, 192, 192, 0.2)',
                                                    'rgba(153, 102, 255, 0.2)',
                                                    'rgba(255, 159, 64, 0.2)',
                                                ],
                                                borderColor: [
                                                    'rgba(255, 99, 132, 1)',
                                                    'rgba(54, 162, 235, 1)',
                                                    'rgba(255, 206, 86, 1)',
                                                    'rgba(75, 192, 192, 1)',
                                                    'rgba(153, 102, 255, 1)',
                                                    'rgba(255, 159, 64, 1)',
                                                ],
                                                borderWidth: 1,
                                            }
                                        ]
                                    }} />
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
                        {serviceUnitList.sort((a, b) => {
                            return a.Title.localeCompare(b.Title)
                        }).map((item) => {
                            if (item && item.Title) {
                                return <option value={item.Title}>{item.Title}</option>
                            }
                        })}
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

const columns = () => {

    return [
        {
            dataField: 'CaseNumber',
            text: '檔案編號',
            sort: true
        },
        {
            dataField: 'AccidentTime',
            text: '發生日期',
            formatter: (value, data) => {
                let date = value;
                if (data.AccidentTime) {
                    date = data.AccidentTime;
                } else {
                    date = data.IncidentTime;
                }
                return <div>{moment(new Date(date)).format("YYYY-MM-DD")}</div>
            },
            sort: true,
            sortFunc: (a, b, order, dataField, rowA, rowB) => {
                let aTime = new Date().getTime();
                let bTime = new Date().getTime();

                if (rowA.AccidentTime) {
                    aTime = new Date(rowA.AccidentTime).getTime();
                } else {
                    aTime = new Date(rowA.IncidentTime).getTime();
                }


                if (rowB.AccidentTime) {
                    bTime = new Date(rowB.AccidentTime).getTime();
                } else {
                    bTime = new Date(rowB.IncidentTime).getTime();
                }

                if (order === 'asc') {
                    return bTime - aTime;
                }
                return aTime - bTime; // desc
            }
        },
        {
            dataField: 'ServiceUnit',
            text: '服務單位',
            sort: true
        },
        {
            dataField: 'CaseNumber',
            text: '意外/事故',
            sort: true,
        },
        {
            dataField: 'Status',
            text: '狀態',
            sort: true
        },
        {
            dataField: 'Modified',
            text: '最後更新報告',
            formatter: (value, data) => {
                return <div> {moment(new Date(value)).format("YYYY-MM-DD")}</div>
            },
            sort: true,
            sortFunc: (a, b, order, dataField, rowA, rowB) => {
                let aTime = new Date(rowA.Modified).getTime();
                let bTime = new Date(rowB.Modified).getTime();


                if (order === 'asc') {
                    return bTime - aTime;
                }
                return aTime - bTime; // desc
            }
        },
        {
            dataField: 'NextDeadline',
            text: '下個報告到期日',
            formatter: (value, data) => {
                if (data && (data.Status === "CLOSED" || data.Status === "DRAFT")) {
                    return <div>沒有</div>
                } else {
                    return <div>{moment(new Date(value)).format("YYYY-MM-DD")}</div>
                }
            },
            sort: true,
            sortFunc: (a, b, order, dataField, rowA, rowB) => {
                let aTime = new Date(rowA.NextDeadline || new Date().getTime()).getTime();
                let bTime = new Date(rowB.NextDeadline || new Date().getTime()).getTime();

                if (rowA.Status === "CLOSED") {
                    aTime = new Date(new Date().setFullYear(1970)).getTime();
                }

                if (rowA.Status === "CLOSED") {
                    bTime = new Date(new Date().setFullYear(1970)).getTime();
                }


                if (order === 'asc') {
                    return bTime - aTime;
                }
                return aTime - bTime; // desc
            }
        },
        {
            dataField: 'Id',
            text: '',
        }
    ]
};