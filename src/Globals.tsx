import axios from 'axios';
import { isPlatform, IonLabel } from '@ionic/react';
import { DailyOperationalStatisticsOfReservoir } from './models/DailyOperationalStatisticsOfReservoir';
import { ReservoirConditionData } from './models/ReservoirConditionData';
import { Settings } from './models/Settings';

const pwaUrl = process.env.PUBLIC_URL || '';
const bugReportApiUrl = 'https://vh6ud1o56g.execute-api.ap-northeast-1.amazonaws.com/bugReportMailer';
let twrDataUrl = `https://myhdata.s3.ap-northeast-1.amazonaws.com/twrData.json`;
let twrWaterDataUrl = `https://myhdata.s3.ap-northeast-1.amazonaws.com/twrDataWater.json`;

const axiosInstance = axios.create({
  baseURL: twrDataUrl,
  timeout: 8000,
});

async function fetchData(dispatch: Function) {
  dispatch({
    type: "TMP_SET_KEY_VAL",
    key: 'isLoading',
    val: true,
  });
  try {
    let obj: any;
    const res = await axiosInstance.get(twrDataUrl, {
      responseType: 'arraybuffer',
    });
    obj = JSON.parse(new TextDecoder().decode(res.data)) as any;
    let data = obj.DailyOperationalStatisticsOfReservoirs_OPENDATA as DailyOperationalStatisticsOfReservoir[];

    const resWater = await Globals.axiosInstance.get(Globals.twrWaterDataUrl + `?timeStamp=${new Date().getTime()}`, {
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
      if (new Date(originD.ObservationTime) < new Date(d.ObservationTime)) {
        dataWaterReduced[d.ReservoirIdentifier] = d;
      }
    });

    data.forEach((d) => {
      if (dataWaterReduced[d.ReservoirIdentifier] != null) {
        d.latestWaterData = dataWaterReduced[d.ReservoirIdentifier];
      }
    });

    dispatch({
      type: "TMP_SET_KEY_VAL",
      key: 'reservoirs',
      val: data,
    });
  } catch (error) {
    dispatch({
      type: "TMP_SET_KEY_VAL",
      key: 'fetchError',
      val: true,
    });
  }
  dispatch({
    type: "TMP_SET_KEY_VAL",
    key: 'isLoading',
    val: false,
  });
}

let log = '';

async function clearAppData() {
  localStorage.clear();
}

//const electronBackendApi: any = (window as any).electronBackendApi;

const consoleLog = console.log.bind(console);
const consoleError = console.error.bind(console);

function getLog() {
  return log;
}

function enableAppLog() {
  console.log = function () {
    log += '----- Info ----\n';
    log += (Array.from(arguments)) + '\n';
    consoleLog.apply(console, arguments as any);
  };

  console.error = function () {
    log += '----- Error ----\n';
    log += (Array.from(arguments)) + '\n';
    consoleError.apply(console, arguments as any);
  };
}

function disableAppLog() {
  log = '';
  console.log = consoleLog;
  console.error = consoleError;
}

function disableAndroidChromeCallout(event: any) {
  event.preventDefault();
  event.stopPropagation();
  return false;
}

// Workable but imperfect.
function disableIosSafariCallout(this: Window, event: any) {
  const s = this.getSelection();
  if ((s?.rangeCount || 0) > 0) {
    const r = s?.getRangeAt(0);
    s?.removeAllRanges();
    setTimeout(() => {
      s?.addRange(r!);
    }, 50);
  }
}

function copyToClipboard(text: string) {
  try {
    navigator.clipboard && navigator.clipboard.writeText(text);
  } catch (error) {
    console.error(error);
  }
}

function isMacCatalyst() {
  return isPlatform('ios') && navigator.platform === 'MacIntel';
}

const Globals = {
  pwaUrl,
  bugReportApiUrl,
  twrDataUrl,
  twrWaterDataUrl,
  axiosInstance,
  fetchData,
  storeFile: 'TwriSettings.json',
  getLog,
  enableAppLog,
  disableAppLog,
  appSettings: {
    'iconSize': '圖示大小',
    'theme': '佈景主題',
    'uiFontSize': 'UI字型大小',
    'textFontSize': '內容文字大小',
  } as Record<string, string>,
  fetchErrorContent: (
    <div className='contentCenter'>
      <IonLabel>
        <div>
          <div>連線失敗!</div>
          <div style={{ fontSize: 'var(--ui-font-size)', paddingTop: 24 }}>請嘗試點擊右上方的重新讀取按鈕。如果問題持續發生，請執行<a href={`/${pwaUrl}/settings`} target="_self">設定頁</a>的 app 異常回報功能。</div>
        </div>
      </IonLabel>
    </div>
  ),
  updateApp: () => {
    return new Promise(async resolve => {
      navigator.serviceWorker.getRegistrations().then(async regs => {
        const hasUpdates = await Promise.all(regs.map(reg => (reg.update() as any).then((newReg: ServiceWorkerRegistration) => {
          return newReg.installing !== null || newReg.waiting !== null;
        })));
        resolve(hasUpdates.reduce((prev, curr) => prev || curr, false));
      });
    });
  },
  updateCssVars: (settings: Settings) => {
    document.documentElement.style.cssText = `--text-font-size: ${settings.textFontSize}px; --ui-font-size: ${settings.uiFontSize}px;`
  },
  isMacCatalyst,
  isTouchDevice: () => {
    return (isPlatform('ios') && !isMacCatalyst()) || isPlatform('android');
  },
  isStoreApps: () => {
    return isPlatform('pwa') || isPlatform('electron');
  },
  clearAppData,
  disableAndroidChromeCallout,
  disableIosSafariCallout,
  copyToClipboard,
};

export default Globals;
