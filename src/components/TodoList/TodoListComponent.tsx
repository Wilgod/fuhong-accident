import * as React from 'react'
import { useEffect, useState } from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import useServiceUserAccidentForm from '../../hooks/useServiceUserAccidentForm';

export default function TodoListComponent() {
    const [] = useServiceUserAccidentForm();


    const products = [

    ]

    return (
        <div>
            <div className="mb-1" style={{ fontSize: "1.05rem", fontWeight: 600 }}>
                待辦事項
            </div>
            <BootstrapTable keyField='id' data={products} columns={columns} />
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
        text: '發生日期'
    },
    {
        dataField: 'id',
        text: '[按鈕]'
    }
];

