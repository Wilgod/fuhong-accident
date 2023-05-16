import * as React from 'react';
import styles from './FuHongFormsMenu.module.scss';
import { IFuHongFormsMenuProps } from './IFuHongFormsMenuProps';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as fontawesome from '@fortawesome/free-solid-svg-icons';
import { sp } from "@pnp/sp";
import { graph } from "@pnp/graph/presets/all";
import classnames from 'classnames';
import './FuHongFormsMenu.css';
import TodoListComponent from '../../../components/TodoList/TodoListComponent';
import MainTableComponent from '../../../components/MainTable/MainTableComponent';
import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import { getAllServiceUnit, checkPermissionList } from '../../../api/FetchUser';
import { IUser } from '../../../interface/IUser';
import { locationFilterParser } from '../../../hooks/useServiceLocation';
import ServiceUserAccidentAge from '../../../components/Statistics/ServiceUserAccident/ServiceUserAccidentAge';
import { TagItemSuggestion } from 'office-ui-fabric-react';
import ServiceUserAccidentSex from '../../../components/Statistics/ServiceUserAccident/ServiceUserAccidentGender';
import ServiceUserAccidentIntelligence from '../../../components/Statistics/ServiceUserAccident/ServiceUserAccidentIntelligence';
import ServiceUserAccidentASD from '../../../components/Statistics/ServiceUserAccident/ServiceUserAccidentASD';
import ServiceUserAccidentEnv from '../../../components/Statistics/ServiceUserAccident/ServiceUserAccidentEnv';
import ServiceUserAccidentPersonal from '../../../components/Statistics/ServiceUserAccident/ServiceUserAccidentPersonal';
import CaseSummaryScreen from '../../../components/CaseSummaryScreen/CaseSummaryScreen';
import InsuranceEmailReportScreen from '../../../components/InsuranceEmailReportScreen/InsuranceEmailReportScreen';
import LogScreen from '../../../components/LogScreen/LogScreen';
import Dashboard from '../../../components/Statistics/General/Dashboard';
import General from '../../../components/Statistics/General/General';
import OutsiderAccidentEnv from '../../../components/Statistics/OutsiderAccident/OutsiderAccidentEnv';
import OutsiderAccidentNature from '../../../components/Statistics/OutsiderAccident/OutsiderAccidentNature';
import LicenseCategory from '../../../components/Statistics/LicenseIncident/LicenseCategory';
import LicenseNature from '../../../components/Statistics/LicenseIncident/LicenseNature';
import AllowanceCategory from '../../../components/Statistics/AllowanceIncident/AllowanceCategory';
import AllowanceNature from '../../../components/Statistics/AllowanceIncident/AllowanceNature';
import ServiceUserAccidentNature from '../../../components/Statistics/ServiceUserAccident/ServiceUserAccidentNature';
import OutsiderAccidentPersonal from '../../../components/Statistics/OutsiderAccident/OutsiderAccidentPersonal';
import AllowanceCaseSummary from '../../../components/CaseSummary/AllowanceCaseSummary';
import OutsiderAccidentCaseSummary from '../../../components/CaseSummary/OutsiderAccidentCaseSummary';
import ServiceUserAccidentCaseSummary from '../../../components/CaseSummary/ServiceUserAccidentCaseSummary';
import LicenseIncidentCaseSummary from '../../../components/CaseSummary/LicenseIncidentCaseSummary';
import OtherIncidentCaseSummary from '../../../components/CaseSummary/OtherIncidentCaseSummary';
import Admin from '../../../components/AdminPage/Admin';
import FuHongServiceUserAccidentForm from '../../fuHongServiceUserAccidentForm/components/FuHongServiceUserAccidentForm';
import FuHongOutsidersAccidentForm from '../../fuHongOutsidersAccidentForm/components/FuHongOutsidersAccidentForm';
import FuHongSpecialIncidentReportAllowanceForm from '../../fuHongSpecialIncidentReportAllowance/components/FuHongSpecialIncidentReportAllowance';
import FuHongSpecialIncidentReportLicenseForm from '../../fuHongSpecialIncidentReportLicense/components/FuHongSpecialIncidentReportLicense';
import FuHongOtherIncidentReportForm from '../../fuHongOtherIncidentReport/components/FuHongOtherIncidentReport';
import { getAccessRight, getUserInfo, getSMSDMapping } from '../../../api/FetchFuHongList';
import { isArray } from '@pnp/pnpjs';
import NoAccessComponent from '../../../components/NoAccessRight/NoAccessRightComponent';
import { getQueryParameterNumber, getQueryParameterString } from '../../../utils/UrlQueryHelper';
//import {useSearchParams} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import { isDesktop, isMobile } from 'react-device-detect';
if (document.getElementById('workbenchPageContent') != null) {
  document.getElementById('workbenchPageContent').style.maxWidth = 'none';
}

