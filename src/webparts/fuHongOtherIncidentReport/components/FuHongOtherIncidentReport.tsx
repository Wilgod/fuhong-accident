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
import NoAccessComponent from '../../../components/NoAccessRight/NoAccessRightComponent';
import { getQueryParameterNumber, getQueryParameterString } from '../../../utils/UrlQueryHelper';
import { getUserAdByGraph, getAllServiceUnit, checkDepartmentList,checkPermissionList } from '../../../api/FetchUser';
import { getAdmin, getOtherIncidentReportById, getOtherIncidentReportWorkflow, getAllIncidentFollowUpFormByParentId } from '../../../api/FetchFuHongList';
import OtherIncidentReportPrint from "../../../components/IncidentFollowUpForm/OtherIncidentReportPrint";
if (document.getElementById('workbenchPageContent') != null) {
  document.getElementById('workbenchPageContent').style.maxWidth = 'none';
}

if (document.querySelector('.CanvasZone') != null) {
  (document.querySelector('.CanvasZone') as HTMLElement).style.maxWidth = 'none';
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
  currentUserRead:boolean;
  currentUserRole: Role,
  permissionList:any;
  otherIncidentReportFormData: any,
  stage: string,
  formSubmitted: boolean,
  isPrintMode: boolean,
  speicalIncidentReportWorkflow: string,
  departmentList:any,
  loading:boolean,
  formTwentySixData:any;
  formTwentySixDataPrint:any;
  formTwentySixDataSelected:number;
  indexTab:number;
  serviceUnitList:any;
}

export default class FuHongOtherIncidentReport extends React.Component<IFuHongOtherIncidentReportProps, IFuHongOtherIncidentReportStates> {
  private siteCollectionName = this.props.context.pageContext.web.absoluteUrl.split('/sites/')[1].split('/')[0];
	private siteCollecitonOrigin = this.props.context.pageContext.web.absoluteUrl.indexOf("/sites/") > -1 ? this.props.context.pageContext.web.absoluteUrl.substring(0, this.props.context.pageContext.web.absoluteUrl.indexOf("/sites/")) : this.props.context.pageContext.web.absoluteUrl.substring(0, this.props.context.pageContext.web.absoluteUrl.indexOf(".com" + 4));
	private siteCollectionUrl = this.props.context.pageContext.web.absoluteUrl.indexOf("/sites/") > -1 ? this.siteCollecitonOrigin + "/sites/" + this.siteCollectionName : this.siteCollecitonOrigin;
	
