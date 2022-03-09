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
import { getAccidentReportFormById, getAllAccidentFollowUpFormByCaseNumber, getAccidentFollowUpFormById } from '../../../api/FetchFuHongList';
import { getOutsiderAccidentWorkflow } from '../../../api/FetchFuHongList';
import { checkPermissionList } from '../../../api/FetchUser';
import OutsidersAccidentFormPrint from "../../../components/OutsidersAccidentForm/OutsidersAccidentFormPrint";
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
  permissionList:any;
  formSubmitted: boolean;
  outsiderAccidentFormData: any;
  stage: string;
  isPrintMode: boolean;
  formTwentyData:any;
  formTwentyOneData:any;
  formTwentyOneDataPrint:any;
  formTwentyOneDataSelected:number;
  outsiderAccidentWorkflow:string;
  indexTab:number;
  
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
      permissionList: [],
      outsiderAccidentFormData: null,
      stage: "",
      formSubmitted: false,
      isPrintMode: false,
      formTwentyData:[],
      formTwentyOneData:[],
      formTwentyOneDataPrint:[],
      formTwentyOneDataSelected:null,
      outsiderAccidentWorkflow:'',
      indexTab:0
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
    const PermissionList = await checkPermissionList(this.siteCollectionUrl, this.props.context.pageContext.legacyPageContext.userEmail);
    const outsiderAccidentWorkflow = await getOutsiderAccidentWorkflow();
    this.setState({ permissionList: PermissionList, outsiderAccidentWorkflow:outsiderAccidentWorkflow.Url });
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
            if (this.state.formTwentyData.SM.EMail === this.props.context.pageContext.legacyPageContext.userEmail || data.SM.EMail === this.props.context.pageContext.legacyPageContext.userEmail) {
              this.setState({ currentUserRole: Role.SERVICE_MANAGER });
            }
          } else if (data.Stage == '3') {
            if (this.state.formTwentyOneData.SM.EMail === this.props.context.pageContext.legacyPageContext.userEmail ||
              this.state.formTwentyData.SM.EMail === this.props.context.pageContext.legacyPageContext.userEmail || 
              data.SM.EMail === this.props.context.pageContext.legacyPageContext.userEmail) {
              this.setState({ currentUserRole: Role.SERVICE_MANAGER });
            }
          }
          if (data.Stage == '1' && data.SD && data.SD.EMail || data.Stage == '2') {
            if (data.SD.EMail === this.props.context.pageContext.legacyPageContext.userEmail) {
              this.setState({ currentUserRole: Role.SERVICE_MANAGER });
            }
          } else if (data.Stage == '3') {
            if (this.state.formTwentyOneData.SD.EMail === this.props.context.pageContext.legacyPageContext.userEmail || data.SD.EMail === this.props.context.pageContext.legacyPageContext.userEmail) {
              this.setState({ currentUserRole: Role.SERVICE_MANAGER });
            }
          }
          if (data.Stage == '1' && data.SPT && data.SPT.EMail) {
            if (data.SPT.EMail === this.props.context.pageContext.legacyPageContext.userEmail) {
              this.setState({ currentUserRole: Role.SERVICE_MANAGER });
            }
          } else if (data.Stage == '2') {
            if (this.state.formTwentyData.SPT.EMail === this.props.context.pageContext.legacyPageContext.userEmail ||
              data.SPT.EMail === this.props.context.pageContext.legacyPageContext.userEmail) {
              this.setState({ currentUserRole: Role.SERVICE_MANAGER });
            }
          } else if (data.Stage == '3') {
            if (this.state.formTwentyOneData.SPT.EMail === this.props.context.pageContext.legacyPageContext.userEmail ||
              this.state.formTwentyData.SPT.EMail === this.props.context.pageContext.legacyPageContext.userEmail ||
              data.SPT.EMail === this.props.context.pageContext.legacyPageContext.userEmail) {
              this.setState({ currentUserRole: Role.SERVICE_MANAGER });
            }
          }
        }
        getAdmin().then((admin) => {
          admin.forEach((item) => {
            if (item.Admin && item.Admin.EMail === this.props.context.pageContext.legacyPageContext.userEmail) {
              this.setState({ currentUserRole: Role.ADMIN,permissionList:['All']  });
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
        const author = await getUserAdByGraph(data.Author.EMail);
        const investigator = data.InvestigatorId != null ? await getUserAdByGraph(data.Investigator.EMail) : null;
        debugger
        //data["Author"] =author;
        //data["InvestigatorAD"] =investigator;
        let stage = parseInt(data.Stage)-1;
        let formTwentyData:any = [];
        let formTwentyOneData:any = [];
        let formTwentyOneDataPrint= [];
        let formTwentyOneDataSelected = null;
        if (data.AccidentReportFormId != null) {
          formTwentyData = await getAccidentReportFormById(data.AccidentReportFormId);
        }
        if (data.AccidentFollowUpFormId != null && data.AccidentFollowUpFormId.length > 0) {
          formTwentyOneData = await getAccidentFollowUpFormById(data.AccidentFollowUpFormId[data.AccidentFollowUpFormId.length - 1]);
          formTwentyOneDataPrint = await getAllAccidentFollowUpFormByCaseNumber(data.CaseNumber);
          formTwentyOneData = formTwentyOneDataPrint[0];
          formTwentyOneDataSelected = formTwentyOneData.Id
        }
        //this.setState({ outsiderAccidentFormData: data, formTwentyData:formTwentyData, formTwentyOneData:formTwentyOneData });
        if (data.Stage == '2' && data.Status == 'PENDING_INVESTIGATE' && (data.SDComment == null || data.SDComment == '') && data.SDId == this.props.context.pageContext.legacyPageContext.userId && new Date(new Date(data.SPTDate).setDate(new Date(data.SPTDate).getDate()  + 7)) > new Date()) {
          this.setState({ outsiderAccidentFormData: data, indexTab:0, formTwentyData:formTwentyData, formTwentyOneData:formTwentyOneData, formTwentyOneDataPrint:formTwentyOneDataPrint });
        } else if (data.Stage == '3' && data.Status == 'PENDING_SM_FILL_IN') {
          if (formTwentyData.SMId == this.props.context.pageContext.legacyPageContext.userId && (formTwentyData.SMComment == null || formTwentyData.SMComment == '') && new Date(new Date(formTwentyData.SPTDate).setDate(new Date(formTwentyData.SPTDate).getDate() + 7)) > new Date()) {
            this.setState({ outsiderAccidentFormData: data, indexTab:1, formTwentyData:formTwentyData, formTwentyOneData:formTwentyOneData, formTwentyOneDataPrint:formTwentyOneDataPrint, formTwentyOneDataSelected:formTwentyOneDataSelected });
          } else {
            this.setState({ outsiderAccidentFormData: data, indexTab:stage, formTwentyData:formTwentyData, formTwentyOneData:formTwentyOneData, formTwentyOneDataPrint:formTwentyOneDataPrint, formTwentyOneDataSelected:formTwentyOneDataSelected });
          }
        } else {
          this.setState({ outsiderAccidentFormData: data, indexTab:stage, formTwentyData:formTwentyData, formTwentyOneData:formTwentyOneData, formTwentyOneDataPrint:formTwentyOneDataPrint, formTwentyOneDataSelected:formTwentyOneDataSelected });
        }
        return data;
      }
    } catch (err) {
      console.error(err);
      throw new Error("initialDataByFormId error");
    }
  }

  public changeFormTwentyOneDataSelected(value) {
    debugger
    this.setState({
      formTwentyOneDataSelected:value
    })
  }

  private tab(index) {
    this.setState({
      indexTab:index
    })
  }

  private print() {
    this.setState({
      isPrintMode:true
    })
  }

  private redirectPath = this.props.context.pageContext.site.absoluteUrl + `/accident-and-incident/SitePages/Home.aspx`;

  private formSubmittedHandler = () => this.setState({ formSubmitted: true });

  public render(): React.ReactElement<IFuHongOutsidersAccidentFormProps> {

    return (
      <div className={styles.fuHongOutsidersAccidentForm}>
        <div className={styles.container}>
          {this.state.isPrintMode ?
          <OutsidersAccidentFormPrint index={this.state.indexTab} formData={this.state.outsiderAccidentFormData} formTwentyData={this.state.formTwentyData} formTwentyOneDataPrint={this.state.formTwentyOneDataPrint} formTwentyOneDataSelected={this.state.formTwentyOneDataSelected} siteCollectionUrl={this.siteCollectionUrl} permissionList={this.state.permissionList}/>
          :
            this.state.formSubmitted ?
              <ThankYouComponent redirectLink={this.redirectPath} />
              :
              <div className={styles.eform}>
                  {this.state.outsiderAccidentFormData != null &&
                    <div className="row" style={{float:'right'}}>
                      <div className="col-12" style={{padding:'10px 20px'}}><button className="btn btn-warning mr-3" onClick={()=>this.print()}>打印</button></div>
                    </div>
                  }
                <Tabs variant="fullWidth" defaultIndex={this.state.indexTab}>
                  <TabList>
                    <Tab onClick={()=>this.tab(0)}>外界人士意外填報表(一)</Tab>
                    <Tab onClick={()=>this.tab(1)}>外界人士意外報告(二)</Tab>
                    <Tab onClick={()=>this.tab(2)}>意外跟進/結束表(三)</Tab>
                  </TabList>
                  <TabPanel>
                    <OutsidersAccidentForm context={this.props.context} formSubmittedHandler={this.formSubmittedHandler} currentUserRole={this.state.currentUserRole} formData={this.state.outsiderAccidentFormData} isPrintMode={this.state.isPrintMode} siteCollectionUrl={this.siteCollectionUrl} permissionList={this.state.permissionList} workflow={this.state.outsiderAccidentWorkflow}/>
                  </TabPanel>
                  <TabPanel>
                    <AccidentReportForm context={this.props.context} styles={styles} formType={"OUTSIDERS"} currentUserRole={this.state.currentUserRole} parentFormData={this.state.outsiderAccidentFormData} formSubmittedHandler={this.formSubmittedHandler} isPrintMode={this.state.isPrintMode} formTwentyData={this.state.formTwentyData} workflow={this.state.outsiderAccidentWorkflow}/>
                  </TabPanel>
                  <TabPanel>
                    <AccidentFollowUpForm context={this.props.context} styles={styles} formType={"OUTSIDERS"} currentUserRole={this.state.currentUserRole} parentFormData={this.state.outsiderAccidentFormData} formSubmittedHandler={this.formSubmittedHandler} isPrintMode={this.state.isPrintMode} formTwentyData={this.state.formTwentyData} formTwentyOneData={this.state.formTwentyOneData} workflow={this.state.outsiderAccidentWorkflow} changeFormTwentyOneDataSelected={this.changeFormTwentyOneDataSelected}/>
                  </TabPanel>
                </Tabs>
              </div>
          }
        </div>
      </div>
    );
  }
}
