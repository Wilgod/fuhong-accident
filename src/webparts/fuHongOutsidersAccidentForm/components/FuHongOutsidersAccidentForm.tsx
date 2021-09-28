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
import { getQueryParameterString } from '../../../utils/UrlQueryHelper';
import { sp } from '@pnp/sp';
import { graph } from '@pnp/graph';

if (document.getElementById('workbenchPageContent') != null) {
  document.getElementById('workbenchPageContent').style.maxWidth = '1920px';
}

if (document.querySelector('.CanvasZone') != null) {
  (document.querySelector('.CanvasZone') as HTMLElement).style.maxWidth = '1920px';
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



export default class FuHongOutsidersAccidentForm extends React.Component<IFuHongOutsidersAccidentFormProps, { currentUserRole: Role }> {
  public constructor(props) {
    super(props);
    getCanvasZone();
    console.log("Flow 2");
    sp.setup({ spfxContext: this.props.context });
    graph.setup({ spfxContext: this.props.context });

    this.state = {
      currentUserRole: Role.GENERAL
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

  public componentDidMount() {
    this.checkRole(); // Testing Only
  }

  public render(): React.ReactElement<IFuHongOutsidersAccidentFormProps> {
    return (
      <div className={styles.fuHongOutsidersAccidentForm}>
        <div className={styles.container}>
          <Tabs variant="fullWidth">
            <TabList>
              <Tab>外界人士意外填報表(一)</Tab>
              <Tab>服務使用者/外界人士意外報告(二)</Tab>
              <Tab>意外跟進/結束表(三)</Tab>
            </TabList>
            <TabPanel>
              <OutsidersAccidentForm context={this.props.context} />
            </TabPanel>
            <TabPanel>
              <AccidentReportForm context={this.props.context} styles={styles} formType={"OUTSIDERS"} currentUserRole={this.state.currentUserRole} parentFormData={null} />
            </TabPanel>
            <TabPanel>
              <AccidentFollowUpForm context={this.props.context} styles={styles} formType={"OUTSIDERS"} currentUserRole={this.state.currentUserRole} parentFormData={null} />
            </TabPanel>
          </Tabs>
        </div>
      </div>
    );
  }
}
