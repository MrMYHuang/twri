import React from 'react';
import { Redirect, Route, RouteComponentProps, withRouter } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonAlert,
  isPlatform,
  IonToast,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { connect, Provider } from 'react-redux';
import queryString from 'query-string';
import getSavedStore from './redux/store';
import { water, settings, bookmark } from 'ionicons/icons';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import SettingsPage from './pages/SettingsPage';
import HomePage from './pages/HomePage';
import Globals from './Globals';
import ShareTextModal from './components/ShareTextModal';
import BookmarkPage from './pages/BookmarkPage';

const electronBackendApi: any = (window as any).electronBackendApi;

let store = getSavedStore();
/*
class DebugRouter extends IonReactRouter {
  constructor(props: any) {
    super(props);
    console.log('initial history is: ', JSON.stringify(this.history, null, 2))
    this.history.listen((location, action) => {
      console.log(
        `The current URL is ${location.pathname}${location.search}${location.hash}`
      )
      console.log(`The last navigation action was ${action}`, JSON.stringify(this.history, null, 2));
    });
  }
}
*/

setupIonicReact({
  mode: 'md', // Use a consistent UI style across Android and iOS.
  swipeBackEnabled: false,
});

export var serviceWorkCallbacks = {
  onSuccess: function (registration: ServiceWorkerRegistration) { },
  onUpdate: function (registration: ServiceWorkerRegistration) { },
};

interface Props {
  dispatch: Function;
  shareTextModal: any;
  settings: any;
}

interface PageProps extends RouteComponentProps<{
  tab: string;
  path: string;
}> { }

interface AppOrigProps extends Props, RouteComponentProps<{
  tab: string;
  path: string;
}> { }

interface State {
  showToast: boolean;
  toastMessage: string;
  showUpdateAlert: boolean;
  showRestoreAppSettingsToast: boolean;
  downloadModal: any;
}

class _App extends React.Component<PageProps> {
  render() {
    return (
      <Provider store={store}>
        <AppOrig {...this.props} />
      </Provider>
    );
  }
}

class _AppOrig extends React.Component<AppOrigProps, State> {
  registrationNew: ServiceWorkerRegistration | null;
  originalAppSettingsStr: string | null | undefined;

  constructor(props: any) {
    Globals.fetchData(store.dispatch);
    super(props);
    if (!this.props.settings.hasAppLog) {
      Globals.disableAppLog();
    }

    electronBackendApi?.receive("fromMain", (data: any) => {
      switch (data.event) {
        case 'version':
          this.props.dispatch({
            type: "TMP_SET_KEY_VAL",
            key: 'mainVersion',
            val: data.version,
          });
          break;
      }
    });
    electronBackendApi?.send("toMain", { event: 'ready' });

    this.registrationNew = null;
    // Disable browser callout.
    if (isPlatform('android')) {
      window.oncontextmenu = Globals.disableAndroidChromeCallout;
    } else if (isPlatform('ios')) {
      document.ontouchend = Globals.disableIosSafariCallout.bind(window);
    }

    // ----- Initializing UI settings -----
    // Apply the theme setting.
    while (document.body.classList.length > 0) {
      document.body.classList.remove(document.body.classList.item(0)!);
    }
    document.body.classList.toggle(`theme${this.props.settings.theme}`, true);

    // Modify UI settings from query string.
    const queryParams = queryString.parse(this.props.location.search) as any;
    if (queryParams.settings) {
      this.originalAppSettingsStr = localStorage.getItem(Globals.storeFile);
      (queryParams.settings as string).split(',').forEach(setting => {
        const keyVal = setting.split('=');
        this.props.dispatch({
          type: "SET_KEY_VAL",
          key: keyVal[0],
          val: +keyVal[1],
        });
      });
    }
    setTimeout(() => {
      Globals.updateCssVars(this.props.settings);
    }, 0);

    this.state = {
      showUpdateAlert: false,
      showRestoreAppSettingsToast: (queryParams.settings != null && this.originalAppSettingsStr != null) || false,
      showToast: false,
      toastMessage: '',
      downloadModal: { progress: 0, show: false }
    };

    serviceWorkCallbacks.onUpdate = (registration: ServiceWorkerRegistration) => {
      this.registrationNew = registration;
      this.setState({ showUpdateAlert: true });
    };

    serviceWorkCallbacks.onSuccess = (registration: ServiceWorkerRegistration) => {
    };

    // Preload speechSynthesis.
    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.getVoices();
      speechSynthesis.cancel();
    }

