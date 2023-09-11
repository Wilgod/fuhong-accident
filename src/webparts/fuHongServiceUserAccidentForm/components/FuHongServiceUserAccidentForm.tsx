import * as React from 'react';
import styles from './FuHongServiceUserAccidentForm.module.scss';
import { IFuHongServiceUserAccidentFormProps } from './IFuHongServiceUserAccidentFormProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as moment from 'moment';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { sp } from "@pnp/sp";
import { graph } from "@pnp/graph/presets/all";
import 'react-tabs/style/react-tabs.css';
import "./react-tabs.css";
import ServiceUserAccidentForm from "./ServiceUserAccidentForm";
import AccidentFollowUpForm from "../../../components/AccidentFollowUpForm/AccidentFollowUpForm";
import AccidentReportForm from "../../../components/AccidentReportForm/AccidentReportForm";
import { jobTitleParser, jobTitleParser2, Role } from '../../../utils/RoleParser';
import { getQueryParameterNumber, getQueryParameterString } from '../../../utils/UrlQueryHelper';
import { getUserInfoByEmailInUserInfoAD } from '../../../api/FetchUser';
import { getUserAdByGraph } from '../../../api/FetchUser';
import ThankYouComponent from '../../../components/ThankYou/ThankYouComponent';
import NoAccessComponent from '../../../components/NoAccessRight/NoAccessRightComponent';
import { getAllServiceUnit, checkPermissionList } from '../../../api/FetchUser';
import { getAccidentReportFormById, getAccidentFollowUpFormById, getAllAccidentFollowUpFormByCaseNumber,getAdmin, getServiceUserAccidentById } from '../../../api/FetchFuHongList';
import { getServiceUserAccidentWorkflow, getCMSUserWorkflow, getCMSUserInformationIdWorkflow, getCMSUserInformationWorkflow } from '../../../api/FetchFuHongList';
import ServiceUserAccidentFormPrint from "../../../components/ServiceUserAccidentForm/ServiceUserAccidentFormPrint";
import 'bootstrap/dist/css/bootstrap.css';

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
  document.getElementById('workbenchPageContent').style.maxWidth = 'none';
}

if (document.querySelector('.CanvasZone') != null) {
  (document.querySelector('.CanvasZone') as HTMLElement).style.maxWidth = 'none';
}

interface IFuHongServiceUserAccidentFormState {
  currentUserRole: Role;
  permissionList:any;
  serviceUserAccidentFormData: any;
  stage: string;
  formSubmitted: boolean;
  isPrintMode: boolean;
  loading:boolean;
  indexTab:number;
  formTwentyData:any;
  formTwentyOneData:any;
  formTwentyOneDataPrint:any;
  serviceUserAccidentWorkflow:string;
  formTwentyOneDataSelected:number;
  serviceUnitList:any;
  cmsUserWorkflow:string;
  cmsUserInformationWorkflow:string;
  cmsUserInformationIdWorkflow:string;
}

interface UserInfo {
	userId: string;
	userEmail: string;
	userDisplayName: string;
}

export default class FuHongServiceUserAccidentForm extends React.Component<IFuHongServiceUserAccidentFormProps, IFuHongServiceUserAccidentFormState> {
  private siteCollectionName = this.props.context.pageContext.web.absoluteUrl.split('/sites/')[1].split('/')[0];
	private siteCollecitonOrigin = this.props.context.pageContext.web.absoluteUrl.indexOf("/sites/") > -1 ? this.props.context.pageContext.web.absoluteUrl.substring(0, this.props.context.pageContext.web.absoluteUrl.indexOf("/sites/")) : this.props.context.pageContext.web.absoluteUrl.substring(0, this.props.context.pageContext.web.absoluteUrl.indexOf(".com" + 4));
	private siteCollectionUrl = this.props.context.pageContext.web.absoluteUrl.indexOf("/sites/") > -1 ? this.siteCollecitonOrigin + "/sites/" + this.siteCollectionName : this.siteCollecitonOrigin;
	
