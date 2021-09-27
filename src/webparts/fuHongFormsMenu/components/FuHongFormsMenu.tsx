import * as React from 'react';
import styles from './FuHongFormsMenu.module.scss';
import { IFuHongFormsMenuProps } from './IFuHongFormsMenuProps';
import 'bootstrap/dist/css/bootstrap.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as fontawesome from '@fortawesome/free-solid-svg-icons';
import TodoListComponent from '../../../components/TodoList/TodoListComponent';

if (document.getElementById('workbenchPageContent') != null) {
  document.getElementById('workbenchPageContent').style.maxWidth = '1920px';
}

if (document.querySelector('.CanvasZone') != null) {
  (document.querySelector('.CanvasZone') as HTMLElement).style.maxWidth = '1920px';
}



export default class FuHongFormsMenu extends React.Component<IFuHongFormsMenuProps, { formToggle: boolean, screenNav: string }> {

  private SERVICE_USER_ACCIDENT = "ServiceUserAccident"; // form 19
  private OUTSIDERS_ACCIDENT = "OutsidersAccident"; //form 22
  private OTHER_INCIDENT_REPORT = "OtherIncidentReport"; // form 23
  private SPECIAL_INCIDENT_REPORT_ALLOWANCE = "SpecialIncidentReportAllowance"; // form 24
  private SPECIAL_INCIDENT_REPORT_LICENSE = "SpecialIncidentReportLicense"; //form 25
  private SITE_CONTENT = `${this.props.context.pageContext.web.absoluteUrl}/_layouts/15/viewlsts.aspx?view=14`;
  public constructor(props) {
    super(props);
    getCanvasZone();

    this.state = {
      formToggle: false,
      screenNav: ""
    }
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
          {
            this.state.formToggle && formList()
          }
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
              <TodoListComponent />
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