  public constructor(props) {
    super(props);
    getCanvasZone();

    sp.setup({ spfxContext: this.props.context });
    graph.setup({ spfxContext: this.props.context });

    this.state = {
      currentUserRole:  Role.NoAccessRight,//Role.GENERAL,
      permissionList: [],
      otherIncidentReportFormData: null,
      stage: "",
      formSubmitted: false,
      isPrintMode: false,
      speicalIncidentReportWorkflow:'',
      departmentList:[],
      loading:true,
      formTwentySixData:[],
      formTwentySixDataPrint:[],
      formTwentySixDataSelected:null,
      indexTab:0,
      serviceUnitList:[],
      currentUserRead:false
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

  private initialState = async () => {
    const PermissionList = await checkPermissionList(this.siteCollectionUrl, this.props.context.pageContext.legacyPageContext.userEmail);
    const DepartmentList = await checkDepartmentList(this.siteCollectionUrl, this.props.context.pageContext.legacyPageContext.userEmail);
    const speicalIncidentReportWorkflow = await getOtherIncidentReportWorkflow();
    const serviceUnitList:any = await getAllServiceUnit(this.siteCollectionUrl);
    debugger
    return [PermissionList, DepartmentList,speicalIncidentReportWorkflow.Url,serviceUnitList]
    //this.setState({ departmentList: DepartmentList, loading:true, speicalIncidentReportWorkflow:speicalIncidentReportWorkflow.Url, serviceUnitList:serviceUnitList });
  }

  public componentDidMount() {
    this.initialState().then((lists)=> {
      
      getUserAdByGraph(this.props.context.pageContext.legacyPageContext.userEmail).then(value => {
        /*if (value && value.jobTitle) {
          this.setState({ currentUserRole: jobTitleParser2(value.jobTitle) });
        }*/
  
        this.initialDataByFormId().then(async(data) => {
          let formTwentySixData :any = [];
          let formTwentySixDataPrint :any = [];
          let formTwentySixDataSelected = null;
          if (data) {
            formTwentySixDataPrint = await getAllIncidentFollowUpFormByParentId(data.Id);
            
            if (formTwentySixDataPrint.length > 0) {
              let filterTSdata = formTwentySixDataPrint.filter(item => {return item.CaseNumber.indexOf('OIN-') >= 0});
              if (filterTSdata.length > 0) {
                formTwentySixData = filterTSdata[0];
                formTwentySixDataSelected = formTwentySixData.Id;
              }
              
            }
            
          }
          let userEmail = this.props.context.pageContext.legacyPageContext.userEmail;
          if (data && data.Investigator && data.Investigator.EMail) {
            if (data.Investigator.EMail === userEmail) {
              this.setState({ currentUserRole: Role.INVESTIGATOR });
            }
          }
  
          if (data && data.SM && data.SM.EMail) {
            if (data.SM.EMail === userEmail) {
              this.setState({ currentUserRole: Role.SERVICE_MANAGER });
            }
          }
  
          if (data && data.SD && data.SD.EMail) {
            if (data.SD.EMail === userEmail) {
              this.setState({ currentUserRole: Role.SERVICE_DIRECTOR });
            }
          }
  
          if (data && data.SPT && data.SPT.EMail) {
            if (data.SPT.EMail === userEmail) {
              this.setState({ currentUserRole: Role.SENIOR_PHYSIOTHERAPIST });
            }
          }
          let userCanRead = false;
          if (data.SM && data.SM.EMail) {
            if (data.SM.EMail === userEmail) {
              userCanRead = true;
            }
          }
          if (data.SD && data.SD.EMail) {
            if (data.SD.EMail === userEmail) {
              userCanRead = true;
            }
          }
          if (data.Investigator && data.Investigator.EMail) {
            if (data.Investigator.EMail === userEmail) {
              userCanRead = true;
            }
          }
          if (data.Reporter && data.Reporter.EMail) {
            if (data.Reporter.EMail === userEmail) {
              userCanRead = true;
            }
          }
          if (data.SPT && data.SPT.EMail) {
            if (data.SPT.EMail === userEmail) {
              userCanRead = true;
            }
          }
          if (data.Stage == '2') {
            if (formTwentySixData.length > 0 && formTwentySixData.SM.EMail === userEmail) {
              userCanRead = true;
            }
            if (formTwentySixData.length > 0 && formTwentySixData.SD.EMail === userEmail) {
              userCanRead = true;
            }
            if (formTwentySixData.length > 0 && formTwentySixData.SPT.EMail === userEmail) {
              userCanRead = true;
            }
          }
          
          this.setState({ currentUserRead: userCanRead });
          if (data && data.Stage == '1') {
            this.setState({ indexTab: 0, formTwentySixData:formTwentySixData, formTwentySixDataPrint:formTwentySixDataPrint });
          } else if (data && data.Stage == '2') {
            this.setState({ indexTab: 1, formTwentySixData:formTwentySixData, formTwentySixDataPrint:formTwentySixDataPrint, formTwentySixDataSelected:formTwentySixDataSelected });
          }
          getAdmin().then((admin) => {
            admin.forEach((item) => {
              if (item.Admin && item.Admin.EMail === this.props.context.pageContext.legacyPageContext.userEmail) {
                this.setState({ currentUserRole: Role.ADMIN, currentUserRead:true });
              }
            })
          }).catch(console.error)
          this.setState({ permissionList: lists[0], departmentList: lists[1], loading:false, speicalIncidentReportWorkflow:lists[2], serviceUnitList:lists[3] });
          this.checkRole();// Testing Only 
        }).catch(console.error);
      }).catch(console.error);
    });
    
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

  public changeFormTwentySixDataSelected = (value) =>{
    this.setState({
      formTwentySixDataSelected:value
    })
  }

  private tab(index) {
    this.setState({
      indexTab:index
    })
  }
  
  private print = () => {
    this.setState({
      isPrintMode:true
    })
  }
  private backToForm = () => {
    this.setState({
      isPrintMode:false
    })
  }
  public render(): React.ReactElement<IFuHongOtherIncidentReportProps> {
    return (
      <div className={styles.fuHongOtherIncidentReport}>
        <div className={styles.container}>
        {
            !this.state.loading && this.state.formSubmitted ?
              <ThankYouComponent redirectLink={this.redirectPath} />
              :
              !this.state.loading && !this.state.currentUserRead ? // && (this.state.permissionList.length == 0 || this.state.currentUserRole == Role.NoAccessRight) ? 
              <NoAccessComponent redirectLink={this.redirectPath} />
              :
              !this.state.loading ?
                this.state.isPrintMode ?
                  <OtherIncidentReportPrint index={this.state.indexTab} context={this.props.context} formSubmittedHandler={this.formSubmittedHandler} currentUserRole={this.state.currentUserRole} formData={this.state.otherIncidentReportFormData} formTwentySixData={this.state.formTwentySixDataPrint} formTwentySixDataSelected={this.state.formTwentySixDataSelected} siteCollectionUrl={this.siteCollectionUrl} serviceUnitList={this.state.serviceUnitList}  backToForm={this.backToForm}/>
                  :
                  <div className={styles.eform}>
                    {/*this.state.serviceUserAccidentFormData != null &&
                      <div className="row" style={{float:'right'}}>
                        <div className="col-12" style={{padding:'10px 20px'}}><button className="btn btn-warning mr-3" onClick={()=>this.print()}>打印</button></div>
                      </div>
                    */}
                      <Tabs variant="fullWidth" defaultIndex={this.state.indexTab}>
                        <TabList>
                          <Tab onClick={()=>this.tab(0)}>其他事故呈報表</Tab>
                          <Tab onClick={()=>this.tab(1)}>事故跟進/結束報告</Tab>
                        </TabList>
                        <TabPanel>
                          <OtherIncidentReport context={this.props.context} styles={styles} formSubmittedHandler={this.formSubmittedHandler} currentUserRole={this.state.currentUserRole} formData={this.state.otherIncidentReportFormData} isPrintMode={this.state.isPrintMode} siteCollectionUrl={this.siteCollectionUrl} workflow={this.state.speicalIncidentReportWorkflow} print={this.print} permissionList={this.state.permissionList}/>
                        </TabPanel>
                        <TabPanel>
                          <IncidentFollowUpForm context={this.props.context} styles={styles} formType={"OTHER_INCIDENT"} formSubmittedHandler={this.formSubmittedHandler} parentFormData={this.state.otherIncidentReportFormData} currentUserRole={this.state.currentUserRole} isPrintMode={this.state.isPrintMode} siteCollectionUrl={this.siteCollectionUrl} permissionList={this.state.permissionList} formTwentySixData={this.state.formTwentySixData} workflow={this.state.speicalIncidentReportWorkflow} changeFormTwentySixDataSelected={this.changeFormTwentySixDataSelected} serviceUnitList={this.state.serviceUnitList} print={this.print}/>
                        </TabPanel>
                      </Tabs>
              </div>
              : <div></div>
              
          }
          {/*
            this.state.formSubmitted ?
              <ThankYouComponent redirectLink={this.redirectPath} />
              :
              this.state.loading ?
                this.state.isPrintMode ?
                  <OtherIncidentReportPrint index={this.state.indexTab} context={this.props.context} formSubmittedHandler={this.formSubmittedHandler} currentUserRole={this.state.currentUserRole} formData={this.state.otherIncidentReportFormData} formTwentySixData={this.state.formTwentySixDataPrint} formTwentySixDataSelected={this.state.formTwentySixDataSelected} siteCollectionUrl={this.siteCollectionUrl} serviceUnitList={this.state.serviceUnitList}  backToForm={this.backToForm}/>
                  :
                  <div className={styles.eform}>
                      <Tabs variant="fullWidth" defaultIndex={this.state.indexTab}>
                        <TabList>
                          <Tab onClick={()=>this.tab(0)}>其他事故呈報表</Tab>
                          <Tab onClick={()=>this.tab(1)}>事故跟進/結束報告</Tab>
                        </TabList>
                        <TabPanel>
                          <OtherIncidentReport context={this.props.context} styles={styles} formSubmittedHandler={this.formSubmittedHandler} currentUserRole={this.state.currentUserRole} formData={this.state.otherIncidentReportFormData} isPrintMode={this.state.isPrintMode} siteCollectionUrl={this.siteCollectionUrl} workflow={this.state.speicalIncidentReportWorkflow} print={this.print}/>
                        </TabPanel>
                        <TabPanel>
                          <IncidentFollowUpForm context={this.props.context} styles={styles} formType={"OTHER_INCIDENT"} formSubmittedHandler={this.formSubmittedHandler} parentFormData={this.state.otherIncidentReportFormData} currentUserRole={this.state.currentUserRole} isPrintMode={this.state.isPrintMode} siteCollectionUrl={this.siteCollectionUrl} formTwentySixData={this.state.formTwentySixData} workflow={this.state.speicalIncidentReportWorkflow} changeFormTwentySixDataSelected={this.changeFormTwentySixDataSelected} serviceUnitList={this.state.serviceUnitList} print={this.print}/>
                        </TabPanel>
                      </Tabs>
                  </div>
                  :
                <div></div>
        */}
        </div>
      </div>
    );
  }
}
