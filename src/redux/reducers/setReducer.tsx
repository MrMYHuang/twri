import Globals from '../../Globals';
import { Bookmark } from '../../models/Bookmark';

// Used to store settings. They will be saved to file.
export default function reducer(state = {
}, action: any) {
  var newSettings = { ...state } as any;
  switch (action.type) {
    case "LOAD_SETTINGS":
      newSettings = JSON.parse(localStorage.getItem(Globals.storeFile)!).settings;
      break;
    case "SET_KEY_VAL":
      var key = action.key;
      var val = action.val;
      switch (key) {
        case 'theme': {
          document.body.classList.forEach((val) => {
            if (/theme/.test(val)) {
              document.body.classList.remove(val);
            }
          });
          document.body.classList.toggle(`theme${val}`, true);
          break;
        }
      }

      newSettings[key] = val;
      localStorage.setItem(Globals.storeFile, JSON.stringify({ settings: newSettings }));
      break;
    case "ADD_BOOKMARK":
      newSettings.bookmarks = [...newSettings.bookmarks, action.bookmark];
      localStorage.setItem(Globals.storeFile, JSON.stringify({ settings: newSettings }));
      break;
    case "DEL_BOOKMARK": {
      let bookmarksTemp = newSettings.bookmarks as [Bookmark];
      const idxToDel = bookmarksTemp.findIndex((b) => { return b.uuid === action.uuid });
      if (idxToDel !== -1) {
        bookmarksTemp.splice(idxToDel, 1);
      }
      newSettings.bookmarks = [...bookmarksTemp];
      localStorage.setItem(Globals.storeFile, JSON.stringify({ settings: newSettings }));
      break;
    }
    case "UPDATE_BOOKMARKS": {
      newSettings.bookmarks = action.bookmarks;
      localStorage.setItem(Globals.storeFile, JSON.stringify({ settings: newSettings }));
      break;
    }
    // @ts-ignore
    case "DEFAULT_SETTINGS":
      newSettings = {};
    // Don't use break here!
    // eslint-disable-next-line
    default:
      if (Object.keys(newSettings).length === 0) {
        newSettings = {};
      }
      // Setting default values.
      // version is the setting file version.
      var keys = ['version', 'hasAppLog', 'theme', 'fontSize', 'uiFontSize', 'voiceURI', 'speechRate', 'bookmarks', 'dictionaryHistory'];
      var vals = [1, 1, 0, 32, 24, null, 0.8, [], []];
      for (let k = 0; k < keys.length; k++) {
        if (newSettings[keys[k]] === undefined) {
          newSettings[keys[k]] = vals[k];
        }
      }
  }
  return newSettings;
}
