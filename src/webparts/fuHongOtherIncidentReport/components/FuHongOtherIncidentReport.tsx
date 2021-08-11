import * as React from 'react';
import styles from './FuHongOtherIncidentReport.module.scss';
import { IFuHongOtherIncidentReportProps } from './IFuHongOtherIncidentReportProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import 'bootstrap/dist/css/bootstrap.css';
import "./react-tabs.css";
import OtherIncidentReport from "./OtherIncidentReport";
import "./custom.css";

export default class FuHongOtherIncidentReport extends React.Component<IFuHongOtherIncidentReportProps, {}> {
  public render(): React.ReactElement<IFuHongOtherIncidentReportProps> {
    return (
      <div className={styles.fuHongOtherIncidentReport}>
        <div className={styles.container}>
          <Tabs variant="fullWidth">
            <TabList>
              <Tab>23_其他事故呈報表</Tab>
            </TabList>
            <TabPanel>
              <OtherIncidentReport context={this.props.context} styles={styles} />
            </TabPanel>
          </Tabs>
        </div>
      </div>
    );
  }
}
