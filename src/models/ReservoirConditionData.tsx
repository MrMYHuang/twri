export class ReservoirConditionData {
    AccumulateRainfallInCatchment: number;
    DesiltingTunnelOutflow: number;
    DrainageTunnelOutflow: number;
    EffectiveWaterStorageCapacity: number;
    InflowDischarge: number;
    ObservationTime: string;
    OthersOutflow: number;
    PowerOutletOutflow: number;
    PredeterminedCrossFlow: number;
    PredeterminedOutflowTime: string;
    ReservoirIdentifier: number;
    SpillwayOutflow: number;
    StatusType: number;
    TotalOutflow: number;
    WaterDraw: number;
    WaterLevel: number;

    constructor(json: any) {
        this.AccumulateRainfallInCatchment = json.AccumulateRainfallInCatchment;
        this.DesiltingTunnelOutflow = json.DesiltingTunnelOutflow;
        this.DrainageTunnelOutflow = json.DrainageTunnelOutflow;
        this.EffectiveWaterStorageCapacity = json.EffectiveWaterStorageCapacity;
        this.InflowDischarge = json.InflowDischarge;
        this.ObservationTime = json.ObservationTime;
        this.OthersOutflow = json.OthersOutflow;
        this.PowerOutletOutflow = json.PowerOutletOutflow;
        this.PredeterminedCrossFlow = json.PredeterminedCrossFlow;
        this.PredeterminedOutflowTime = json.PredeterminedOutflowTime;
        this.ReservoirIdentifier = json.ReservoirIdentifier;
        this.SpillwayOutflow = json.SpillwayOutflow;
        this.StatusType = json.StatusType;
        this.TotalOutflow = json.TotalOutflow;
        this.WaterDraw = json.WaterDraw;
        this.WaterLevel = json.WaterLevel;
    }
}