  public constructor(props) {
    super(props);

    console.log("siteCollectionName",this.siteCollectionName);
    console.log("siteCollecitonOrigin",this.siteCollecitonOrigin);
    getCanvasZone();

    sp.setup({ spfxContext: this.props.context });
    graph.setup({ spfxContext: this.props.context });

    this.state = {
      currentUserRole: Role.NoAccessRight,//Role.GENERAL,
      permissionList: [],

      serviceUserAccidentFormData: null,
      stage: "",
      formSubmitted: false,
      isPrintMode: false,
      loading:true,
      indexTab: 0,
      formTwentyData: [],
      formTwentyOneData: [],
      formTwentyOneDataPrint:[],
      serviceUserAccidentWorkflow:'',
      formTwentyOneDataSelected:null,
      serviceUnitList:[],
      cmsUserWorkflow:'',
      cmsUserInformationWorkflow:'',
      cmsUserInformationIdWorkflow:''
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

  private getCurrentUser(): UserInfo {
		return {
			userId: this.props.context.pageContext.legacyPageContext.userId,
			userEmail: this.props.context.pageContext.user.email,
			//userEmail:'cholam.chan@fuhong.org',
			userDisplayName: this.props.context.pageContext.user.displayName
		};
	}

  private initialState = async () => {
    const PermissionList = await checkPermissionList(this.siteCollectionUrl, this.getCurrentUser().userEmail);
    const serviceUserAccidentWorkflow = await getServiceUserAccidentWorkflow();
    const cmsUserWorkflow = await getCMSUserWorkflow();
    const cmsUserInformationIdWorkflow = await getCMSUserInformationIdWorkflow();
    const cmsUserInformationWorkflow = await getCMSUserInformationWorkflow()
    const serviceUnitList:any = await getAllServiceUnit(this.siteCollectionUrl);
    return [PermissionList,serviceUserAccidentWorkflow.Url,serviceUnitList, cmsUserWorkflow.Url, cmsUserInformationWorkflow.Url, cmsUserInformationIdWorkflow.Url]
    //this.setState({ permissionList: PermissionList, serviceUserAccidentWorkflow:serviceUserAccidentWorkflow.Url,serviceUnitList:serviceUnitList });
  }

  public componentDidMount() {
    this.initialState().then((lists)=> {
      getUserAdByGraph(this.getCurrentUser().userEmail).then(value => {
        if (value && value.jobTitle) {
          this.setState({ currentUserRole: jobTitleParser2(value.jobTitle) });
        }
        this.initialDataByFormId().then((data) => {
          if (data && data.Investigator && data.Investigator.EMail) {
            if (data.Investigator.EMail === this.getCurrentUser().userEmail) {
              this.setState({ currentUserRole: Role.INVESTIGATOR });
            }
          }
  
          if (data) {
            if (data.Stage == '1' && data.SM && data.SM.EMail) {
              if (data.SM.EMail === this.getCurrentUser().userEmail) {
                this.setState({ currentUserRole: Role.SERVICE_MANAGER });
              }
            } else if (data.Stage == '2') {
              if (this.state.formTwentyData.SM.EMail === this.getCurrentUser().userEmail || data.SM.EMail === this.getCurrentUser().userEmail) {
                this.setState({ currentUserRole: Role.SERVICE_MANAGER });
              }
            } else if (data.Stage == '3') {
              if (this.state.formTwentyOneData.SM.EMail === this.getCurrentUser().userEmail ||
                this.state.formTwentyData.SM.EMail === this.getCurrentUser().userEmail || 
                data.SM.EMail === this.getCurrentUser().userEmail) {
                this.setState({ currentUserRole: Role.SERVICE_MANAGER });
              }
            }
            if ((data.Stage == '1' && data.SD && data.SD.EMail) || data.Stage == '2') {
              if (data.SD.EMail === this.getCurrentUser().userEmail) {
                this.setState({ currentUserRole: Role.SERVICE_DIRECTOR });
              }
            } else if (data.Stage == '3') {
              if (this.state.formTwentyOneData.SD.EMail === this.getCurrentUser().userEmail || data.SD.EMail === this.getCurrentUser().userEmail) {
                this.setState({ currentUserRole: Role.SERVICE_DIRECTOR });
              }
            }
            if (data.Stage == '1' && data.SPT && data.SPT.EMail) {
              if (data.SPT.EMail === this.getCurrentUser().userEmail) {
                this.setState({ currentUserRole: Role.SENIOR_PHYSIOTHERAPIST });
              }
            } else if (data.Stage == '2') {
              if (this.state.formTwentyData.SPT.EMail === this.getCurrentUser().userEmail ||
                data.SPT.EMail === this.getCurrentUser().userEmail) {
                this.setState({ currentUserRole: Role.SENIOR_PHYSIOTHERAPIST });
              }
            } else if (data.Stage == '3') {
              if (this.state.formTwentyOneData.SPT.EMail === this.getCurrentUser().userEmail ||
                this.state.formTwentyData.SPT.EMail === this.getCurrentUser().userEmail ||
                data.SPT.EMail === this.getCurrentUser().userEmail) {
                this.setState({ currentUserRole: Role.SENIOR_PHYSIOTHERAPIST });
              }
            }
          }
          getAdmin().then((admin) => {
            admin.forEach((item) => {
              if (item.Admin && item.Admin.EMail === this.getCurrentUser().userEmail) {
                console.log(Role.ADMIN === 4)
                this.setState({ currentUserRole: Role.ADMIN,permissionList:['All'] });
              }
            })
          }).catch(console.error)
          
          this.setState({ permissionList: lists[0], loading:false, serviceUserAccidentWorkflow:lists[1], serviceUnitList:lists[2], cmsUserWorkflow:lists[3], cmsUserInformationWorkflow:lists[4], cmsUserInformationIdWorkflow:lists[5] });
          
          //this.checkRole();// Testing Only 
        }).catch(console.error);
      }).catch(console.error);
    });
    
  }

  private async initialDataByFormId() {
    try {
      const formId = getQueryParameterNumber("formId");
      if (formId) {
        
        const data = await getServiceUserAccidentById(formId);
        let contactStaff = null;
        if (data.ContactFamilyStaffId != null) {
          
          contactStaff = await getUserAdByGraph(data.ContactFamilyStaff.EMail);
          
          if (contactStaff == null) {
            let cStaff = {
              displayName: data.ContactFamilyStaff.Title,
              mail : data.ContactFamilyStaff.EMail
            }
            data["ContactStaff"] = cStaff;
          } else {
            data["ContactStaff"] = contactStaff;
          }
          
        }
        
        const Reporter = await getUserAdByGraph(data.Reporter.EMail);
        const investigator = data.Investigator != null ? await getUserAdByGraph(data.Investigator.EMail) : null;
        
        if (Reporter == null) {
          let r = {
            displayName: data.Reporter.Title,
            mail : data.Reporter.EMail
          }
          data["ReporterLeave"] = r;
        }
        data["Reporter"] = Reporter;
        data["InvestigatorAD"] =investigator;
        let stage = parseInt(data.Stage)-1;
        let formTwentyData:any = [];
        let formTwentyOneData:any = [];
        let formTwentyOneDataPrint= [];
        let formTwentyOneDataSelected = null;
        if (data.AccidentReportFormId != null) {
          formTwentyData = await getAccidentReportFormById(data.AccidentReportFormId);
          const investigator2 = formTwentyData.Investigator != null ? await getUserAdByGraph(formTwentyData.Investigator.EMail) : null;
          formTwentyData["InvestigatorAD"] =investigator2;
        }
        if (data.AccidentFollowUpFormId != null && data.AccidentFollowUpFormId.length > 0) {
          formTwentyOneData = await getAccidentFollowUpFormById(data.AccidentFollowUpFormId[data.AccidentFollowUpFormId.length - 1]);
          formTwentyOneDataPrint = await getAllAccidentFollowUpFormByCaseNumber(data.CaseNumber);
          formTwentyOneData = formTwentyOneDataPrint[0];
          formTwentyOneDataSelected = formTwentyOneData.Id
        }
        if (data.Stage == '2' && data.Status == 'PENDING_INVESTIGATE' && (data.SDComment == null || data.SDComment == '') && data.SDId == this.props.context.pageContext.legacyPageContext.userId && new Date(new Date(data.SPTDate).setDate(new Date(data.SPTDate).getDate()  + 7)) > new Date()) {
          this.setState({ serviceUserAccidentFormData: data, indexTab:0, formTwentyData:formTwentyData, formTwentyOneData:formTwentyOneData, formTwentyOneDataPrint:formTwentyOneDataPrint });
        } else if (data.Stage == '3' && data.Status == 'PENDING_SM_FILL_IN') {
          if (formTwentyData.SMId == this.props.context.pageContext.legacyPageContext.userId && (formTwentyData.SMComment == null || formTwentyData.SMComment == '') && new Date(new Date(formTwentyData.SPTDate).setDate(new Date(formTwentyData.SPTDate).getDate() + 7)) > new Date()) {
            this.setState({ serviceUserAccidentFormData: data, indexTab:1, formTwentyData:formTwentyData, formTwentyOneData:formTwentyOneData, formTwentyOneDataPrint:formTwentyOneDataPrint, formTwentyOneDataSelected:formTwentyOneDataSelected });
          } else {
            this.setState({ serviceUserAccidentFormData: data, indexTab:stage, formTwentyData:formTwentyData, formTwentyOneData:formTwentyOneData, formTwentyOneDataPrint:formTwentyOneDataPrint, formTwentyOneDataSelected:formTwentyOneDataSelected });
          }
        } else {
          this.setState({ serviceUserAccidentFormData: data, indexTab:stage, formTwentyData:formTwentyData, formTwentyOneData:formTwentyOneData, formTwentyOneDataPrint:formTwentyOneDataPrint, formTwentyOneDataSelected:formTwentyOneDataSelected });
        }
        
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

  public changeFormTwentyOneDataSelected = (value) =>{
    this.setState({
      formTwentyOneDataSelected:value
    })
  }
  public render(): React.ReactElement<IFuHongServiceUserAccidentFormProps> {
    console.log('currentUserRole : ' + this.state.currentUserRole + ', Status :'+  (this.state.permissionList.length == 0 || this.state.currentUserRole != Role.NoAccessRight));
    console.log('permissionList :, ',this.state.permissionList);
    {/**
                  this.state.currentUserRole == 7 ? 
              <NoAccessComponent redirectLink={this.redirectPath} />
              :
    */}
    return (
      <div className={styles.fuHongServiceUserAccidentForm}>
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
                  <ServiceUserAccidentFormPrint index={this.state.indexTab} formData={this.state.serviceUserAccidentFormData} formTwentyData={this.state.formTwentyData} formTwentyOneDataPrint={this.state.formTwentyOneDataPrint} formTwentyOneDataSelected={this.state.formTwentyOneDataSelected} siteCollectionUrl={this.siteCollectionUrl} permissionList={this.state.permissionList} serviceUnitList={this.state.serviceUnitList} backToForm={this.backToForm}/>
                  :
                  <div className={styles.eform}>
                    {/*this.state.serviceUserAccidentFormData != null &&
                      <div className="row" style={{float:'right'}}>
                        <div className="col-12" style={{padding:'10px 20px'}}><button className="btn btn-warning mr-3" onClick={()=>this.print()}>打印</button></div>
                      </div>
                    */}
                      <Tabs variant="fullWidth" defaultIndex={this.state.indexTab}>
                        <TabList>
                          <Tab onClick={()=>this.tab(0)}>服務使用者意外填報表(一)</Tab>
                          <Tab onClick={()=>this.tab(1)}>服務使用者意外報告(二)</Tab>
                          <Tab onClick={()=>this.tab(2)}>事故跟進/結束報告(三)</Tab>
                        </TabList>
                        <TabPanel>
                          <ServiceUserAccidentForm context={this.props.context} currentUserRole={this.state.currentUserRole} formData={this.state.serviceUserAccidentFormData} formSubmittedHandler={this.formSubmittedHandler} isPrintMode={this.state.isPrintMode} siteCollectionUrl={this.siteCollectionUrl} permissionList={this.state.permissionList} serviceUserAccidentWorkflow={this.state.serviceUserAccidentWorkflow} print={this.print} cmsUserWorkflow={this.state.cmsUserWorkflow} cmsUserInformationWorkflow={this.state.cmsUserInformationWorkflow} cmsUserInformationIdWorkflow={this.state.cmsUserInformationIdWorkflow}/>
                        </TabPanel>
                        <TabPanel>
                          <AccidentReportForm context={this.props.context} styles={styles} formType={"SERVICE_USER"} currentUserRole={this.state.currentUserRole} parentFormData={this.state.serviceUserAccidentFormData} formSubmittedHandler={this.formSubmittedHandler} isPrintMode={this.state.isPrintMode} formTwentyData={this.state.formTwentyData} workflow={this.state.serviceUserAccidentWorkflow} serviceUnitList={this.state.serviceUnitList} print={this.print}/>
                        </TabPanel>
                        <TabPanel>
                          <AccidentFollowUpForm context={this.props.context} styles={styles} formType={"SERVICE_USER"} currentUserRole={this.state.currentUserRole} parentFormData={this.state.serviceUserAccidentFormData} formSubmittedHandler={this.formSubmittedHandler} isPrintMode={this.state.isPrintMode} siteCollectionUrl={this.siteCollectionUrl} permissionList={this.state.permissionList} formTwentyData={this.state.formTwentyData} formTwentyOneData={this.state.formTwentyOneData}  workflow={this.state.serviceUserAccidentWorkflow} changeFormTwentyOneDataSelected={this.changeFormTwentyOneDataSelected} serviceUnitList={this.state.serviceUnitList} print={this.print}/>
                        </TabPanel>
                      </Tabs>
              </div>
              : <div></div>
              
          }
        </div>
      </div>
    );
  }
}
