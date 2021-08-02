import * as React from 'react'
import "./header.css";

interface IHeader {
    displayName: string;
}

export default function Header({ displayName }: IHeader) {
    return (
        <div className="header" >
            <img src={require("../../assets/icons/fuhong_logo_yellow.PNG")} />
            <span>{displayName}</span>
        </div>
    )
}
