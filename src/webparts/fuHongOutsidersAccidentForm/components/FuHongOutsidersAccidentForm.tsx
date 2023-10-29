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
import { getAllServiceUnit, checkPermissionList, checkSkipApproval } from '../../../api/FetchUser';
import NoAccessComponent from '../../../components/NoAccessRight/NoAccessRightComponent';
import OutsidersAccidentFormPrint from "../../../components/OutsidersAccidentForm/OutsidersAccidentFormPrint";
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

interface IFuHongOutsidersAccidentFormState {
  currentUserRead:boolean;
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
  loading:boolean;
  serviceUnitList:any;
  skipApproval:boolean;
}

interface UserInfo {
	userEmail: string;
	userDisplayName: string;
  userId: number;
}

export default class FuHongOutsidersAccidentForm extends React.Component<IFuHongOutsidersAccidentFormProps, IFuHongOutsidersAccidentFormState> {
  private siteCollectionName = this.props.context.pageContext.web.absoluteUrl.split('/sites/')[1].split('/')[0];
	private siteCollecitonOrigin = this.props.context.pageContext.web.absoluteUrl.indexOf("/sites/") > -1 ? this.props.context.pageContext.web.absoluteUrl.substring(0, this.props.context.pageContext.web.absoluteUrl.indexOf("/sites/")) : this.props.context.pageContext.web.absoluteUrl.substring(0, this.props.context.pageContext.web.absoluteUrl.indexOf(".com" + 4));
	private siteCollectionUrl = this.props.context.pageContext.web.absoluteUrl.indexOf("/sites/") > -1 ? this.siteCollecitonOrigin + "/sites/" + this.siteCollectionName : this.siteCollecitonOrigin;
	
  private getCurrentUser(): UserInfo {
		return {
			userEmail: this.props.context.pageContext.user.email,
			userDisplayName:this.props.context.pageContext.user.displayName,
      userId:this.props.context.pageContext.legacyPageContext.userId
		};
	}

