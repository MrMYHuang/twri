import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, withIonLifeCycle, IonToast, IonButton, IonIcon, IonLoading, IonAlert } from '@ionic/react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import Globals from '../Globals';
import ReservoirLiquidView from '../components/ReservoirLiquidView';
import { DailyOperationalStatisticsOfReservoir } from '../models/DailyOperationalStatisticsOfReservoir';
import { ReservoirConditionData } from '../models/ReservoirConditionData';
import './Home.css';
import { bulb, refresh, shareSocial, information } from 'ionicons/icons';
import { Settings } from '../models/Settings';

interface Props {
  dispatch: Function;
  fontSize: number;
  settings: Settings;
}

interface State {
  isLoading: boolean;
  fetchError: boolean;
  reservoirs: DailyOperationalStatisticsOfReservoir[];
  showInfo: boolean;
  showToast: boolean;
  toastMessage: string;
}

interface PageProps extends Props, RouteComponentProps<{
  tab: string;
  path: string;
}> { }

const helpDoc = <>
  <div style={{ fontSize: 'var(--ui-font-size)', textAlign: 'center' }}><a href="https://github.com/MrMYHuang/twri#web-app" target="_new">程式安裝說明</a></div>
</>;

class _HomePage extends React.Component<PageProps, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      isLoading: true,
      fetchError: false,
      reservoirs: [],
      showInfo: false,
      showToast: false,
      toastMessage: '',
    }
  }

  ionViewWillEnter() {
    this.fetchData();
  }

  async fetchData() {
    this.setState({ isLoading: true });
    try {
      let obj: any;
      const res = await Globals.axiosInstance.get(Globals.twrDataUrl, {
        responseType: 'arraybuffer',
      });
      obj = JSON.parse(new TextDecoder().decode(res.data)) as any;
      let data = obj.DailyOperationalStatisticsOfReservoirs_OPENDATA as DailyOperationalStatisticsOfReservoir[];

      const resWater = await Globals.axiosInstance.get(Globals.twrWaterDataUrl, {
        responseType: 'arraybuffer',
      });
      obj = JSON.parse(new TextDecoder().decode(resWater.data)) as any;
      let dataWater = obj.ReservoirConditionData_OPENDATA as ReservoirConditionData[];

      let dataWaterReduced: any = {};
      dataWater.forEach((d) => {
        if (dataWaterReduced[d.ReservoirIdentifier] == null) {
          dataWaterReduced[d.ReservoirIdentifier] = d;
          return;
        }

        const originD = dataWaterReduced[d.ReservoirIdentifier] as ReservoirConditionData;
        if (new Date(originD.ObservationTime) > new Date(d.ObservationTime)) {
          dataWaterReduced[d.ReservoirIdentifier] = d;
        }
      });

      data.forEach((d) => {
        if (dataWaterReduced[d.ReservoirIdentifier] != null) {
          d.latestWaterData = dataWaterReduced[d.ReservoirIdentifier];
        }
      });

      this.setState({ isLoading: false, fetchError: false, reservoirs: data });
    } catch (error) {
      this.setState({ isLoading: false, fetchError: true });
    }
  }

  getReservoirInfos() {
    const reservoirs = this.props.settings.showAllReservoirs ? this.state.reservoirs : this.state.reservoirs.filter(v => v.EffectiveCapacity > 1000);
    return reservoirs.map((info) =>
      <ReservoirLiquidView key={`ReservoirLiquidView${info.ReservoirIdentifier}`}
        {...{
          info: info,
          ...this.props
        }} />
    );
  }

  render() {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle style={{ fontSize: 'var(--ui-font-size)' }}>水庫資訊</IonTitle>

            <IonButton fill="clear" slot='end' onClick={e => {
              this.setState({ showInfo: true });
            }}>
              <IonIcon icon={information} slot='icon-only' />
            </IonButton>

            <IonButton fill={this.props.settings.showAllReservoirs ? 'solid' : 'clear'} slot='end' onClick={e => {
              this.props.dispatch({
                type: "SET_KEY_VAL",
                key: 'showAllReservoirs',
                val: !this.props.settings.showAllReservoirs,
              });
            }}>
              <IonIcon icon={bulb} slot='icon-only' />
            </IonButton>

            <IonButton fill="clear" slot='end' onClick={e => {
              this.fetchData();
            }}>
              <IonIcon icon={refresh} slot='icon-only' />
            </IonButton>

            <IonButton fill="clear" slot='end' onClick={e => {
              this.props.dispatch({
                type: "TMP_SET_KEY_VAL",
                key: 'shareTextModal',
                val: {
                  show: true,
                  text: decodeURIComponent(window.location.href),
                },
              });
            }}>
              <IonIcon icon={shareSocial} slot='icon-only' />
            </IonButton>
          </IonToolbar>
        </IonHeader>
        <IonContent>

          {this.state.isLoading ?
            <IonLoading
              cssClass='uiFont'
              isOpen={this.state.isLoading}
              message={'載入中...'}
            />
            :
            this.state.fetchError ?
              Globals.fetchErrorContent
              :
              <div className='ReservoirList'>
                {this.getReservoirInfos()}
              </div>
          }

          {helpDoc}

          <IonAlert
            cssClass='uiFont'
            isOpen={this.state.showInfo}
            backdropDismiss={false}
            header={'有效蓄水量單位：萬立方公尺'}
            buttons={[
              {
                text: '關閉',
                cssClass: 'primary uiFont',
                handler: (value) => {
                  this.setState({
                    showInfo: false,
                  });
                },
              }
            ]}
          />

          <IonToast
            cssClass='uiFont'
            isOpen={this.state.showToast}
            onDidDismiss={() => this.setState({ showToast: false })}
            message={this.state.toastMessage}
            duration={2000}
          />
        </IonContent>
      </IonPage>
    );
  }
};

const mapStateToProps = (state: any /*, ownProps*/) => {
  return {
    settings: state.settings
  }
};

//const mapDispatchToProps = {};

const HomePage = withIonLifeCycle(_HomePage);

export default connect(
  mapStateToProps,
)(HomePage);
