import * as React from 'react';
import styles from './FuHongOutsidersAccidentForm.module.scss';
import { IFuHongOutsidersAccidentFormProps } from './IFuHongOutsidersAccidentFormProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as moment from 'moment';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import AccidentFollowUpForm from "../../../components/AccidentFollowUpForm/AccidentFollowUpForm";
import AccidentReportForm from "../../../components/AccidentReportForm/AccidentReportForm";
import 'react-tabs/style/react-tabs.css';
import 'bootstrap/dist/css/bootstrap.css';
import "./react-tabs.css";
import OutsidersAccidentForm from "./OutsidersAccidentForm";
import { jobTitleParser, jobTitleParser2, Role } from '../../../utils/RoleParser';
import { getQueryParameterNumber, getQueryParameterString } from '../../../utils/UrlQueryHelper';
import { sp } from '@pnp/sp';
import { graph } from '@pnp/graph';
import ThankYouComponent from '../../../components/ThankYou/ThankYouComponent';
import { getUserAdByGraph } from '../../../api/FetchUser';
import { getAdmin, getOutsiderAccidentById } from '../../../api/FetchFuHongList';
import { getAccidentReportFormById, getAccidentFollowUpFormById } from '../../../api/FetchFuHongList';
import { getServiceUserAccidentWorkflow } from '../../../api/FetchFuHongList';
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

interface IFuHongOutsidersAccidentFormState {
  currentUserRole: Role;
  formSubmitted: boolean;
  outsiderAccidentFormData: any;
  stage: string;
  isPrintMode: boolean;
  formTwentyData:any;
  formTwentyOneData:any;
  serviceUserAccidentWorkflow:string;
}
export default class FuHongOutsidersAccidentForm extends React.Component<IFuHongOutsidersAccidentFormProps, IFuHongOutsidersAccidentFormState> {
  private siteCollectionName = this.props.context.pageContext.web.absoluteUrl.substring(this.props.context.pageContext.web.absoluteUrl.indexOf("/sites/") + 7, this.props.context.pageContext.web.absoluteUrl.length).substring(0, 14);
	private siteCollecitonOrigin = this.props.context.pageContext.web.absoluteUrl.indexOf("/sites/") > -1 ? this.props.context.pageContext.web.absoluteUrl.substring(0, this.props.context.pageContext.web.absoluteUrl.indexOf("/sites/")) : this.props.context.pageContext.web.absoluteUrl.substring(0, this.props.context.pageContext.web.absoluteUrl.indexOf(".com" + 4));
	private siteCollectionUrl = this.props.context.pageContext.web.absoluteUrl.indexOf("/sites/") > -1 ? this.siteCollecitonOrigin + "/sites/" + this.siteCollectionName : this.siteCollecitonOrigin;
	

