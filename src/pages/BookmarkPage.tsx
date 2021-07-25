import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonReorderGroup, IonReorder, IonItem, IonLabel, withIonLifeCycle, IonItemSliding, IonItemOptions, IonItemOption, IonIcon, IonButton, IonToast, IonLoading } from '@ionic/react';
import { ItemReorderEventDetail } from '@ionic/core';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { Bookmark } from '../models/Bookmark';
import { refresh, swapVertical } from 'ionicons/icons';
import Globals from '../Globals';
import { Settings } from '../models/Settings';
import ReservoirLiquidView from '../components/ReservoirLiquidView';
import { TmpSettings } from '../models/TmpSettings';
import { DailyOperationalStatisticsOfReservoir } from '../models/DailyOperationalStatisticsOfReservoir';

interface Props {
  dispatch: Function;
  bookmarks: [Bookmark];
  tmpSettings: TmpSettings;
  settings: Settings;
  fontSize: number;
}

interface State {
  reorder: boolean;
  showToast: boolean;
  toastMessage: string;
}

interface PageProps extends Props, RouteComponentProps<{
  tab: string;
  path: string;
}> { }

const helpDoc = <>
  <div style={{ fontSize: 'var(--ui-font-size)', textAlign: 'center' }}><a href="https://github.com/MrMYHuang/twdi#web-app" target="_new">程式安裝說明</a></div>
  <div style={{ fontSize: 'var(--ui-font-size)', textAlign: 'center' }}><a href="https://github.com/MrMYHuang/twdi#shortcuts" target="_new">程式捷徑</a></div>
</>;

class _BookmarkPage extends React.Component<PageProps, State> {
  bookmarkListRef: React.RefObject<HTMLIonListElement>;
  constructor(props: any) {
    super(props);
    this.state = {
      reorder: false,
      showToast: false,
      toastMessage: '',
    }
    this.bookmarkListRef = React.createRef<HTMLIonListElement>();
  }

  ionViewWillEnter() {
    if (!this.hasBookmark) {
      this.setState({ showToast: true, toastMessage: '無書籤！請搜尋藥品並加至書籤。' });
      this.props.history.push(`${Globals.pwaUrl}/home`);
    }
    //console.log( 'view will enter' );
  }

  get hasBookmark() {
    return this.props.bookmarks.length > 0;
  }

  delBookmarkHandler(uuidStr: string) {
    this.props.dispatch({
      type: "DEL_BOOKMARK",
      ReservoirIdentifier: uuidStr,
    });

    if (!this.hasBookmark) {
      this.setState({ showToast: true, toastMessage: '無書籤！請搜尋藥品並加至書籤。' });
      this.props.history.push(`${Globals.pwaUrl}/home`);
    }
  }

  reorderBookmarks(event: CustomEvent<ItemReorderEventDetail>) {
    const bookmarks = event.detail.complete(this.props.bookmarks);
    this.props.dispatch({
      type: "UPDATE_BOOKMARKS",
      bookmarks: bookmarks,
    });
  }

  getBookmarkRows() {
    let bookmarks = this.props.bookmarks;
    let rows = Array<object>();
    bookmarks.forEach((bookmark, i) => {
      let label = `${bookmark.ReservoirName}`;
      rows.push(
        <IonItemSliding key={`bookmarkItemSliding_` + i}>
          <IonItem key={`bookmarkItem_` + i} button={true}>
            <div tabIndex={0}></div>{/* Workaround for macOS Safari 14 bug. */}
            <IonLabel className='ion-text-wrap uiFont' key={`bookmarkItemLabel_` + i}>
              {label}
            </IonLabel>
            <IonReorder slot='end' />
          </IonItem>

          <IonItemOptions side="end">
            <IonItemOption style={{ fontSize: 'var(--ui-font-size)' }} color='danger' onClick={(e) => {
              this.delBookmarkHandler(bookmark.ReservoirIdentifier);
              this.bookmarkListRef.current?.closeSlidingItems();
            }}>刪除</IonItemOption>
          </IonItemOptions>
        </IonItemSliding>
      );
    });
    return rows;
  }

  getReservoirInfos() {
    const reservoirs = this.props.settings.bookmarks.map(b => this.props.tmpSettings.reservoirs.find(r => b.ReservoirIdentifier === r.ReservoirIdentifier)).filter(r => r !== undefined) as DailyOperationalStatisticsOfReservoir[];
    return reservoirs.map((info) =>
      <ReservoirLiquidView key={`BookmarkReservoirLiquidView${info.ReservoirIdentifier}`}
        {...{
          info: info,
          onIconClick: (bookmark: Bookmark) => {
            // Do nothing.
          },
          ...this.props
        }} />
    );
  }

  render() {
    const rows = this.getBookmarkRows();

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle className='uiFont'>書籤</IonTitle>

            <IonButton fill="clear" slot='end' onClick={e => {
              Globals.fetchData(this.props.dispatch);
            }}>
              <IonIcon icon={refresh} slot='icon-only' />
            </IonButton>

            <IonButton fill={this.state.reorder ? 'solid' : 'clear'} slot='end'
              onClick={ev => this.setState({ reorder: !this.state.reorder })}>
              <IonIcon icon={swapVertical} slot='icon-only' />
            </IonButton>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {
            this.props.tmpSettings.isLoading ?
              <IonLoading
                cssClass='uiFont'
                isOpen={this.props.tmpSettings.isLoading}
                message={'載入中...'}
              />
              :
              this.props.tmpSettings.fetchError ?
                Globals.fetchErrorContent
                :
                this.hasBookmark ?
                  this.state.reorder ?
                    <>
                      <IonList key='bookmarkList0' ref={this.bookmarkListRef}>
                        <IonReorderGroup disabled={!this.state.reorder} onIonItemReorder={(event: CustomEvent<ItemReorderEventDetail>) => { this.reorderBookmarks(event); }}>
                          {rows}
                        </IonReorderGroup>
                      </IonList>
                      {helpDoc}
                    </>
                    :
                    <>
                      <div className='ReservoirList'>
                        {this.getReservoirInfos()}
                      </div>
                      {helpDoc}
                    </>
                  :
                  <>
                    <IonList key='bookmarkList1'>
                      {rows}
                    </IonList>
                    {helpDoc}
                  </>
          }

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
    bookmarks: state.settings.bookmarks,
    settings: state.settings,
    tmpSettings: state.tmpSettings,
  }
};

//const mapDispatchToProps = {};

const BookmarkPage = withIonLifeCycle(_BookmarkPage);

export default connect(
  mapStateToProps,
)(BookmarkPage);
