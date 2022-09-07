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
import SpecialIncidentReportLicensePrint from "../../../components/IncidentFollowUpForm/SpecialIncidentReportLicensePrint";
import { sp } from "@pnp/sp";
import { graph } from "@pnp/graph/presets/all";
import { jobTitleParser, jobTitleParser2, Role } from '../../../utils/RoleParser';
import "./react-tabs.css";
import "./custom.css";
import ThankYouComponent from '../../../components/ThankYou/ThankYouComponent';
import NoAccessComponent from '../../../components/NoAccessRight/NoAccessRightComponent';
import { getQueryParameterNumber, getQueryParameterString } from '../../../utils/UrlQueryHelper';
import { getAdmin, getSpecialIncidentReportLicenseById, getSpeicalIncidentReportLicenseWorkflow, getAllIncidentFollowUpFormByParentId } from '../../../api/FetchFuHongList';
import { getUserAdByGraph, getAllServiceUnit, checkDepartmentList, checkPermissionList} from '../../../api/FetchUser';

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

interface IFuHongSpecialIncidentReportLicenseStates {
  currentUserRole: Role;
  permissionList:any;
  specialINcidentReportLicenseData: any;
  stage: string;
  formSubmitted: boolean;
  isPrintMode: boolean;
  departmentList:any;
  loading:boolean;
  indexTab:number;
  speicalIncidentReportWorkflow:string;
  formTwentySixData:any;
  formTwentySixDataPrint:any;
  formTwentySixDataSelected:number;
  serviceUnitList:any;
}

export default class FuHongSpecialIncidentReportLicense extends React.Component<IFuHongSpecialIncidentReportLicenseProps, IFuHongSpecialIncidentReportLicenseStates> {
  private siteCollectionName = this.props.context.pageContext.web.absoluteUrl.substring(this.props.context.pageContext.web.absoluteUrl.indexOf("/sites/") + 7, this.props.context.pageContext.web.absoluteUrl.length).substring(0, 14);
	private siteCollecitonOrigin = this.props.context.pageContext.web.absoluteUrl.indexOf("/sites/") > -1 ? this.props.context.pageContext.web.absoluteUrl.substring(0, this.props.context.pageContext.web.absoluteUrl.indexOf("/sites/")) : this.props.context.pageContext.web.absoluteUrl.substring(0, this.props.context.pageContext.web.absoluteUrl.indexOf(".com" + 4));
	private siteCollectionUrl = this.props.context.pageContext.web.absoluteUrl.indexOf("/sites/") > -1 ? this.siteCollecitonOrigin + "/sites/" + this.siteCollectionName : this.siteCollecitonOrigin;
	
  public constructor(props) {
    super(props);
    getCanvasZone();
    console.log("Flow 4");

    sp.setup({ spfxContext: this.props.context });
    graph.setup({ spfxContext: this.props.context });

    this.state = {
      currentUserRole: Role.NoAccessRight,//Role.GENERAL,
      permissionList: [],
      specialINcidentReportLicenseData: null,
      stage: "",
      formSubmitted: false,
      isPrintMode: false,
      departmentList:[],
      loading:true,
      indexTab: 0,
      speicalIncidentReportWorkflow:'',
      formTwentySixData:[],
      formTwentySixDataPrint:[],
      formTwentySixDataSelected:null,
      serviceUnitList:[]
    }
  }

  private initialState = async () => {
    const PermissionList = await checkPermissionList(this.siteCollectionUrl, this.props.context.pageContext.legacyPageContext.userEmail);
    const DepartmentList = await checkDepartmentList(this.siteCollectionUrl, this.props.context.pageContext.legacyPageContext.userEmail);
    const speicalIncidentReportWorkflow = await getSpeicalIncidentReportLicenseWorkflow();
    const serviceUnitList:any = await getAllServiceUnit(this.siteCollectionUrl);
    return [PermissionList, DepartmentList,speicalIncidentReportWorkflow.Url,serviceUnitList]
    //this.setState({ departmentList: DepartmentList, loading:true, speicalIncidentReportWorkflow:speicalIncidentReportWorkflow.Url,serviceUnitList:serviceUnitList });
  }

