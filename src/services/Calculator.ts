import {FIELD_KWH_CHF, FIELD_LITRE_CHF, IceWaterCoolingMeasurements, TapWaterCoolingMeasurements} from "./DataProvider";
import {KettleEntity} from "../entities/KettleEntity";
import {IceWaterCoolingEntity} from "../entities/IceWaterCoolingEntity";

export class Calculator {
  kettleEntities: KettleEntity[];
  tapWaterCoolingMeasurements?: TapWaterCoolingMeasurements;
  iceWaterCoolingMeasurements?: IceWaterCoolingMeasurements;
  iceWaterCoolingEntity: IceWaterCoolingEntity;
  timePowerPercentageRows: object[];

  constructor(
    kettleEntities: KettleEntity[],
    iceWaterCoolingEntity: IceWaterCoolingEntity,
    timePowerPercentageRows: object[]
  ) {
    this.kettleEntities = kettleEntities;
    this.iceWaterCoolingEntity = iceWaterCoolingEntity;
    this.timePowerPercentageRows = timePowerPercentageRows;
  }

  setTapWaterCoolingMeasurements = (tapWaterCoolingMeasurements: TapWaterCoolingMeasurements) => {
    this.tapWaterCoolingMeasurements = tapWaterCoolingMeasurements;
  };

  setIceWaterCoolingMeasurements = (iceWaterCoolingMeasurements: IceWaterCoolingMeasurements) => {
    this.iceWaterCoolingMeasurements = iceWaterCoolingMeasurements;
  };

  setMeasurementsTargetRow = () => {
    if (!this.tapWaterCoolingMeasurements || !this.iceWaterCoolingMeasurements) return;

    let lowestCostDifference;
    let lowestCostDifferenceIdx: number;
    for (let i = 0; i < this.tapWaterCoolingMeasurements.length && i < this.iceWaterCoolingMeasurements.length; i++) {
      const tapWaterCoolingCost = this.tapWaterCoolingMeasurements[i][FIELD_LITRE_CHF];
      const iceWaterCoolingCost = this.iceWaterCoolingMeasurements[i][FIELD_KWH_CHF];
      let costDifference;

      if (tapWaterCoolingCost <= iceWaterCoolingCost) costDifference = iceWaterCoolingCost - tapWaterCoolingCost;
      else costDifference = tapWaterCoolingCost - iceWaterCoolingCost;

      if (lowestCostDifference === undefined || lowestCostDifference > costDifference) {
        lowestCostDifference = costDifference;
        lowestCostDifferenceIdx = i;
      }
    }

    this.tapWaterCoolingMeasurements[lowestCostDifferenceIdx!]['target'] = true;
    this.iceWaterCoolingMeasurements[lowestCostDifferenceIdx!]['target'] = true;

    return {
      tapWaterCoolingMeasurements: (this.tapWaterCoolingMeasurements as TapWaterCoolingMeasurements),
      iceWaterCoolingMeasurements: (this.iceWaterCoolingMeasurements as IceWaterCoolingMeasurements)
    };
  };

  setTimeTablePowerPercentages = () => {
    if (
      this.iceWaterCoolingEntity.type1Count <= 0
      && this.iceWaterCoolingEntity.type4Count <= 0
      || this.iceWaterCoolingEntity.type1Count > 4
      || this.iceWaterCoolingEntity.type4Count > 4
    ) return;

    const maxPowerKW = this.iceWaterCoolingEntity.getMaxPowerKW();
    const rechargeRateKW = this.iceWaterCoolingEntity.getRechargeRateKW();
    const timePowerMap: { time: string, powerKW: number }[] = [];

    for (const kettleEntity of this.kettleEntities) {
      for (const usageTime of kettleEntity.getUsageTimes()) {
        const existingTimePowerEntry = timePowerMap.find(timePowerEntry => timePowerEntry.time === usageTime.time);

        if (existingTimePowerEntry) {
          existingTimePowerEntry.powerKW -= (usageTime.foodLitres / 10);
        } else {
          const powerKWLeft = maxPowerKW - (usageTime.foodLitres / 10);
          timePowerMap.push({ time: usageTime.time, powerKW: powerKWLeft });
        }
      }
    }

    console.log(timePowerMap)
  };
}