  public constructor(props) {
    super(props);
    getCanvasZone();
    console.log("Flow 2");
    sp.setup({ spfxContext: this.props.context });
    graph.setup({ spfxContext: this.props.context });

    this.state = {
      currentUserRole: Role.NoAccessRight,//Role.GENERAL,
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
      indexTab:0,
      loading:true,
      serviceUnitList:[],
      currentUserRead:false,
      skipApproval:false
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
    const PermissionList = await checkPermissionList(this.siteCollectionUrl, this.getCurrentUser().userEmail);
    const skipApproval = await checkSkipApproval(this.siteCollectionUrl, this.getCurrentUser().userEmail);
    const outsiderAccidentWorkflow = await getOutsiderAccidentWorkflow();
    const serviceUnitList:any = await getAllServiceUnit(this.siteCollectionUrl);
    
    return [PermissionList,outsiderAccidentWorkflow.Url,serviceUnitList, skipApproval]
    //this.setState({ permissionList: PermissionList, outsiderAccidentWorkflow:outsiderAccidentWorkflow.Url,serviceUnitList:serviceUnitList });
  }

  public componentDidMount() {
    this.initialState().then((lists) => {
      this.setState({ skipApproval:lists[3] });
      getUserAdByGraph(this.getCurrentUser().userEmail).then(value => {
        /*if (value && value.jobTitle) {
          this.setState({ currentUserRole: jobTitleParser2(value.jobTitle) });
        }*/
        this.initialDataByFormId().then((data) => {
          if (data && data.Investigator && data.Investigator.EMail) {
            if (data.Investigator.EMail === this.getCurrentUser().userEmail) {
              this.setState({ currentUserRole: Role.INVESTIGATOR });
            }
          }
  
          if (data) {
            let userEmail = this.getCurrentUser().userEmail;
            if (data.Stage == '1' && data.SM && data.SM.EMail) {
              if (data.SM.EMail === userEmail) {
                this.setState({ currentUserRole: Role.SERVICE_MANAGER });
              }
            } else if (data.Stage == '2') {
              if (this.state.formTwentyData.SM.EMail === userEmail || data.SM.EMail === userEmail) {
                this.setState({ currentUserRole: Role.SERVICE_MANAGER });
              }
            } else if (data.Stage == '3') {
              if (this.state.formTwentyOneData.SM.EMail === userEmail ||
                this.state.formTwentyData.SM.EMail === userEmail || 
                data.SM.EMail === userEmail) {
                this.setState({ currentUserRole: Role.SERVICE_MANAGER });
              }
            }
            if (data.Stage == '1' && data.SD && data.SD.EMail || data.Stage == '2') {
              if (data.SD.EMail === userEmail) {
                this.setState({ currentUserRole: Role.SERVICE_MANAGER });
              }
            } else if (data.Stage == '3') {
              if (this.state.formTwentyOneData.SD.EMail === userEmail || data.SD.EMail === userEmail) {
                this.setState({ currentUserRole: Role.SERVICE_MANAGER });
              }
            }
            if (data.Stage == '1' && data.SPT && data.SPT.EMail) {
              if (data.SPT.EMail === userEmail) {
                this.setState({ currentUserRole: Role.SERVICE_MANAGER });
              }
            } else if (data.Stage == '2') {
              if (this.state.formTwentyData.SPT.EMail === userEmail ||
                data.SPT.EMail === userEmail) {
                this.setState({ currentUserRole: Role.SERVICE_MANAGER });
              }
            } else if (data.Stage == '3') {
              if (this.state.formTwentyOneData.SPT.EMail === userEmail ||
                this.state.formTwentyData.SPT.EMail === userEmail ||
                data.SPT.EMail === userEmail) {
                this.setState({ currentUserRole: Role.SERVICE_MANAGER });
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
              if (this.state.formTwentyData.SM.EMail === userEmail) {
                userCanRead = true;
              }
              if (this.state.formTwentyData.SPT.EMail === userEmail) {
                userCanRead = true;
              }
              if (this.state.formTwentyData.Investigator.EMail === userEmail) {
                userCanRead = true;
              }
            }
            if (data.Stage == '3') {
              if (this.state.formTwentyData.SM.EMail === userEmail) {
                userCanRead = true;
              }
              if (this.state.formTwentyData.SPT.EMail === userEmail) {
                userCanRead = true;
              }
              if (this.state.formTwentyData.Investigator.EMail === userEmail) {
                userCanRead = true;
              }
              if (this.state.formTwentyOneData.SM.EMail === userEmail) {
                userCanRead = true;
              }
              if (this.state.formTwentyOneData.SD.EMail === userEmail) {
                userCanRead = true;
              }
              if (this.state.formTwentyOneData.SPT.EMail === userEmail) {
                userCanRead = true;
              }
            }
            if (lists[0].length > 0) {
              for (let dept of lists[0]) {
                if (dept == 'All') {
                  userCanRead = true;
                } else if (data.ServiceUserUnit.toLowerCase() == dept.toLowerCase()) {
                  userCanRead = true;
                }
              }
            }
            this.setState({ currentUserRead: userCanRead });
          }
          getAdmin().then((admin) => {
            admin.forEach((item) => {
              if (item.Admin && item.Admin.EMail === this.getCurrentUser().userEmail) {
                this.setState({ currentUserRole: Role.ADMIN,permissionList:['All'], currentUserRead:true  });
              }
            })
          }).catch(console.error)
          
          this.setState({ permissionList: lists[0], loading:false, outsiderAccidentWorkflow:lists[1], serviceUnitList:lists[2] });

          this.checkRole();// Testing Only 
        }).catch(console.error);
      }).catch(console.error);
    });
    

  }

  private async initialDataByFormId() {
    try {
      const formId = getQueryParameterNumber("formId");
      if (formId) {
        const data = await getOutsiderAccidentById(formId);
        //const author = await getUserAdByGraph(data.Author.EMail);
        //const investigator = data.InvestigatorId != null ? await getUserAdByGraph(data.Investigator.EMail) : null;
        //data["Author"] =author;
        //data["InvestigatorAD"] =investigator;
        data["ServiceUserUnit"] = data["ServiceLocation"];
        data["ServiceUserNameCN"] = data["ServiceUserNameTC"];
        
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
        if (data.Stage == '2' && data.Status == 'PENDING_INVESTIGATE' && (data.SDComment == null || data.SDComment == '') && data.SDId == this.getCurrentUser().userId && new Date(new Date(data.SPTDate).setDate(new Date(data.SPTDate).getDate()  + 7)) > new Date()) {
          this.setState({ outsiderAccidentFormData: data, indexTab:0, formTwentyData:formTwentyData, formTwentyOneData:formTwentyOneData, formTwentyOneDataPrint:formTwentyOneDataPrint });
        } else if (data.Stage == '3' && data.Status == 'PENDING_SM_FILL_IN') {
          if (formTwentyData.SMId == this.getCurrentUser().userId && (formTwentyData.SMComment == null || formTwentyData.SMComment == '') && new Date(new Date(formTwentyData.SPTDate).setDate(new Date(formTwentyData.SPTDate).getDate() + 7)) > new Date()) {
            this.setState({ outsiderAccidentFormData: data, indexTab:1, formTwentyData:formTwentyData, formTwentyOneData:formTwentyOneData, formTwentyOneDataPrint:formTwentyOneDataPrint, formTwentyOneDataSelected:formTwentyOneDataSelected });
          } else {
            this.setState({ outsiderAccidentFormData: data, indexTab:stage, formTwentyData:formTwentyData, formTwentyOneData:formTwentyOneData, formTwentyOneDataPrint:formTwentyOneDataPrint, formTwentyOneDataSelected:formTwentyOneDataSelected });
          }
        } else {
          this.setState({ outsiderAccidentFormData: data, indexTab:stage, formTwentyData:formTwentyData, formTwentyOneData:formTwentyOneData, formTwentyOneDataPrint:formTwentyOneDataPrint, formTwentyOneDataSelected:formTwentyOneDataSelected });
        }
        return data;
      } else {
        this.setState({ currentUserRead: true });
      }
    } catch (err) {
      console.error(err);
      throw new Error("initialDataByFormId error");
    }
  }

  public changeFormTwentyOneDataSelected(value) {
    this.setState({
      formTwentyOneDataSelected:value
    })
  }

  private tab(index) {
    this.setState({
      indexTab:index
    })
  }

  public print = () => {
    this.setState({
      isPrintMode:true
    })
  }

  private backToForm = () => {
    this.setState({
      isPrintMode:false
    })
  }

  private redirectPath = this.props.context.pageContext.site.absoluteUrl + `/accident-and-incident/SitePages/Home.aspx`;

  private formSubmittedHandler = () => this.setState({ formSubmitted: true });

  public render(): React.ReactElement<IFuHongOutsidersAccidentFormProps> {
    console.log('currentUserRole', this.state.currentUserRole)
    console.log('this.state.permissionList', this.state.permissionList)
    return (
      <div className={styles.fuHongOutsidersAccidentForm}>
        <div className={styles.container}>
          {
            !this.state.loading && this.state.formSubmitted ?
            <ThankYouComponent redirectLink={this.redirectPath} />
            :
            !this.state.loading && !this.state.currentUserRead ? //&& (this.state.permissionList.length == 0 && this.state.currentUserRole == Role.NoAccessRight)
            <NoAccessComponent redirectLink={this.redirectPath} />
            :
            !this.state.loading ?
              this.state.isPrintMode ?
                <OutsidersAccidentFormPrint index={this.state.indexTab} formData={this.state.outsiderAccidentFormData} formTwentyData={this.state.formTwentyData} formTwentyOneDataPrint={this.state.formTwentyOneDataPrint} formTwentyOneDataSelected={this.state.formTwentyOneDataSelected} siteCollectionUrl={this.siteCollectionUrl} permissionList={this.state.permissionList} serviceUnitList={this.state.serviceUnitList} backToForm={this.backToForm}/>
                :
                <div className={styles.eform}>
                  {/*this.state.serviceUserAccidentFormData != null &&
                    <div className="row" style={{float:'right'}}>
                      <div className="col-12" style={{padding:'10px 20px'}}><button className="btn btn-warning mr-3" onClick={()=>this.print()}>打印</button></div>
                    </div>
                  */}
                    <Tabs variant="fullWidth" defaultIndex={this.state.indexTab}>
                      <TabList>
                        <Tab onClick={()=>this.tab(0)}>外界人士意外填報表(一)</Tab>
                        <Tab onClick={()=>this.tab(1)}>外界人士意外報告(二)</Tab>
                        <Tab onClick={()=>this.tab(2)}>事故跟進/結束報告(三)</Tab>
                      </TabList>
                      <TabPanel>
                    <OutsidersAccidentForm context={this.props.context} formSubmittedHandler={this.formSubmittedHandler} currentUserRole={this.state.currentUserRole} formData={this.state.outsiderAccidentFormData} isPrintMode={this.state.isPrintMode} siteCollectionUrl={this.siteCollectionUrl} permissionList={this.state.permissionList} workflow={this.state.outsiderAccidentWorkflow} print={this.print} skipApproval={this.state.skipApproval}/>
                  </TabPanel>
                  <TabPanel>
                    <AccidentReportForm context={this.props.context} styles={styles} formType={"OUTSIDERS"} currentUserRole={this.state.currentUserRole} parentFormData={this.state.outsiderAccidentFormData} formSubmittedHandler={this.formSubmittedHandler} isPrintMode={this.state.isPrintMode} formTwentyData={this.state.formTwentyData} workflow={this.state.outsiderAccidentWorkflow} serviceUnitList={this.state.serviceUnitList} print={this.print}/>
                  </TabPanel>
                  <TabPanel>
                    <AccidentFollowUpForm context={this.props.context} styles={styles} formType={"OUTSIDERS"} currentUserRole={this.state.currentUserRole} parentFormData={this.state.outsiderAccidentFormData} formSubmittedHandler={this.formSubmittedHandler} isPrintMode={this.state.isPrintMode} siteCollectionUrl={this.siteCollectionUrl} permissionList={this.state.permissionList} formTwentyData={this.state.formTwentyData} formTwentyOneData={this.state.formTwentyOneData} workflow={this.state.outsiderAccidentWorkflow} changeFormTwentyOneDataSelected={this.changeFormTwentyOneDataSelected} serviceUnitList={this.state.serviceUnitList} print={this.print}/>
                  </TabPanel>
                    </Tabs>
            </div>
            : <div></div>
          }

          {/*this.state.isPrintMode ?
          <OutsidersAccidentFormPrint index={this.state.indexTab} formData={this.state.outsiderAccidentFormData} formTwentyData={this.state.formTwentyData} formTwentyOneDataPrint={this.state.formTwentyOneDataPrint} formTwentyOneDataSelected={this.state.formTwentyOneDataSelected} siteCollectionUrl={this.siteCollectionUrl} permissionList={this.state.permissionList} serviceUnitList={this.state.serviceUnitList} backToForm={this.backToForm}/>
          :
            this.state.formSubmitted ?
              <ThankYouComponent redirectLink={this.redirectPath} />
              :
              !this.state.loading ?
              <div className={styles.eform}>
                <Tabs variant="fullWidth" defaultIndex={this.state.indexTab}>
                  <TabList>
                    <Tab onClick={()=>this.tab(0)}>外界人士意外填報表(一)</Tab>
                    <Tab onClick={()=>this.tab(1)}>外界人士意外報告(二)</Tab>
                    <Tab onClick={()=>this.tab(2)}>事故跟進/結束報告(三)</Tab>
                  </TabList>
                  <TabPanel>
                    <OutsidersAccidentForm context={this.props.context} formSubmittedHandler={this.formSubmittedHandler} currentUserRole={this.state.currentUserRole} formData={this.state.outsiderAccidentFormData} isPrintMode={this.state.isPrintMode} siteCollectionUrl={this.siteCollectionUrl} permissionList={this.state.permissionList} workflow={this.state.outsiderAccidentWorkflow} print={this.print}/>
                  </TabPanel>
                  <TabPanel>
                    <AccidentReportForm context={this.props.context} styles={styles} formType={"OUTSIDERS"} currentUserRole={this.state.currentUserRole} parentFormData={this.state.outsiderAccidentFormData} formSubmittedHandler={this.formSubmittedHandler} isPrintMode={this.state.isPrintMode} formTwentyData={this.state.formTwentyData} workflow={this.state.outsiderAccidentWorkflow} serviceUnitList={this.state.serviceUnitList} print={this.print}/>
                  </TabPanel>
                  <TabPanel>
                    <AccidentFollowUpForm context={this.props.context} styles={styles} formType={"OUTSIDERS"} currentUserRole={this.state.currentUserRole} parentFormData={this.state.outsiderAccidentFormData} formSubmittedHandler={this.formSubmittedHandler} isPrintMode={this.state.isPrintMode} formTwentyData={this.state.formTwentyData} formTwentyOneData={this.state.formTwentyOneData} workflow={this.state.outsiderAccidentWorkflow} changeFormTwentyOneDataSelected={this.changeFormTwentyOneDataSelected} serviceUnitList={this.state.serviceUnitList} print={this.print}/>
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
