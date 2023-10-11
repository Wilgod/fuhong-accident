import * as React from 'react'

interface INoAccessRightComponentProps {
    redirectLink: string;
}

export default function NoAccessRightComponent({ redirectLink }: INoAccessRightComponentProps) {

    const redirectHandler = () => {
        window.open(redirectLink, "_self");
    }

    return (
        <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: 500, width:'100%' }}>
            <div className="mb-3" style={{ fontSize: 27, fontWeight: 600 }}>沒有訪問權限</div>
            <button onClick={() => redirectHandler()} className="btn btn-primary">上一頁</button>
        </div>
    )
}
