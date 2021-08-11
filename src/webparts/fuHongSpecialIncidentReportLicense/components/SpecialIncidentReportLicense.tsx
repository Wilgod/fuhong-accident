import * as React from 'react'
import { useState } from "react";
import DatePicker from "react-datepicker";
import Header from "../../../components/Header/Header";
import "react-datepicker/dist/react-datepicker.css";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { WebPartContext } from '@microsoft/sp-webpart-base';

interface ISpecialIncidentReportLicenseProps {
    context: WebPartContext;
    styles: any;
}

interface ISpecialIncidentReportLicenseStates {

}

export default function SpecialIncidentReportLicense({ context, styles }: ISpecialIncidentReportLicenseProps) {
    const [form, setForm] = useState<ISpecialIncidentReportLicenseStates>();

    return (
        <>
            
        </>
    )
}
