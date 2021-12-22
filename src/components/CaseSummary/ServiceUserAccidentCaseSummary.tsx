import * as React from 'react'
import { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import useServiceUnit2 from '../../hooks/useServiceUser2';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import * as moment from 'moment';
import { caseNumberToFormNameParser, caseNumberToSitePageParser } from '../../utils/FormNameUtils';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import useServiceLocation from '../../hooks/useServiceLocation';

interface IServiceUserAccidentCaseSummary {
    context: WebPartContext;
}

function ServiceUserAccidentCaseSummary({ context }: IServiceUserAccidentCaseSummary) {
    const [startDate, setStartDate] = useState(new Date(new Date().setFullYear(new Date().getFullYear() - 3)));
    const [endDate, setEndDate] = useState(new Date());
    const [serviceLocation] = useServiceLocation();
    const [data, setData] = useState([]);
    const multipleOptionsSelectParser = (event) => {
        let result = [];
        const selectedOptions = event.target.selectedOptions;
        for (let i = 0; i < selectedOptions.length; i++) {
            result.push(selectedOptions[i].value);
        }
        return result;
    }

    return (
        <div>
            <div className="row mb-3">
                <div className="col">
                    <h6 style={{ fontWeight: 600 }}>報告 &gt; 個案概要 &gt; 服務使用者意外</h6>
                </div>
            </div>
            <div className="row">
                <div className="col-2" >
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
                <div className="col-4" >
                    <div className="mb-3" style={{ fontWeight: 600 }}>
                        服務單位
                    </div>
                    {/* <div className="" style={{ overflowY: "scroll", border: "1px solid gray", height: 100 }}>

                    </div> */}
                    <select multiple className="form-control" onChange={(event) => {
                        const selectedOptions = multipleOptionsSelectParser(event);

                    }}>
                        <option value="ALL">--- 所有 ---</option>
                        {
                            serviceLocation.map((item) => {
                                return <option value={item}>{item}</option>
                            })
                        }
                    </select>
                </div>
                <div className="col-4" >
                    <div className="mb-3" style={{ fontWeight: 600 }}>
                        顯示狀態
                    </div>
                    <select multiple className="form-control" onChange={(event) => {

                    }}>
                        <option value="PROCESSING">跟進中個案</option>
                        <option value="CLOSED">已結束個案</option>
                        <option value="ALL">所有狀態</option>
                    </select>
                </div>
            </div>
            <div className="mb-3">
                <div className="mb-3" style={{ fontSize: "1.05rem", fontWeight: 600 }} >
                    關鍵字
                </div>
                <div className="row">
                    <div className="col-10">
                        <input className="form-control" placeholder="(可搜尋：事主姓名 / 檔案編號 / 保險公司備案編號)" />
                    </div>
                    <div className="col">
                        <button type="button" className="btn btn-primary" >搜尋</button>
                    </div>
                </div>
            </div>
            <div>
                <div className="mb-1" style={{ fontSize: "1.05rem", fontWeight: 600 }}>
                    搜尋結果 [{`${data.length} 筆記錄`}]
                </div>
                <BootstrapTable boot keyField='id' data={data || []} columns={column} pagination={paginationFactory()} bootstrap4={true} />
            </div>
        </div>
    )
}

export default ServiceUserAccidentCaseSummary

const column = [
    {
        dataField: 'id',
        text: '服務單位',
        sort: true
    },
    {
        dataField: 'AccidentTime',
        text: '意外發生日期及時間',
    },
    {
        dataField: 'Gender',
        text: '性別',
    },
    {
        dataField: 'Age',
        text: '年齡',
    },
    {
        dataField: 'location',
        text: '意外發生地點',
    },
    {
        dataField: 'intelligence',
        text: '智力障礙程度',
    },
    {
        dataField: 'ASD',
        text: '自閉症譜系障礙 (ASD)',
    },
    {
        dataField: 'category',
        text: '意外性質',
    },
    {
        dataField: 'env',
        text: '意外成因 - 環境因素',
    },
    {
        dataField: 'personal',
        text: '意外成因 - 個人因素',
    },
    {
        dataField: 'personal',
        text: '事發過程',
    },
    {
        dataField: 'reason',
        text: '成因'
    },
    {
        dataField: 'reason',
        text: '服務單位即時治療/處理'
    },
    {
        dataField: 'reason',
        text: '提供予服務使用者的治療'
    },
    {
        dataField: 'reason',
        text: '意外後中心即時應變措施'
    },
    {
        dataField: 'reason',
        text: '報告建議'
    }
]