if (document.querySelector('.CanvasZone') != null) {
  (document.querySelector('.CanvasZone') as HTMLElement).style.maxWidth = 'none';
}

interface IFuHongFormsMenuStates {
  formToggle: boolean;
  reportToggle: boolean;
  statToggle: boolean;
  caseSummaryToggle: boolean;
  screenNav: string;
  searchDateStart: Date;
  searchDateEnd: Date;
  searchServiceUnit: string[];
  searchFormType: string[];
  searchFormStatus: string;
  searchExpired: boolean;
  serviceUnitList: any[];
  searchKeyword: string;
  tempKeyword: string;
  permissionList: any[];
  adminPermission: any[];
  adminPermissionBoolean: boolean;
  loading: boolean;
  mainTableDisplay: boolean;
}
//const [searchParams, setSearchParams] = useSearchParams();
export default class FuHongFormsMenu extends React.Component<IFuHongFormsMenuProps, IFuHongFormsMenuStates> {

  private SERVICE_USER_ACCIDENT = "ServiceUserAccident"; // form 19
  private OUTSIDERS_ACCIDENT = "OutsidersAccident"; //form 22
  private OTHER_INCIDENT_REPORT = "OtherIncidentReport"; // form 23
  private SPECIAL_INCIDENT_REPORT_ALLOWANCE = "SpecialIncidentReportAllowance"; // form 24
  private SPECIAL_INCIDENT_REPORT_LICENSE = "SpecialIncidentReportLicense"; //form 25
  private SITE_CONTENT = `${this.props.context.pageContext.web.absoluteUrl}/_layouts/15/viewlsts.aspx?view=14`;

  private siteCollectionName = this.props.context.pageContext.web.absoluteUrl.split('/sites/')[1].split('/')[0];
  private siteCollecitonOrigin = this.props.context.pageContext.web.absoluteUrl.indexOf("/sites/") > -1 ? this.props.context.pageContext.web.absoluteUrl.substring(0, this.props.context.pageContext.web.absoluteUrl.indexOf("/sites/")) : this.props.context.pageContext.web.absoluteUrl.substring(0, this.props.context.pageContext.web.absoluteUrl.indexOf(".com" + 4));
  private siteCollectionUrl = this.props.context.pageContext.web.absoluteUrl.indexOf("/sites/") > -1 ? this.siteCollecitonOrigin + "/sites/" + this.siteCollectionName : this.siteCollecitonOrigin;

  private formId = getQueryParameterNumber("formId");
  private navScreen: string = getQueryParameterString("navScreen");
  private type: string = getQueryParameterString("type");
  private keyword: string = getQueryParameterString("keyword");
  public constructor(props) {
    super(props);
    getCanvasZone();
    sp.setup({ spfxContext: this.props.context });
    graph.setup({ spfxContext: this.props.context });

    this.state = {
      formToggle: false,
      reportToggle: false,
      statToggle: false,
      caseSummaryToggle: false,
      screenNav: this.navScreen,
      searchDateStart: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
      searchDateEnd: new Date(),
      serviceUnitList: [],
      searchExpired: false,
      searchFormStatus: "ALL",
      searchFormType: ["ALL"],
      searchServiceUnit: ["ALL"],
      searchKeyword: "",
      tempKeyword: "",
      permissionList: [],
      adminPermission: [],
      adminPermissionBoolean: false,
      loading: true,
      mainTableDisplay: false
    }
  }

  private CURRENT_USER: IUser = {
    email: this.props.context.pageContext.legacyPageContext.userEmail,
    name: this.props.context.pageContext.legacyPageContext.userDisplayName,
    id: this.props.context.pageContext.legacyPageContext.userId,
  }

  public componentDidMount() {
    this.initialState();
  }

