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
export default class FuHongServiceUserAccidentForm extends React.Component<IFuHongServiceUserAccidentFormProps, {}> {
  public constructor(props) {
    super(props);
  }

  public render(): React.ReactElement<IFuHongServiceUserAccidentFormProps> {

    return (
      <div className={styles.fuHongServiceUserAccidentForm}>
        <div className={styles.container}>
          <Tabs>
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
