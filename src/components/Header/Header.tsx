import * as React from 'react'
import "./header.css";


interface IHeader {
    displayName: string;
}

export default function Header({ displayName }: IHeader) {
    return (
        <div className="header" >
            <img src={"https://fuhongsociety.sharepoint.com/sites/FHS.Portal.dev/accident-and-incident/SiteAssets/fuhong_logo_yellow.PNG"} />
            <span>{displayName}</span>
        </div>
    )
}
