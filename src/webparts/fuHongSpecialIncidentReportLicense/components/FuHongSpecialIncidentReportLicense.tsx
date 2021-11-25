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
import { getQueryParameterNumber, getQueryParameterString } from '../../../utils/UrlQueryHelper';
import { getSpecialIncidentReportLicenseById } from '../../../api/FetchFuHongList';
import { getUserAdByGraph } from '../../../api/FetchUser';

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

interface IFuHongSpecialIncidentReportLicenseStates {
  currentUserRole: Role;
  specialINcidentReportLicenseData: any;
  stage: string;
  formSubmitted: boolean;
  isPrintMode: boolean;
}

export default class FuHongSpecialIncidentReportLicense extends React.Component<IFuHongSpecialIncidentReportLicenseProps, IFuHongSpecialIncidentReportLicenseStates> {
  public constructor(props) {
    super(props);
    getCanvasZone();
    console.log("Flow 4");

    sp.setup({ spfxContext: this.props.context });
    graph.setup({ spfxContext: this.props.context });

    this.state = {
      currentUserRole: Role.GENERAL,
      specialINcidentReportLicenseData: null,
      stage: "",
      formSubmitted: false,
      isPrintMode: false
    }
  }

  public componentDidMount() {
    getUserAdByGraph(this.props.context.pageContext.legacyPageContext.userEmail).then(value => {
      if (value && value.jobTitle) {
        this.setState({ currentUserRole: jobTitleParser2(value.jobTitle) });
      }

      this.initialDataByFormId().then((data) => {
        if (data && data.Investigator && data.Investigator.EMail) {
          if (data.Investigator.EMail === this.props.context.pageContext.legacyPageContext.userEmail) {
            this.setState({ currentUserRole: Role.INVESTIGATOR });
          }
        }

        if (data && data.SM && data.SM.EMail) {
          if (data.SM.EMail === this.props.context.pageContext.legacyPageContext.userEmail) {
            this.setState({ currentUserRole: Role.SERVICE_MANAGER });
          }
        }

        if (data && data.SD && data.SD.EMail) {
          if (data.SD.EMail === this.props.context.pageContext.legacyPageContext.userEmail) {
            this.setState({ currentUserRole: Role.SERVICE_DIRECTOR });
          }
        }

        if (data && data.SPT && data.SPT.EMail) {
          if (data.SPT.EMail === this.props.context.pageContext.legacyPageContext.userEmail) {
            this.setState({ currentUserRole: Role.SENIOR_PHYSIOTHERAPIST });
          }
        }

        this.checkRole();// Testing Only 
      }).catch(console.error);
    }).catch(console.error);
  }

  private checkRole = () => {
    const queryParameter = getQueryParameterString("role");
    if (queryParameter) {
      const role = jobTitleParser(queryParameter);
      this.setState({
        currentUserRole: role
      });
    }
  }

  private async initialDataByFormId() {
    try {
      const formId = getQueryParameterNumber("formId");
      if (formId) {
        const data = await getSpecialIncidentReportLicenseById(formId);
        this.setState({ specialINcidentReportLicenseData: data });
        return data;
      }
    } catch (err) {
      console.error(err);
      throw new Error("initialDataByFormId error");
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
                  <SpecialIncidentReportLicense context={this.props.context} styles={styles} formSubmittedHandler={this.formSubmittedHandler} currentUserRole={this.state.currentUserRole} formData={this.state.specialINcidentReportLicenseData} isPrintMode={this.state.isPrintMode} />
                </TabPanel>
                <TabPanel>
                  <IncidentFollowUpForm context={this.props.context} styles={styles} formType={"SPECIAL_INCIDENT_REPORT_LICENSE"} formSubmittedHandler={this.formSubmittedHandler} currentUserRole={this.state.currentUserRole} parentFormData={this.state.specialINcidentReportLicenseData} isPrintMode={this.state.isPrintMode} />
                </TabPanel>
              </Tabs>
          }
        </div>
      </div>
    );
  }
}
