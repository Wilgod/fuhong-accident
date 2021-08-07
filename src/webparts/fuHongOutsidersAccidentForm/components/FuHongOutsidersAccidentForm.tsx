import * as React from 'react';
import styles from './FuHongOutsidersAccidentForm.module.scss';
import { IFuHongOutsidersAccidentFormProps } from './IFuHongOutsidersAccidentFormProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as moment from 'moment';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import AccidentFollowUpForm from "../../../components/AccidentFollowUpForm/AccidentFollowUpForm";
import AccidentReportForm from "../../../components/AccidentRepotForm/AccidentRepotForm";
import 'react-tabs/style/react-tabs.css';
import 'bootstrap/dist/css/bootstrap.css';
import "./react-tabs.css";
import OutsidersAccidentForm from "./OutsidersAccidentForm";

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

export default class FuHongOutsidersAccidentForm extends React.Component<IFuHongOutsidersAccidentFormProps, {}> {
  public constructor(props) {
    super(props);
    getCanvasZone();
  }
  public render(): React.ReactElement<IFuHongOutsidersAccidentFormProps> {
    return (
      <div className={styles.fuHongOutsidersAccidentForm}>
        <div className={styles.container}>
          <Tabs variant="fullWidth">
            <TabList>
              <Tab>22_外界人士意外填報表(一)</Tab>
              {/* <Tab>20_</Tab> */}
              <Tab>21_意外跟進/結束表(三)</Tab>
            </TabList>
            <TabPanel>
              <OutsidersAccidentForm context={this.props.context} />
            </TabPanel>
            {/* <TabPanel>
              <AccidentReportForm context={this.props.context} />
            </TabPanel> */}
            <TabPanel>
              <AccidentFollowUpForm context={this.props.context} />
            </TabPanel>
          </Tabs>
        </div>
      </div>
    );
  }
}
