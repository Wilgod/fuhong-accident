import * as React from 'react'
import { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import useServiceUnit2 from '../../hooks/useServiceUser2';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import * as moment from 'moment';
import { caseNumberToFormNameParser, caseNumberToSitePageParser } from '../../utils/FormNameUtils';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import useEmailRecord from '../../hooks/useEmailRecords';
import useServiceLocation from '../../hooks/useServiceLocation';
interface IInsuranceEmailReportScreenProps {
    context: WebPartContext;
    siteCollectionUrl: string;
    permission: any;
}



function InsuranceEmailReportScreen({ context, siteCollectionUrl, permission }: IInsuranceEmailReportScreenProps) {
    const [startDate, setStartDate] = useState(new Date(new Date().setFullYear(new Date().getFullYear() - 3)));
    const [endDate, setEndDate] = useState(new Date());
    //const [serviceUnitList] = useServiceUnit2(siteCollectionUrl);
    const [serviceLocation] = useServiceLocation(siteCollectionUrl);
    const [data] = useEmailRecord(permission);
    const [displayData, setDisplayData] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [status, setStatus] = useState('');
    const [keyword, setKeyword] = useState('');
    console.log(data);
    const multipleOptionsSelectParser = (event) => {
        let result = [];
        const selectedOptions = event.target.selectedOptions;
        for (let i = 0; i < selectedOptions.length; i++) {
            result.push(selectedOptions[i].value);
        }
        return result;
    }

    const inputFieldHandler = (event) => {
        const value = event.target.value;
        setKeyword(value);
    }

    const filter = () => {
        let filterData = data;
        if (selectedOptions.length > 0) {
            if (selectedOptions[0] != 'ALL') {
                let dataLists = [];
                for (let option of selectedOptions) {
                    let newDataList = filterData.filter(item => { return (item.ServiceLocation == option || item.ServiceUnit == option) });
                    for (let dataList of newDataList) {
                        dataLists.push(dataList);
                    }
                }
                filterData = dataLists;
            }

        }
        if (startDate != null) {
            let newStartDate = new Date(startDate).setHours(0,0,0);
            filterData = filterData.filter(item => { return (new Date(item.AccidentTime).getTime() >= new Date(newStartDate).getTime() || new Date(item.IncidentTime).getTime() >= new Date(newStartDate).getTime()) });
        }
        if (endDate != null) {
            let newEndDate = new Date(endDate).setHours(23,59,59);
            filterData = filterData.filter(item => { return (new Date(item.AccidentTime).getTime() <= new Date(newEndDate).getTime() || new Date(item.IncidentTime).getTime() <= new Date(newEndDate).getTime()) });
        }

        if (status != '' && status != 'ALL') {
            if (status == 'Apply') {
                filterData = filterData.filter(item => { return item.Stage == '1' });
            } else if (status == 'Confirm') {
                filterData = filterData.filter(item => { return item.Stage == '2' });
            }
        }
        debugger
        filterData = filterData.filter(item => {
            return ((item.HomesName != null && item.HomesName.indexOf(keyword) >= 0) ||
                (item.ServiceLocation != null && item.ServiceLocation.indexOf(keyword) >= 0) ||
                (item.CaseNumber != null && item.CaseNumber.indexOf(keyword) >= 0) ||
                (item.InsuranceCaseNo != null && item.InsuranceCaseNo.indexOf(keyword) >= 0))
        });

        setDisplayData(filterData);
    }

    useEffect(() => {
        if (data.length > 0) {
            setDisplayData(data)
        }
    }, [data]);

    return (
        <div>
            <div className="row mb-3">
                <div className="col">
                    <h6 style={{ fontWeight: 600 }}>報告 &gt; 保險公司電郵報告</h6>
                </div>
            </div>
            <div className="row">
                <div className="col-xl-4 col-md-6 col-12 mb-3" >
                    <div style={{ fontWeight: 600 }}>
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
                <div className="col-xl-4 col-md-6 col-12 mb-3" >
                    <div style={{ fontWeight: 600 }}>
                        服務單位
                    </div>
                    {/* <div className="" style={{ overflowY: "scroll", border: "1px solid gray", height: 100 }}>

                    </div> */}
                    <select multiple className="form-control" onChange={(event) => {
                        const selectedOptions = multipleOptionsSelectParser(event);
                        setSelectedOptions(selectedOptions);
                    }}>
                        <option value="ALL">--- 所有 ---</option>
                        {permission.indexOf('All') >= 0 && serviceLocation.length > 0 &&
                            serviceLocation.map((item) => {
                                return <option value={item.su_Eng_name_display}>{item.su_name_tc}</option>
                            })
                        }
                        {permission.indexOf('All') < 0 && serviceLocation.length > 0 &&
                            permission.map((item) => {
                                //
                                let ser = serviceLocation.filter(o => { return o.su_Eng_name_display == item });

                                if (ser.length > 0) {
                                    return <option value={ser[0].su_Eng_name_display}>{ser[0].su_name_tc}</option>
                                }

                            })
                        }
                        {/*
                            serviceLocation.map((item) => {
                                return <option value={item.su_Eng_name_display}>{item.su_name_tc}</option>
                            })
                        */}
                    </select>
                </div>
                <div className="col-xl-4 col-md-6 col-12 mb-3" >
                    <div style={{ fontWeight: 600 }}>
                        意外/事故
                    </div>
                    <select multiple className="form-control" onChange={(event) => {
                        const selectedOptions = multipleOptionsSelectParser(event);

                    }}>
                        <option value="ALL">--- 所有 ---</option>
                        <option value="SUI">服務使用者意外</option>
                        <option value="PUI">外界人士意外</option>
                        <option value="SIH">特別事故(牌照事務處)</option>
                        <option value="SID">特別事故(津貼科)</option>
                        <option value="OIN">其他事故</option>
                    </select>
                </div>
                <div className="col-xl-4 col-md-6 col-12 mb-3" >
                    <div style={{ fontWeight: 600 }}>
                        顯示狀態
                    </div>
                    <select multiple className="form-control" onChange={(event) => {

                    }}>
                        <option value="PROCESSING">跟進中個案</option>
                        <option value="CLOSED">已結束個案</option>
                        <option value="ALL">所有狀態</option>
                    </select>
                </div>
                <div className="col-xl-4 col-md-6 col-12 mb-3" >
                    <div style={{ fontWeight: 600 }}>
                        過期未交報告
                    <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                    </div>
                    </div>
                </div>
            </div>
            <div className="mb-3">
                <div style={{ fontSize: "1.05rem", fontWeight: 600 }} >
                    關鍵字
                </div>
                <div className="row">
                    <div className="col-md-10 col-12 mt-1">
                        <input className="form-control" placeholder="(可搜尋：事主姓名 / 檔案編號 / 保險公司備案編號)" onChange={inputFieldHandler}/>
                    </div>
                    <div className="col-md-2 col-12 mt-1">
                        <button type="button" className="btn btn-primary w-100" onClick={() => filter()} >搜尋</button>
                    </div>
                </div>
            </div>
            <div>
                <div className="mb-1" style={{ fontSize: "1.05rem", fontWeight: 600 }}>
                    搜尋結果 [{`${displayData.length} 筆記錄`}]
                </div>
                <BootstrapTable boot keyField='id' data={displayData || []} columns={columns(context)} pagination={paginationFactory()} bootstrap4={true} />
            </div>
        </div>
    )
}

export default InsuranceEmailReportScreen


const columns = (context) => {
    const path = context.pageContext.site.absoluteUrl + `/accident-and-incident/SitePages/`;
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
            formatter: (value, data) => {
                if (value) {
                    const [caseType] = value.split("-");
                    return caseNumberToFormNameParser(caseType);
                }
            }
        },
        {
            dataField: 'InsuranceCaseNo',
            text: '保險公司備案編號',
            sort: true
        },
        {
            dataField: 'Created',
            text: '電郵發出日期',
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
            dataField: 'Title',
            text: '電郵標題',
        },
        {
            dataField: 'RecordId',
            text: '[按鈕]',
            formatter: (value, data) => {
                let formLink = "";
                if (data && data.CaseNumber) {
                    const [caseType] = data.CaseNumber.split("-");
                    //formLink = path + caseNumberToSitePageParser(caseType) + `?formId=${value}`;
                    let navPage = caseNumberToSitePageParser(caseType)
                    formLink = path + `Home.aspx?formId=${value}&navScreen=${navPage}`;
                } else if (data && data.Title) {
                    //formLink = path + caseNumberToSitePageParser(data.Title.toUpperCase()) + `?formId=${value}`;
                    let navPage = caseNumberToSitePageParser(data.Title.toUpperCase())
                    formLink = path + `Home.aspx?formId=${value}&navScreen=${navPage}`;
                } else {
                    return null;
                }

                return <div className="d-flex justify-content-center">
                    <button className="btn btn-sm btn-primary" onClick={() => window.open(formLink, "_blank")} disabled={value === null}>
                        檢視
                    </button>
                </div>
            }
        }
    ]
};