import { ReservoirConditionData } from "./ReservoirConditionData";

export interface DailyOperationalStatisticsOfReservoir {
    CatchmentAreaRainfall: number;
    CrossFlow: number;
    DeadStorageLevel: number;
    EffectiveCapacity: number;
    FullWaterLevel: number;
    InflowVolume: number;
    Outflow: number;
    OutflowDischarge: number;
    OutflowTotal: number;
    RecordTime: string;
    RegulatoryDischarge: number;
    ReservoirIdentifier: string;
    ReservoirName: string;
    latestWaterData: ReservoirConditionData | undefined;
}
