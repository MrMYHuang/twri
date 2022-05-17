# 台灣水庫資訊 (Taiwan Reservoir Info)

## <a id='feature'>特色</a>

書籤功能、網址分享、佈景主題切換、字型調整、跨平台、無廣告、開放原始碼。

## 說明

台灣水庫資訊 (Taiwan Reservoir Info)，簡寫 twri，使用台灣政府開放資料之《水庫水情資料》，支援以下功能

* <a id='bookmark'>書籤</a>
  1. 在水庫頁面，點擊任一水庫蓄水率圖示，會跳出對話框，按確定即可加入書籤頁。
  2. 刪除：至書籤頁，按右上角切換順序鈕，會出現書籤列表。左滑項目即出現刪除鈕，再點擊即可。

* <a id='shareAppLink'>網址分享</a>
  1. 用瀏覽器開啟此 app 的水庫頁面，點擊右上角分享鈕，可複製此頁連結至作業系統剪貼簿或產生 QR code，可分享給其他人。
  2. 分享網址可帶上部分 app 設定參數。

* 佈景主題切換
* 字型調整
  1. 考量視力不佳的使用者，提供最大32 px的字型設定。

* <a id='report'>App異常回報</a>

  App設定頁的異常回報鈕使用方法為：執行會造成app異常的步驟後，再至設定頁按下異常回報鈕，即會自動產生一封 E-mail，包含異常的記錄，發送此 E-mail 給我們即可。

程式碼為開放 (MIT License)，可自由下載修改、重新發佈。

## 支援平台
已在這些環境作過安裝、測試:
* Windows 10 +  Chrome
* Android 9 + Chrome
* macOS 11 + Chrome
* iPad 7 + Safari
* iPhone 8 + Safari
* Debian Linux 10 + Chrome

非上述環境仍可嘗試使用此app。若有<a href='#knownIssues'>已知問題</a>未描述的問題，可用<a href='#report'>異常回報</a>功能。

建議 OS 與 Chrome, Safari 保持在最新版，以取得最佳app體驗。

## <a id='install'>安裝</a>

此 app 目前有2種取得、安裝方式：

  1. Chrome, Safari 網頁瀏覽器。
  2. App 商店

### <a id='web-app'>從瀏覽器開啟/安裝</a>
請用 Chrome (Windows, macOS, Linux, Android 作業系統使用者), Safari iOS (iPhone, iPad 使用者)瀏覽器開啟以下網址：

https://myhpwa.github.io/twri

或：

<a href='https://myhpwa.github.io/twri' target='_blank'>
<img width="auto" height='60px' src='https://user-images.githubusercontent.com/9122190/28998409-c5bf7362-7a00-11e7-9b63-db56694522e7.png'/>
</a>

此 progressive web app (PWA)，可不安裝直接在網頁瀏覽器執行，或安裝至手機、平板、筆電、桌機。建議安裝，以避免瀏覽器定期清除快取，導致書籤資料不見！

#### Windows, macOS, Linux, Android - 使用 Chrome 安裝
使用Chrome瀏覧器（建議最新版）開啟上述PWA網址後，網址列會出現一個加號，如圖所示：

<img src='https://github.com/MrMYHuang/twri/raw/main/docs/images/ChromeInstall.png' width='50%' />

點擊它，以完成安裝。安裝完後會在桌面出現"台灣水庫" app 圖示。

#### iOS - 使用 Safari 安裝
1. 使用 Safari 開啟 web app 網址，再點擊下方中間的"分享"圖示：

<img src='https://github.com/MrMYHuang/twri/raw/main/docs/images/Safari/OpenAppUrl.png' width='50%' />

2. 滑動頁面至下方，點選"加入主畫面" (Add to Home Screen)：

<img src='https://github.com/MrMYHuang/twri/raw/main/docs/images/Safari/AddToHomeScreen.png' width='50%' />

3. App 安裝完，出現在主畫面的圖示：

<img src='https://github.com/MrMYHuang/twri/raw/main/docs/images/Safari/AppIcon.png' width='50%' />

