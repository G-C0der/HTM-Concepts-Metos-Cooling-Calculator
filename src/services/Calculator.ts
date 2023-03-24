import {FIELD_KWH_CHF, FIELD_LITRE_CHF, IceWaterCoolingMeasurements, TapWaterCoolingMeasurements} from "./DataProvider";
import {KettleEntity} from "../entities/KettleEntity";
import {IceWaterCoolingEntity, TimePowerUsageRow} from "../entities/IceWaterCoolingEntity";
import {KettleCoolingModes} from "../enums/KettleCoolingModes";

export class Calculator {
  kettleEntities: KettleEntity[];
  tapWaterCoolingMeasurements?: TapWaterCoolingMeasurements;
  iceWaterCoolingMeasurements?: IceWaterCoolingMeasurements;
  iceWaterCoolingEntity: IceWaterCoolingEntity;
  timePowerUsageRows: TimePowerUsageRow[];

  constructor(
    kettleEntities: KettleEntity[],
    iceWaterCoolingEntity: IceWaterCoolingEntity,
    timePowerUsageRows: TimePowerUsageRow[]
  ) {
    this.kettleEntities = kettleEntities;
    this.iceWaterCoolingEntity = iceWaterCoolingEntity;
    this.timePowerUsageRows = timePowerUsageRows;
  }

  setTapWaterCoolingMeasurements = (tapWaterCoolingMeasurements: TapWaterCoolingMeasurements) => {
    this.tapWaterCoolingMeasurements = tapWaterCoolingMeasurements;
  };

  setIceWaterCoolingMeasurements = (iceWaterCoolingMeasurements: IceWaterCoolingMeasurements) => {
    this.iceWaterCoolingMeasurements = iceWaterCoolingMeasurements;
  };

  calculateMeasurementsTargetRow = () => {
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

  calculateTimeTablePowerPercentages = () => {
    console.log(1, this.timePowerUsageRows)

    const iceWaterCoolingType1Count = this.iceWaterCoolingEntity.getType1Count();
    const iceWaterCoolingType4Count = this.iceWaterCoolingEntity.getType4Count();
    if (
      iceWaterCoolingType1Count <= 0
      && iceWaterCoolingType4Count <= 0
      || iceWaterCoolingType1Count > 4
      || iceWaterCoolingType4Count > 4
    ) return;

    this.iceWaterCoolingEntity.setTimePowerUsageRows();

    const maxPowerKW = this.iceWaterCoolingEntity.getMaxPowerKW();
    const rechargeRateKW = this.iceWaterCoolingEntity.getRechargeRateKW();
    const timeUsedPowerMap: { time: string, usedPowerKW: number }[] = [];

    const electricCoolingModes = [KettleCoolingModes.C3, KettleCoolingModes.C5i];
    const electricCoolingModeKettleEntities = this.kettleEntities
      .filter(kettleEntity => electricCoolingModes.includes(kettleEntity.coolingMode));
    for (const kettleEntity of electricCoolingModeKettleEntities) {
      for (const usageTime of kettleEntity.getTimeUsages()) {
        const existingTimePowerEntry = timeUsedPowerMap.find(timeUsedPowerEntry => timeUsedPowerEntry.time === usageTime.time);

        if (existingTimePowerEntry) {
          existingTimePowerEntry.usedPowerKW += (usageTime.foodLitres / 10);
        } else {
          const usedPowerKW = (usageTime.foodLitres / 10);
          timeUsedPowerMap.push({ time: usageTime.time, usedPowerKW });
        }
      }
    }
    console.log(2, this.timePowerUsageRows)
    const timeIndexUsedPowerMap = timeUsedPowerMap.map(timeUsedPowerEntry => ({
      timeIndex: this.timePowerUsageRows.map(timePowerUsageRow => timePowerUsageRow.time).indexOf(timeUsedPowerEntry.time),
      usedPowerKW: timeUsedPowerEntry.usedPowerKW
    }));
    console.log(3, this.timePowerUsageRows)
    const subtractedPowerKWTimeIndexes: number[] = [];
    for (const { timeIndex, usedPowerKW } of timeIndexUsedPowerMap) {
      if (!subtractedPowerKWTimeIndexes.includes(timeIndex)) {
        const powerKWSubtractionResult = this.timePowerUsageRows[timeIndex].powerKW! -= usedPowerKW;
        subtractedPowerKWTimeIndexes.push(timeIndex);

        const maxTimeIndex = 23;
        let powerKWRechargeHourCount = 1;
        let currentTimeIndex = timeIndex + 1;
        this.timePowerUsageRows[currentTimeIndex].powerKW! = powerKWSubtractionResult + (rechargeRateKW * powerKWRechargeHourCount);
        while (this.timePowerUsageRows[currentTimeIndex].powerKW! < maxPowerKW) {
          console.log(rechargeRateKW * powerKWRechargeHourCount)
          // TODO: recharge before or after removal of usage?
          if (powerKWRechargeHourCount > 1) this.timePowerUsageRows[currentTimeIndex].powerKW! = powerKWSubtractionResult + (rechargeRateKW * powerKWRechargeHourCount);

          // Make sure it does not go over max KW
          if (this.timePowerUsageRows[currentTimeIndex].powerKW! > maxPowerKW) this.timePowerUsageRows[currentTimeIndex].powerKW! = maxPowerKW

          const usedPowerTimeIndexes = timeIndexUsedPowerMap.map(timeIndexUsedPowerEntry => timeIndexUsedPowerEntry.timeIndex);
          if (usedPowerTimeIndexes.includes(currentTimeIndex) && !subtractedPowerKWTimeIndexes.includes(currentTimeIndex)) {
            this.timePowerUsageRows[currentTimeIndex].powerKW! -= usedPowerKW;
          }

          if (currentTimeIndex === maxTimeIndex) currentTimeIndex = 0;
          else currentTimeIndex++;

          powerKWRechargeHourCount++;
        }
      }
    }
    console.log(4, this.timePowerUsageRows)

    return (this.timePowerUsageRows as TimePowerUsageRow[]);
  };
}