  private initialState = async () => {

    const PermissionList = await checkPermissionList(this.siteCollectionUrl, this.props.context.pageContext.legacyPageContext.userEmail);
    const adminPermission: any[] = await sp.web.lists.getByTitle("Admin").items.select("*", "Admin/Id", "Admin/EMail", 'Admin/Title').expand("Admin").get();
    let adminPermissionOwner = adminPermission.filter(item => { return item.Admin.EMail == this.CURRENT_USER.email })
    let adminPermissionBoolean = adminPermissionOwner.length == 0 ? false : true;
    const serviceUnitList = await getAllServiceUnit(this.siteCollectionUrl);
    const serviceLocations = locationFilterParser(serviceUnitList);
    this.setState({ permissionList: PermissionList, serviceUnitList: serviceLocations, loading: false, adminPermission: adminPermission, adminPermissionBoolean: adminPermissionBoolean });
  }

  private formToggleHandler = (event) => {
    event.stopPropagation();
    this.setState({ formToggle: !this.state.formToggle })
  }

  private repotToggleHandler = (event) => {
    event.stopPropagation();
    this.setState({ reportToggle: !this.state.reportToggle });
  }

  private statToggleHandler = (event) => {
    event.stopPropagation();
    this.setState({ statToggle: !this.state.statToggle });
  }

  private caseSummaryToggleHandler = (event) => {
    event.stopPropagation();
    this.setState({ caseSummaryToggle: !this.state.caseSummaryToggle });
  }

  private screenNavHandler = (event, nav: string) => {
    event.stopPropagation();
    /*const paramFormId = searchParams.get('formId');
    if (paramFormId) {
      searchParams.delete('formId');
    }
    const paramNavScreen = searchParams.get('navScreen');
    if (paramNavScreen) {
      searchParams.delete('navScreen');
    }
    setSearchParams(searchParams);*/
    let url = new URL(window.location.href);
    let params = new URLSearchParams(url.search);
    params.delete('formId');
    params.delete('navScreen');
    window.history.replaceState({}, '', `${location.pathname}?${params}`);
    this.setState({ screenNav: nav });
  }

  private searchResult() {
    if (this.state.mainTableDisplay) {
      this.setState({ mainTableDisplay: false }, () => {
        this.setState({ mainTableDisplay: true });
      })
    } else {
      this.setState({ mainTableDisplay: true });
    }
  }
  private multipleOptionsSelectParser = (event) => {
    let result = [];
    const selectedOptions = event.target.selectedOptions;
    for (let i = 0; i < selectedOptions.length; i++) {
      result.push(selectedOptions[i].value);
    }
    return result;
  }

