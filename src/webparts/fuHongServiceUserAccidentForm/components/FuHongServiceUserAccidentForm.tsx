import * as React from 'react';
import styles from './FuHongServiceUserAccidentForm.module.scss';
import { IFuHongServiceUserAccidentFormProps } from './IFuHongServiceUserAccidentFormProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as moment from 'moment';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import 'bootstrap/dist/css/bootstrap.css';
import "./react-tabs.css";
import ServiceUserAccidentForm from "./ServiceUserAccidentForm";
import AccidentFollowUpForm from "../../../components/AccidentFollowUpForm/AccidentFollowUpForm";
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

export default class FuHongServiceUserAccidentForm extends React.Component<IFuHongServiceUserAccidentFormProps, {}> {
  public constructor(props) {
    super(props);
    getCanvasZone();
  }

  public render(): React.ReactElement<IFuHongServiceUserAccidentFormProps> {

    return (
      <div className={styles.fuHongServiceUserAccidentForm}>
        <div className={styles.container}>
          <Tabs variant="fullWidth">
            <TabList>
              <Tab>19_服務使用者意外填報表(一)</Tab>
              <Tab>21_意外跟進/結束表(三)</Tab>
            </TabList>
            <TabPanel>
              <ServiceUserAccidentForm context={this.props.context} />
            </TabPanel>
            <TabPanel>
              <AccidentFollowUpForm context={this.props.context} />
            </TabPanel>
          </Tabs>

        </div>
      </div>
    );
  }
}
