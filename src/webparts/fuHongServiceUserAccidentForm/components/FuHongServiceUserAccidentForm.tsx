import * as React from 'react';
import styles from './FuHongServiceUserAccidentForm.module.scss';
import { IFuHongServiceUserAccidentFormProps } from './IFuHongServiceUserAccidentFormProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as moment from 'moment';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { sp } from "@pnp/sp";
import { graph } from "@pnp/graph/presets/all";
import 'react-tabs/style/react-tabs.css';
import 'bootstrap/dist/css/bootstrap.css';
import "./react-tabs.css";
import ServiceUserAccidentForm from "./ServiceUserAccidentForm";
import AccidentFollowUpForm from "../../../components/AccidentFollowUpForm/AccidentFollowUpForm";
import AccidentReportForm from "../../../components/AccidentReportForm/AccidentReportForm";
import { jobTitleParser, jobTitleParser2, Role } from '../../../utils/RoleParser';
import { getQueryParameterNumber, getQueryParameterString } from '../../../utils/UrlQueryHelper';
import { getAdmin, getServiceUserAccidentById } from '../../../api/FetchFuHongList';
import { getUserAdByGraph } from '../../../api/FetchUser';
import ThankYouComponent from '../../../components/ThankYou/ThankYouComponent';

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

if (document.getElementById('workbenchPageContent') != null) {
  document.getElementById('workbenchPageContent').style.maxWidth = '1920px';
}

if (document.querySelector('.CanvasZone') != null) {
  (document.querySelector('.CanvasZone') as HTMLElement).style.maxWidth = '1920px';
}

interface IFuHongServiceUserAccidentFormState {
  currentUserRole: Role;
  serviceUserAccidentFormData: any;
  stage: string;
  formSubmitted: boolean;
  isPrintMode: boolean;
}

export default class FuHongServiceUserAccidentForm extends React.Component<IFuHongServiceUserAccidentFormProps, IFuHongServiceUserAccidentFormState> {
  public constructor(props) {
    super(props);
    getCanvasZone();

    sp.setup({ spfxContext: this.props.context });
    graph.setup({ spfxContext: this.props.context });

    this.state = {
      currentUserRole: Role.GENERAL,
      serviceUserAccidentFormData: null,
      stage: "",
      formSubmitted: false,
      isPrintMode: false,
    }
    console.log("Flow 1");
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

        getAdmin().then((admin) => {
          admin.forEach((item) => {
            if (item.Admin && item.Admin.EMail === this.props.context.pageContext.legacyPageContext.userEmail) {
              console.log(Role.ADMIN === 4)
              this.setState({ currentUserRole: Role.ADMIN });
            }
          })
        }).catch(console.error)
        this.checkRole();// Testing Only 
      }).catch(console.error);
    }).catch(console.error);
  }

  private async initialDataByFormId() {
    try {
      const formId = getQueryParameterNumber("formId");
      if (formId) {
        const data = await getServiceUserAccidentById(formId);
        this.setState({ serviceUserAccidentFormData: data });
        return data;
      }
    } catch (err) {
      console.error(err);
      throw new Error("initialDataByFormId error");
    }
  }

  private redirectPath = this.props.context.pageContext.site.absoluteUrl + `/accident-and-incident/SitePages/Home.aspx`;

  private formSubmittedHandler = () => this.setState({ formSubmitted: true });

  private printModeHandler = () => { this.setState({ isPrintMode: !this.state.isPrintMode }); }

  public render(): React.ReactElement<IFuHongServiceUserAccidentFormProps> {

    return (
      <div className={styles.fuHongServiceUserAccidentForm}>
        <div className={styles.container}>
          {
            this.state.formSubmitted ?
              <ThankYouComponent redirectLink={this.redirectPath} />
              :
              <Tabs variant="fullWidth">
                <TabList>
                  <Tab>服務使用者意外填報表(一)</Tab>
                  <Tab>服務使用者意外報告(二)</Tab>
                  <Tab>意外跟進/結束表(三)</Tab>
                </TabList>
                <TabPanel>
                  <ServiceUserAccidentForm context={this.props.context} currentUserRole={this.state.currentUserRole} formData={this.state.serviceUserAccidentFormData} formSubmittedHandler={this.formSubmittedHandler} isPrintMode={this.state.isPrintMode} />
                </TabPanel>
                <TabPanel>
                  <AccidentReportForm context={this.props.context} styles={styles} formType={"SERVICE_USER"} currentUserRole={this.state.currentUserRole} parentFormData={this.state.serviceUserAccidentFormData} formSubmittedHandler={this.formSubmittedHandler} isPrintMode={this.state.isPrintMode} />
                </TabPanel>
                <TabPanel>
                  <AccidentFollowUpForm context={this.props.context} styles={styles} formType={"SERVICE_USER"} currentUserRole={this.state.currentUserRole} parentFormData={this.state.serviceUserAccidentFormData} formSubmittedHandler={this.formSubmittedHandler} isPrintMode={this.state.isPrintMode} />
                </TabPanel>
              </Tabs>
          }
        </div>
      </div>
    );
  }
}
