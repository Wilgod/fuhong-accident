import * as React from 'react';
import styles from './FuHongSpecialIncidentReportLicense.module.scss';
import { IFuHongSpecialIncidentReportLicenseProps } from './IFuHongSpecialIncidentReportLicenseProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import 'bootstrap/dist/css/bootstrap.css';
import "./react-tabs.css";
import SpecialIncidentReportLicense from './SpecialIncidentReportLicense';
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
              <Tab>19_服務使用者意外填報表(一)</Tab>
            </TabList>
            <TabPanel>
              <SpecialIncidentReportLicense context={this.props.context} styles={styles} />
            </TabPanel>
          </Tabs>
        </div>
      </div>
    );
  }
}
