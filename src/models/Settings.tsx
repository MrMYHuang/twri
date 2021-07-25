import { Bookmark } from "./Bookmark";

export class Settings {
    version: number = 1;
    hasAppLog: boolean = true;
    theme: number = 1;
    uiFontSize: number = 24;
    textFontSize: number = 24;
    showAllReservoirs: boolean = false;
    iconSize: number = 250;
    bookmarks: Bookmark[] = [];
}
