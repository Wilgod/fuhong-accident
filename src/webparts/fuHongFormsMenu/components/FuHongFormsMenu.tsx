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

if (document.getElementById('workbenchPageContent') != null) {
  document.getElementById('workbenchPageContent').style.maxWidth = '1920px';
}

if (document.querySelector('.CanvasZone') != null) {
  (document.querySelector('.CanvasZone') as HTMLElement).style.maxWidth = '1920px';
}

interface IFuHongFormsMenu {
  formToggle: boolean;
  screenNav: string;
  searchDateStart: Date;
  searchDateEnd: Date;
  serviceUnitList: any[];
}

export default class FuHongFormsMenu extends React.Component<IFuHongFormsMenuProps, IFuHongFormsMenu> {

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
      screenNav: "",
      searchDateStart: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
      searchDateEnd: new Date(),
      serviceUnitList: []
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
    this.setState({ serviceUnitList });
  }

  private formToggleHandler = (event) => {
    event.stopPropagation();
    this.setState({ formToggle: !this.state.formToggle })
  }

  private screenNavHandler = (event, nav: string) => {
    event.stopPropagation();
    this.setState({ screenNav: nav });
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
        <li>{ItemComponent(this.SPECIAL_INCIDENT_REPORT_ALLOWANCE, "特別事故報告 (牌照事務處)")}</li>
        <li>{ItemComponent(this.SPECIAL_INCIDENT_REPORT_LICENSE, "特別事故報告 (津貼科)")}</li>
        <li>{ItemComponent(this.OTHER_INCIDENT_REPORT, "其他事故")}</li>
      </ul>
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
        <div className={`${styles.child}`} onClick={(event) => this.screenNavHandler(event, "HOME")}>主頁</div>
        <div className={`${styles.child}`} onClick={this.formToggleHandler}>
          表格
          {this.state.formToggle && formList()}
        </div>
        <div className={`${styles.child}`} onClick={(event) => this.screenNavHandler(event, "REPORT")}>報告</div>
        <div className={`${styles.child}`} onClick={(event) => this.screenNavHandler(event, "STAT")}>統計資料</div>
        <div className={`${styles.child}`} onClick={(event) => this.screenNavHandler(event, "DASHBOARD")}>儀表板</div>
      </div>
    }

    const screenSwitch = () => {
      switch (this.state.screenNav) {
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
                    <select multiple className="form-control" onChange={(event) => { console.log(event.target.value) }}>
                      <option value="ALL">--- 所有 ---</option>
                      {this.state.serviceUnitList.map((item) => {
                        if (item && item.Title) {
                          return <option value={item.Title}>{item.Title}</option>
                        }
                      })}
                    </select>
                  </div>
                  <div className="col" >
                    <div className="mb-3" style={{ fontWeight: 600 }}>
                      意外/事故
                    </div>
                    <select multiple className="form-control" onChange={(event) => { console.log(event.target.value) }}>
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
                    <select multiple className="form-control" onChange={(event) => { console.log(event.target.value) }}>
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
                      <input type="checkbox" className="form-check-input" id="exampleCheck1" />
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
                    <input className="form-control" placeholder="(可搜尋：事主姓名 / 檔案編號 / 保險公司備案編號)" />
                  </div>
                  <div className="col">
                    <button type="button" className="btn btn-primary">搜尋</button>
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <MainTableComponent context={this.props.context} />
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