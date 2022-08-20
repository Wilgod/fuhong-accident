import * as React from 'react';
import styles from './FuHongSpecialIncidentReportAllowance.module.scss';
import { IFuHongSpecialIncidentReportAllowanceProps } from './IFuHongSpecialIncidentReportAllowanceProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as moment from 'moment';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import 'bootstrap/dist/css/bootstrap.css';
import "./react-tabs.css";
import SpecialIncidentReportAllowance from './SpecialIncidentReportAllowance';
import IncidentFollowUpForm from "../../../components/IncidentFollowUpForm/IncidentFollowUpForm";
import SpecialIncidentReportAllowancePrint from "../../../components/IncidentFollowUpForm/SpecialIncidentReportAllowancePrint";
import { sp } from "@pnp/sp";
import { graph } from "@pnp/graph/presets/all";
import { jobTitleParser, jobTitleParser2, Role } from '../../../utils/RoleParser';
import "./react-tabs.css";
import "./custom.css";
import ThankYouComponent from '../../../components/ThankYou/ThankYouComponent';
import { getUserAdByGraph, getAllServiceUnit, checkDepartmentList } from '../../../api/FetchUser';
import { getQueryParameterNumber, getQueryParameterString } from '../../../utils/UrlQueryHelper';
import { getAdmin, getSpecialIncidentReportAllowanceById, getSpeicalIncidentReportAllowanceWorkflow, getAllIncidentFollowUpFormByParentId } from '../../../api/FetchFuHongList';
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

