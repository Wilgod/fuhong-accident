import * as React from 'react';
import styles from './FuHongSpecialIncidentReportAllowance.module.scss';
import { IFuHongSpecialIncidentReportAllowanceProps } from './IFuHongSpecialIncidentReportAllowanceProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as moment from 'moment';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import 'bootstrap/dist/css/bootstrap.css';
import "./react-tabs.css";
import SpecialIncidentReportAllowance from './SpecialIncidentReportAllowance';
import IncidentFollowUpForm from "../../../components/IncidentFollowUpForm/IncidentFollowUpForm";
import "./react-tabs.css";
import "./custom.css";

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

export default class FuHongSpecialIncidentReportAllowance extends React.Component<IFuHongSpecialIncidentReportAllowanceProps, {}> {
  public constructor(props) {
    super(props);
    getCanvasZone();
  }

  public render(): React.ReactElement<IFuHongSpecialIncidentReportAllowanceProps> {

    return (
      <div className={styles.fuHongSpecialIncidentReportAllowance}>
        <div className={styles.container}>
          <Tabs variant="fullWidth">
            <TabList>
              <Tab>25_特別事故報告(津貼科)</Tab>
              <Tab>26_事故跟進/結束報告</Tab>
            </TabList>
            <TabPanel>
              <SpecialIncidentReportAllowance context={this.props.context} styles={styles} />
            </TabPanel>
            <TabPanel>
              <IncidentFollowUpForm context={this.props.context} styles={styles} formType={"SPECIAL_INCIDENT_REPORT_ALLOWANCE"} />
            </TabPanel>
          </Tabs>
        </div>
      </div>
    );
  }
}