    // Enable screen wake lock.
    if ((navigator as any).wakeLock) {
      this.wakeLockScreen();
      document.addEventListener("visibilitychange", async () => {
        if (document.visibilityState === 'visible') {
          this.wakeLockScreen();
        } else {
          this.wakeLockScreenRelease()
        }
      });
    }
  }

  restoreAppSettings() {
    localStorage.setItem(Globals.storeFile, this.originalAppSettingsStr!);
    this.props.dispatch({ type: 'LOAD_SETTINGS' });
  }

  // Prevent device from sleeping.
  wakeLock: any;
  async wakeLockScreen() {
    try {
      const wakeLock = (navigator as any).wakeLock;
      if (wakeLock != null) {
        this.wakeLock = await wakeLock.request('screen');
        console.log('Screen wake lock is requested.');
      } else {
        console.error('navigator.wakeLock is undefined.');
      }
    } catch (err: any) {
      // the wake lock request fails - usually system related, such low as battery
      console.log(`${err.name}, ${err.message}`);
      console.log(new Error().stack);
    }
  }

  async wakeLockScreenRelease() {
    if (this.wakeLock != null) {
      await this.wakeLock.release();
      this.wakeLock = null;
      console.log('Screen wake lock is released.');
    }
  }

  routeByQueryString() {
    // This app uses client side routing. 
    // Without the first loading of this app,
    // any client side route becomes a server side route!
    // These invalid server side routings cause 404 errors.
    // To workaround these errors, we can use GitHub 404.html redirection
    // to pass the client side routes to this app by using query string.
    // After this app loads, it can use the query string to correctly redirect to
    // a client side route!
    console.log(window.location.search);
    const routeMatches = /route=([^&]*)/.exec(window.location.search);
    const queryMatches = /query=([^&]*)/.exec(window.location.search);
    if (routeMatches !== null) {
      const route = decodeURIComponent(routeMatches[1]);

      let query = ''
      if (queryMatches !== null) {
        query = decodeURIComponent(queryMatches[1]);
      }
      return <Redirect to={`${Globals.pwaUrl}` + route + query} />;
    } else if (window.location.pathname === `${Globals.pwaUrl}/` || window.location.pathname === `${Globals.pwaUrl}`) {
      return <Redirect to={`${Globals.pwaUrl}/bookmarks`} />;
    }
  }

  render() {
    return (
      <IonApp>
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet animated={false}>
              <Route path={`${Globals.pwaUrl}/:tab(bookmarks)`} render={(props: any) => <BookmarkPage {...props} />} exact={true} />
              <Route path={`${Globals.pwaUrl}/:tab(home)`} render={(props: any) => <HomePage {...props} />} exact={true} />
              <Route path={`${Globals.pwaUrl}/settings`} render={(props: any) => <SettingsPage {...props} />} />
              <Route path={`${Globals.pwaUrl}/`} render={() => { return this.routeByQueryString(); }} exact={true} />
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
              <IonTabButton tab="bookmarks" href={`${Globals.pwaUrl}/bookmarks`}>
                <IonIcon icon={bookmark} />
              </IonTabButton>
              <IonTabButton tab="home" href={`${Globals.pwaUrl}/home`}>
                <IonIcon icon={water} />
              </IonTabButton>
              <IonTabButton tab="settings" href={`${Globals.pwaUrl}/settings`}>
                <IonIcon icon={settings} />
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </IonReactRouter>
        <IonAlert
          cssClass='uiFont'
          isOpen={this.state.showUpdateAlert}
          backdropDismiss={false}
          onDidPresent={(ev) => {
            // Run SKIP_WAITING at onDidPresent event to avoid a race condition of
            // an old page fetching old JS chunks with a new service worker!
            this.registrationNew?.installing?.postMessage({ type: 'SKIP_WAITING' });
            this.registrationNew?.waiting?.postMessage({ type: 'SKIP_WAITING' });
          }}
          header={'App 已更新，請重啟!'}
          buttons={[
            {
              text: '關閉',
              cssClass: 'primary uiFont',
              handler: (value) => {
                this.setState({
                  showUpdateAlert: false,
                });
              },
            },
            {
              text: '顯示版本歷史',
              cssClass: 'secondary uiFont',
              handler: (value) => {
                window.open('https://github.com/MrMYHuang/twri#history');
              },
            }
          ]}
        />

        <ShareTextModal
          {...{
            text: this.props.shareTextModal?.text,
            showModal: this.props.shareTextModal?.show || false,
            finish: () => {
              this.props.dispatch({
                type: "TMP_SET_KEY_VAL",
                key: 'shareTextModal',
                val: { show: false },
              });
            }, ...this.props
          }}
        />

        <IonToast
          cssClass='uiFont'
          isOpen={this.state.showRestoreAppSettingsToast}
          onDidDismiss={() => this.setState({ showRestoreAppSettingsToast: false })}
          message={`已套用 app 連結中的設定，是否還原設定？`}
          buttons={[
            {
              text: '取消',
              role: 'cancel',
              handler: () => this.setState({ showRestoreAppSettingsToast: false })
            },
            {
              text: '還原',
              handler: () => this.restoreAppSettings(),
            },
          ]}
        />

        <IonToast
          cssClass='uiFont'
          isOpen={this.state.showToast}
          onDidDismiss={() => this.setState({ showToast: false })}
          message={this.state.toastMessage}
          duration={2000}
        />
      </IonApp>
    );
  }
}

const mapStateToProps = (state: any /*, ownProps*/) => {
  return {
    shareTextModal: state.tmpSettings.shareTextModal,
    settings: state.settings,
  }
};

const AppOrig = connect(
  mapStateToProps,
)(_AppOrig);


const App = withRouter(_App);

export default App;
