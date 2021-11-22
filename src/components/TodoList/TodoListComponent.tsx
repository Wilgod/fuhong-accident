import * as React from 'react'
import { useEffect, useState } from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import useFetchAllForms from '../../hooks/useFetchAllForms';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { ITodoListComponentProps } from './ITodoListComponent';
import { caseNumberToFormNameParser, caseNumberToSitePageParser } from '../../utils/FormNameUtils';
import * as moment from 'moment';
import { IUser } from '../../interface/IUser';
import useFetchUserJob from '../../hooks/useFetchUserJob';

export default function TodoListComponent({ context }: ITodoListComponentProps) {
    const CURRENT_USER: IUser = {
        email: context.pageContext.legacyPageContext.userEmail,
        name: context.pageContext.legacyPageContext.userDisplayName,
        id: context.pageContext.legacyPageContext.userId,
    }
    const [data] = useFetchUserJob(CURRENT_USER.id);


    return (
        <div>
            <div className="mb-1" style={{ fontSize: "1.05rem", fontWeight: 600 }}>
                待辦事項
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
            text: '意外/事故',
            sort: true,
            formatter: (value, data) => {
                if (value) {
                    const [caseType] = value.split("-");
                    return caseNumberToFormNameParser(caseType);
                } else if (data && data.Title) {
                    return caseNumberToFormNameParser(data.Title);
                }
            }
        },
        {
            dataField: 'ServiceUnit',
            text: '服務單位',
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

