import * as React from 'react';
import styles from './FuHongServiceUserAccidentForm.module.scss';
import { IFuHongServiceUserAccidentFormProps } from './IFuHongServiceUserAccidentFormProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as moment from 'moment';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { sp } from "@pnp/sp";
import 'react-tabs/style/react-tabs.css';
import 'bootstrap/dist/css/bootstrap.css';
import "./react-tabs.css";
import ServiceUserAccidentForm from "./ServiceUserAccidentForm";
import AccidentFollowUpForm from "../../../components/AccidentFollowUpForm/AccidentFollowUpForm";
import AccidentReportForm from "../../../components/AccidentReportForm/AccidentReportForm";
import { graph } from "@pnp/graph/presets/all";
import { jobTitleParser, Role } from '../../../utils/RoleParser';
import { getQueryParameterString } from '../../../utils/UrlQueryHelper';

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
  document.getElementById('workbenchPageContent').style.maxWidth = '1920px';
}

if (document.querySelector('.CanvasZone') != null) {
  (document.querySelector('.CanvasZone') as HTMLElement).style.maxWidth = '1920px';
}


export default class FuHongServiceUserAccidentForm extends React.Component<IFuHongServiceUserAccidentFormProps, { currentUserRole: Role }> {
  public constructor(props) {
    super(props);
    getCanvasZone();

    sp.setup({ spfxContext: this.props.context });
    graph.setup({ spfxContext: this.props.context });

    this.state = {
      currentUserRole: Role.PROFESSIONAL
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

  public componentDidMount() {
    this.checkRole(); // Testing Only
  }

  public render(): React.ReactElement<IFuHongServiceUserAccidentFormProps> {

    return (
      <div className={styles.fuHongServiceUserAccidentForm}>
        <div className={styles.container}>
          <Tabs variant="fullWidth">
            <TabList>
              <Tab>服務使用者意外填報表(一)</Tab>
              <Tab>服務使用者/外界人士意外報告(二)</Tab>
              <Tab>意外跟進/結束表(三)</Tab>
            </TabList>
            <TabPanel>
              <ServiceUserAccidentForm context={this.props.context} currentUserRole={this.state.currentUserRole} />
            </TabPanel>
            <TabPanel>
              <AccidentReportForm context={this.props.context} styles={styles} formType={"SERVICE_USER"} currentUserRole={this.state.currentUserRole} />
            </TabPanel>
            <TabPanel>
              <AccidentFollowUpForm context={this.props.context} styles={styles} formType={"SERVICE_USER"} currentUserRole={this.state.currentUserRole} />
            </TabPanel>
          </Tabs>
        </div>
      </div>
    );
  }
}
