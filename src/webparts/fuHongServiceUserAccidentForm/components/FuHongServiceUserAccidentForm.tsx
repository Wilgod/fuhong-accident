import * as React from 'react';
import styles from './FuHongServiceUserAccidentForm.module.scss';
import { IFuHongServiceUserAccidentFormProps } from './IFuHongServiceUserAccidentFormProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as moment from 'moment';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import 'bootstrap/dist/css/bootstrap.css';

import ServiceUserAccidentForm from "./ServiceUserAccidentForm";

export default class FuHongServiceUserAccidentForm extends React.Component<IFuHongServiceUserAccidentFormProps, {}> {
  public render(): React.ReactElement<IFuHongServiceUserAccidentFormProps> {
    return (
      <div className={styles.fuHongServiceUserAccidentForm}>
        <div className={styles.container}>
          <ServiceUserAccidentForm />
        </div>
      </div>
    );
  }
}
