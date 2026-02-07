import { ReservoirConditionData } from "./ReservoirConditionData";

export interface DailyOperationalStatisticsOfReservoir {
    catchmentarearainfall: number;
    crossflow: number;
    deadstoragelevel: number;
    capacity: number;
    fullwaterlevel: number;
    inflowvolume: number;
    outflow: number;
    outflowdischarge: number;
    outflowtotal: number;
    recordtime: string;
    regulatorydischarge: number;
    reservoiridentifier: string;
    reservoirname: string;
    latestwaterdata: ReservoirConditionData | undefined;
}
