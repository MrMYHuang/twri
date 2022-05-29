import { DailyOperationalStatisticsOfReservoir } from "./DailyOperationalStatisticsOfReservoir";

export interface TmpSettings {
    fetchError: boolean;
    isLoading: boolean;
    reservoirs: DailyOperationalStatisticsOfReservoir[];
}

export const defaultTmpSettings = {
    fetchError: false,
    isLoading: false,
    reservoirs: [],
} as TmpSettings;
