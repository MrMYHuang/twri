import { Bookmark } from "./Bookmark";

export interface Settings {
    version: number;
    hasAppLog: boolean;
    theme: number;
    uiFontSize: number;
    textFontSize: number;
    showAllReservoirs: boolean;
    iconSize: number;
    bookmarks: Bookmark[];
}

export const defaultSettings = {
    version: 1,
    hasAppLog: true,
    theme: 1,
    uiFontSize: 24,
    textFontSize: 24,
    showAllReservoirs: false,
    iconSize: 250,
    bookmarks: [],
} as Settings;