  public constructor(props) {
    super(props);
    getCanvasZone();
    console.log("Flow 2");
    sp.setup({ spfxContext: this.props.context });
    graph.setup({ spfxContext: this.props.context });

    this.state = {
      currentUserRole: Role.GENERAL,
      outsiderAccidentFormData: null,
      stage: "",
      formSubmitted: false,
      isPrintMode: false,
      formTwentyData:[],
      formTwentyOneData:[],
      serviceUserAccidentWorkflow:''
    }
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

  private initialState = async () => {
    const serviceUserAccidentWorkflow = await getServiceUserAccidentWorkflow();
    this.setState({ serviceUserAccidentWorkflow:serviceUserAccidentWorkflow });
  }

  public componentDidMount() {
    this.initialState();
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

        if (data) {
          if (data.Stage == '1' && data.SM && data.SM.EMail) {
            if (data.SM.EMail === this.props.context.pageContext.legacyPageContext.userEmail) {
              this.setState({ currentUserRole: Role.SERVICE_MANAGER });
            }
          } else if (data.Stage == '2') {
            if (this.state.formTwentyData.SM.EMail === this.props.context.pageContext.legacyPageContext.userEmail) {
              this.setState({ currentUserRole: Role.SERVICE_MANAGER });
            }
          } else if (data.Stage == '3') {
            if (this.state.formTwentyOneData.SM.EMail === this.props.context.pageContext.legacyPageContext.userEmail) {
              this.setState({ currentUserRole: Role.SERVICE_MANAGER });
            }
          }
          if (data.Stage == '1' && data.SD && data.SD.EMail) {
            if (data.SD.EMail === this.props.context.pageContext.legacyPageContext.userEmail) {
              this.setState({ currentUserRole: Role.SERVICE_MANAGER });
            }
          } else if (data.Stage == '3') {
            if (this.state.formTwentyOneData.SD.EMail === this.props.context.pageContext.legacyPageContext.userEmail) {
              this.setState({ currentUserRole: Role.SERVICE_MANAGER });
            }
          }
          if (data.Stage == '1' && data.SPT && data.SPT.EMail) {
            if (data.SPT.EMail === this.props.context.pageContext.legacyPageContext.userEmail) {
              this.setState({ currentUserRole: Role.SERVICE_MANAGER });
            }
          } else if (data.Stage == '2') {
            if (this.state.formTwentyData.SPT.EMail === this.props.context.pageContext.legacyPageContext.userEmail) {
              this.setState({ currentUserRole: Role.SERVICE_MANAGER });
            }
          } else if (data.Stage == '3') {
            if (this.state.formTwentyOneData.SPT.EMail === this.props.context.pageContext.legacyPageContext.userEmail) {
              this.setState({ currentUserRole: Role.SERVICE_MANAGER });
            }
          }
        }
        getAdmin().then((admin) => {
          admin.forEach((item) => {
            if (item.Admin && item.Admin.EMail === this.props.context.pageContext.legacyPageContext.userEmail) {
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
        const data = await getOutsiderAccidentById(formId);
        let formTwentyData:any = [];
        let formTwentyOneData:any = [];
        if (data.AccidentReportFormId != null) {
          formTwentyData = await getAccidentReportFormById(data.AccidentReportFormId);
        }
        if (data.AccidentFollowUpFormId != null && data.AccidentFollowUpFormId.length > 0) {
          formTwentyOneData = await getAccidentFollowUpFormById(data.AccidentFollowUpFormId);
        }
        this.setState({ outsiderAccidentFormData: data, formTwentyData:formTwentyData, formTwentyOneData:formTwentyOneData });
        return data;
      }
    } catch (err) {
      console.error(err);
      throw new Error("initialDataByFormId error");
    }
  }

  private redirectPath = this.props.context.pageContext.site.absoluteUrl + `/accident-and-incident/SitePages/Home.aspx`;

  private formSubmittedHandler = () => this.setState({ formSubmitted: true });

  public render(): React.ReactElement<IFuHongOutsidersAccidentFormProps> {

    return (
      <div className={styles.fuHongOutsidersAccidentForm}>
        <div className={styles.container}>
          {
            this.state.formSubmitted ?
              <ThankYouComponent redirectLink={this.redirectPath} />
              :
              <Tabs variant="fullWidth">
                <TabList>
                  <Tab>外界人士意外填報表(一)</Tab>
                  <Tab>外界人士意外報告(二)</Tab>
                  <Tab>意外跟進/結束表(三)</Tab>
                </TabList>
                <TabPanel>
                  <OutsidersAccidentForm context={this.props.context} formSubmittedHandler={this.formSubmittedHandler} currentUserRole={this.state.currentUserRole} formData={this.state.outsiderAccidentFormData} isPrintMode={this.state.isPrintMode} siteCollectionUrl={this.siteCollectionUrl}/>
                </TabPanel>
                <TabPanel>
                  <AccidentReportForm context={this.props.context} styles={styles} formType={"OUTSIDERS"} currentUserRole={this.state.currentUserRole} parentFormData={this.state.outsiderAccidentFormData} formSubmittedHandler={this.formSubmittedHandler} isPrintMode={this.state.isPrintMode} formTwentyData={this.state.formTwentyData} serviceUserAccidentWorkflow={this.state.serviceUserAccidentWorkflow}/>
                </TabPanel>
                <TabPanel>
                  <AccidentFollowUpForm context={this.props.context} styles={styles} formType={"OUTSIDERS"} currentUserRole={this.state.currentUserRole} parentFormData={this.state.outsiderAccidentFormData} formSubmittedHandler={this.formSubmittedHandler} isPrintMode={this.state.isPrintMode} formTwentyData={this.state.formTwentyData} formTwentyOneData={this.state.formTwentyOneData} serviceUserAccidentWorkflow={this.state.serviceUserAccidentWorkflow}/>
                </TabPanel>
              </Tabs>
          }
        </div>
      </div>
    );
  }
}
