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
import { sp } from "@pnp/sp";
import { graph } from "@pnp/graph/presets/all";
import { jobTitleParser, jobTitleParser2, Role } from '../../../utils/RoleParser';
import "./react-tabs.css";
import "./custom.css";
import ThankYouComponent from '../../../components/ThankYou/ThankYouComponent';

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

export default class FuHongSpecialIncidentReportLicense extends React.Component<IFuHongSpecialIncidentReportLicenseProps, { currentUserRole: Role, serviceUserAccidentFormData: any, stage: string, formSubmitted: boolean }> {
  public constructor(props) {
    super(props);
    getCanvasZone();
    console.log("Flow 4");

    sp.setup({ spfxContext: this.props.context });
    graph.setup({ spfxContext: this.props.context });

    this.state = {
      currentUserRole: Role.GENERAL,
      serviceUserAccidentFormData: null,
      stage: "",
      formSubmitted: false
    }
  }


  private redirectPath = this.props.context.pageContext.site.absoluteUrl + `/accident-and-incident/SitePages/Home.aspx`;

  private formSubmittedHandler = () => this.setState({ formSubmitted: true });

  public render(): React.ReactElement<IFuHongSpecialIncidentReportLicenseProps> {
    return (
      <div className={styles.fuHongSpecialIncidentReportLicense}>
        <div className={styles.container}>
          {
            this.state.formSubmitted ?
              <ThankYouComponent redirectLink={this.redirectPath} />
              :
              <Tabs variant="fullWidth">
                <TabList>
                  <Tab>特別事故報告(牌照事務處)</Tab>
                  <Tab>事故跟進/結束報告</Tab>
                </TabList>
                <TabPanel>
                  <SpecialIncidentReportLicense context={this.props.context} styles={styles} formSubmittedHandler={this.formSubmittedHandler} />
                </TabPanel>
                <TabPanel>
                  <IncidentFollowUpForm context={this.props.context} styles={styles} formType={"SPECIAL_INCIDENT_REPORT_LICENSE"} formSubmittedHandler={this.formSubmittedHandler} />
                </TabPanel>
              </Tabs>
          }
        </div>
      </div>
    );
  }
}
