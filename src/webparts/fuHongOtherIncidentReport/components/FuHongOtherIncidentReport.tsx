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
import { sp } from "@pnp/sp";
import { graph } from "@pnp/graph/presets/all";
import { jobTitleParser, jobTitleParser2, Role } from '../../../utils/RoleParser';
import ThankYouComponent from '../../../components/ThankYou/ThankYouComponent';
import { getQueryParameterNumber, getQueryParameterString } from '../../../utils/UrlQueryHelper';
import { getUserAdByGraph } from '../../../api/FetchUser';
import { getOtherIncidentReportById } from '../../../api/FetchFuHongList';


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

interface IFuHongOtherIncidentReportStates {
  currentUserRole: Role,
  otherIncidentReportFormData: any,
  stage: string,
  formSubmitted: boolean,
  isPrintMode: boolean
}

export default class FuHongOtherIncidentReport extends React.Component<IFuHongOtherIncidentReportProps, IFuHongOtherIncidentReportStates> {
  public constructor(props) {
    super(props);
    getCanvasZone();

    sp.setup({ spfxContext: this.props.context });
    graph.setup({ spfxContext: this.props.context });

    this.state = {
      currentUserRole: Role.GENERAL,
      otherIncidentReportFormData: null,
      stage: "",
      formSubmitted: false,
      isPrintMode: false
    }

    console.log("Flow 5");
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

  private async initialDataByFormId() {
    try {

      const formId = getQueryParameterNumber("formId");
      if (formId) {

        const data = await getOtherIncidentReportById(formId);
        this.setState({ otherIncidentReportFormData: data });
        return data;
      }
    } catch (err) {
      console.error(err);
      throw new Error("initialDataByFormId error");
    }
  }

  private redirectPath = this.props.context.pageContext.site.absoluteUrl + `/accident-and-incident/SitePages/Home.aspx`;

  private formSubmittedHandler = () => this.setState({ formSubmitted: true });

  public render(): React.ReactElement<IFuHongOtherIncidentReportProps> {
    return (
      <div className={styles.fuHongOtherIncidentReport}>
        <div className={styles.container}>
          {
            this.state.formSubmitted ?
              <ThankYouComponent redirectLink={this.redirectPath} />
              :
              <Tabs variant="fullWidth">
                <TabList>
                  <Tab>其他事故呈報表</Tab>
                  <Tab>事故跟進/結束報告</Tab>
                </TabList>
                <TabPanel>
                  <OtherIncidentReport context={this.props.context} styles={styles} formSubmittedHandler={this.formSubmittedHandler} currentUserRole={this.state.currentUserRole} formData={this.state.otherIncidentReportFormData} isPrintMode={this.state.isPrintMode} />
                </TabPanel>
                <TabPanel>
                  <IncidentFollowUpForm context={this.props.context} styles={styles} formType={"OTHER_INCIDENT"} formSubmittedHandler={this.formSubmittedHandler} parentFormData={this.state.otherIncidentReportFormData} currentUserRole={this.state.currentUserRole} isPrintMode={this.state.isPrintMode} />
                </TabPanel>
              </Tabs>
          }
        </div>
      </div>
    );
  }
}
