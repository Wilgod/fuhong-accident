import * as React from 'react';
import styles from './FuHongFormsMenu.module.scss';
import { IFuHongFormsMenuProps } from './IFuHongFormsMenuProps';
import 'bootstrap/dist/css/bootstrap.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as fontawesome from '@fortawesome/free-solid-svg-icons';
import { sp } from "@pnp/sp";
import { graph } from "@pnp/graph/presets/all";
import TodoListComponent from '../../../components/TodoList/TodoListComponent';
import MainTableComponent from '../../../components/MainTable/MainTableComponent';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getAllServiceUnit } from '../../../api/FetchUser';
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
import General from '../../../components/Statistics/General/General';
import OutsiderAccidentEnv from '../../../components/Statistics/OutsiderAccident/OutsiderAccidentEnv';
import OutsiderAccidentNature from '../../../components/Statistics/OutsiderAccident/OutsiderAccidentNature';
import AllowanceCategory from '../../../components/Statistics/AllowanceIncident/AllowanceCategory';
import AllowanceNature from '../../../components/Statistics/AllowanceIncident/AllowanceNature';
import ServiceUserAccidentNature from '../../../components/Statistics/ServiceUserAccident/ServiceUserAccidentNature';
import OutsiderAccidentPersonal from '../../../components/Statistics/OutsiderAccident/OutsiderAccidentPersonal';
import AllowanceCaseSummary from '../../../components/CaseSummary/AllowanceCaseSummary';
import OutsiderAccidentCaseSummary from '../../../components/CaseSummary/OutsiderAccidentCaseSummary';
import ServiceUserAccidentCaseSummary from '../../../components/CaseSummary/ServiceUserAccidentCaseSummary';
import LicenseIncidentCaseSummary from '../../../components/CaseSummary/LicenseIncidentCaseSummary';
import OtherIncidentCaseSummary from '../../../components/CaseSummary/OtherIncidentCaseSummary';

if (document.getElementById('workbenchPageContent') != null) {
  document.getElementById('workbenchPageContent').style.maxWidth = '1920px';
}

if (document.querySelector('.CanvasZone') != null) {
  (document.querySelector('.CanvasZone') as HTMLElement).style.maxWidth = '1920px';
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
}

export default class FuHongFormsMenu extends React.Component<IFuHongFormsMenuProps, IFuHongFormsMenuStates> {

  private SERVICE_USER_ACCIDENT = "ServiceUserAccident"; // form 19
  private OUTSIDERS_ACCIDENT = "OutsidersAccident"; //form 22
  private OTHER_INCIDENT_REPORT = "OtherIncidentReport"; // form 23
  private SPECIAL_INCIDENT_REPORT_ALLOWANCE = "SpecialIncidentReportAllowance"; // form 24
  private SPECIAL_INCIDENT_REPORT_LICENSE = "SpecialIncidentReportLicense"; //form 25
  private SITE_CONTENT = `${this.props.context.pageContext.web.absoluteUrl}/_layouts/15/viewlsts.aspx?view=14`;

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
      screenNav: "",
      searchDateStart: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
      searchDateEnd: new Date(),
      serviceUnitList: [],
      searchExpired: false,
      searchFormStatus: "ALL",
      searchFormType: ["ALL"],
      searchServiceUnit: ["ALL"],
      searchKeyword: "",
      tempKeyword: ""
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
    const serviceUnitList = await getAllServiceUnit();
    const serviceLocations = locationFilterParser(serviceUnitList);

    this.setState({ serviceUnitList: serviceLocations });
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
    this.setState({ screenNav: nav });
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
    const ItemComponent = (href, name) => {
      return <a className="text-decoration-none" href={href + ".aspx"} target="_blank" data-interception="off">
        {name}
      </a>
    }

    const formList = () => {
      return <ul>
        <li>{ItemComponent(this.SERVICE_USER_ACCIDENT, "服務使用者意外")}</li>
        <li>{ItemComponent(this.OUTSIDERS_ACCIDENT, "外界人士意外")}</li>
        <li>{ItemComponent(this.SPECIAL_INCIDENT_REPORT_LICENSE, "特別事故報告 (牌照事務處)")}</li>
        <li>{ItemComponent(this.SPECIAL_INCIDENT_REPORT_ALLOWANCE, "特別事故報告 (津貼科)")}</li>
        <li>{ItemComponent(this.OTHER_INCIDENT_REPORT, "其他事故")}</li>
      </ul>
    }

