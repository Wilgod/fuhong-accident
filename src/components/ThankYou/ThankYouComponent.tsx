import * as React from 'react'

interface IThankYouComponentProps {
    redirectLink: string;
}

export default function ThankYouComponent({ redirectLink }: IThankYouComponentProps) {

    const redirectHandler = () => {
        window.open(redirectLink, "_self");
    }

    return (
        <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: 500 }}>
            <div className="mb-3" style={{ fontSize: 27, fontWeight: 600 }}>表格遞交成功</div>
            <button className="btn btn-success" onClick={redirectHandler}>返回主頁</button>
        </div>
    )
}
