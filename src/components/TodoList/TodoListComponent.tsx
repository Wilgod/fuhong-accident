import * as React from 'react'
import { useEffect, useState } from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import useFetchAllForms from '../../hooks/useServiceUserAccidentForm';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { ITodoListComponentProps } from './ITodoListComponent';
import { caseNumberToFormNameParser, caseNumberToSitePageParser } from '../../utils/FormNameUtils';
import * as moment from 'moment';

export default function TodoListComponent({ context }: ITodoListComponentProps) {
    const [data] = useFetchAllForms();

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
                return <div>{moment(new Date(value)).format("YYYY-MM-DD")}</div>
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

