import * as React from 'react';
import styles from './FuHongOutsidersAccidentForm.module.scss';
import { IFuHongOutsidersAccidentFormProps } from './IFuHongOutsidersAccidentFormProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as moment from 'moment';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import 'bootstrap/dist/css/bootstrap.css';

import OutsidersAccidentForm from "./OutsidersAccidentForm";
export default class FuHongOutsidersAccidentForm extends React.Component<IFuHongOutsidersAccidentFormProps, {}> {
  public render(): React.ReactElement<IFuHongOutsidersAccidentFormProps> {
    return (
      <div className={styles.fuHongOutsidersAccidentForm}>
        <div className={styles.container}>
          <OutsidersAccidentForm context={this.props.context} />
        </div>
      </div>
    );
  }
}
