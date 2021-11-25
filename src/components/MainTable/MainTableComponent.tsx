import * as React from 'react'
import { useEffect } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import useServiceUnit from '../../hooks/useServiceUnits';
import { IMainTableComponentProps } from './IMainTableComponent';
import * as moment from 'moment';
import { caseNumberToFormNameParser, caseNumberToSitePageParser } from '../../utils/FormNameUtils';
import useFetchAllForms from '../../hooks/useFetchAllForms';
import { IUser } from '../../interface/IUser';
export default function MainTableComponent({ context, dateRange, searchExpired, searchFormStatus, searchFormType, searchServiceUnit }: IMainTableComponentProps) {

    const CURRENT_USER: IUser = {
        email: context.pageContext.legacyPageContext.userEmail,
        name: context.pageContext.legacyPageContext.userDisplayName,
        id: context.pageContext.legacyPageContext.userId,
    }

    const [data] = useFetchAllForms(CURRENT_USER.id, {
        startDate: dateRange.start,
        endDate: dateRange.end,
        expired: searchExpired,
        formStatus: searchFormStatus,
        formTypes: searchFormType,
        serviceUnits: searchServiceUnit
    });
    // const [data, setStartDate, setEndDate, setSearchServiceUnit, setSearchFormTypes, setSearchFormStatus, setSearchExpired] = useFetchAllForms(CURRENT_USER.id);



    return (
        <div>
            <div className="mb-1" style={{ fontSize: "1.05rem", fontWeight: 600 }}>
                搜尋結果 [{`${data.length} 筆記錄`}]
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
            text: '[按鈕]',
            formatter: (value, data) => {
                let formLink = "";
                if (data && data.CaseNumber) {
                    const [caseType] = data.CaseNumber.split("-");
                    formLink = path + caseNumberToSitePageParser(caseType) + `?formId=${value}`;
                } else if (data && data.Title) {
                    formLink = path + caseNumberToSitePageParser(data.Title.toUpperCase()) + `?formId=${value}`;
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