  public componentDidMount() {
    this.initialState().then((lists)=> {
      getUserAdByGraph(this.props.context.pageContext.legacyPageContext.userEmail).then(value => {
        if (value && value.jobTitle) {
          this.setState({ currentUserRole: jobTitleParser2(value.jobTitle) });
        }
  
        this.initialDataByFormId().then(async (data) => {
          let formTwentySixData :any = [];
          let formTwentySixDataPrint :any = [];
          let formTwentySixDataSelected = null;
          if (data) {
            formTwentySixDataPrint = await getAllIncidentFollowUpFormByParentId(data.Id);
          }
          
          
          if (formTwentySixDataPrint.length > 0) {
            formTwentySixData = formTwentySixDataPrint[0];
            formTwentySixDataSelected = formTwentySixData.Id
          }
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
          if (data && data.Stage == '1') {
            this.setState({ indexTab: 0, formTwentySixData:formTwentySixData });
          } else if (data && data.Stage == '2') {
            this.setState({ indexTab: 1, formTwentySixData:formTwentySixData, formTwentySixDataPrint:formTwentySixDataPrint, formTwentySixDataSelected:formTwentySixDataSelected });
          }
          getAdmin().then((admin) => {
            admin.forEach((item) => {
              if (item.Admin && item.Admin.EMail === this.props.context.pageContext.legacyPageContext.userEmail) {
                this.setState({ currentUserRole: Role.ADMIN,departmentList:{"All":true} });
              }
            })
          }).catch(console.error)
          this.setState({ permissionList: lists[0], departmentList: lists[1], loading:false, speicalIncidentReportWorkflow:lists[2], serviceUnitList:lists[3] });
          this.checkRole();// Testing Only 
        }).catch(console.error);
      }).catch(console.error);
    });
    
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

  private tab(index) {
    this.setState({
      indexTab:index
    })
  }

  public changeFormTwentySixDataSelected = (value) =>{
    this.setState({
      formTwentySixDataSelected:value
    })
  }
  
  public render(): React.ReactElement<IFuHongSpecialIncidentReportLicenseProps> {
    console.log('currentUserRole : ' + this.state.currentUserRole + ', Status :'+  (this.state.departmentList.length == 0 || this.state.currentUserRole != Role.NoAccessRight));
    console.log('departmentList :, ',this.state.departmentList);
    return (
      <div className={styles.fuHongSpecialIncidentReportLicense}>
        <div className={styles.container}>
        {
            !this.state.loading && this.state.formSubmitted ?
              <ThankYouComponent redirectLink={this.redirectPath} />
              :
              !this.state.loading && (this.state.permissionList.length == 0 && this.state.currentUserRole == Role.NoAccessRight) ? 
              <NoAccessComponent redirectLink={this.redirectPath} />
              :
              !this.state.loading ?
                this.state.isPrintMode ?
                  <SpecialIncidentReportLicensePrint index={this.state.indexTab} context={this.props.context} formSubmittedHandler={this.formSubmittedHandler} currentUserRole={this.state.currentUserRole} formData={this.state.specialINcidentReportLicenseData} formTwentySixData={this.state.formTwentySixDataPrint} formTwentySixDataSelected={this.state.formTwentySixDataSelected} siteCollectionUrl={this.siteCollectionUrl} backToForm={this.backToForm}/>
                  :
                  <div className={styles.eform}>
                    {/*this.state.serviceUserAccidentFormData != null &&
                      <div className="row" style={{float:'right'}}>
                        <div className="col-12" style={{padding:'10px 20px'}}><button className="btn btn-warning mr-3" onClick={()=>this.print()}>打印</button></div>
                      </div>
                    */}
                      <Tabs variant="fullWidth" defaultIndex={this.state.indexTab}>
                      <TabList>
                        <Tab onClick={()=>this.tab(0)}>特別事故報告(牌照事務處)</Tab>
                        <Tab onClick={()=>this.tab(1)}>事故跟進/結束報告</Tab>
                      </TabList>
                      <TabPanel>
                        <SpecialIncidentReportLicense context={this.props.context} styles={styles} formSubmittedHandler={this.formSubmittedHandler} currentUserRole={this.state.currentUserRole} formData={this.state.specialINcidentReportLicenseData} isPrintMode={this.state.isPrintMode} siteCollectionUrl={this.siteCollectionUrl} departmentList={this.state.departmentList} speicalIncidentReportWorkflow={this.state.speicalIncidentReportWorkflow} print={this.print}/>
                      </TabPanel>
                      <TabPanel>
                        <IncidentFollowUpForm context={this.props.context} styles={styles} formType={"SPECIAL_INCIDENT_REPORT_LICENSE"} formSubmittedHandler={this.formSubmittedHandler} currentUserRole={this.state.currentUserRole} parentFormData={this.state.specialINcidentReportLicenseData} isPrintMode={this.state.isPrintMode} siteCollectionUrl={this.siteCollectionUrl} formTwentySixData={this.state.formTwentySixData} workflow={this.state.speicalIncidentReportWorkflow} changeFormTwentySixDataSelected={this.changeFormTwentySixDataSelected} serviceUnitList={this.state.serviceUnitList} print={this.print}/>
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
                  <SpecialIncidentReportLicensePrint index={this.state.indexTab} context={this.props.context} formSubmittedHandler={this.formSubmittedHandler} currentUserRole={this.state.currentUserRole} formData={this.state.specialINcidentReportLicenseData} formTwentySixData={this.state.formTwentySixDataPrint} formTwentySixDataSelected={this.state.formTwentySixDataSelected} siteCollectionUrl={this.siteCollectionUrl} backToForm={this.backToForm}/>
                  :
                  <div className={styles.eform}>
                    <Tabs variant="fullWidth" defaultIndex={this.state.indexTab}>
                      <TabList>
                        <Tab onClick={()=>this.tab(0)}>特別事故報告(牌照事務處)</Tab>
                        <Tab onClick={()=>this.tab(1)}>事故跟進/結束報告</Tab>
                      </TabList>
                      <TabPanel>
                        <SpecialIncidentReportLicense context={this.props.context} styles={styles} formSubmittedHandler={this.formSubmittedHandler} currentUserRole={this.state.currentUserRole} formData={this.state.specialINcidentReportLicenseData} isPrintMode={this.state.isPrintMode} siteCollectionUrl={this.siteCollectionUrl} departmentList={this.state.departmentList} speicalIncidentReportWorkflow={this.state.speicalIncidentReportWorkflow} print={this.print}/>
                      </TabPanel>
                      <TabPanel>
                        <IncidentFollowUpForm context={this.props.context} styles={styles} formType={"SPECIAL_INCIDENT_REPORT_LICENSE"} formSubmittedHandler={this.formSubmittedHandler} currentUserRole={this.state.currentUserRole} parentFormData={this.state.specialINcidentReportLicenseData} isPrintMode={this.state.isPrintMode} siteCollectionUrl={this.siteCollectionUrl} formTwentySixData={this.state.formTwentySixData} workflow={this.state.speicalIncidentReportWorkflow} changeFormTwentySixDataSelected={this.changeFormTwentySixDataSelected} serviceUnitList={this.state.serviceUnitList} print={this.print}/>
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
