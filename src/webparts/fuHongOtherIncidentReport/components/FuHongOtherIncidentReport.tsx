import * as React from 'react';
import styles from './FuHongOtherIncidentReport.module.scss';
import { IFuHongOtherIncidentReportProps } from './IFuHongOtherIncidentReportProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import 'bootstrap/dist/css/bootstrap.css';
import "./react-tabs.css";
import OtherIncidentReport from "./OtherIncidentReport";
import IncidentFollowUpForm from "../../../components/IncidentFollowUpForm/IncidentFollowUpForm";
import "./custom.css";

if (document.getElementById('workbenchPageContent') != null) {
  document.getElementById('workbenchPageContent').style.maxWidth = '1920px';
}

if (document.querySelector('.CanvasZone') != null) {
  (document.querySelector('.CanvasZone') as HTMLElement).style.maxWidth = '1920px';
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

export default class FuHongOtherIncidentReport extends React.Component<IFuHongOtherIncidentReportProps, {}> {
  public constructor(props) {
    super(props);
    getCanvasZone();
    console.log("Flow 5");
  }
  public render(): React.ReactElement<IFuHongOtherIncidentReportProps> {
    return (
      <div className={styles.fuHongOtherIncidentReport}>
        <div className={styles.container}>
          <Tabs variant="fullWidth">
            <TabList>
              <Tab>其他事故呈報表</Tab>
              <Tab>事故跟進/結束報告</Tab>
            </TabList>
            <TabPanel>
              <OtherIncidentReport context={this.props.context} styles={styles} />
            </TabPanel>
            <TabPanel>
              <IncidentFollowUpForm context={this.props.context} styles={styles} formType={"OTHER_INCIDENT"} />
            </TabPanel>
          </Tabs>
        </div>
      </div>
    );
  }
}