  public render(): React.ReactElement<IFuHongFormsMenuProps> {
    console.log('permissionList :', this.state.permissionList);
    const ItemComponent = (href, name) => {
      return <a className="text-decoration-none" href={this.props.context.pageContext.site.absoluteUrl + '/accident-and-incident/SitePages/' + href + ".aspx"} target="_blank" data-interception="off">
        {name}
      </a>
    }

    /*const formList = () => {
      return <ul>
        <li>{ItemComponent(this.SERVICE_USER_ACCIDENT, "服務使用者意外")}</li>
        <li>{ItemComponent(this.OUTSIDERS_ACCIDENT, "外界人士意外")}</li>
        <li>{ItemComponent(this.SPECIAL_INCIDENT_REPORT_LICENSE, "特別事故報告 (牌照事務處)")}</li>
        <li>{ItemComponent(this.SPECIAL_INCIDENT_REPORT_ALLOWANCE, "特別事故報告 (津貼科)")}</li>
        <li>{ItemComponent(this.OTHER_INCIDENT_REPORT, "其他事故")}</li>
      </ul>
    }*/
    const formList = () => {
      return <ul style={{ fontSize: '15px' }}>
        <li>
          <div className="" onClick={(event) => this.screenNavHandler(event, "ServiceUserAccident")}>
            服務使用者意外
          </div>
        </li>
        <li>
          <div className="" onClick={(event) => this.screenNavHandler(event, "OutsidersAccident")}>
            外界人士意外
          </div>
        </li>
        <li>
          <div className="" onClick={(event) => this.screenNavHandler(event, "SpecialIncidentReportLicense")}>
            特別事故報告 (牌照事務處)
          </div>
        </li>
        <li>
          <div className="" onClick={(event) => this.screenNavHandler(event, "SpecialIncidentReportAllowance")}>
            特別事故報告 (津貼科)
          </div>
        </li>
        <li>
          <div className="" onClick={(event) => this.screenNavHandler(event, "OtherIncidentReport")}>
            其他事故
          </div>
        </li>
      </ul>
    }
    const reportList = () => {
      return <ul style={{ fontSize: '15px' }}>
        <li>
          <div onClick={(event) => this.caseSummaryToggleHandler(event)}>
            個案概要
            {
              this.state.caseSummaryToggle &&
              <ul>
                <li>
                  <div className="" onClick={(event) => this.screenNavHandler(event, "CS_SUI")}>
                    服務使用者意外
                  </div>
                </li>
                <li>
                  <div className="" onClick={(event) => this.screenNavHandler(event, "CS_PUI")}>
                    外界人士意外
                  </div>
                </li>
                <li>
                  <div className="" onClick={(event) => this.screenNavHandler(event, "CS_SIH")}>
                    特別事故報告 (牌照事務處)
                  </div>
                </li>
                <li>
                  <div className="" onClick={(event) => this.screenNavHandler(event, "CS_SID")}>
                    特別事故報告 (津貼科)
                  </div>
                </li>
                <li>
                  <div className="" onClick={(event) => this.screenNavHandler(event, "CS_OIN")}>
                    其他事故
                  </div>
                </li>
              </ul>
            }
          </div>
        </li>
        <li>
          <div className="" onClick={(event) => this.screenNavHandler(event, "INSURANCE_EMAIL")}>
            保險公司電郵報告
          </div>
        </li>
        <li>
          <div className="" onClick={(event) => this.screenNavHandler(event, "LOG")}>
            表格更新記錄
          </div>
        </li>
      </ul>
    }
    console.log(this.state.screenNav)
    const statList = () => {
      return (
        <ul style={{ fontSize: '15px' }}>
          <li>
            <div onClick={(event) => event.stopPropagation()}>
              一般統計
            </div>
            <ul>
              <li>
                <div onClick={(event) => this.screenNavHandler(event, "GENERAL")}>
                  新發生意外或事故
                </div>
              </li>
            </ul>
          </li>
          <li>
            <div onClick={(event) => event.stopPropagation()}>
              服務使用者意外統計
            </div>
            <ul>
              <li>
                <div onClick={(event) => this.screenNavHandler(event, "SUI_AGE")}>
                  年齡
                </div>
              </li>
              <li>
                <div onClick={(event) => this.screenNavHandler(event, "SUI_GENDER")}>
                  性別
                </div>
              </li>
              <li>
                <div onClick={(event) => this.screenNavHandler(event, "SUI_INTELLIGENCE")}>
                  智力障礙程度
                </div>
              </li>
              <li>
                <div onClick={(event) => this.screenNavHandler(event, "SUI_ASD")}>
                  自閉症譜系障礙 (ASD)
                </div>
              </li>
              <li>
                <div onClick={(event) => this.screenNavHandler(event, "SUI_NATURE")}>
                  意外性質
                </div>
              </li>
              <li>
                <div onClick={(event) => this.screenNavHandler(event, "SUI_ENV")}>
                  意外成因 - 環境因素
                </div>
              </li>
              <li>
                <div onClick={(event) => this.screenNavHandler(event, "SUI_PERSONAL")}>
                  意外成因 - 個人因素
                </div>
              </li>
            </ul>
          </li >
          <li>
            <div onClick={(event) => event.stopPropagation()}>
              外界人士意外統計
            </div>
            <ul>
              <li>
                <div onClick={(event) => this.screenNavHandler(event, "PUI_NATURE")}>
                  意外性質
                </div>
              </li>
              <li>
                <div onClick={(event) => this.screenNavHandler(event, "PUI_ENV")}>
                  意外成因 - 環境因素
                </div>
              </li>
              <li>
                <div onClick={(event) => this.screenNavHandler(event, "PUI_PERSONAL")}>
                  意外成因 - 個人因素
                </div>
              </li>
            </ul>
          </li>
          <li>
            <div onClick={(event) => event.stopPropagation()}>
              特別事故統計 (牌照事務處)
            </div>
            <ul>
              <li>
                <div onClick={(event) => this.screenNavHandler(event, "SIH_CATEGORY")}>
                  特別事故類別
                </div>
              </li>
              <li>
                <div onClick={(event) => this.screenNavHandler(event, "SIH_NATURE")}>
                  虐待性質
                </div>
              </li>
            </ul>
          </li>
          <li>
            <div onClick={(event) => event.stopPropagation()}>
              特別事故統計 (津貼科)
            </div>
            <ul>
              <li>
                <div onClick={(event) => this.screenNavHandler(event, "SID_CATEGORY")}>
                  特別事故類別
                </div>
              </li>
              <li>
                <div onClick={(event) => this.screenNavHandler(event, "SID_NATURE")}>
                  虐待性質
                </div>
              </li>
            </ul>
          </li>
        </ul >)
    }

    const siteContentCog = () => {
      return (
        <a href={this.SITE_CONTENT} target="_blank" data-interception="off">
          <FontAwesomeIcon size="lg" icon={fontawesome.faCog} title={"Site Content"} />
        </a>
      )
    }

    const navigationMenu = () => {
      console.log(Array.isArray(this.state.permissionList) && this.state.permissionList.indexOf("All") >= 0);
      console.log("permissionList ", this.state.permissionList);
      console.log("ALL ", this.state.permissionList.indexOf("All") >= 0);
      return <div className={`${styles.navigationMenu}`} style={{ position: isDesktop ? 'absolute' : 'unset' }}>
        <div className={`${styles.child}`} onClick={(event) => this.screenNavHandler(event, "HOME")}>
          <div className="d-flex align-items center">
            <div style={{ marginRight: '10px' }}>
              <FontAwesomeIcon size="lg" icon={fontawesome.faHome} title={"主頁"} />
            </div>
            <div>
              主頁
            </div>
          </div>
        </div>
        <div className={`${styles.child}`} onClick={this.formToggleHandler}>
          <div className="d-flex align-items center">
            <div style={{ marginRight: '10px' }}>
              <FontAwesomeIcon size="lg" icon={fontawesome.faPen} title={"表格"} />
            </div>
            <div>
              表格
            </div>
          </div>
          {this.state.formToggle && formList()}
        </div>
        <div className={`${styles.child}`} onClick={this.repotToggleHandler}>
          <div className="d-flex align-items center">
            <div style={{ marginRight: '10px' }}>
              <FontAwesomeIcon size="lg" icon={fontawesome.faFileContract} title={"報告"} />
            </div>
            <div>
              報告
            </div>
          </div>
          {this.state.reportToggle && reportList()}
        </div>
        <div className={`${styles.child}`} onClick={(this.statToggleHandler)}>
          <div className="d-flex align-items center">
            <div style={{ marginRight: '10px' }}>
              <FontAwesomeIcon size="lg" icon={fontawesome.faChartBar} title={"統計資料"} />
            </div>
            <div>
              統計資料
            </div>
          </div>
          {this.state.statToggle && statList()}
        </div>
        <div className={`${styles.child}`} onClick={(event) => this.screenNavHandler(event, "DASHBOARD")}>
          <div className="d-flex align-items center">
            <div style={{ marginRight: '10px' }}>
              <FontAwesomeIcon size="lg" icon={fontawesome.faTachometerAlt} title={"常用圖表"} />
            </div>
            <div>
              常用圖表
            </div>
          </div>
        </div>
        {this.state.adminPermissionBoolean &&
          <div className={`${styles.child}`} onClick={(event) => this.screenNavHandler(event, "ADMIN")}>
            <div className="d-flex align-items center">
              <div style={{ marginRight: '10px' }}>
                <FontAwesomeIcon size="lg" icon={fontawesome.faUserCog} title={"Admin"} />
              </div>
              <div>
                Admin
              </div>
            </div>
          </div>
        }
      </div>
    }

    const screenSwitch = () => {
      switch (this.state.screenNav) {
        case 'ServiceUserAccident':
          return <FuHongServiceUserAccidentForm context={this.props.context} description={""} />
        case 'OutsidersAccident':
          return <FuHongOutsidersAccidentForm context={this.props.context} description={""} />
        case 'SpecialIncidentReportAllowance':
          return <FuHongSpecialIncidentReportAllowanceForm context={this.props.context} description={""} />
        case 'SpecialIncidentReportLicense':
          return <FuHongSpecialIncidentReportLicenseForm context={this.props.context} description={""} />
        case 'OtherIncidentReport':
          return <FuHongOtherIncidentReportForm context={this.props.context} description={""} />
        case 'CASE_SUMMARY':
          return <CaseSummaryScreen context={this.props.context} siteCollectionUrl={this.siteCollectionUrl} permission={this.state.permissionList} />
        case 'INSURANCE_EMAIL':
          return <InsuranceEmailReportScreen context={this.props.context} siteCollectionUrl={this.siteCollectionUrl} permission={this.state.permissionList} />
        case 'LOG':
          return <LogScreen context={this.props.context} siteCollectionUrl={this.siteCollectionUrl} permission={this.state.permissionList} />
        case 'GENERAL':
          return <General siteCollectionUrl={this.siteCollectionUrl} permission={this.state.permissionList} />
        case 'SUI_AGE':
          return <ServiceUserAccidentAge siteCollectionUrl={this.siteCollectionUrl} permission={this.state.permissionList} />
        case 'SUI_GENDER':
          return <ServiceUserAccidentSex siteCollectionUrl={this.siteCollectionUrl} permission={this.state.permissionList} />
        case 'SUI_INTELLIGENCE':
          return <ServiceUserAccidentIntelligence siteCollectionUrl={this.siteCollectionUrl} permission={this.state.permissionList} />
        case 'SUI_ASD':
          return <ServiceUserAccidentASD siteCollectionUrl={this.siteCollectionUrl} permission={this.state.permissionList} />
        case 'SUI_NATURE':
          return <ServiceUserAccidentNature siteCollectionUrl={this.siteCollectionUrl} permission={this.state.permissionList} />
        case 'SUI_ENV':
          return <ServiceUserAccidentEnv siteCollectionUrl={this.siteCollectionUrl} permission={this.state.permissionList} />
        case 'SUI_PERSONAL':
          return <ServiceUserAccidentPersonal siteCollectionUrl={this.siteCollectionUrl} permission={this.state.permissionList} />
        case 'PUI_NATURE':
          return <OutsiderAccidentNature siteCollectionUrl={this.siteCollectionUrl} permission={this.state.permissionList} />
        case 'PUI_ENV':
          return <OutsiderAccidentEnv siteCollectionUrl={this.siteCollectionUrl} permission={this.state.permissionList} />
        case 'PUI_PERSONAL':
          return <OutsiderAccidentPersonal siteCollectionUrl={this.siteCollectionUrl} permission={this.state.permissionList} />
        case 'SIH_CATEGORY':
          return <LicenseCategory siteCollectionUrl={this.siteCollectionUrl} permission={this.state.permissionList} />
        case 'SIH_NATURE':
          return <LicenseNature siteCollectionUrl={this.siteCollectionUrl} permission={this.state.permissionList} />
        case 'SID_CATEGORY':
          return <AllowanceCategory siteCollectionUrl={this.siteCollectionUrl} permission={this.state.permissionList} />
        case 'SID_NATURE':
          return <AllowanceNature siteCollectionUrl={this.siteCollectionUrl} permission={this.state.permissionList} />
        case 'CS_SUI':
          return <ServiceUserAccidentCaseSummary context={this.props.context} siteCollectionUrl={this.siteCollectionUrl} permission={this.state.permissionList} />
        case 'CS_PUI':
          return <OutsiderAccidentCaseSummary context={this.props.context} siteCollectionUrl={this.siteCollectionUrl} permission={this.state.permissionList} />
        case 'CS_SIH':
          return <LicenseIncidentCaseSummary context={this.props.context} siteCollectionUrl={this.siteCollectionUrl} permission={this.state.permissionList} />
        case 'CS_SID':
          return <AllowanceCaseSummary context={this.props.context} siteCollectionUrl={this.siteCollectionUrl} permission={this.state.permissionList} />
        case 'CS_OIN':
          return <OtherIncidentCaseSummary context={this.props.context} siteCollectionUrl={this.siteCollectionUrl} permission={this.state.permissionList} />
        case "REPORT":
        // return <div>REPORT</div>
        case "STAT":
        // return <div>STAT</div>
        case "DASHBOARD":
          return <Dashboard siteCollectionUrl={this.siteCollectionUrl} permission={this.state.permissionList} />
        case "ADMIN":
          return <Admin context={this.props.context} siteCollectionUrl={this.siteCollectionUrl} />
        case "HOME":
        default:
          console.log('1')
          return (
            <div>
              {this.navScreen != 'cms' && 
              <>
                <div className="mb-3" style={{ fontSize: 19, fontWeight: 600 }}>
                  主頁
                </div>
                <div className="mb-3">
                  {!this.state.loading &&
                    <TodoListComponent context={this.props.context} permissionList={this.state.permissionList} />
                  }
                </div>
              <div className="mb-3">
                <div className="mb-3" style={{ fontSize: "1.05rem", fontWeight: 600 }}>
                  搜尋
                </div>
                <div className="row">
                  <div className="col-xl-2 col-md-6 col-12 mb-3" >
                    <div style={{ fontWeight: 600 }}>
                      發生日期
                    </div>
                    <div className="d-flex flex-column py-1">
                      <div className="mb-3 d-flex">
                        <div className="mr-3">
                          由
                        </div>
                        <DatePicker className="form-control" dateFormat="yyyy/MM/dd" selected={this.state.searchDateStart} onChange={(date) => this.setState({ mainTableDisplay: false, searchDateStart: date })} />
                      </div>
                      <div className="d-flex">
                        <div className="mr-3">
                          至
                        </div>
                        <DatePicker className="form-control" dateFormat="yyyy/MM/dd" selected={this.state.searchDateEnd} onChange={(date) => this.setState({ mainTableDisplay: false, searchDateEnd: date })} />
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-2 col-md-6 col-12 mb-3" >
                    <div style={{ fontWeight: 600 }}>
                      服務單位
                    </div>

                    <select multiple className="form-control" onChange={(event) => {
                      const selectedOptions = this.multipleOptionsSelectParser(event);
                      this.setState({ mainTableDisplay: false, searchServiceUnit: selectedOptions });
                    }}>
                      <option value="ALL">--- 所有 ---</option>
                      {this.state.permissionList.indexOf('All') >= 0 &&
                        this.state.serviceUnitList.map((item) => {
                          return <option value={item.su_Eng_name_display}>{item.su_name_tc}</option>
                        })
                      }
                      {this.state.permissionList.indexOf('All') < 0 &&
                        this.state.permissionList.map((item) => {
                          let ser = this.state.serviceUnitList.filter(o => { return o.su_Eng_name_display == item });

                          if (ser.length > 0) {
                            return <option value={ser[0].su_Eng_name_display}>{ser[0].su_name_tc}</option>
                          }

                        })
                      }
                    </select>
                  </div>
                  <div className="col-xl-2 col-md-6 col-12 mb-3" >
                    <div style={{ fontWeight: 600 }}>
                      意外/事故
                    </div>
                    <select multiple className="form-control" onChange={(event) => {
                      const selectedOptions = this.multipleOptionsSelectParser(event);
                      this.setState({ mainTableDisplay: false, searchFormType: selectedOptions });
                    }}>
                      <option value="ALL">--- 所有 ---</option>
                      <option value="SUI">服務使用者意外</option>
                      <option value="PUI">外界人士意外</option>
                      <option value="SIH">特別事故(牌照事務處)</option>
                      <option value="SID">特別事故(津貼科)</option>
                      <option value="OIN">其他事故</option>
                    </select>
                  </div>
                  <div className="col-xl-2 col-md-6 col-12 mb-3" >
                    <div style={{ fontWeight: 600 }}>
                      顯示狀態
                    </div>
                    <select multiple className="form-control" onChange={(event) => {
                      this.setState({ mainTableDisplay: false, searchFormStatus: event.target.value });
                    }}>
                      <option value="ALL">所有狀態</option>
                      <option value="Apply">遞交檔案</option>
                      <option value="Confirm">確認檔案</option>
                      {/*<option value="Stage 1 - PENDING SM">Stage 1 - PENDING SM</option>
                      <option value="Stage 1 - PENDING SPT">Stage 1 - PENDING SPT</option>
                      <option value="Stage 2 - PENDING INVESTIGATOR">Stage 2 - PENDING INVESTIGATOR</option>
                      <option value="Stage 2 - PENDING SPT">Stage 2 - PENDING SPT</option>
                      <option value="Stage 2 - PENDING SM">Stage 2 - PENDING SM</option>
                      <option value="Stage 2 - PENDING SD">Stage 2 - PENDING SD</option>
                      <option value="Stage 3 - PENDING SM">Stage 3 - PENDING SM</option>
                      <option value="Stage 3 - PENDING SD">Stage 3 - PENDING SD</option>
                  <option value="CLOSED">CLOSED</option>*/}
                      {/*<option value="PROCESSING">跟進中個案</option>
                      <option value="CLOSED">已結束個案</option>
                      <option value="ALL">所有狀態</option>*/}
                    </select>
                  </div>
                  <div className="col-xl-2 col-md-6 col-12 mb-3" >
                    <div style={{ fontWeight: 600 }}>
                      過期未交報告
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="exampleCheck1" onClick={() => this.setState({ mainTableDisplay: false, searchExpired: !this.state.searchExpired })} checked={this.state.searchExpired} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <div style={{ fontSize: "1.05rem", fontWeight: 600 }} >
                  關鍵字
                </div>
                <div className="row">
                  <div className="col-md-10 col-12  mt-1">
                    <input className="form-control" placeholder="(可搜尋：事主姓名 / 檔案編號 / 保險公司備案編號)" value={this.state.searchKeyword} onChange={(event) => this.setState({ searchKeyword: event.target.value })} />
                  </div>
                  <div className="col mt-1">
                    <button type="button" className="btn btn-primary" onClick={() => this.searchResult()}>搜尋</button>
                  </div>
                </div>
              </div>
              <div className="mb-3">
                {this.state.mainTableDisplay &&
                  <MainTableComponent
                    context={this.props.context}
                    searchExpired={this.state.searchExpired}
                    dateRange={{
                      start: new Date(this.state.searchDateStart.setHours(0,0,0)),
                      end: new Date(this.state.searchDateEnd.setHours(23,59,59))
                    }}
                    searchFormStatus={this.state.searchFormStatus}
                    searchFormType={this.state.searchFormType}
                    searchServiceUnit={this.state.searchServiceUnit}
                    searchKeyword={this.state.searchKeyword}
                    adminPermissionBoolean={this.state.adminPermissionBoolean}
                    serviceUnitList={this.state.serviceUnitList}
                    permissionList={this.state.permissionList}
                  />
                }

              </div>
              </>
              }
              {this.navScreen == 'cms' &&
                  <MainTableComponent
                    context={this.props.context}
                    searchExpired={this.state.searchExpired}
                    dateRange={{
                      start: new Date(new Date().setFullYear(2000)),
                      end: new Date(new Date().setHours(23,59,59))
                    }}
                    searchFormStatus={"ALL"}
                    searchFormType={["ALL"]}
                    searchServiceUnit={["ALL"]}
                    searchKeyword={this.keyword}
                    adminPermissionBoolean={this.state.adminPermissionBoolean}
                    serviceUnitList={this.state.serviceUnitList}
                    permissionList={this.state.permissionList}
                  />
                }
            </div>
          )
      }
    }
    console.log('this.state.permissionList.length : ' + this.state.permissionList.length);
    console.log('loading : ' + this.state.loading);
    let navigationMenuDivCss = isDesktop ? { backgroundColor: "#fff2d4", minHeight: 500, padding: "10px 0px" } : { backgroundColor: "#fff2d4", padding: "10px 0px" };
    return (
      <div className={styles.fuHongFormsMenu} id="fuHongFormsMenu">
        <div className={styles.container} >
          <div className="container-fluid">
            {(this.navScreen == 'cms' || this.type == 'cms') &&
              screenSwitch()
            }
            {this.navScreen != 'cms' && this.type != 'cms' &&
            <div className="row no-gutters" style={{ height: '90vh' }}>
              {
                !this.state.loading && (this.state.permissionList.length == 0) ?
                  <NoAccessComponent redirectLink={""} />
                  :
                  <>
                    {/* Navigation menu */}
                    <div className={`${isDesktop ? 'col-sm-12 col-md-2 col-lg-2' : 'col-12'} notPrintable`} style={navigationMenuDivCss}>
                      {navigationMenu()}
                    </div>
                    {/* Main Content */}
                    <div className={`${isDesktop ? 'col-sm-12 col-md-10 col-lg-10' : 'col-12'}`} >
                      <div className={`${styles.systemTitle} notPrintable`}>
                        意外及事故呈報系統
                        {/*<div style={{ float: "right" }}>
                        {siteContentCog()}
        </div>*/}
                      </div>
                      <div className="p-2">
                        {screenSwitch()}
                      </div>
                    </div>
                  </>
              }

            </div>
            }
          </div>
        </div>
      </div>
    );
  }
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

