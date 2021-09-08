import * as React from 'react';
import styles from './FuHongFormsMenu.module.scss';
import { IFuHongFormsMenuProps } from './IFuHongFormsMenuProps';
import 'bootstrap/dist/css/bootstrap.css';

export default class FuHongFormsMenu extends React.Component<IFuHongFormsMenuProps, {}> {

  private SERVICE_USER_ACCIDENT = "ServiceUserAccident"; // form 19
  private OUTSIDERS_ACCIDENT = "OutsidersAccident"; //form 22
  private OTHER_INCIDENT_REPORT = "OtherIncidentReport"; // form 23
  private SPECIAL_INCIDENT_REPORT_ALLOWANCE = "SpecialIncidentReportAllowance"; // form 24
  private SPECIAL_INCIDENT_REPORT_LICENSE = "SpecialIncidentReportLicense"; //form 25

  public constructor(props) {
    super(props);
    getCanvasZone();
  }

  public render(): React.ReactElement<IFuHongFormsMenuProps> {


    const ItemComponent = (href, name) => {
      return <a href={href + ".aspx"} target="_blank" data-interception="off">
        <div className="shadow p-3 mb-2 bg-white rounded">
          <span className="h6 font-weight-bold text-decoration-none">{name}</span>
        </div>
      </a>
    }


    return (
      <div className={styles.fuHongFormsMenu} >
        <div className={styles.container}>
          <div className="p-5">
            <div className="row">
              <div className="col-12">
                {ItemComponent(this.SERVICE_USER_ACCIDENT, "服務使用者意外")}
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                {ItemComponent(this.OUTSIDERS_ACCIDENT, "外界人士意外")}
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                {ItemComponent(this.SPECIAL_INCIDENT_REPORT_ALLOWANCE, "特別事故報告 (牌照事務處)")}
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                {ItemComponent(this.SPECIAL_INCIDENT_REPORT_LICENSE, "特別事故報告 (津貼科)")}
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                {ItemComponent(this.OTHER_INCIDENT_REPORT, "其他事故")}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const getCanvasZone = () => {
  let x = document.getElementsByTagName("div");
  for (let i = 0; i < x.length; i++) {
    if (x[i].getAttribute("data-automation-id")) {
      if (x[i].getAttribute("data-automation-id") === "CanvasZone") {
        if (x[i].firstElementChild) {
          x[i].firstElementChild.setAttribute("style", "max-width:none ;width:100%")
        }
      }
    }
  }
}