### <a id='storeApp'>從 App 商店安裝</a>
#### Android - 使用 Google Play Store
<a href='https://play.google.com/store/apps/details?id=io.github.myhpwa.twri' target='_blank'>
<img width="auto" height='60px' alt='Google Play立即下載' src='https://github.com/MrMYHuang/twri/raw/main/docs/images/zh-tw_badge_web_generic.png'/>
</a>

#### iOS 14.0+ (iPhone), iPadOS 14.0+ (iPad) - 使用 Apple App Store
<a href='https://apps.apple.com/app/id1577455211' target='_blank'>
<img width="auto" height='60px' src='https://github.com/MrMYHuang/twri/raw/main/docs/images/Download_on_the_App_Store_Badge_CNTC_RGB_blk_100217.svg'/>
</a>

#### macOS 10.10+ - 使用 Apple App Store
<a href='https://apps.apple.com/app/id1577455211' target='_blank'>
<img width="auto" height='60px' src='https://github.com/MrMYHuang/twri/raw/main/docs/images/Download_on_the_Mac_App_Store_Badge_CNTC_RGB_blk_100217.svg'/>
</a>

#### Windows 10 - 使用 Microsoft Store
<a href='https://www.microsoft.com/store/apps/9PHVHJ5GWPC8' target='_blank'>
<img width="auto" height='60px' src='https://developer.microsoft.com/store/badges/images/Chinese-Traditional_get-it-from-MS.png' alt='Chinese Traditional badge'/>
</a>

#### Linux - 使用 Snap Store
<a href='https://snapcraft.io/twri' target='_blank'>
<img width="auto" height='60px' src='https://github.com/MrMYHuang/twri/raw/main/docs/images/[TW]-snap-store-black@2x.png' />
</a>

## <a id='knownIssues'>已知問題</a>
1. iOS Safari 13.4 以上才支援"分享此頁"功能。

## <a id='history'>版本歷史</a>

* PWA 1.6.2:
  * [修正] 網址分享在新電腦開啟異常。
  * [修正] setState, dispatch 相關狀態更新 bugs。

* 1.6.0:
  * 錯誤回報功能作 E-mail 檢查。
  * 錯誤回報功能支援填寫問題發生步驟。
* Snap 1.1.0:
  * 支援 Linux arm64。
* MAS 1.1.0:
  * 支援 Universal app。
* 1.5.0:
  * 修正錯誤回報功能異常的問題。
* 1.4.6:
  * 修正資料不即時的問題。
* 1.4.5:
  * 移除 store apps 不必要的 app 安裝連結。
  * 移除設定頁 app 更新通知功能，以符合 Mac App Store 上架規範。
* 1.4.3:
  * 修正設定檔滙出功能。
  * 修正錯字。
* 1.4.1:
  * 調整資料呈現版面。
* 1.4.0:
  * 設定頁新增"內容文字大小"設定。
  * 調整圖示大小不再須要重啟 app。
* 1.3.4:
  * 縮小 UI 字型設定准許範圍，避免排版過於擁擠，以符合 Apple App Store 上架規範。
* 1.3.3:
  * 設定頁加上資料來源的國家發展委員會信箱，以符合 Google Play Store 上架規範。
* 1.3.2:
  * 設定頁加上資料來源版權聲明，以符合 Google Play Store 上架規範。
* 1.3.1:
  * 修正水庫資訊非水利署最新值的問題。
* 1.3.0:
  * 新增書籤頁。
  * 水庫資訊頁新增顯示小蓄水量水庫。
  * 設定頁新增圖示大小設定。
* 1.0.2:
  * 修正 app 設定與其它 apps 設定衝突的問題。
* 1.0.1:
  * 修正佈景主題切換後，所選項目文字沒出現的問題。
* 1.0.0:
  * 第1版。

## <a href='https://github.com/MrMYHuang/twri/blob/main/PrivacyPolicy.md'>隱私政策</a>

## 第三方軟體版權聲明

1. 水庫每日營運狀況 ( https://data.gov.tw/dataset/41568 )
2. 水庫水情資料集 ( https://data.gov.tw/dataset/45501 )

    此 app 使用《水庫每日營運狀況》、《水庫水情資料》。此開放資料依政府資料開放授權條款 (Open Government Data License) 進行公眾釋出，使用者於遵守本條款各項規定之前提下，得利用之。政府資料開放授權條款：https://data.gov.tw/license