    const reportList = () => {
      return <ul>
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
        <ul>
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
      return <div className={`${styles.navigationMenu}`}>
        <div className={`${styles.child}`} onClick={(event) => this.screenNavHandler(event, "HOME")}>
          <div className="d-flex justify-content-between align-items center">
            <div>
              主頁
            </div>
            <div className="">
              <FontAwesomeIcon size="lg" icon={fontawesome.faHome} title={"主頁"} />
            </div>
          </div>
        </div>
        <div className={`${styles.child}`} onClick={this.formToggleHandler}>
          <div className="d-flex justify-content-between align-items center">
            <div>
              表格
            </div>
            <div className="">
              <FontAwesomeIcon size="lg" icon={fontawesome.faPen} title={"表格"} />
            </div>
          </div>
          {this.state.formToggle && formList()}
        </div>
        <div className={`${styles.child}`} onClick={this.repotToggleHandler}>
          <div className="d-flex justify-content-between align-items center">
            <div>
              報告
            </div>
            <div className="">
              <FontAwesomeIcon size="lg" icon={fontawesome.faFileContract} title={"報告"} />
            </div>
          </div>
          {this.state.reportToggle && reportList()}
        </div>
        <div className={`${styles.child}`} onClick={(this.statToggleHandler)}>
          <div className="d-flex justify-content-between align-items center">
            <div>
              統計資料
            </div>
            <div className="">
              <FontAwesomeIcon size="lg" icon={fontawesome.faChartBar} title={"統計資料"} />
            </div>
          </div>
          {this.state.statToggle && statList()}
        </div>
        <div className={`${styles.child}`} onClick={(event) => this.screenNavHandler(event, "DASHBOARD")}>
          <div className="d-flex justify-content-between align-items center">
            <div>
              儀表板
            </div>
            <div className="">
              <FontAwesomeIcon size="lg" icon={fontawesome.faTachometerAlt} title={"儀表板"} />
            </div>
          </div>
        </div>
      </div>
    }

