import * as React from 'react'
import { useEffect, useState } from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import useFetchAllForms from '../../hooks/useServiceUserAccidentForm';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { ITodoListComponentProps } from './ITodoListComponent';

export default function TodoListComponent({ context }: ITodoListComponentProps) {
    const products = [

    ]

    return (
        <div>
            <div className="mb-1" style={{ fontSize: "1.05rem", fontWeight: 600 }}>
                待辦事項
            </div>
            <BootstrapTable boot keyField='id' data={products} columns={columns} pagination={paginationFactory()} bootstrap4={true} />
        </div>
    )
}

const columns = [

    {
        dataField: 'name',
        text: '意外/事故'
    },
    {
        dataField: 'name',
        text: '服務單位'
    },
    {
        dataField: 'AccidentTime',
        text: '發生日期',
        sort: true
    },
    {
        dataField: 'id',
        text: '[按鈕]',
        formatter: (value, row) => {
            console.log(value, row)
            return <div className="d-flex justify-content-center">
                <button className="btn btn-sm btn-primary">
                    檢視
                </button>
            </div>
        }
    }
];