export default class FuHongSpecialIncidentReportAllowance extends React.Component<IFuHongSpecialIncidentReportAllowanceProps, { 
  currentUserRole: Role,
  specialIncidentReportAllowanceFormData: any, 
  stage: string, 
  formSubmitted: boolean, 
  isPrintMode: boolean, 
  speicalIncidentReportWorkflow:string,
  departmentList:any,
  loading:boolean ,
  formTwentySixData:any;
  formTwentySixDataPrint:any;
  formTwentySixDataSelected:number;
  indexTab:number;
  serviceUnitList:any;
}> {
  private siteCollectionName = this.props.context.pageContext.web.absoluteUrl.substring(this.props.context.pageContext.web.absoluteUrl.indexOf("/sites/") + 7, this.props.context.pageContext.web.absoluteUrl.length).substring(0, 6);
	private siteCollecitonOrigin = this.props.context.pageContext.web.absoluteUrl.indexOf("/sites/") > -1 ? this.props.context.pageContext.web.absoluteUrl.substring(0, this.props.context.pageContext.web.absoluteUrl.indexOf("/sites/")) : this.props.context.pageContext.web.absoluteUrl.substring(0, this.props.context.pageContext.web.absoluteUrl.indexOf(".com" + 4));
	private siteCollectionUrl = this.props.context.pageContext.web.absoluteUrl.indexOf("/sites/") > -1 ? this.siteCollecitonOrigin + "/sites/" + this.siteCollectionName : this.siteCollecitonOrigin;
	
  public constructor(props) {
    super(props);
    getCanvasZone();

    sp.setup({ spfxContext: this.props.context });
    graph.setup({ spfxContext: this.props.context });

    this.state = {
      currentUserRole: Role.GENERAL,
      specialIncidentReportAllowanceFormData: null,
      stage: "",
      formSubmitted: false,
      isPrintMode: false,
      speicalIncidentReportWorkflow:'',
      departmentList:[],
      loading:false,
      formTwentySixData:[],
      formTwentySixDataPrint:[],
      formTwentySixDataSelected:null,
      indexTab:0,
      serviceUnitList:[]
    }
    console.log("Flow 3");
  }

  private initialState = async () => {
    const DepartmentList = await checkDepartmentList(this.siteCollectionUrl, this.props.context.pageContext.legacyPageContext.userEmail);
    const speicalIncidentReportWorkflow = await getSpeicalIncidentReportAllowanceWorkflow();
    const serviceUnitList:any = await getAllServiceUnit(this.siteCollectionUrl);
    return [DepartmentList,speicalIncidentReportWorkflow.Url,serviceUnitList]
    //this.setState({ departmentList: DepartmentList, loading:true, speicalIncidentReportWorkflow:speicalIncidentReportWorkflow.Url,serviceUnitList:serviceUnitList });
  }

  public componentDidMount() {
    this.initialState().then((lists) => {
      getUserAdByGraph(this.props.context.pageContext.legacyPageContext.userEmail).then(value => {
        if (value && value.jobTitle) {
          this.setState({ currentUserRole: jobTitleParser2(value.jobTitle) });
        }
  
        this.initialDataByFormId().then(async(data) => {
          let formTwentySixData :any = [];
          let formTwentySixDataPrint :any = [];
          let formTwentySixDataSelected = null;
          if (data) {
            formTwentySixDataPrint = await getAllIncidentFollowUpFormByParentId(data.Id);
            debugger
            if (formTwentySixDataPrint.length > 0) {
              formTwentySixData = formTwentySixDataPrint[0];
              formTwentySixDataSelected = formTwentySixData.Id;
            }
            
          }
          
          if (data && data.Investigator && data.Investigator.EMail) {
            if (data.Investigator.EMail === this.props.context.pageContext.legacyPageContext.userEmail) {
              this.setState({ currentUserRole: Role.INVESTIGATOR });
            }
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
                this.setState({ currentUserRole: Role.ADMIN });
              }
            })
          }).catch(console.error)
          this.setState({ departmentList: lists[0], loading:true, speicalIncidentReportWorkflow:lists[1], serviceUnitList:lists[2] });
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
        const data = await getSpecialIncidentReportAllowanceById(formId);
        this.setState({ specialIncidentReportAllowanceFormData: data });
        return data;
      }
    } catch (err) {
      console.error(err);
      throw new Error("initialDataByFormId error");
    }
  }

  public changeFormTwentySixDataSelected = (value) =>{
    this.setState({
      formTwentySixDataSelected:value
    })
  }

  private redirectPath = this.props.context.pageContext.site.absoluteUrl + `/accident-and-incident/SitePages/Home.aspx`;

  private formSubmittedHandler = () => this.setState({ formSubmitted: true });

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
  public render(): React.ReactElement<IFuHongSpecialIncidentReportAllowanceProps> {

    console.log('this.state.formTwentySixDataPrint',this.state.formTwentySixDataPrint)
    return (
      <div className={styles.fuHongSpecialIncidentReportAllowance}>
        <div className={styles.container}>
          {
            this.state.formSubmitted ?
              <ThankYouComponent redirectLink={this.redirectPath} />
              :
              this.state.loading ?
                this.state.isPrintMode ?
                  <SpecialIncidentReportAllowancePrint index={this.state.indexTab} context={this.props.context} formSubmittedHandler={this.formSubmittedHandler} currentUserRole={this.state.currentUserRole} formData={this.state.specialIncidentReportAllowanceFormData} formTwentySixData={this.state.formTwentySixDataPrint} formTwentySixDataSelected={this.state.formTwentySixDataSelected} siteCollectionUrl={this.siteCollectionUrl} backToForm={this.backToForm}/>
                  :
                  <div className={styles.eform}>
                    {/*<div className="row" style={{ float:'right'}}>
                      <div className="col-12" style={{padding:'10px 20px'}}><button className="btn btn-warning mr-3" onClick={()=>this.print()}>打印</button></div>
                    </div>*/}
                    <Tabs variant="fullWidth" defaultIndex={this.state.indexTab}>
                      <TabList>
                        <Tab onClick={()=>this.tab(0)}>特別事故報告(津貼科)</Tab>
                        <Tab onClick={()=>this.tab(1)}>事故跟進/結束報告</Tab>
                      </TabList>
                      <TabPanel>
                        <SpecialIncidentReportAllowance context={this.props.context} styles={styles} formSubmittedHandler={this.formSubmittedHandler} formData={this.state.specialIncidentReportAllowanceFormData} currentUserRole={this.state.currentUserRole} isPrintMode={this.state.isPrintMode} siteCollectionUrl={this.siteCollectionUrl} departmentList={this.state.departmentList} speicalIncidentReportWorkflow={this.state.speicalIncidentReportWorkflow} print={this.print} />
                      </TabPanel>
                      <TabPanel>
                        <IncidentFollowUpForm context={this.props.context} styles={styles} formType={"SPECIAL_INCIDENT_REPORT_ALLOWANCE"} formSubmittedHandler={this.formSubmittedHandler} parentFormData={this.state.specialIncidentReportAllowanceFormData} currentUserRole={this.state.currentUserRole} isPrintMode={this.state.isPrintMode} siteCollectionUrl={this.siteCollectionUrl} formTwentySixData={this.state.formTwentySixData} workflow={this.state.speicalIncidentReportWorkflow} changeFormTwentySixDataSelected={this.changeFormTwentySixDataSelected} serviceUnitList={this.state.serviceUnitList} print={this.print}/>
                      </TabPanel>
                    </Tabs>
                  </div>
                  :
                  <div></div>
          }
        </div>
      </div>
    );
  }
}
