import { ReservoirConditionData } from "./ReservoirConditionData";

export class DailyOperationalStatisticsOfReservoir {
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
    ReservoirIdentifier: number;
    ReservoirName: string;
    latestWaterData: ReservoirConditionData | undefined;

    constructor(json: DailyOperationalStatisticsOfReservoir) {
        this.CatchmentAreaRainfall = json.CatchmentAreaRainfall;
        this.CrossFlow = json.CrossFlow;
        this.DeadStorageLevel = json.DeadStorageLevel;
        this.EffectiveCapacity = json.EffectiveCapacity;
        this.FullWaterLevel = json.FullWaterLevel;
        this.InflowVolume = json.InflowVolume;
        this.Outflow = json.Outflow;
        this.OutflowDischarge = json.OutflowDischarge;
        this.OutflowTotal = json.OutflowTotal;
        this.RecordTime = json.RecordTime;
        this.RegulatoryDischarge = json.RegulatoryDischarge;
        this.ReservoirIdentifier = json.ReservoirIdentifier;
        this.ReservoirName = json.ReservoirName;
    }
}
