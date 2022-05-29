import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, withIonLifeCycle, IonToast, IonButton, IonIcon, IonLoading, IonAlert } from '@ionic/react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import Globals from '../Globals';
import ReservoirLiquidView from '../components/ReservoirLiquidView';
import './Home.css';
import { bulb, refresh, shareSocial, information } from 'ionicons/icons';
import { Settings } from '../models/Settings';
import { Bookmark } from '../models/Bookmark';
import { TmpSettings } from '../models/TmpSettings';

interface Props {
  dispatch: Function;
  fontSize: number;
  settings: Settings;
  tmpSettings: TmpSettings;
}

interface State {
  showInfo: boolean;
  showToast: boolean;
  toastMessage: string;
  addBookmarkAlert: boolean;
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
      showInfo: false,
      showToast: false,
      toastMessage: '',
      addBookmarkAlert: false,
    }
  }

  ionViewWillEnter() {
  }

  clickedBookmark: Bookmark | undefined;
  getReservoirInfos() {
    const reservoirs = this.props.settings.showAllReservoirs ? this.props.tmpSettings.reservoirs : this.props.tmpSettings.reservoirs.filter(v => v.EffectiveCapacity > 1000);
    return reservoirs.map((info) =>
      <ReservoirLiquidView key={`HomeReservoirLiquidView${info.ReservoirIdentifier}`}
        {...{
          info: info,
          onIconClick: (bookmark: Bookmark) => {
            this.clickedBookmark = bookmark;
            this.setState({ addBookmarkAlert: true });
          },
          ...this.props
        }} />
    );
  }

  render() {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle style={{ fontSize: 'var(--ui-font-size)' }}>水庫</IonTitle>

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
              Globals.fetchData(this.props.dispatch);
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

          {this.props.tmpSettings.isLoading ?
            <IonLoading
              cssClass='uiFont'
              isOpen={this.props.tmpSettings.isLoading}
              message={'載入中...'}
            />
            :
            this.props.tmpSettings.fetchError ?
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

          <IonAlert
            cssClass='uiFont'
            isOpen={this.state.addBookmarkAlert}
            backdropDismiss={false}
            header={'確定新增至書籤？'}
            buttons={[
              {
                text: '取消',
                cssClass: 'primary uiFont',
                handler: (value) => {
                  this.setState({
                    addBookmarkAlert: false,
                  });
                },
              },
              {
                text: '確定',
                cssClass: 'secondary uiFont',
                handler: (value) => {
                  this.props.dispatch({
                    type: "ADD_BOOKMARK",
                    bookmark: this.clickedBookmark,
                  });
                  this.setState({ addBookmarkAlert: false, showToast: true, toastMessage: '新增書籤成功！' });
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
  return JSON.parse(JSON.stringify({
    tmpSettings: state.tmpSettings,
    settings: state.settings
  }));
};

//const mapDispatchToProps = {};

const HomePage = withIonLifeCycle(_HomePage);

export default connect(
  mapStateToProps,
)(HomePage);
