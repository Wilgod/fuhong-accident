import * as React from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import useServiceUnit from '../../hooks/useServiceUnits';
import useFetchAllForms from '../../hooks/useServiceUserAccidentForm';
import { IMainTableComponentProps } from './IMainTableComponent';
import * as moment from 'moment';
import { caseNumberToFormNameParser, caseNumberToSitePageParser } from '../../utils/FormNameUtils';
export default function MainTableComponent({ context }: IMainTableComponentProps) {
    const [data] = useFetchAllForms();

    return (
        <div>
            <div className="mb-1" style={{ fontSize: "1.05rem", fontWeight: 600 }}>
                搜尋
            </div>
            <BootstrapTable boot keyField='id' data={data || []} columns={columns(context)} pagination={paginationFactory()} bootstrap4={true} />
        </div>
    )
}

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
            dataField: 'Status',
            text: '狀態',
        },
        {
            dataField: 'Modified',
            text: '最後更新報告',
            formatter: (value, data) => {
                return <div> {moment(new Date(value)).format("YYYY-MM-DD")}</div>
            }
        },
        {
            dataField: 'NextDeadline',
            text: '下個報告到期日',
            formatter: (value, data) => {
                if (value) {
                    return <div>{moment(new Date(value)).format("YYYY-MM-DD")}</div>
                } else {
                    return <div>沒有</div>
                }
            }
        },
        {
            dataField: 'Id',
            text: '[按鈕]',
            formatter: (value, data) => {
                let formLink = "";
                if (data && data.CaseNumber) {
                    const [caseType] = data.CaseNumber.split("-");
                    formLink = path + caseNumberToSitePageParser(caseType) + `?formId=${value}`;
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