    const screenSwitch = () => {
      switch (this.state.screenNav) {
        case 'CASE_SUMMARY':
          return <CaseSummaryScreen context={this.props.context} />
        case 'INSURANCE_EMAIL':
          return <InsuranceEmailReportScreen context={this.props.context} />
        case 'LOG':
          return <LogScreen context={this.props.context} />
        case 'GENERAL':
          return <General />
        case 'SUI_AGE':
          return <ServiceUserAccidentAge />
        case 'SUI_GENDER':
          return <ServiceUserAccidentSex />
        case 'SUI_INTELLIGENCE':
          return <ServiceUserAccidentIntelligence />
        case 'SUI_ASD':
          return <ServiceUserAccidentASD />
        case 'SUI_NATURE':
          return <ServiceUserAccidentNature />
        case 'SUI_ENV':
          return <ServiceUserAccidentEnv />
        case 'SUI_PERSONAL':
          return <ServiceUserAccidentPersonal />
        case 'PUI_NATURE':
          return <OutsiderAccidentNature />
        case 'PUI_ENV':
          return <OutsiderAccidentEnv />
        case 'PUI_PERSONAL':
          return <OutsiderAccidentPersonal />
        case 'SIH_CATEGORY':
          return <AllowanceCategory />
        // return <div>SIH_CATEGORY</div>
        case 'SID_CATEGORY':
          return <AllowanceCategory />
        case 'SID_NATURE':
          return <AllowanceNature />
        case 'CS_SUI':
          return <ServiceUserAccidentCaseSummary context={this.props.context} />
        case 'CS_PUI':
          return <OutsiderAccidentCaseSummary context={this.props.context} />
        case 'CS_SIH':
          return <LicenseIncidentCaseSummary context={this.props.context} />
        case 'CS_SID':
          return <AllowanceCaseSummary context={this.props.context} />
        case 'CS_OIN':
          return <OtherIncidentCaseSummary context={this.props.context} />
        case "REPORT":
        // return <div>REPORT</div>
        case "STAT":
        // return <div>STAT</div>
        case "DASHBOARD":
        // return <div>DASHBOARD</div>
        case "HOME":
        default:
          return (
            <div>
              <div className="mb-3" style={{ fontSize: 19, fontWeight: 600 }}>
                主頁
              </div>
              <div className="mb-3">
                <TodoListComponent context={this.props.context} />
              </div>
              <div className="mb-3">
                <div className="mb-3" style={{ fontSize: "1.05rem", fontWeight: 600 }}>
                  搜尋
                </div>
                <div className="row">
                  <div className="col" >
                    <div className="mb-3" style={{ fontWeight: 600 }}>
                      發生日期
                    </div>
                    <div className="d-flex flex-column py-1">
                      <div className="mb-3 d-flex">
                        <div className="mr-3">
                          由
                        </div>
                        <DatePicker className="form-control" dateFormat="yyyy/MM/dd" selected={this.state.searchDateStart} onChange={(date) => this.setState({ searchDateStart: date })} />
                      </div>
                      <div className="d-flex">
                        <div className="mr-3">
                          至
                        </div>
                        <DatePicker className="form-control" dateFormat="yyyy/MM/dd" selected={this.state.searchDateEnd} onChange={(date) => this.setState({ searchDateEnd: date })} />
                      </div>
                    </div>
                  </div>
                  <div className="col" >
                    <div className="mb-3" style={{ fontWeight: 600 }}>
                      服務單位
                    </div>
                    {/* <div className="" style={{ overflowY: "scroll", border: "1px solid gray", height: 100 }}>

                    </div> */}
                    <select multiple className="form-control" onChange={(event) => {
                      const selectedOptions = this.multipleOptionsSelectParser(event);
                      this.setState({ searchServiceUnit: selectedOptions });
                    }}>
                      <option value="ALL">--- 所有 ---</option>
                      {this.state.serviceUnitList.map((item) => {
                        return <option value={item}>{item}</option>
                      })}
                    </select>
                  </div>
                  <div className="col" >
                    <div className="mb-3" style={{ fontWeight: 600 }}>
                      意外/事故
                    </div>
                    <select multiple className="form-control" onChange={(event) => {
                      const selectedOptions = this.multipleOptionsSelectParser(event);
                      this.setState({ searchFormType: selectedOptions });
                    }}>
                      <option value="ALL">--- 所有 ---</option>
                      <option value="SUI">服務使用者意外</option>
                      <option value="PUI">外界人士意外</option>
                      <option value="SIH">特別事故(牌照事務處)</option>
                      <option value="SID">特別事故(津貼科)</option>
                      <option value="OIN">其他事故</option>
                    </select>
                  </div>
                  <div className="col" >
                    <div className="mb-3" style={{ fontWeight: 600 }}>
                      顯示狀態
                    </div>
                    <select multiple className="form-control" onChange={(event) => {
                      this.setState({ searchFormStatus: event.target.value });
                    }}>
                      <option value="PROCESSING">跟進中個案</option>
                      <option value="CLOSED">已結束個案</option>
                      <option value="ALL">所有狀態</option>
                    </select>
                  </div>
                  <div className="col" >
                    <div className="mb-3" style={{ fontWeight: 600 }}>
                      過期未交報告
                    </div>
                    <div className="form-check">
                      <input type="checkbox" className="form-check-input" id="exampleCheck1" onClick={() => this.setState({ searchExpired: !this.state.searchExpired })} checked={this.state.searchExpired} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <div className="mb-3" style={{ fontSize: "1.05rem", fontWeight: 600 }} >
                  關鍵字
                </div>
                <div className="row">
                  <div className="col-10">
                    <input className="form-control" placeholder="(可搜尋：事主姓名 / 檔案編號 / 保險公司備案編號)" value={this.state.tempKeyword} onChange={(event) => this.setState({ tempKeyword: event.target.value })} />
                  </div>
                  <div className="col">
                    <button type="button" className="btn btn-primary" onClick={() => this.setState({ searchKeyword: this.state.tempKeyword })}>搜尋</button>
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <MainTableComponent
                  context={this.props.context}
                  searchExpired={this.state.searchExpired}
                  dateRange={{
                    start: this.state.searchDateStart,
                    end: this.state.searchDateEnd
                  }}
                  searchFormStatus={this.state.searchFormStatus}
                  searchFormType={this.state.searchFormType}
                  searchServiceUnit={this.state.searchServiceUnit}
                  searchKeyword={this.state.searchKeyword}
                />
              </div>
            </div>
          )
      }
    }

    return (
      <div className={styles.fuHongFormsMenu} >
        <div className={styles.container} >
          <div className="container-fluid">
            <div className="row no-gutters">
              {/* Navigation menu */}
              <div className="col-12 col-md-3 col-lg-2" style={{ backgroundColor: "#F7CD70", minHeight: 500, padding: "10px 0px" }}>
                {navigationMenu()}
              </div>
              {/* Main Content */}
              <div className="col" >
                <div className={`${styles.systemTitle}`}>
                  意外及事故呈報系統
                  <div style={{ float: "right" }}>
                    {siteContentCog()}
                  </div>
                </div>
                <div className="p-2">
                  {screenSwitch()}
                </div>
              </div>
            </div>
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