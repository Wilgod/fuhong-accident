import * as React from 'react';
import styles from './FuHongSpecialIncidentReportLicense.module.scss';
import { IFuHongSpecialIncidentReportLicenseProps } from './IFuHongSpecialIncidentReportLicenseProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import 'bootstrap/dist/css/bootstrap.css';
import "react-datepicker/dist/react-datepicker.css";
import SpecialIncidentReportLicense from './SpecialIncidentReportLicense';
import IncidentFollowUpForm from "../../../components/IncidentFollowUpForm/IncidentFollowUpForm";
import "./react-tabs.css";
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

export default class FuHongSpecialIncidentReportLicense extends React.Component<IFuHongSpecialIncidentReportLicenseProps, {}> {
  public constructor(props) {
    super(props);
    getCanvasZone();
  }

  public render(): React.ReactElement<IFuHongSpecialIncidentReportLicenseProps> {
    return (
      <div className={styles.fuHongSpecialIncidentReportLicense}>
        <div className={styles.container}>
          <Tabs variant="fullWidth">
            <TabList>
              <Tab>24_特別事故報告(牌照事務處)</Tab>
              <Tab>26_事故跟進/結束報告</Tab>
            </TabList>
            <TabPanel>
              <SpecialIncidentReportLicense context={this.props.context} styles={styles} />
            </TabPanel>
            <TabPanel>
              <IncidentFollowUpForm context={this.props.context} styles={styles} formType={"SPECIAL_INCIDENT_REPORT_LICENSE"}/>
            </TabPanel>

          </Tabs>
        </div>
      </div>
    );
  }
}
